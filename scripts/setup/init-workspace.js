#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function print(text, color = 'reset') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function printBox(text, color = 'cyan') {
  const width = 60;
  const padding = Math.max(0, width - text.length - 4);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;

  print('═'.repeat(width), color);
  print(`║ ${' '.repeat(leftPad)}${text}${' '.repeat(rightPad)} ║`, color);
  print('═'.repeat(width), color);
}

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(`${colors.cyan}${prompt}${colors.reset} `, resolve);
  });
}

// 检查命令是否存在
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// 获取命令版本
function getVersion(command, args = '--version') {
  try {
    return execSync(`${command} ${args}`, { encoding: 'utf8' }).trim().split('\n')[0];
  } catch {
    return 'unknown';
  }
}

// 检查环境
async function checkEnvironment() {
  print('\n🔍 环境检测', 'bright');
  print('─'.repeat(60), 'blue');

  const checks = [
    {
      name: 'Node.js',
      command: 'node',
      version: () => getVersion('node', '--version'),
      required: true
    },
    {
      name: 'npm',
      command: 'npm',
      version: () => getVersion('npm', '--version'),
      required: true
    },
    {
      name: 'Git',
      command: 'git',
      version: () => getVersion('git', '--version'),
      required: false
    },
    {
      name: 'VSCode',
      command: 'code',
      version: () => getVersion('code', '--version'),
      required: false
    },
    {
      name: 'Claude CLI',
      command: 'claude',
      version: () => getVersion('claude', '--version'),
      required: false
    }
  ];

  const results = {};

  for (const check of checks) {
    const exists = commandExists(check.command);
    results[check.command] = exists;

    if (exists) {
      const version = check.version();
      print(`  ✓ ${check.name.padEnd(15)} ${version}`, 'green');
    } else {
      const marker = check.required ? '✗' : '○';
      const color = check.required ? 'red' : 'yellow';
      print(`  ${marker} ${check.name.padEnd(15)} 未安装`, color);
    }
  }

  // 检查必需工具
  if (!results.node || !results.npm) {
    print('\n❌ 缺少必需工具！请先安装 Node.js 和 npm', 'red');
    process.exit(1);
  }

  return results;
}

// 扫描现有内容
function scanExistingContent() {
  print('\n📂 扫描现有内容', 'bright');
  print('─'.repeat(60), 'blue');

  const workspaceRoot = process.cwd();
  const folders = [
    '00_Inbox',
    '01_Projects',
    '02_Areas',
    '03_Resources',
    '04_Archive',
    '06_Meta'
  ];

  const stats = {
    foldersExist: 0,
    markdownFiles: 0,
    otherFiles: 0
  };

  folders.forEach(folder => {
    const folderPath = path.join(workspaceRoot, folder);
    if (fs.existsSync(folderPath)) {
      stats.foldersExist++;

      // 计算文件数
      const files = fs.readdirSync(folderPath, { recursive: true });
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
          if (file.endsWith('.md')) {
            stats.markdownFiles++;
          } else {
            stats.otherFiles++;
          }
        }
      });
    }
  });

  print(`  已存在文件夹: ${stats.foldersExist}/6`, stats.foldersExist === 6 ? 'green' : 'yellow');
  print(`  Markdown 文件: ${stats.markdownFiles}`, 'cyan');
  print(`  其他文件: ${stats.otherFiles}`, 'cyan');

  return stats;
}

