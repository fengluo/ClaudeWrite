# Claude Write

> AI 驱动的内容创作与知识管理系统，基于 VSCode + Claude Code，采用 PARA 方法组织内容

## 特性

- **双模式工作流**: 思考模式（探索想法）+ 写作模式（产出内容）
- **结构化知识管理**: PARA 方法（Projects, Areas, Resources, Archive）
- **智能 AI 助手**: 5+ 个预配置的 Claude 命令
- **本地优先**: 完全控制数据，基于 Markdown 和 Git
- **自动化工具**: 附件整理、统计分析、智能同步
- **VSCode 深度集成**: 任务、代码片段、扩展推荐

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- VSCode (推荐最新版本)
- Claude Code CLI (推荐)
- Git (可选，但推荐用于版本控制)

### 安装

1. **克隆或下载此仓库**
   ```bash
   git clone [your-repo-url]
   cd claude-write
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **初始化工作区（可选）**
   如果你想使用交互式向导配置工作区:
   ```bash
   npm run init
   ```

4. **在 VSCode 中打开**
   ```bash
   code .
   ```

5. **安装推荐扩展**
   VSCode 会提示安装推荐扩展，点击"安装"即可

### 第一次使用

1. **快速捕获想法**
   ```bash
   # 在 VSCode 终端运行 Claude Code
   claude

   # 然后输入
   /quick-capture
   ```

2. **查看可用命令**
   - `/thinking-partner` - 思考模式，探索想法
   - `/quick-capture` - 快速捕获想法到收件箱
   - `/inbox-processor` - 整理收件箱
   - `/research-assistant` - 深入研究主题
   - `/daily-review` - 每日回顾

3. **运行统计**
   ```bash
   npm run stats:overview
   ```

## 文件夹结构

```
claude-write/
├── 00_Inbox/              # 快速捕获区 - 新想法和待处理内容
├── 01_Projects/           # 项目 - 有明确目标和截止日期的工作
├── 02_Areas/              # 领域 - 持续性责任区域
├── 03_Resources/          # 资源 - 参考资料和知识库
├── 04_Archive/            # 归档 - 已完成或不活跃的内容
├── 05_Attachments/        # 附件 - 图片、文档、视频等
├── 06_Meta/               # 元数据 - 模板、回顾、洞察、文档
│   ├── Templates/         # 笔记模板
│   ├── Reviews/           # 每日/每周回顾
│   ├── Insights/          # 思考洞察记录
│   └── Docs/              # 系统文档
├── .claude/               # Claude Code 配置
│   └── commands/          # 自定义命令
├── .vscode/               # VSCode 配置
│   ├── settings.json      # 工作区设置
│   ├── extensions.json    # 推荐扩展
│   ├── tasks.json         # 任务定义
│   └── snippets/          # 代码片段
└── scripts/               # 自动化脚本
    ├── setup/             # 初始化
    │   └── init-workspace.js
    ├── file-management/   # 文件管理
    │   ├── organize-attachments.js
    │   ├── find-orphans.js
    │   └── compress-images.js
    ├── stats/             # 统计分析
    │   ├── workspace-stats.js
    │   ├── word-count.js
    │   └── activity-tracker.js
    ├── git/               # Git 自动化
    │   ├── smart-commit.js
    │   └── auto-sync.js
    ├── web/               # 网页保存
    │   ├── save-article.js
    │   └── batch-save.js
    └── utils/             # 工具函数
        ├── file-helpers.js
        └── markdown-parser.js
