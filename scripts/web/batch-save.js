#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { saveArticle } = require('./save-article');
const { ensureDir, readFile } = require('../utils/file-helpers');

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
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 从文件读取 URL 列表
 */
function readUrlsFromFile(filePath) {
  const content = readFile(filePath);
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.startsWith('http'));
}

/**
 * 批量保存文章
 */
async function batchSave(urls, outputDir, options = {}) {
  const { delayMs = 2000, continueOnError = true } = options;

  console.log(c('bright', '\n📥 批量保存网页文章\n'));
  console.log(`共 ${c('cyan', urls.length)} 个 URL`);
  console.log(`输出目录: ${c('cyan', outputDir)}\n`);

  ensureDir(outputDir);

  const results = {
    success: [],
    failed: []
  };

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(c('bright', `\n[${i + 1}/${urls.length}] 处理中...\n`));
    console.log(`URL: ${c('dim', url)}`);

    try {
      const result = await saveArticle(url, outputDir);

      if (result.success) {
        results.success.push({
          url,
          path: result.path,
          title: result.title
        });
      } else {
        results.failed.push({
          url,
          error: result.error
        });

        if (!continueOnError) {
          console.log(c('red', '\n停止处理 (--stop-on-error)\n'));
          break;
        }
      }
    } catch (err) {
      results.failed.push({
        url,
        error: err.message
      });

      if (!continueOnError) {
        console.log(c('red', '\n停止处理 (--stop-on-error)\n'));
        break;
      }
    }

    // 延迟以避免请求过快
    if (i < urls.length - 1) {
      console.log(c('dim', `等待 ${delayMs / 1000} 秒...`));
      await delay(delayMs);
    }
  }

  // 汇总报告
  console.log(c('bright', '\n\n========== 批量保存完成 ==========\n'));
  console.log(`成功: ${c('green', results.success.length)} 篇`);
  console.log(`失败: ${c('red', results.failed.length)} 篇\n`);

  if (results.success.length > 0) {
    console.log(c('green', '成功保存的文章:'));
    results.success.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title}`);
      console.log(`     ${c('dim', path.relative(ROOT_DIR, item.path))}`);
    });
    console.log('');
  }

  if (results.failed.length > 0) {
    console.log(c('red', '保存失败的 URL:'));
    results.failed.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.url}`);
      console.log(`     ${c('dim', '原因: ' + item.error)}`);
    });
    console.log('');
  }

  // 生成报告文件
  if (process.argv.includes('--report')) {
    const reportPath = path.join(outputDir, `batch-save-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      total: urls.length,
      success: results.success.length,
      failed: results.failed.length,
      results
    }, null, 2));
    console.log(`报告已保存: ${c('cyan', path.relative(ROOT_DIR, reportPath))}\n`);
  }

  return results;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('-'));

  if (args.length === 0) {
    console.log(`
批量保存网页文章

用法: npm run web:batch -- <urls-file> [output-dir] [options]

参数:
  urls-file   包含 URL 列表的文本文件 (每行一个 URL)
  output-dir  保存目录 (默认: 03_Resources/Articles)

选项:
  --delay=N         请求间隔毫秒数 (默认: 2000)
  --stop-on-error   遇到错误时停止
  --report          生成 JSON 格式的报告

URL 文件格式:
  # 这是注释
  https://example.com/article1
  https://example.com/article2
  https://blog.example.com/post

示例:
  npm run web:batch -- urls.txt
  npm run web:batch -- reading-list.txt "03_Resources/Tech" --delay=3000
  npm run web:batch -- links.txt --report
`);
    process.exit(0);
  }

  const urlsFile = path.resolve(ROOT_DIR, args[0]);
  const outputDir = args[1]
    ? path.resolve(ROOT_DIR, args[1])
    : path.join(ROOT_DIR, '03_Resources', 'Articles');

  // 检查文件是否存在
  if (!fs.existsSync(urlsFile)) {
    console.log(c('red', `错误: 文件不存在: ${urlsFile}\n`));
    process.exit(1);
  }

  // 读取 URL 列表
  const urls = readUrlsFromFile(urlsFile);

  if (urls.length === 0) {
    console.log(c('yellow', '没有找到有效的 URL\n'));
    process.exit(0);
  }

  // 解析选项
  const options = {
    delayMs: 2000,
    continueOnError: !process.argv.includes('--stop-on-error')
  };

  const delayArg = process.argv.find(a => a.startsWith('--delay='));
  if (delayArg) {
    options.delayMs = parseInt(delayArg.split('=')[1]) || 2000;
  }

  await batchSave(urls, outputDir, options);
}

// 运行
main().catch(err => {
  console.error(c('red', `错误: ${err.message}`));
  process.exit(1);
});
