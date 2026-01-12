# 定制化指南

如何根据你的需求定制这个系统。

## 系统配置

### 全局配置

编辑 `.claude/config.json` 来修改系统级行为：

```json
{
  "language": "zh-CN",
  "theme": "default",
  "features": {
    "auto_tagging": true,      // 自动添加标签
    "smart_links": true,       // 自动创建双向链接
    "daily_review_time": "21:00" // 每日回顾提醒时间
  },
  "paths": {
    "inbox": "00_Inbox",
    "projects": "01_Projects",
    "areas": "02_Areas",
    "resources": "03_Resources",
    "archive": "04_Archive"
  }
}
```

## VSCode 配置定制

### 修改编辑器设置

编辑 `.vscode/settings.json`:

```json
{
  // 修改字体大小
  "markdown.preview.fontSize": 18,  // 默认 16

  // 修改行高
  "markdown.preview.lineHeight": 2.0,  // 默认 1.8

  // 禁用自动格式化
  "editor.formatOnSave": false,

  // 修改 Daily Note 位置
  "foam.openDailyNote.directory": "02_Areas/Journal"
}
```

### 添加自定义任务

编辑 `.vscode/tasks.json`:

```json
{
  "tasks": [
    {
      "label": "我的自定义任务",
      "type": "shell",
      "command": "npm",
      "args": ["run", "my-script"]
    }
  ]
}
```

### 创建代码片段

编辑 `.vscode/snippets/markdown.json`:

```json
{
  "My Custom Snippet": {
    "prefix": "mysnippet",
    "body": [
      "# ${1:Title}",
      "",
      "${2:Content}"
    ],
    "description": "我的自定义片段"
  }
}
```

## Claude 命令定制

### 使用向导创建命令 (推荐)

最简单的方法是使用内置的命令生成器：

```bash
npm run create-command
```

或者在 Claude 中运行 `/create-command`。向导会引导你完成：
1. 设置命令名称和描述
2. 定义 Agent 角色和目标
3. 设计工作流程
4. 设置行为准则

### 手动创建新命令

在 `.claude/commands/` 创建 Markdown 文件。

**示例: 创建代码审查命令**

文件: `.claude/commands/code-review.md`

```markdown
# Code Review - 代码审查

你是一个专业的代码审查员。

## 工作流程

1. 让用户提供代码文件路径或代码片段
2. 分析代码的以下方面：
   - 可读性
   - 性能
   - 安全性
   - 最佳实践
3. 提供具体的改进建议
4. 给出示例代码

## 审查清单

- [ ] 命名是否清晰
- [ ] 是否有潜在的性能问题
- [ ] 错误处理是否完善
- [ ] 是否符合语言惯例

## 输出格式

### 总体评价
[简短评价]

### 主要问题
1. 问题1
2. 问题2

### 改进建议
[具体建议和示例代码]

### 优点
[代码的优点]
```

使用: 在 Claude Code 中运行 `/code-review`

### 修改现有命令

编辑 `.claude/commands/` 下的文件。

**示例: 修改 thinking-partner**

添加你自己的提问模板：

```markdown
## 自定义提问

如果主题是 [你常探索的主题]，额外询问：
- [你的定制问题1]
- [你的定制问题2]
```

## AI Agents 定制

除了命令，你还可以定制 AI Agent 的角色定义（Persona）。这些定义位于 `06_Meta/Agents/`。

### 修改现有 Agent

例如，修改 `writer.md` 让其风格更严肃：

```markdown
你是一个严谨的学术写作助手。
风格要求：
- 使用客观、中立的语言
- 避免使用夸张的形容词
- 必须引用来源
```

### 创建新 Agent

创建 `06_Meta/Agents/python-expert.md`:

```markdown
你是一个 Python 专家，精通数据科学栈（Pandas, NumPy, Scikit-learn）。
你的代码风格遵循 PEP 8，且总是包含类型注解。
```

## 文件夹结构定制

### 添加自定义文件夹

在主文件夹下创建子文件夹：

```
02_Areas/
└── My-Custom-Area/
    ├── README.md
    └── notes.md
```

### 修改 PARA 分类

如果 PARA 不适合你，可以创建自己的分类：

```
# 按主题分类
Technology/
Career/
Personal/
Learning/
```

保持一致性即可。

## 模板定制

### 修改现有模板

编辑 `06_Meta/Templates/` 下的文件。

### 创建新模板

**示例: 读书笔记模板**

文件: `06_Meta/Templates/book-note.md`

```markdown
---
title: {Book Title}
author: {Author}
date_read: {Date}
rating: /5
tags: [book, {genre}]
---

# {Book Title}

**作者**: {Author}
**评分**: ⭐⭐⭐⭐⭐

## 基本信息

- **出版年份**:
- **页数**:
- **ISBN**:

## 核心观点

1.
2.
3.

## 重要引用

> "..."
>
> — 第X页

## 个人思考

## 行动项

- [ ]

## 相关笔记

- [[]]
```

### 在 VSCode Snippet 中使用模板

```json
{
  "Book Note": {
    "prefix": "book",
    "body": [
      "---",
      "title: ${1:Book Title}",
      "author: ${2:Author}",
      "..."
    ]
  }
}
```

## 脚本定制

### 修改统计脚本

编辑 `scripts/stats/workspace-stats.js`:

```javascript
// 添加自定义统计
const customStats = {
  // 统计特定标签
  reactNotes: contentFiles.filter(f => {
    const tags = extractTags(readFile(f));
    return tags.includes('react');
  }).length
};

console.log(`React 笔记数: ${customStats.reactNotes}`);
```

### 创建新脚本

文件: `scripts/my-scripts/word-goal-tracker.js`

```javascript
// 追踪字数目标
const { getAllMarkdownFiles, readFile } = require('../utils/file-helpers');
const { countWords } = require('../utils/markdown-parser');

const DAILY_GOAL = 500;

const files = getAllMarkdownFiles(process.cwd());
const today = new Date().toISOString().split('T')[0];

let todayWords = 0;

files.forEach(file => {
  if (file.includes(today)) {
    todayWords += countWords(readFile(file));
  }
});

console.log(`今日字数: ${todayWords} / ${DAILY_GOAL}`);
console.log(`完成度: ${Math.round(todayWords / DAILY_GOAL * 100)}%`);
```

在 `package.json` 添加脚本：

```json
{
  "scripts": {
    "goal": "node scripts/my-scripts/word-goal-tracker.js"
  }
}
```

使用: `npm run goal`

## 自动化与定时任务

### 配置定时任务

系统内置了任务调度器，你可以通过编辑 `.claude/schedule.json` (如果存在) 或直接修改 `scripts/scheduler/daemon.js` 来添加任务。

**启动守护进程**

```bash
npm run daemon
```

**添加自定义定时任务**

在 `scripts/scheduler/daemon.js` 中：

```javascript
// 每天早上 8 点发送励志名言
cron.schedule('0 8 * * *', () => {
  console.log('🌞 早安！开始新的一天创作吧。');
  // 这里可以调用系统通知或其他脚本
});
```

### 每日自动任务

**macOS: 使用 cron (系统级)**

```bash
# 编辑 crontab
crontab -e

# 每天晚上 9 点提醒回顾
0 21 * * * osascript -e 'display notification "该回顾今天了！" with title "Daily Review"'
```

## Git 工作流定制

### 创建 Git 钩子

文件: `.git/hooks/pre-commit`

```bash
#!/bin/bash

# 提交前运行统计
npm run stats > stats-report.txt

# 检查是否有 TODO
if grep -r "TODO" --include="*.md" .; then
  echo "警告: 存在 TODO 项目"
fi
```

### 自定义 .gitignore

根据需要添加忽略规则：

```gitignore
# 忽略特定项目
01_Projects/Private-Project/

# 忽略草稿
**/*-draft.md

# 忽略日记
02_Areas/Journal/
```

## 主题和样式定制

### 自定义 Markdown 预览样式

创建文件: `.vscode/markdown-preview.css`

```css
/* 自定义标题样式 */
h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
}

/* 自定义代码块 */
code {
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
}
```

在 settings.json 中引用：

```json
{
  "markdown.styles": [
    ".vscode/markdown-preview.css"
  ]
}
```

## 集成外部工具

### Alfred/Raycast 快捷方式

**Alfred Workflow 示例**

1. 创建关键词触发器: `qc`
2. 运行脚本:
```bash
cd /path/to/workspace
claude /quick-capture
```

快速访问: 输入 `qc` 即可捕获想法。

### Obsidian Sync (可选)

如果你同时使用 Obsidian:

1. 在 Obsidian 中打开这个文件夹
2. 启用社区插件:
   - Dataview
   - Calendar
   - Excalidraw

### Notion/Roam 导入

使用脚本将现有笔记迁移：

```javascript
// scripts/import/notion-import.js
// 解析 Notion 导出的 Markdown
// 转换格式并导入
```

## 个性化建议

### 按使用场景定制

**学术研究者**:
- 在 03_Resources/ 添加 Papers/ 子文件夹
- 创建 citation 管理命令
- 添加文献笔记模板

**软件开发者**:
- 创建 code-snippet 管理命令
- 添加 bug-tracking 模板
- 集成 GitHub Issues

**内容创作者**:
- 创建发布平台相关的模板
- 添加 SEO 检查脚本
- 集成图片优化工具

### 团队使用

**共享模板和命令**:

1. 团队共享仓库
2. 个人 fork 并定制
3. 定期同步团队更新

**分支策略**:
- `main` - 团队共享配置
- `personal` - 个人定制

## 导出和分享

### 导出为网站

使用静态站点生成器：

```bash
# 使用 MkDocs
pip install mkdocs
mkdocs new my-docs
# 复制 Markdown 文件
mkdocs serve
```

### 分享单篇笔记

```bash
# 使用 Pandoc 转换格式
pandoc note.md -o note.pdf
pandoc note.md -o note.docx
```

## 性能优化

### 大型工作区优化

如果文件超过 1000 个：

```json
{
  // 排除大文件夹的搜索
  "search.exclude": {
    "**/04_Archive/**": true,
    "**/03_Resources/Books/**": true
  },

  // 限制文件监控
  "files.watcherExclude": {
    "**/04_Archive/**": true
  }
}
```

## 记住

定制化的目标是**让系统适应你的工作流**，而非相反。

- 从小改动开始
- 记录有效的定制
- 定期回顾和调整
- 不要过度工程化

最好的系统是你实际会使用的系统！