```

## 核心概念

### PARA 方法

- **Projects (项目)**: 有明确截止日期和可交付成果的短期工作
- **Areas (领域)**: 需要持续维护的责任区域
- **Resources (资源)**: 感兴趣的主题和参考资料
- **Archive (归档)**: 不再活跃的项目和资源

### 双模式工作流

**思考模式** (`/thinking-partner`)
- AI 通过提问引导你探索想法
- 搜索并连接工作区中的相关内容
- 记录思考过程和洞察
- 强调理解而非立即产出

**写作模式** (`/research-assistant` → 创作)
- 基于研究生成结构化大纲
- 整合内外部资料
- 产出可交付的内容

## Claude 命令说明

### `/thinking-partner` - 思考伙伴
AI 作为思考伙伴，通过提问帮你澄清和深化想法。不会直接给答案，而是引导你自己发现。

**使用场景**:
- 开始新项目前的头脑风暴
- 遇到困惑需要理清思路
- 探索复杂主题的多个角度

### `/quick-capture` - 快速捕获
零摩擦捕获想法到收件箱，自动添加元数据和标签。

**使用场景**:
- 突然有灵感需要快速记录
- 阅读时遇到值得保存的内容
- 待办事项和问题记录

### `/inbox-processor` - 收件箱处理
智能分析收件箱内容，提供整理建议，帮助你定期清空收件箱。

**使用场景**:
- 每天/每周定期整理
- 收件箱积累过多内容
- 需要将想法转化为行动

### `/research-assistant` - 研究助手
深入研究主题，搜索内部笔记和外部资料，生成结构化大纲。

**使用场景**:
- 写作前的资料收集
- 学习新主题
- 准备演讲或教程

### `/daily-review` - 每日回顾
自动统计当天活动，引导反思，记录进展和洞察。

**使用场景**:
- 每天结束时回顾
- 追踪工作进展
- 发现思考模式

## 可用脚本

```bash
# 初始化工作区 (交互式向导)
npm run init

# 查看帮助
npm run help
```

### 文件管理

```bash
npm run file:organize    # 整理附件 (按类型分类到子目录)
npm run file:orphans     # 查找未被引用的孤儿附件
npm run file:compress    # 压缩大图片 (支持 --dry-run 预览)
```

### 统计分析

```bash
npm run stats            # 完整工作区统计报告
npm run stats:overview   # 快速概览
npm run stats:words      # 按项目/标签/文件夹统计字数
npm run stats:activity   # 30天活跃度分析 (热力图、时段分布)
```

### Git 自动化

```bash
npm run git:smart-commit # 智能提交 (分析变更自动生成提交信息)
npm run git:sync         # 自动同步 (检测差异，自动拉取/推送)
```

### 网页保存

```bash
npm run web:save -- "https://example.com/article"  # 保存单个网页
npm run web:batch -- urls.txt                       # 批量保存 URL 列表
```

## VSCode 功能

### 任务 (Tasks)

在 VSCode 中按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows)，输入 `Tasks: Run Task`:

- **Organize Attachments** - 整理附件
- **Workspace Stats** - 生成统计
- **Initialize Workspace** - 运行初始化向导

### Markdown 代码片段

在 Markdown 文件中输入以下前缀并按 `Tab`:

- `project` - 创建项目笔记
- `meeting` - 创建会议笔记
- `article` - 创建文章草稿
- `daily` - 创建每日回顾

### 推荐扩展

项目已配置推荐扩展列表，VSCode 会自动提示安装:

- **Markdown All in One** - Markdown 编辑增强
- **Markdown Preview Enhanced** - 预览增强
- **GitLens** - Git 可视化
- **Foam** - 双向链接和图谱
- **Todo Tree** - 任务管理
- **Prettier** - 代码格式化
- **Code Spell Checker** - 拼写检查

## 使用示例

### 场景 1: 写一篇技术博客

```bash
1. 快速捕获想法
   claude
   /quick-capture
   输入: "写一篇关于 React Hooks 最佳实践的文章"

2. 思考模式探索
   /thinking-partner
   AI 会搜索相关笔记并提问引导你思考

3. 深度研究
   /research-assistant
   生成结构化大纲和参考资料

4. 创建项目
   在 01_Projects/ 下创建 React-Hooks-Article/

5. 撰写内容
   使用 VSCode 编辑，结合代码示例

6. 每日回顾
   /daily-review
   记录今天的进展
```

### 场景 2: 整理笔记

```bash
1. 整理收件箱
   /inbox-processor
   将想法移动到正确位置

2. 整理附件
   npm run file:organize
   清理未使用的文件

3. 查看统计
   npm run stats:overview
   了解工作区现状