// 收集用户配置
async function collectUserPreferences(stats) {
  print('\n⚙️  配置向导', 'bright');
  print('─'.repeat(60), 'blue');

  const config = {};

  // 主要用途
  print('\n您主要用这个系统做什么？', 'cyan');
  print('  1. 个人知识管理 (PKM)');
  print('  2. 项目管理和协作');
  print('  3. 写作和内容创作');
  print('  4. 学习笔记和研究');
  print('  5. 混合使用');

  const purpose = await question('请选择 (1-5，默认 5):');
  config.purpose = ['pkm', 'project', 'writing', 'learning', 'mixed'][parseInt(purpose || '5') - 1];

  // 语言偏好
  print('\n您主要使用什么语言写作？', 'cyan');
  print('  1. 中文');
  print('  2. 英文');
  print('  3. 双语');

  const lang = await question('请选择 (1-3，默认 3):');
  config.language = ['zh', 'en', 'both'][parseInt(lang || '3') - 1];

  // Git 初始化
  if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
    const initGit = await question('\n是否初始化 Git 仓库？(y/N):');
    config.initGit = initGit.toLowerCase() === 'y';
  } else {
    print('\n✓ Git 仓库已存在', 'green');
    config.initGit = false;
  }

  // 是否创建示例内容
  if (stats.markdownFiles === 0) {
    const createExamples = await question('\n是否创建示例笔记？(Y/n):');
    config.createExamples = createExamples.toLowerCase() !== 'n';
  } else {
    config.createExamples = false;
  }

  return config;
}

// 创建文件夹结构
function ensureFolderStructure() {
  print('\n📁 创建文件夹结构', 'bright');
  print('─'.repeat(60), 'blue');

  const folders = [
    '00_Inbox',
    '01_Projects/_template',
    '02_Areas/_template',
    '03_Resources/Articles',
    '03_Resources/Books',
    '03_Resources/Courses',
    '03_Resources/Research',
    '04_Archive',
    '05_Attachments/images',
    '05_Attachments/documents',
    '05_Attachments/videos',
    '05_Attachments/other',
    '06_Meta/Templates',
    '06_Meta/Reviews/daily',
    '06_Meta/Reviews/weekly',
    '06_Meta/Reviews/monthly',
    '06_Meta/Insights',
    '06_Meta/Docs',
    'scripts/setup',
    'scripts/stats',
    'scripts/file-management',
    'scripts/utils',
    '.claude/commands'
  ];

  let created = 0;
  let existing = 0;

  folders.forEach(folder => {
    const folderPath = path.join(process.cwd(), folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      created++;
      print(`  ✓ 创建 ${folder}`, 'green');
    } else {
      existing++;
    }
  });

  print(`\n  新建文件夹: ${created}`, 'green');
  print(`  已存在: ${existing}`, 'cyan');
}

// 创建示例内容
function createExampleNotes(config) {
  print('\n📝 创建示例笔记', 'bright');
  print('─'.repeat(60), 'blue');

  const today = new Date().toISOString().split('T')[0];
  const examples = [];

  // 收件箱示例
  const inboxExample = `---
created: ${today}
type: idea
tags: [示例]
status: unprocessed
---

# 欢迎使用知识管理系统

这是一个示例笔记，展示基本用法。

## 快速开始

1. 使用 \`/quick-capture\` 命令快速捕获想法
2. 使用 \`/thinking-partner\` 命令探索主题
3. 使用 \`/inbox-processor\` 命令整理收件箱

## 建立连接

使用双括号创建链接：[[示例项目]]

## 添加标签

使用 #标签 来分类内容

#开始 #PKM
`;

  examples.push({
    path: `00_Inbox/${today}-welcome.md`,
    content: inboxExample
  });

  // 项目示例
  const projectExample = `---
title: 示例项目
status: in-progress
created: ${today}
tags: [项目, 示例]
---

# 示例项目

## 目标

展示项目笔记的基本结构。

## 任务

- [ ] 任务 1
- [ ] 任务 2
- [x] 已完成任务

## 笔记

使用此区域记录项目进展。

## 相关资源

- [[相关资源]]
`;

  examples.push({
    path: `01_Projects/example-project/README.md`,
    content: projectExample
  });

  // 每日笔记示例
  const dailyExample = `---
date: ${today}
tags: [日记]
---

# ${today}

## 今日焦点

今天要完成的最重要的事情。

## 笔记

### 工作

### 学习

### 想法

## 待办事项

- [ ]

## 反思

今天学到了什么？
`;

  examples.push({
    path: `06_Meta/Reviews/daily/${today}.md`,
    content: dailyExample
  });

  // 写入文件
  examples.forEach(example => {
    const filePath = path.join(process.cwd(), example.path);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, example.content, 'utf8');
    print(`  ✓ 创建 ${example.path}`, 'green');
  });
}

