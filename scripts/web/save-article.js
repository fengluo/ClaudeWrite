#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { ensureDir, writeFile } = require('../utils/file-helpers');

const ROOT_DIR = process.cwd();

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function c(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * 发起 HTTP/HTTPS 请求
 */
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const req = protocol.request(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        ...options.headers
      },
      timeout: 30000
    }, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        fetch(redirectUrl, options).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
    req.end();
  });
}

/**
 * 从 HTML 中提取标题
 */
function extractTitle(html) {
  // 尝试 <title> 标签
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return decodeHTMLEntities(titleMatch[1].trim());
  }

  // 尝试 og:title
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch) {
    return decodeHTMLEntities(ogMatch[1].trim());
  }

  return null;
}

/**
 * 从 HTML 中提取主要内容
 */
function extractContent(html) {
  // 移除脚本和样式
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // 尝试找到文章主体
  const articlePatterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]+class=["'][^"']*(?:content|article|post|entry)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
  ];

  for (const pattern of articlePatterns) {
    const match = content.match(pattern);
    if (match) {
      content = match[1];
      break;
    }
  }

  return content;
}

/**
 * 将 HTML 转换为 Markdown
 */
function htmlToMarkdown(html) {
  let md = html;

  // 标题
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // 段落和换行
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // 粗体和斜体
  md = md.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**');
  md = md.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');

  // 代码
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n');

  // 链接
  md = md.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // 图片
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)');

  // 列表
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n');

  // 引用
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    return content.split('\n').map(line => `> ${line}`).join('\n') + '\n';
  });

  // 移除剩余 HTML 标签
  md = md.replace(/<[^>]+>/g, '');

  // 解码 HTML 实体
  md = decodeHTMLEntities(md);

  // 清理多余空行
  md = md.replace(/\n{3,}/g, '\n\n');

  return md.trim();
}

/**
 * 解码 HTML 实体
 */
function decodeHTMLEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '...',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'gi'), char);
  }

  // 处理数字实体
  result = result.replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num)));
  result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

  return result;
}

/**
 * 生成安全的文件名
 */
function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .trim();
}

/**
 * 保存文章
 */
async function saveArticle(url, outputDir) {
  console.log(c('bright', '\n📥 保存网页文章\n'));
  console.log(`URL: ${c('cyan', url)}\n`);

  try {
    // 获取页面
    console.log('正在获取页面...');
    const html = await fetch(url);

    // 提取信息
    const title = extractTitle(html) || new URL(url).hostname;
    console.log(`标题: ${c('green', title)}`);

    const content = extractContent(html);
    const markdown = htmlToMarkdown(content);

    // 生成文件内容
    const date = new Date().toISOString().split('T')[0];
    const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
source: "${url}"
saved_at: ${date}
tags: [saved-article]
---

`;

    const fullContent = frontMatter + `# ${title}\n\n> 来源: [${url}](${url})\n\n` + markdown;

    // 确定输出路径
    const targetDir = outputDir || path.join(ROOT_DIR, '03_Resources', 'Articles');
    const filename = `${date}-${sanitizeFilename(title)}.md`;
    const filePath = path.join(targetDir, filename);

    // 保存文件
    ensureDir(targetDir);
    writeFile(filePath, fullContent);

    console.log(`\n${c('green', '✓')} 已保存到: ${c('cyan', path.relative(ROOT_DIR, filePath))}`);
    console.log(`  字数: 约 ${markdown.split(/\s+/).length} 词\n`);

    return { success: true, path: filePath, title };
  } catch (err) {
    console.log(c('red', `\n✗ 保存失败: ${err.message}\n`));
    return { success: false, error: err.message };
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('-'));

  if (args.length === 0) {
    console.log(`
保存网页文章

用法: npm run web:save -- <url> [output-dir]

参数:
  url         要保存的网页 URL
  output-dir  保存目录 (默认: 03_Resources/Articles)

示例:
  npm run web:save -- "https://example.com/article"
  npm run web:save -- "https://blog.example.com/post" "03_Resources/Tech"

注意:
  此脚本使用内置的 HTML 解析，对于复杂网页可能效果有限。
  建议配合 Firecrawl API 使用以获得更好的效果。
`);
    process.exit(0);
  }

  const url = args[0];
  const outputDir = args[1] ? path.resolve(ROOT_DIR, args[1]) : null;

  // 验证 URL
  try {
    new URL(url);
  } catch {
    console.log(c('red', '错误: 无效的 URL\n'));
    process.exit(1);
  }

  await saveArticle(url, outputDir);
}

// 运行
main().catch(err => {
  console.error(c('red', `错误: ${err.message}`));
  process.exit(1);
});

module.exports = { saveArticle };