```

## 工作流建议

### 每日工作流
1. **早上**: 查看 00_Inbox/，使用 `/inbox-processor` 整理
2. **工作中**: 使用 `/quick-capture` 随时记录想法
3. **晚上**: 运行 `/daily-review` 回顾当天

### 每周工作流
1. 回顾活跃项目进展
2. 整理收件箱确保清空
3. 运行 `npm run stats` 查看统计
4. 归档已完成的项目

### 最佳实践
- **捕获一切**: 不要担心想法不完整，先记录下来
- **定期整理**: 收件箱不应该成为永久存储
- **思考优先**: 使用 `/thinking-partner` 而非直接让 AI 写内容
- **建立连接**: 利用双向链接 `[[笔记名]]` 建立知识网络
- **定期回顾**: 每日/每周回顾帮助发现模式

## 定制化

### 创建自定义 Claude 命令

在 `.claude/commands/` 下创建新的 Markdown 文件:

```markdown
# My Custom Command

你是一个 [角色描述]。

## 工作流程
1. [步骤1]
2. [步骤2]

## 行为准则
- ✓ 应该做的
- ✗ 不应该做的
```

### 修改配置

- **VSCode 设置**: 编辑 `.vscode/settings.json`
- **任务**: 编辑 `.vscode/tasks.json`
- **代码片段**: 编辑 `.vscode/snippets/markdown.json`

## 命令速查表

### Claude 命令

| 命令 | 用途 |
|------|------|
| `/thinking-partner` | 思考伙伴 - 探索想法，深化理解 |
| `/quick-capture` | 快速捕获 - 零摩擦记录想法 |
| `/inbox-processor` | 收件箱处理 - 智能整理笔记 |
| `/research-assistant` | 研究助手 - 深度研究主题 |
| `/daily-review` | 每日回顾 - 统计与反思 |

### npm 脚本

| 命令 | 用途 |
|------|------|
| `npm run help` | 显示所有可用命令 |
| `npm run init` | 初始化工作区 |
| `npm run file:organize` | 整理附件 |
| `npm run file:orphans` | 查找孤儿附件 |
| `npm run file:compress` | 压缩图片 |
| `npm run stats` | 完整统计报告 |
| `npm run stats:words` | 字数统计 |
| `npm run stats:activity` | 活跃度分析 |
| `npm run git:smart-commit` | 智能提交 |
| `npm run git:sync` | 自动同步 |
| `npm run web:save` | 保存网页 |
| `npm run web:batch` | 批量保存网页 |

## 文档

详细文档位于 `06_Meta/Docs/`:

- **getting-started.md** - 详细入门指南
- **commands-reference.md** - 命令完整参考
- **customization-guide.md** - 定制化指南

## Git 工作流 (可选)

### 初始化 Git

```bash
git init
git add .
git commit -m "Initial commit: Claude Write workspace setup"
```

### 推送到 GitHub

```bash
git remote add origin [your-repo-url]
git push -u origin main
```

### 使用智能提交 (推荐)

使用内置的智能提交工具，自动分析变更并生成提交信息：

```bash
# 交互模式 - 显示变更摘要，建议提交信息
npm run git:smart-commit

# 自动模式 - 直接使用建议的提交信息
npm run git:smart-commit -- --auto
```

### 自动同步

检测本地与远程的差异，自动拉取或推送：

```bash
# 自动同步
npm run git:sync

# 使用 rebase 方式合并远程更新
npm run git:sync -- --rebase
```

### 手动提交 (备选)

```bash
# 每天结束时提交
git add .
git commit -m "Daily: [简短描述今天的工作]"
git push

# 完成项目时
git commit -m "Complete: [项目名称]"
```

## 故障排查

### npm install 失败
- 确保 Node.js 版本 >= 18.0.0
- 删除 `node_modules/` 和 `package-lock.json` 后重试
- 检查网络连接

### Claude 命令无法识别
- 确保文件位于 `.claude/commands/` 目录
- 检查文件扩展名为 `.md`
- 重启 Claude Code

### VSCode 扩展未提示安装
- 手动打开扩展面板 (`Cmd+Shift+X`)
- 搜索 `@recommended`
- 逐个安装推荐扩展

## 贡献

欢迎贡献新的命令、脚本、模板或文档改进！

## 许可证

MIT License

---

**开始你的知识管理之旅**: 运行 `npm run init` 或直接使用 `/quick-capture` 捕获第一个想法！

---

*Claude Write - 让 AI 成为你的思考伙伴，而不仅仅是打字机。*