// 生成 CLAUDE.md 配置文件
function generateClaudeConfig(config) {
  print('\n⚙️  生成 Claude 配置', 'bright');
  print('─'.repeat(60), 'blue');

  const purposeMap = {
    pkm: '个人知识管理',
    project: '项目管理',
    writing: '写作创作',
    learning: '学习研究',
    mixed: '综合应用'
  };

  const langMap = {
    zh: '中文',
    en: 'English',
    both: '中英双语'
  };

  const claudeConfig = `# 工作区配置

## 基本信息

- **主要用途**: ${purposeMap[config.purpose]}
- **语言**: ${langMap[config.language]}
- **创建时间**: ${new Date().toISOString().split('T')[0]}

## 工作区约定

### 文件组织

本工作区使用 PARA 方法：
- \`00_Inbox/\` - 快速捕获想法
- \`01_Projects/\` - 有明确目标和截止日期的项目
- \`02_Areas/\` - 持续关注的领域
- \`03_Resources/\` - 参考资料
- \`04_Archive/\` - 已完成或不再活跃的内容
- \`05_Attachments/\` - 媒体文件
- \`06_Meta/\` - 系统配置和反思

### 命名约定

- 文件名使用小写字母和连字符：\`my-note.md\`
- 日期格式：\`YYYY-MM-DD\`
- 项目文件夹：\`project-name/\`

### 标签系统

常用标签：
${config.purpose === 'pkm' || config.purpose === 'mixed' ? '- #想法 #洞察 #问题\n' : ''}${config.purpose === 'project' || config.purpose === 'mixed' ? '- #项目 #任务 #会议\n' : ''}${config.purpose === 'writing' || config.purpose === 'mixed' ? '- #草稿 #文章 #发布\n' : ''}${config.purpose === 'learning' || config.purpose === 'mixed' ? '- #学习 #研究 #笔记\n' : ''}- #待处理 #重要 #紧急

### 工作流程

1. **快速捕获** - 使用 \`/quick-capture\` 记录想法到收件箱
2. **思考探索** - 使用 \`/thinking-partner\` 深入思考
3. **整理分类** - 使用 \`/inbox-processor\` 处理收件箱
4. **深入研究** - 使用 \`/research-assistant\` 研究主题
5. **定期回顾** - 使用 \`/daily-review\` 每日反思，使用 \`/weekly-synthesis\` 每周总结

## Claude 行为准则

当在此工作区工作时，请：

1. **搜索优先** - 总是先搜索工作区中的相关内容
2. **建立连接** - 主动建议相关笔记之间的链接
3. **保持组织** - 建议合适的文件夹和标签
4. **提问引导** - 多问问题，而非直接给答案（thinking-partner 模式）
5. **尊重结构** - 遵循 PARA 方法和文件命名约定
${config.language === 'zh' ? '6. **语言** - 使用中文交流\n' : ''}${config.language === 'en' ? '6. **Language** - Communicate in English\n' : ''}${config.language === 'both' ? '6. **语言/Language** - 根据用户使用的语言自适应\n' : ''}
## 自定义设置

您可以在这里添加个人偏好和自定义规则。
`;

  const configPath = path.join(process.cwd(), 'CLAUDE.md');
  fs.writeFileSync(configPath, claudeConfig, 'utf8');
  print(`  ✓ 创建 CLAUDE.md`, 'green');
}

// 安装依赖
async function installDependencies() {
  print('\n📦 安装依赖', 'bright');
  print('─'.repeat(60), 'blue');

  const install = await question('是否安装 npm 依赖？(Y/n):');

  if (install.toLowerCase() !== 'n') {
    try {
      print('  正在安装...', 'cyan');
      execSync('npm install', { stdio: 'inherit' });
      print('\n  ✓ 依赖安装完成', 'green');
      return true;
    } catch (error) {
      print('\n  ✗ 依赖安装失败', 'red');
      return false;
    }
  } else {
    print('  跳过依赖安装，稍后可运行 npm install', 'yellow');
    return false;
  }
}

