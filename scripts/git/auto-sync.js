#!/usr/bin/env node

const { execSync } = require('child_process');

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
 * 检查远程是否存在
 */
function hasRemote() {
  const remotes = git('remote', true);
  return remotes && remotes.length > 0;
}

/**
 * 获取当前分支
 */
function getCurrentBranch() {
  return git('rev-parse --abbrev-ref HEAD', true);
}

/**
 * 获取本地和远程的差异
 */
function getStatus() {
  const branch = getCurrentBranch();
  if (!branch) return null;

  // 获取远程跟踪分支
  const upstream = git(`rev-parse --abbrev-ref ${branch}@{upstream}`, true);
  if (!upstream) {
    return { branch, hasUpstream: false };
  }

  // 获取差异
  const ahead = git(`rev-list --count ${upstream}..HEAD`, true);
  const behind = git(`rev-list --count HEAD..${upstream}`, true);

  return {
    branch,
    upstream,
    hasUpstream: true,
    ahead: parseInt(ahead) || 0,
    behind: parseInt(behind) || 0
  };
}

/**
 * 检查是否有未提交的变更
 */
function hasUncommittedChanges() {
  const status = git('status --porcelain', true);
  return status && status.length > 0;
}

/**
 * 主函数
 */
function main() {
  console.log(c('bright', '\n🔄 Git 自动同步\n'));

  // 检查是否是 Git 仓库
  const isGit = git('rev-parse --is-inside-work-tree', true);
  if (isGit !== 'true') {
    console.log(c('red', '错误: 当前目录不是 Git 仓库\n'));
    process.exit(1);
  }

  // 检查远程
  if (!hasRemote()) {
    console.log(c('yellow', '⚠ 没有配置远程仓库\n'));
    console.log('添加远程仓库:');
    console.log(c('dim', '  git remote add origin <url>\n'));
    process.exit(0);
  }

  // 获取状态
  const status = getStatus();
  if (!status) {
    console.log(c('red', '无法获取仓库状态\n'));
    process.exit(1);
  }

  console.log(`当前分支: ${c('cyan', status.branch)}`);

  if (!status.hasUpstream) {
    console.log(c('yellow', '⚠ 当前分支没有设置上游跟踪\n'));
    console.log('设置上游分支:');
    console.log(c('dim', `  git push -u origin ${status.branch}\n`));
    process.exit(0);
  }

  console.log(`远程分支: ${c('cyan', status.upstream)}\n`);

  // 检查未提交变更
  if (hasUncommittedChanges()) {
    console.log(c('yellow', '⚠ 有未提交的变更，请先提交或暂存\n'));
    console.log('使用以下命令提交:');
    console.log(c('dim', '  npm run git:smart-commit'));
    console.log('\n或暂存变更:');
    console.log(c('dim', '  git stash\n'));
    process.exit(1);
  }

  // 执行 fetch
  console.log('获取远程更新...');
  git('fetch --all --prune');

  // 重新获取状态
  const newStatus = getStatus();

  console.log('');
  console.log(`本地领先: ${c('cyan', newStatus.ahead)} 个提交`);
  console.log(`本地落后: ${c('cyan', newStatus.behind)} 个提交\n`);

  // 决定操作
  if (newStatus.behind > 0 && newStatus.ahead > 0) {
    // 需要 rebase 或 merge
    console.log(c('yellow', '⚠ 本地和远程都有新提交，需要合并\n'));

    if (process.argv.includes('--rebase')) {
      console.log('执行 rebase...');
      const result = git('pull --rebase', true);
      if (result === null) {
        console.log(c('red', '\nRebase 失败，可能有冲突。'));
        console.log('解决冲突后运行:');
        console.log(c('dim', '  git rebase --continue\n'));
        process.exit(1);
      }
      console.log(c('green', '✓ Rebase 完成\n'));
    } else {
      console.log('建议操作:');
      console.log(c('dim', '  git pull --rebase  # 推荐: 变基合并'));
      console.log(c('dim', '  git pull           # 普通合并'));
      console.log('\n或使用:');
      console.log(c('dim', '  npm run git:sync -- --rebase\n'));
      process.exit(0);
    }
  } else if (newStatus.behind > 0) {
    // 需要 pull
    console.log('拉取远程更新...');
    git('pull');
    console.log(c('green', `✓ 已拉取 ${newStatus.behind} 个提交\n`));
  } else if (newStatus.ahead > 0) {
    // 需要 push
    console.log('推送本地提交...');
    git('push');
    console.log(c('green', `✓ 已推送 ${newStatus.ahead} 个提交\n`));
  } else {
    console.log(c('green', '✓ 本地与远程已同步\n'));
  }

  // 显示最新状态
  console.log(c('bright', '=== 最近提交 ===\n'));
  const logs = git('log --oneline -5', true);
  if (logs) {
    logs.split('\n').forEach(log => {
      const [hash, ...message] = log.split(' ');
      console.log(`${c('yellow', hash)} ${message.join(' ')}`);
    });
  }
  console.log('');
}

// 显示帮助
if (process.argv.includes('--help')) {
  console.log(`
Git 自动同步

用法: npm run git:sync [选项]

选项:
  --rebase    使用 rebase 方式合并远程更新
  --help      显示帮助

功能:
  1. 检查当前仓库状态
  2. 获取远程更新 (fetch)
  3. 自动拉取或推送
  4. 检测冲突并提供建议

示例:
  npm run git:sync
  npm run git:sync -- --rebase
`);
  process.exit(0);
}

// 运行
main();
