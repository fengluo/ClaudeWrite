#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

const ROOT_DIR = process.cwd();

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function c(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * 执行 Git 命令
 */
function git(command, silent = false) {
  try {
    return execSync(`git ${command}`, {
      encoding: 'utf8',
      cwd: ROOT_DIR,
      stdio: silent ? 'pipe' : undefined
    }).trim();
  } catch (err) {
    if (!silent) {
      console.error(c('red', `Git 错误: ${err.message}`));
    }
    return null;
  }
}

/**
 * 获取文件变更统计
 */
function getChanges() {
  const status = git('status --porcelain', true);
  if (!status) return { added: [], modified: [], deleted: [], untracked: [] };

  const changes = { added: [], modified: [], deleted: [], untracked: [] };

  status.split('\n').filter(Boolean).forEach(line => {
    const status = line.substring(0, 2);
    const file = line.substring(3);

    if (status.includes('A')) changes.added.push(file);
    else if (status.includes('M')) changes.modified.push(file);
    else if (status.includes('D')) changes.deleted.push(file);
    else if (status === '??') changes.untracked.push(file);
  });

  return changes;
}

/**
 * 分析变更类型
 */
function analyzeChanges(changes) {
  const all = [...changes.added, ...changes.modified, ...changes.untracked];

  const stats = {
    markdown: all.filter(f => f.endsWith('.md')).length,
    config: all.filter(f => f.includes('.vscode') || f.includes('.claude') || f.endsWith('.json')).length,
    scripts: all.filter(f => f.includes('scripts/')).length,
    attachments: all.filter(f => f.includes('05_Attachments')).length,
    other: 0
  };

  stats.other = all.length - stats.markdown - stats.config - stats.scripts - stats.attachments;

  // 识别主要变更区域
  const folders = {};
  all.forEach(file => {
    const folder = file.split('/')[0];
    folders[folder] = (folders[folder] || 0) + 1;
  });

  return { stats, folders, total: all.length };
}

/**
 * 生成提交信息建议
 */
function generateCommitMessage(changes, analysis) {
  const { added, modified, deleted, untracked } = changes;
  const all = [...added, ...modified, ...untracked];

  // 确定动作类型
  let action = 'update';
  if (added.length + untracked.length > modified.length) action = 'add';
  if (deleted.length > added.length + modified.length) action = 'remove';

  // 确定主要内容
  let subject = '';
  const { stats, folders } = analysis;

  // 根据变更类型生成描述
  if (stats.markdown > 0 && stats.markdown >= all.length * 0.6) {
    // 主要是 Markdown 文件
    const mdFiles = all.filter(f => f.endsWith('.md'));
    if (mdFiles.length === 1) {
      const fileName = path.basename(mdFiles[0], '.md');
      subject = `${action}: ${fileName}`;
    } else {
      const mainFolder = Object.entries(folders)
        .sort((a, b) => b[1] - a[1])[0];
      if (mainFolder) {
        const folderNames = {
          '00_Inbox': 'inbox notes',
          '01_Projects': 'project notes',
          '02_Areas': 'area notes',
          '03_Resources': 'resources',
          '04_Archive': 'archived notes',
          '06_Meta': 'meta files'
        };
        subject = `${action}: ${folderNames[mainFolder[0]] || mainFolder[0]}`;
      } else {
        subject = `${action}: ${mdFiles.length} notes`;
      }
    }
  } else if (stats.scripts > 0) {
    subject = `${action}: automation scripts`;
  } else if (stats.config > 0) {
    subject = `${action}: configuration`;
  } else {
    subject = `${action}: workspace files`;
  }

  // 生成详细描述
  const details = [];
  if (added.length + untracked.length > 0) {
    details.push(`- Add ${added.length + untracked.length} files`);
  }
  if (modified.length > 0) {
    details.push(`- Update ${modified.length} files`);
  }
  if (deleted.length > 0) {
    details.push(`- Remove ${deleted.length} files`);
  }

  return {
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    details
  };
}

/**
 * 创建交互式 readline 接口
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * 询问用户
 */
function ask(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim());
    });
  });
}

/**
 * 主函数
 */