// Git 初始化
function initializeGit() {
  print('\n🔧 初始化 Git 仓库', 'bright');
  print('─'.repeat(60), 'blue');

  try {
    execSync('git init', { stdio: 'ignore' });
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit: Claude Write workspace setup"', { stdio: 'ignore' });
    print('  ✓ Git 仓库初始化完成', 'green');
    return true;
  } catch (error) {
    print('  ✗ Git 初始化失败', 'red');
    return false;
  }
}

// 显示完成信息
function showCompletion(config, env) {
  print('\n', 'reset');
  printBox('✨ 初始化完成！', 'green');

  print('\n📚 下一步建议', 'bright');
  print('─'.repeat(60), 'blue');

  print('\n1. 启动 VSCode', 'cyan');
  if (env.code) {
    print('   code .', 'yellow');
  } else {
    print('   在当前目录打开 VSCode', 'yellow');
  }

  print('\n2. 安装推荐扩展', 'cyan');
  print('   VSCode 会提示安装工作区推荐的扩展', 'yellow');

  print('\n3. 创建第一条笔记', 'cyan');
  if (env.claude) {
    print('   运行: claude /quick-capture', 'yellow');
  } else {
    print('   在 VSCode 中使用 Claude Code 扩展', 'yellow');
  }

  print('\n4. 阅读文档', 'cyan');
  print('   06_Meta/Docs/getting-started.md', 'yellow');
  print('   06_Meta/Docs/commands-reference.md', 'yellow');

  print('\n📖 可用的 Claude 命令', 'bright');
  print('─'.repeat(60), 'blue');
  print('   /quick-capture      - 快速捕获想法', 'cyan');
  print('   /thinking-partner   - 思考探索模式', 'cyan');
  print('   /inbox-processor    - 整理收件箱', 'cyan');
  print('   /research-assistant - 深入研究', 'cyan');
  print('   /daily-review       - 每日回顾', 'cyan');
  print('   /weekly-synthesis   - 每周综合', 'cyan');

  print('\n🛠️  可用的 npm 脚本', 'bright');
  print('─'.repeat(60), 'blue');
  print('   npm run stats       - 查看工作区统计', 'cyan');
  print('   npm run file:organize - 整理附件文件', 'cyan');

  print('\n💡 使用技巧', 'bright');
  print('─'.repeat(60), 'blue');
  print('   • 每天从收件箱开始，快速捕获想法', 'yellow');
  print('   • 定期处理收件箱（推荐每天或每周）', 'yellow');
  print('   • 使用 [[双括号]] 创建笔记之间的链接', 'yellow');
  print('   • 使用 #标签 组织内容', 'yellow');
  print('   • 项目完成后移动到 Archive', 'yellow');

  print('\n🌟 记住', 'magenta');
  print('   "The best system is the one you\'ll actually use."', 'magenta');
  print('   "最好的系统是你真正会使用的系统。"', 'magenta');

  print('\n📧 需要帮助？', 'bright');
  print('   查看文档: 06_Meta/Docs/', 'cyan');
  print('   自定义指南: 06_Meta/Docs/customization-guide.md', 'cyan');

  print('\n');
}

// 主函数
async function main() {
  try {
    printBox('Claude Write 内容创作系统', 'bright');
    printBox('初始化向导', 'cyan');

    // 1. 环境检测
    const env = await checkEnvironment();

    // 2. 扫描现有内容
    const stats = scanExistingContent();

    // 3. 收集用户配置
    const config = await collectUserPreferences(stats);

    print('\n');
    printBox('开始初始化...', 'yellow');

    // 4. 创建文件夹结构
    ensureFolderStructure();

    // 5. 创建示例内容
    if (config.createExamples) {
      createExampleNotes(config);
    }

    // 6. 生成配置文件
    generateClaudeConfig(config);

    // 7. 安装依赖
    const depsInstalled = await installDependencies();

    // 8. Git 初始化
    if (config.initGit) {
      initializeGit();
    }

    // 9. 显示完成信息
    showCompletion(config, env);

  } catch (error) {
    print(`\n❌ 初始化失败: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 运行
main();
