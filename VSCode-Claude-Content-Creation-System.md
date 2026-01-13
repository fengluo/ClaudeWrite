# VSCode + Claude Code 内容创作系统设计方案

> 基于 Claudesidian 理念,打造适合 VSCode 的 AI 驱动知识管理与内容创作平台

## 目录

1. [系统概述](#系统概述)
2. [核心设计理念](#核心设计理念)
3. [技术架构](#技术架构)
4. [功能模块设计](#功能模块设计)
5. [项目结构](#项目结构)
6. [实施路线图](#实施路线图)
7. [VSCode 特定优化](#vscode-特定优化)
8. [使用场景](#使用场景)

---

## 系统概述

### 项目目标

构建一个基于 VSCode + Claude Code 的本地优先、AI 增强的内容创作系统,实现:

- **双模式工作流**: 思考模式(探索想法) + 写作模式(产出内容)
- **结构化知识管理**: 采用改良的 PARA 方法组织内容
- **智能辅助创作**: 利用 Claude Code 提供上下文感知的 AI 助手
- **版本控制**: 基于 Git 追踪知识演变
- **可扩展性**: 支持自定义命令、工作流和集成

### 与 Claudesidian 的对比

| 特性 | Claudesidian (Obsidian) | 本方案 (VSCode) |
|------|------------------------|----------------|
| 核心编辑器 | Obsidian | VSCode |
| 文件格式 | Markdown | Markdown + 多格式支持 |
| 扩展性 | Obsidian 插件 | VSCode 扩展 + 任务自动化 |
| AI 集成 | Claude Code CLI | Claude Code CLI + Tasks |
| 版本控制 | Git (需配置) | 原生 Git 集成 |
| 代码支持 | 基础 | 专业级代码编辑 |
| 可视化 | 图谱视图 | 文件树 + 自定义视图 |
| 移动访问 | SSH 远程 | SSH 远程 + Code Server |

### 适用人群

- 内容创作者(文章、教程、文档)
- 技术写作者(需要代码与文档结合)
- 研究人员(需要管理文献和笔记)
- 产品经理(需求文档、用户故事)
- 知识工作者(个人知识库管理)

---

## 核心设计理念

### 1. 思考优先于写作

**理念**: AI 是思考伙伴,不是打字机。

**实现**:
- 强制性"思考模式"命令,引导用户先澄清想法
- 记录思考过程(洞察日志、问题链)
- 在生成内容前建立想法连接

### 2. 本地优先,云端可选

**理念**: 数据主权归用户,永久可访问。

**实现**:
- 所有内容存储为纯文本(Markdown)
- Git 版本控制
- 可选同步到云端(GitHub/GitLab)
- 无厂商锁定

### 3. 结构即自由

**理念**: 良好的组织结构释放创造力。

**实现**:
- PARA 方法的改良版
- 约定优于配置的文件夹结构
- 灵活的标签和元数据系统

### 4. 渐进式增强

**理念**: 基础功能开箱即用,高级功能按需启用。

**实现**:
- 核心功能零配置
- 可选集成(Gemini Vision、Web Scraping)
- 模块化设计,按需加载

---

## 技术架构

### 技术栈

```
┌─────────────────────────────────────────┐
│           用户界面层                       │
│    VSCode + Markdown Preview Enhanced   │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           AI 集成层                       │
│   Claude Code CLI + Custom Commands     │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         扩展能力层 (可选)                  │
│  Gemini MCP | Firecrawl | Custom MCP    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           数据存储层                       │
│    Markdown Files + Git + Attachments   │
└─────────────────────────────────────────┘
```

### 核心组件

#### 1. VSCode 扩展配置

**必需扩展**:
- Markdown All in One (编辑增强)
- Markdown Preview Enhanced (预览)
- GitLens (Git 可视化)
- Foam (双向链接、图谱)

**推荐扩展**:
- Todo Tree (任务管理)
- Front Matter CMS (元数据管理)
- Code Spell Checker (拼写检查)
- Prettier (格式化)

#### 2. Claude Code 集成

**架构**:
```
.claude/
├── commands/          # 自定义命令定义
│   ├── thinking-partner.md
│   ├── research-assistant.md
│   ├── inbox-processor.md
│   ├── daily-review.md
│   ├── weekly-synthesis.md
│   ├── de-ai-ify.md
│   └── custom-*.md
├── agents/            # 专门化 Agent 指令
│   ├── writer.md
│   ├── researcher.md
│   └── editor.md
└── config.json        # 配置文件
```

#### 3. 自动化脚本

**技术选型**: Node.js + TypeScript

**脚本类型**:
- 文件管理(附件整理、孤儿文件检测)
- 统计分析(字数统计、进度追踪)
- 内容转换(格式转换、导出)
- Git 自动化(智能提交、同步)

---

## 功能模块设计

### 模块 1: 智能初始化向导

**目标**: 零配置快速启动,自动适配用户需求。

**功能**:

1. **环境检测**
   - 检查 VSCode 版本
   - 验证必需扩展
   - 检测 Claude Code CLI
   - 确认 Git 配置

2. **个性化配置**
   - 询问主要用途(写作/研究/混合)
   - 分析现有文件结构(如有)
   - 生成个性化 `CLAUDE.md`
   - 创建工作区设置 `.vscode/settings.json`

3. **结构初始化**
   - 创建 PARA 文件夹
   - 设置模板文件
   - 初始化 Git 仓库
   - 配置 `.gitignore`

**实现命令**: `/init-workspace`

**交互流程**:
```
欢迎使用 VSCode + Claude 内容创作系统!

我将引导你完成初始化...

[1/6] 检测环境
✓ VSCode 版本: 1.85.0
✓ Claude Code CLI: 已安装
✓ Git: 已安装
⚠ 推荐扩展 "Foam" 未安装,是否现在安装? [Y/n]

[2/6] 导入现有内容 (可选)
检测到当前目录包含 Markdown 文件,是否导入? [Y/n]
└─ 将创建 OLD_CONTENT/ 备份现有文件

[3/6] 个性化设置
你主要用途是? [1] 技术写作  [2] 研究笔记  [3] 创意写作  [4] 混合
你偏好的写作语言? [1] 中文  [2] English  [3] 双语

[4/6] 生成配置文件
✓ 创建 CLAUDE.md (你的 AI 助手配置)
✓ 创建 .vscode/settings.json
✓ 创建 .gitignore

[5/6] 创建文件夹结构
✓ 00_Inbox/
✓ 01_Projects/
✓ 02_Areas/
✓ 03_Resources/
✓ 04_Archive/
✓ 05_Attachments/
✓ 06_Meta/

[6/6] 初始化 Git
✓ git init
✓ 首次提交: "Initial workspace setup"

初始化完成! 输入 `/help` 查看可用命令。
```

### 模块 2: 双模式工作流

#### 思考模式 (Thinking Mode)

**目标**: 通过 AI 对话探索想法,建立知识连接。

**命令**: `/thinking-partner`

**工作流程**:
1. AI 询问你想探索的主题
2. 搜索工作区中的相关笔记
3. 展示相关内容的连接
4. 通过提问引导深入思考
5. 记录洞察到相关上下文笔记（项目/领域/资源/收件箱）

**示例对话**:
```
User: /thinking-partner
我想探索"个人知识管理系统的设计原则"

AI: 我在你的工作区中找到了 3 篇相关笔记:
- 02_Areas/Knowledge-Management.md
- 03_Resources/PARA-Method.md
- 01_Projects/Build-Second-Brain/notes.md

让我先问几个问题帮你澄清思路:

1. 你认为"好的知识管理系统"最重要的特征是什么?
2. 你当前的系统有什么痛点?
3. 这个探索是为了解决具体问题,还是纯粹的理论研究?

[User 回答后,AI 继续引导...]

基于你的回答,我注意到你之前在 Build-Second-Brain 项目中
提到过"检索>分类"的观点。这与你现在的想法有什么联系?
```

**输出**:
- 将洞察写回相关笔记（例如 `03_Resources/Knowledge-Systems.md` 的洞察区块）
- 更新相关笔记的反向链接

#### 写作模式 (Writing Mode)

**目标**: 基于研究和思考,产出结构化内容。

**命令**: `/research-assistant` → `/draft-content` → `/de-ai-ify`

**工作流程**:

1. **研究阶段** (`/research-assistant`)
   - 深入分析主题
   - 搜索外部资料(可选 Firecrawl)
   - 整理引用和参考文献
   - 生成大纲

2. **草稿阶段** (`/draft-content`)
   - 基于大纲生成初稿
   - 保持结构化
   - 标注需要补充的部分

3. **去 AI 化** (`/de-ai-ify`)
   - 移除 AI 写作痕迹
   - 增加个人风格
   - 调整语气和节奏

**示例**:
```
User: /research-assistant
主题: 如何设计一个好的 API

AI: 我将帮你深入研究这个主题。让我先搜索你的工作区...

找到相关笔记:
- 03_Resources/API-Design-Patterns.md
- 02_Areas/Backend-Development.md

我还建议搜索以下外部资源:
- RESTful API 设计最佳实践
- GraphQL vs REST 对比
- API 版本控制策略

是否启动外部研究? [Y/n]

[研究完成后]

已整理以下大纲:

# 如何设计一个好的 API

## 1. 设计原则
   - 一致性
   - 简单性
   - 可预测性

## 2. 技术选型
   - REST vs GraphQL
   - 版本控制策略

## 3. 实践案例
   - GitHub API
   - Stripe API

保存到哪里? [1] 00_Inbox  [2] 01_Projects  [3] 03_Resources
```

### 模块 3: 收件箱处理

**目标**: 快速捕获想法,定期整理到正确位置。

**命令**: `/quick-capture` (捕获) + `/inbox-processor` (整理)

**快速捕获**:
```
User: /quick-capture
快速创建灵感笔记

AI: 请描述你的想法(可以是不完整的句子):

User: 写一篇关于 Git Hooks 自动化的文章
      可以结合实际项目经验
      目标读者是初学者

AI: ✓ 已保存到 00_Inbox/2024-01-10-git-hooks-idea.md
    添加标签: #idea #git #tutorial

    是否现在就开始探索这个想法? [Y/n]
```

**定期整理**:
```
User: /inbox-processor

AI: 你的收件箱有 5 个未处理项目:

[1] 2024-01-10-git-hooks-idea.md
    标签: #idea #git #tutorial
    建议: 移动到 01_Projects/Git-Hooks-Tutorial/

[2] meeting-notes-2024-01-09.md
    标签: #meeting
    建议: 提取行动项到 Projects,原文归档

[3] random-thoughts.md
    标签: 无
    建议: 请先阅读并分类

逐个处理还是批量? [1] 逐个 [2] 批量应用建议
```

### 模块 4: 定期回顾

**目标**: 发现模式,巩固学习,调整方向。

**命令**: `/daily-review` + `/weekly-synthesis`

**每日回顾**:
```
User: /daily-review

AI: 让我们回顾今天的工作...

今天你:
- 创建了 2 个新笔记
- 更新了 3 个项目
- 添加了 5 个标签

核心主题:
- Git 自动化 (3 次提及)
- API 设计 (2 次提及)

反思问题:
1. 今天最有价值的洞察是什么?
2. 有什么未完成的想法需要明天继续?
3. 学到了什么新知识?

[回答后保存到 06_Meta/Reviews/2024-01-10-daily.md]
```

**周度综合**:
```
User: /weekly-synthesis

AI: 分析过去 7 天的笔记...

本周统计:
- 新增笔记: 12 篇
- 完成项目: 1 个 (Git Hooks Tutorial)
- 热门标签: #git (8), #api (5), #automation (4)

浮现的主题:
1. 开发工具自动化 - 你对提升效率的工具很感兴趣
2. 最佳实践总结 - 多次尝试提炼经验为文章

知识图谱变化:
- "Git" 节点连接增加 5 个
- 新兴集群: "Developer Experience"

本周亮点笔记:
- 01_Projects/Git-Hooks-Tutorial/final-draft.md (字数最多)
- 03_Resources/automation-philosophy.md (反向链接最多)

下周建议:
- 考虑将零散的自动化笔记整理为一个 Area
- "Developer Experience" 主题值得深入探索

[保存到 06_Meta/Reviews/2024-W02-weekly.md]
```

### 模块 5: 智能升级系统

**目标**: 安全更新系统,保护用户内容。

**命令**: `/upgrade`

**功能特点**:
- 仅更新系统文件(`.claude/`, `scripts/`, `06_Meta/Templates/`)
- 从不触碰用户内容(00-04 文件夹)
- 显示文件差异
- 创建时间戳备份
- 可暂停和恢复

**工作流程**:
```
User: /upgrade

AI: 检查更新...
发现新版本 v2.1.0,包含以下改进:

系统文件更新:
[1] .claude/commands/thinking-partner.md
    - 新增:支持多轮对话记忆
    - 查看差异 [D] | 应用 [Y] | 跳过 [N]

[2] scripts/attachment-manager.js
    - 新增:自动压缩大图片
    - 查看差异 [D] | 应用 [Y] | 跳过 [N]

新增文件:
[3] .claude/commands/code-reviewer.md
    - 代码审查助手(新功能)
    - 应用 [Y] | 跳过 [N]

备份位置: .backup/upgrade-2024-01-10-143025/

是否继续? [Y/n]
```

### 模块 6: 视觉与文档分析 (可选)

**目标**: 直接分析图片和 PDF,无需手动描述。

**前置条件**: 配置 Gemini Vision MCP

**使用场景**:

1. **截图分析**
```
User: 分析这个错误截图
[拖拽图片到 VSCode]

AI: [直接读取图片]
这是一个 TypeScript 类型错误:
- 错误位置: src/api/user.ts:42
- 问题: Property 'email' does not exist on type 'User'
- 原因: User 接口定义缺少 email 字段

建议修复:
[AI 提供代码补丁]
```

2. **文档提取**
```
User: /extract-pdf
文件: 05_Attachments/research-paper.pdf

AI: 正在提取 PDF 内容...
✓ 28 页已提取
✓ 检测到 3 个图表(已保存描述)
✓ 提取 15 个参考文献

保存为: 03_Resources/Research-Papers/paper-title.md

是否需要我总结关键内容? [Y/n]
```

3. **批量处理**
```
User: /batch-analyze-images
目录: 05_Attachments/screenshots/

AI: 找到 12 张未处理图片,正在分析...

[1/12] screenshot-001.png
      检测到: UI 设计稿
      建议文件名: landing-page-design-v1.png
      建议位置: 01_Projects/Website-Redesign/

[2/12] screenshot-002.png
      检测到: 代码错误
      建议创建笔记: 00_Inbox/fix-login-bug.md

...

处理完成! 是否应用建议? [Y/n]
```

### 模块 7: 网页研究 (可选)

**目标**: 保存完整文章到工作区,避免 Claude 上下文限制。

**前置条件**: 配置 Firecrawl API

**使用方式**:

1. **单篇保存**
```bash
npm run web:save -- "https://example.com/article" "03_Resources/Articles"
```

2. **批量保存**
```bash
# 创建 urls.txt
https://blog.example.com/post-1
https://blog.example.com/post-2
https://docs.example.com/guide

# 执行批量保存
npm run web:batch -- urls.txt "03_Resources/Tech-Readings"
```

3. **结合 Claude 分析**
```
User: /research-topic
主题: React Server Components

AI: 我将搜索相关资料...

找到推荐文章:
[1] React 官方文档: Server Components
[2] Dan Abramov 的博客文章
[3] Vercel 的实践案例

是否保存这些文章到工作区? [Y/n]

[保存后]
✓ 3 篇文章已保存到 03_Resources/React-Server-Components/

现在让我分析这些文章的核心观点...
[AI 基于完整文本进行深度分析,不受 token 限制]
```

### 模块 8: 辅助工具集

#### 文件管理

**附件整理**:
```bash
npm run file:list-orphans    # 找出未被引用的附件
npm run file:organize        # 按类型整理附件
npm run file:compress        # 压缩大文件
```

**统计分析**:
```bash
npm run stats:overview       # 工作区概览
npm run stats:word-count     # 字数统计(按项目/标签)
npm run stats:activity       # 活跃度分析
```

#### Git 自动化

**智能提交**:
```
User: /smart-commit

AI: 检测到以下变更:

新增文件:
- 01_Projects/Git-Tutorial/draft.md (1200 字)

修改文件:
- 02_Areas/Writing.md (添加 2 个链接)
- CLAUDE.md (更新配置)

建议提交信息:
"Add: Git Hooks tutorial draft

- Create initial draft (1200 words)
- Update writing area with new links
- Adjust AI assistant preferences"

是否使用此提交信息? [Y/n/Edit]
```

**同步检查**:
```bash
npm run git:sync-check       # 检查未同步的更改
npm run git:auto-sync        # 自动拉取并推送
```

### 模块 9: 自定义命令创建器

**目标**: 用户可以创建专属 AI 助手。

**命令**: `/create-command`

**示例对话**:
```
User: /create-command

AI: 让我帮你创建自定义命令。

命令名称 (例如: "blog-publisher"):
User: social-media-adapter

这个命令的作用是?
User: 将长文章改写为社交媒体帖子(Twitter/小红书)

AI: 好的,这个命令将:
- 读取现有文章
- 提取核心观点
- 改写为社交媒体格式
- 考虑字数限制和平台特点

需要支持哪些平台?
[1] Twitter/X
[2] 小红书
[3] LinkedIn
[4] 全部

User: 4

AI: 正在生成命令定义...

✓ 创建 .claude/commands/social-media-adapter.md
✓ 创建示例模板 06_Meta/Templates/social-post.md

你现在可以使用 `/social-media-adapter` 命令了!

是否现在测试? [Y/n]
```

---

## 项目结构

### 完整目录树

```
vscode-claude-workspace/
├── 00_Inbox/                    # 快速捕获区
│   ├── README.md                # 使用说明
│   └── .gitkeep
│
├── 01_Projects/                 # 有明确目标和截止日期的项目
│   ├── _template/               # 项目模板
│   │   ├── README.md
│   │   ├── notes.md
│   │   └── references.md
│   └── .gitkeep
│
├── 02_Areas/                    # 持续性责任领域
│   ├── _template/
│   │   └── area-template.md
│   └── .gitkeep
│
├── 03_Resources/                # 参考资料和知识库
│   ├── Articles/                # 保存的文章
│   ├── Books/                   # 读书笔记
│   ├── Courses/                 # 课程笔记
│   ├── Research/                # 研究资料
│   └── .gitkeep
│
├── 04_Archive/                  # 已完成或不活跃的内容
│   └── .gitkeep
│
├── 05_Attachments/              # 媒体文件
│   ├── images/
│   ├── documents/
│   ├── videos/
│   └── .gitkeep
│
├── 06_Meta/                     # 系统元数据
│   ├── Agents/                  # AI Agent 定义
│   │   ├── writer.md
│   │   ├── researcher.md
│   │   └── editor.md
│   ├── Templates/               # 笔记模板
│   │   ├── daily-note.md
│   │   ├── meeting-note.md
│   │   ├── article-draft.md
│   │   └── project-plan.md
│   ├── Reviews/                 # 定期回顾记录
│   │   ├── daily/
│   │   └── weekly/
│   ├── Insights/                # 洞察日志
│   └── Docs/                    # 系统文档
│       ├── getting-started.md
│       ├── commands-reference.md
│       └── customization-guide.md
│
├── .claude/                     # Claude Code 配置
│   ├── commands/                # 自定义命令
│   │   ├── thinking-partner.md
│   │   ├── research-assistant.md
│   │   ├── inbox-processor.md
│   │   ├── daily-review.md
│   │   ├── weekly-synthesis.md
│   │   ├── draft-content.md
│   │   ├── de-ai-ify.md
│   │   ├── smart-commit.md
│   │   ├── create-command.md
│   │   └── upgrade.md
│   └── config.json              # Claude 配置
│
├── .vscode/                     # VSCode 配置
│   ├── settings.json            # 工作区设置
│   ├── extensions.json          # 推荐扩展
│   ├── tasks.json               # 任务定义
│   └── snippets/                # 代码片段
│       └── markdown.json
│
├── scripts/                     # 自动化脚本
│   ├── setup/
│   │   └── init-workspace.js    # 初始化向导
│   ├── file-management/
│   │   ├── organize-attachments.js
│   │   ├── find-orphans.js
│   │   └── compress-images.js
│   ├── stats/
│   │   ├── workspace-stats.js
│   │   ├── word-count.js
│   │   └── activity-tracker.js
│   ├── git/
│   │   ├── smart-commit.js
│   │   └── auto-sync.js
│   ├── web/
│   │   ├── save-article.js
│   │   └── batch-save.js
│   └── utils/
│       ├── markdown-parser.js
│       └── file-helpers.js
│
├── .backup/                     # 自动备份目录
│   └── .gitkeep
│
├── .gitignore                   # Git 忽略规则
├── package.json                 # 依赖管理
├── tsconfig.json                # TypeScript 配置
├── CLAUDE.md                    # Claude 个性化配置(自动生成)
└── README.md                    # 项目说明
```

### 关键文件说明

#### CLAUDE.md (示例)

```markdown
# Claude 助手配置

## 关于我

- **主要用途**: 技术写作 + 个人知识管理
- **写作语言**: 简体中文为主, English 为辅
- **专业领域**: 前端开发、DevOps、产品设计
- **写作风格**: 实用主义、代码示例丰富、深入浅出

## 工作区约定

- 所有项目笔记包含 `README.md` 和 `notes.md`
- 使用 YAML Front Matter 记录元数据
- 标签使用小写加连字符 (例: `#front-end`)
- 日期格式: YYYY-MM-DD

## AI 协作偏好

- **思考模式**: 多问问题,帮我澄清想法,不要急于给答案
- **写作模式**: 初稿可以是 AI 生成,但最终必须经过我的改写
- **代码**: 提供完整可运行的示例,包含注释
- **引用**: 总是注明信息来源

## 不要做的事

- 不要创建我没要求的文件
- 不要过度使用 emoji
- 不要自作主张删除内容
- 不要在代码中使用中文注释(除非特别说明)
```

#### .vscode/settings.json

```json
{
  "files.exclude": {
    "**/.git": true,
    "**/.backup": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.backup/**": true,
    "**/05_Attachments/**": true
  },
  "markdown.preview.fontSize": 16,
  "markdown.preview.lineHeight": 1.8,
  "editor.wordWrap": "on",
  "editor.quickSuggestions": {
    "comments": "on",
    "strings": "on",
    "other": "on"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.wordWrap": "on",
    "editor.quickSuggestions": {
      "comments": "on",
      "strings": "on",
      "other": "on"
    }
  },
  "foam.openDailyNote.directory": "06_Meta/Reviews/daily",
  "foam.openDailyNote.fileExtension": "md",
  "foam.openDailyNote.titleFormat": "'Daily Note for' yyyy-MM-dd",
  "git.autofetch": true,
  "git.confirmSync": false,
  "todo-tree.general.tags": [
    "TODO",
    "FIXME",
    "NOTE",
    "IDEA",
    "RESEARCH"
  ]
}
```

#### .vscode/extensions.json

```json
{
  "recommendations": [
    "yzhang.markdown-all-in-one",
    "shd101wyy.markdown-preview-enhanced",
    "eamodio.gitlens",
    "foam.foam-vscode",
    "gruntfuggly.todo-tree",
    "esbenp.prettier-vscode",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

#### package.json

```json
{
  "name": "vscode-claude-workspace",
  "version": "1.0.0",
  "description": "AI-powered content creation workspace",
  "scripts": {
    "init": "node scripts/setup/init-workspace.js",
    "file:organize": "node scripts/file-management/organize-attachments.js",
    "file:orphans": "node scripts/file-management/find-orphans.js",
    "file:compress": "node scripts/file-management/compress-images.js",
    "stats:overview": "node scripts/stats/workspace-stats.js",
    "stats:words": "node scripts/stats/word-count.js",
    "stats:activity": "node scripts/stats/activity-tracker.js",
    "git:smart-commit": "node scripts/git/smart-commit.js",
    "git:sync": "node scripts/git/auto-sync.js",
    "web:save": "node scripts/web/save-article.js",
    "web:batch": "node scripts/web/batch-save.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "gray-matter": "^4.0.3",
    "markdown-it": "^14.0.0",
    "node-fetch": "^3.3.0",
    "simple-git": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 实施路线图

### 阶段 1: 核心基础 (Week 1-2)

**目标**: 建立可用的基础系统。

**任务**:
1. 创建项目结构模板
2. 编写初始化脚本 (`init-workspace.js`)
3. 配置 VSCode 设置和推荐扩展
4. 实现核心 Claude 命令:
   - `/thinking-partner`
   - `/quick-capture`
   - `/inbox-processor`
5. 编写入门文档

**交付物**:
- 可克隆的 GitHub 仓库模板
- 工作的初始化向导
- 基础文档

### 阶段 2: 工作流增强 (Week 3-4)

**目标**: 完善双模式工作流。

**任务**:
1. 实现研究助手命令 (`/research-assistant`)
2. 实现内容创作命令 (`/draft-content`, `/de-ai-ify`)
3. 开发文件管理脚本 (整理附件、统计等)
4. 添加 Git 自动化 (`/smart-commit`)
5. 创建笔记模板系统

**交付物**:
- 完整的写作工作流
- 自动化脚本集
- 模板库

### 阶段 3: 智能功能 (Week 5-6)

**目标**: 添加高级 AI 能力。

**任务**:
1. 实现定期回顾 (`/daily-review`, `/weekly-synthesis`)
2. 开发自定义命令创建器 (`/create-command`)
3. 实现智能升级系统 (`/upgrade`)
4. 集成 Gemini Vision (可选)
5. 集成 Firecrawl (可选)

**交付物**:
- 反思和综合工具
- 可扩展的命令系统
- 安全的升级机制

### 阶段 4: 优化和文档 (Week 7-8)

**目标**: 打磨用户体验,完善文档。

**任务**:
1. 性能优化 (大工作区支持)
2. 错误处理和异常恢复
3. 编写详细的使用指南
4. 创建视频教程
5. 建立社区贡献指南

**交付物**:
- 稳定的 v1.0.0 版本
- 完整文档站点
- 示例工作区

### 阶段 5: 社区和生态 (持续)

**目标**: 构建用户社区,收集反馈。

**任务**:
1. 收集用户反馈
2. 建立 Issue 追踪
3. 开发额外的命令和 Agent
4. 创建 VSCode 扩展 (可选)
5. 集成更多 MCP Servers

**交付物**:
- 活跃的社区
- 持续更新
- 扩展生态系统

---

## VSCode 特定优化

### 1. 任务自动化 (Tasks)

**`.vscode/tasks.json`**:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Quick Capture",
      "type": "shell",
      "command": "claude",
      "args": ["/quick-capture"],
      "problemMatcher": []
    },
    {
      "label": "Daily Review",
      "type": "shell",
      "command": "claude",
      "args": ["/daily-review"],
      "problemMatcher": []
    },
    {
      "label": "Process Inbox",
      "type": "shell",
      "command": "claude",
      "args": ["/inbox-processor"],
      "problemMatcher": []
    },
    {
      "label": "Workspace Stats",
      "type": "shell",
      "command": "npm",
      "args": ["run", "stats:overview"],
      "problemMatcher": []
    }
  ]
}
```

**使用**: `Cmd+Shift+P` → `Tasks: Run Task` → 选择任务

### 2. 键盘快捷键

**`.vscode/keybindings.json`** (用户级):

```json
[
  {
    "key": "cmd+shift+i",
    "command": "workbench.action.tasks.runTask",
    "args": "Quick Capture"
  },
  {
    "key": "cmd+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Daily Review"
  }
]
```

### 3. Markdown 代码片段

**`.vscode/snippets/markdown.json`**:

```json
{
  "Project Note": {
    "prefix": "project",
    "body": [
      "---",
      "title: ${1:Project Title}",
      "created: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "tags: [project, ${2:tag}]",
      "status: ${3|in-progress,completed,on-hold|}",
      "---",
      "",
      "# ${1:Project Title}",
      "",
      "## Goal",
      "${4:What is the objective?}",
      "",
      "## Context",
      "${5:Why is this important?}",
      "",
      "## Tasks",
      "- [ ] ${6:Task 1}",
      "",
      "## Notes",
      "$0"
    ]
  },
  "Meeting Note": {
    "prefix": "meeting",
    "body": [
      "---",
      "title: ${1:Meeting Title}",
      "date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "attendees: [${2:names}]",
      "tags: [meeting]",
      "---",
      "",
      "# ${1:Meeting Title}",
      "",
      "**Date**: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      "**Attendees**: ${2:names}",
      "",
      "## Agenda",
      "1. ${3:Topic 1}",
      "",
      "## Discussion",
      "${4:Key points}",
      "",
      "## Action Items",
      "- [ ] ${5:Action 1} (@${6:owner})",
      "",
      "## Next Steps",
      "$0"
    ]
  }
}
```

### 4. Foam 双向链接

**功能**:
- `[[note-name]]` 创建链接
- 自动补全笔记名称
- 悬停预览
- 图谱视图

**配置**:
```json
{
  "foam.edit.linkReferenceDefinitions": "withExtensions",
  "foam.files.ignore": [
    "**/node_modules/**",
    "**/.vscode/**",
    "**/.backup/**"
  ]
}
```

### 5. Front Matter CMS

**用途**: 可视化管理笔记元数据。

**示例元数据**:
```yaml
---
title: My Article
date: 2024-01-10
tags: [writing, tutorial]
status: draft
wordCount: 1200
lastReviewed: 2024-01-10
---
```

**功能**:
- 侧边栏元数据编辑器
- 批量标签管理
- 状态看板视图

---

## 使用场景

### 场景 1: 技术博客写作

**工作流**:

```
1. 快速捕获想法
   $ /quick-capture
   "写一篇关于 React Server Components 的深度文章"
   → 保存到 00_Inbox/

2. 思考模式探索
   $ /thinking-partner
   "我想探索 RSC 的设计哲学"
   → AI 搜索相关笔记,引导思考
   → 把洞察写回到相关笔记或新建到对应目录

3. 深度研究
   $ /research-assistant
   "React Server Components 完整指南"
   → AI 搜索内部笔记 + 外部资料
   → 使用 Firecrawl 保存官方文档
   → 生成大纲

4. 创建项目
   移动到 01_Projects/RSC-Deep-Dive/
   使用项目模板创建结构

5. 撰写草稿
   $ /draft-content
   基于大纲生成初稿

6. 去 AI 化
   $ /de-ai-ify
   移除 AI 写作痕迹,增加个人风格

7. 代码示例
   直接在 VSCode 中编写和测试代码
   嵌入到 Markdown

8. 发布前检查
   - 运行拼写检查
   - 检查链接有效性
   - 格式化代码块

9. 版本控制
   $ /smart-commit
   "Complete: RSC deep dive article (3500 words)"

10. 导出发布
    复制到博客平台 / 使用 API 直接发布
```

### 场景 2: 产品需求文档

**工作流**:

```
1. 会议记录捕获
   使用 "meeting" snippet 快速创建会议笔记
   记录功能需求

2. 需求整理
   $ /inbox-processor
   提取会议中的功能点到项目

3. 用户故事拆解
   $ /thinking-partner
   "帮我把这个功能拆解为用户故事"
   → AI 引导拆解

4. 创建项目结构
   01_Projects/Feature-X/
   ├── requirements.md
   ├── user-stories.md
   ├── technical-design.md
   └── references.md

5. 研究竞品
   使用 Firecrawl 保存竞品分析文章
   $ /research-assistant 综合分析

6. 撰写 PRD
   基于模板创建 Product Requirements Document
   包含:
   - 背景和目标
   - 用户故事
   - 功能规格
   - 技术方案
   - 时间规划

7. 协作评审
   提交到 Git → 创建 PR
   团队成员在 GitHub 上评论

8. 定期同步
   $ /weekly-synthesis
   回顾项目进展,调整优先级
```

### 场景 3: 学习笔记整理

**工作流**:

```
1. 课程视频笔记
   看视频时在 00_Inbox/ 快速记录要点

2. 截图分析(Gemini Vision)
   拖拽课程 PPT 截图到附件
   AI 自动提取文字并总结

3. 每日回顾
   $ /daily-review
   回顾今天学到的内容,提炼关键概念

4. 建立知识连接
   $ /thinking-partner
   "这个概念与我之前学的 X 有什么联系?"
   → AI 搜索相关笔记,建立链接

5. 主题整理
   将零散笔记整理到 02_Areas/Learning/
   按主题创建索引

6. 输出倒逼输入
   $ /research-assistant
   "基于我的笔记,写一篇教程"
   → 以教促学,深化理解

7. 周度复盘
   $ /weekly-synthesis
   发现本周的学习模式和知识图谱变化
```

### 场景 4: 研究项目管理

**工作流**:

```
1. 文献收集
   使用 Firecrawl 批量保存论文
   使用 Gemini Vision 提取 PDF 内容
   保存到 03_Resources/Papers/

2. 文献阅读笔记
   为每篇论文创建笔记
   使用双向链接关联相关论文

3. 研究问题探索
   $ /thinking-partner
   "基于这些文献,我的研究切入点应该是什么?"
   → AI 分析文献,提出问题

4. 实验设计
   创建项目: 01_Projects/Experiment-A/
   记录假设、方法、结果

5. 数据分析
   在 VSCode 中编写分析脚本(Python/R)
   结果可视化嵌入笔记

6. 论文撰写
   $ /research-assistant
   "帮我组织论文结构"

   $ /draft-content
   生成各部分初稿

   手动精修并添加分析

7. 版本管理
   Git 追踪论文的每个版本
   标记重要里程碑(submitted, revised, published)
```

---

## 总结

### 核心优势

1. **本地优先**: 完全控制数据,无厂商锁定
2. **AI 增强思考**: 不只是自动化,更是智能协作
3. **专业代码支持**: VSCode 强大的编辑能力
4. **灵活扩展**: 自定义命令 + VSCode 扩展生态
5. **版本控制**: Git 原生集成,追踪知识演变
6. **跨平台**: Windows/Mac/Linux + 远程访问

### 与 Obsidian 版本的差异

**选择 VSCode 版本的场景**:
- 需要编写大量代码(技术文档、教程)
- 已熟悉 VSCode 生态
- 需要任务自动化(Tasks, Scripts)
- 团队协作(Git 工作流)
- 希望统一开发和写作环境

**选择 Obsidian 版本的场景**:
- 纯文字写作
- 需要可视化图谱
- 移动端体验重要(Obsidian Mobile)
- 喜欢插件生态

### 下一步行动

1. **立即开始**: 克隆模板仓库,运行 `/init-workspace`
2. **熟悉命令**: 尝试每个核心命令,找到适合自己的工作流
3. **定制配置**: 编辑 `CLAUDE.md`,让 AI 了解你的偏好
4. **建立习惯**: 每天使用 `/daily-review`,每周使用 `/weekly-synthesis`
5. **持续迭代**: 创建自定义命令,优化个人工作流

---

**项目地址**: (待创建)
**文档**: (待完善)
**社区**: (待建立)

**许可证**: MIT
**贡献**: 欢迎 PR,但请仔细审阅 AI 生成的内容

---

*本文档由 Claude + Human 协作完成,实践了"思考模式 → 写作模式 → 去 AI 化"的工作流。*