async function main() {
  console.log(c('bright', '\n🔄 智能提交助手\n'));

  // 检查是否是 Git 仓库
  const isGit = git('rev-parse --is-inside-work-tree', true);
  if (isGit !== 'true') {
    console.log(c('red', '错误: 当前目录不是 Git 仓库\n'));
    process.exit(1);
  }

  // 获取变更
  const changes = getChanges();
  const totalChanges = changes.added.length + changes.modified.length +
                       changes.deleted.length + changes.untracked.length;

  if (totalChanges === 0) {
    console.log(c('green', '✓ 工作区干净，没有需要提交的变更\n'));
    process.exit(0);
  }

  // 显示变更摘要
  console.log(c('bright', '=== 变更摘要 ===\n'));

  if (changes.untracked.length > 0) {
    console.log(c('green', `新文件 (${changes.untracked.length}):`));
    changes.untracked.slice(0, 5).forEach(f => console.log(`  + ${f}`));
    if (changes.untracked.length > 5) {
      console.log(c('dim', `  ... 还有 ${changes.untracked.length - 5} 个文件`));
    }
    console.log('');
  }

  if (changes.added.length > 0) {
    console.log(c('green', `已暂存新增 (${changes.added.length}):`));
    changes.added.slice(0, 5).forEach(f => console.log(`  + ${f}`));
    if (changes.added.length > 5) {
      console.log(c('dim', `  ... 还有 ${changes.added.length - 5} 个文件`));
    }
    console.log('');
  }

  if (changes.modified.length > 0) {
    console.log(c('yellow', `已修改 (${changes.modified.length}):`));
    changes.modified.slice(0, 5).forEach(f => console.log(`  ~ ${f}`));
    if (changes.modified.length > 5) {
      console.log(c('dim', `  ... 还有 ${changes.modified.length - 5} 个文件`));
    }
    console.log('');
  }

  if (changes.deleted.length > 0) {
    console.log(c('red', `已删除 (${changes.deleted.length}):`));
    changes.deleted.slice(0, 5).forEach(f => console.log(`  - ${f}`));
    if (changes.deleted.length > 5) {
      console.log(c('dim', `  ... 还有 ${changes.deleted.length - 5} 个文件`));
    }
    console.log('');
  }

  // 分析变更
  const analysis = analyzeChanges(changes);
  const suggestion = generateCommitMessage(changes, analysis);

  console.log(c('bright', '=== 建议提交信息 ===\n'));
  console.log(c('cyan', suggestion.subject));
  suggestion.details.forEach(d => console.log(c('dim', d)));
  console.log('');

  // 检查是否非交互模式
  if (process.argv.includes('--auto') || process.argv.includes('-y')) {
    // 自动模式
    console.log('自动模式: 使用建议的提交信息...\n');

    git('add -A');
    const message = `${suggestion.subject}\n\n${suggestion.details.join('\n')}`;
    git(`commit -m "${message.replace(/"/g, '\\"')}"`);

    console.log(c('green', '✓ 提交成功!\n'));
    console.log(git('log -1 --oneline'));
    console.log('');
    return;
  }

  // 交互模式
  const rl = createInterface();

  try {
    const action = await ask(rl, `使用此提交信息? [Y]是 / [n]否 / [e]编辑: `);

    if (action.toLowerCase() === 'n') {
      console.log('\n已取消。\n');
      rl.close();
      return;
    }

    let finalMessage = `${suggestion.subject}\n\n${suggestion.details.join('\n')}`;

    if (action.toLowerCase() === 'e') {
      const customSubject = await ask(rl, `\n输入提交信息 (回车使用建议): `);
      if (customSubject) {
        finalMessage = customSubject;
      }
    }

    // 执行提交
    console.log('\n执行提交...\n');
    git('add -A');

    const result = git(`commit -m "${finalMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`, true);

    if (result) {
      console.log(c('green', '✓ 提交成功!\n'));
      console.log(git('log -1 --oneline'));
      console.log('');

      // 询问是否推送
      const push = await ask(rl, `是否推送到远程? [y/N]: `);
      if (push.toLowerCase() === 'y') {
        console.log('\n推送中...');
        git('push');
        console.log(c('green', '✓ 推送成功!\n'));
      }
    } else {
      console.log(c('red', '提交失败，请检查 Git 状态\n'));
    }
  } finally {
    rl.close();
  }
}

// 显示帮助
if (process.argv.includes('--help')) {
  console.log(`
智能提交助手

用法: npm run git:smart-commit [选项]

选项:
  --auto, -y    自动模式，使用建议的提交信息
  --help        显示帮助

示例:
  npm run git:smart-commit
  npm run git:smart-commit -- --auto
`);
  process.exit(0);
}

// 运行
main().catch(err => {
  console.error(c('red', `错误: ${err.message}`));
  process.exit(1);
});
