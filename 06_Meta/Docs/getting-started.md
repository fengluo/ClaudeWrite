# 入门指南

欢迎使用 Claude Write！本指南将帮助你快速上手。

## 第一步：环境准备

### 必需工具

1. **VSCode** - 代码编辑器
   - 下载: https://code.visualstudio.com/

2. **Node.js** (>= 18.0.0) - 运行脚本
   - 下载: https://nodejs.org/
   - 验证: `node --version`

3. **Claude Code CLI** (推荐) - AI 助手
   - 安装: 参考 Claude Code 官方文档
   - 验证: `claude --version`

### 可选工具

- **Git** - 版本控制
- **GitHub CLI** (gh) - GitHub 集成

## 第二步：安装扩展

VSCode 会自动提示安装推荐扩展。点击"安装"即可。

推荐扩展列表：
- ✅ Markdown All in One - 编辑增强
- ✅ Markdown Preview Enhanced - 预览
- ✅ GitLens - Git 可视化
- ✅ Foam - 双向链接
- ✅ Todo Tree - 任务管理
- ✅ Prettier - 格式化
- ✅ Code Spell Checker - 拼写检查

手动安装：按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows)，搜索扩展名安装。

## 第三步：第一次使用

### 1. 快速捕获想法

这是最常用的功能，用于零摩擦地记录想法。

```bash
# 在 VSCode 终端中运行
claude

# 输入命令
/quick-capture

# 然后输入你的想法
写一篇关于知识管理的文章
```

文件会自动创建在 `00_Inbox/` 并添加元数据。

### 2. 探索想法

使用思考伙伴模式深入探索：

```bash
/thinking-partner
我想探索个人知识管理系统的设计原则
```

AI 会：
- 搜索你工作区中的相关笔记
- 通过提问引导你思考
- 记录思考过程到相关上下文笔记

### 3. 整理收件箱

定期整理捕获的内容：

```bash
/inbox-processor
```

AI 会分析每个文件并建议移动到合适的位置。

### 4. 每日回顾

每天结束时回顾：

```bash
/daily-review
```

自动统计今天的活动并引导反思。

## 核心概念

### PARA 方法

内容按 4 个类别组织：

- **Projects (项目)**: 有截止日期的短期工作
  - 例：写一篇文章、完成一个功能
  - 位置：`01_Projects/`

- **Areas (领域)**: 需要持续维护的责任
  - 例：健康管理、职业发展、写作
  - 位置：`02_Areas/`

- **Resources (资源)**: 参考资料和知识库
  - 例：文章、书籍笔记、课程资料
  - 位置：`03_Resources/`

- **Archive (归档)**: 已完成或不活跃的内容
  - 位置：`04_Archive/`

### 双模式工作流

**思考模式** - 探索和理解
- 使用 `/thinking-partner`
- 多问问题，少给答案
- 建立知识连接
- 记录洞察

**写作模式** - 产出内容
- 使用 `/research-assistant` 研究
- 生成结构化大纲
- 撰写和编辑
- 发布

## 典型工作流

### 场景 1：写一篇技术博客

```
1. 捕获想法
   /quick-capture
   "写一篇关于 React Hooks 的文章"

2. 思考探索
   /thinking-partner
   探索文章角度、目标读者、核心观点

3. 深度研究
   /research-assistant
   搜索相关笔记和外部资料，生成大纲

4. 创建项目
   在 01_Projects/ 下创建 React-Hooks-Article/
   复制模板开始写作

5. 每日推进
   每天写一部分，使用 /daily-review 记录进展

6. 完成后归档
   移动到 04_Archive/
```

### 场景 2：学习新主题

```
1. 创建领域
   在 02_Areas/ 创建主题文件夹
   例：02_Areas/Machine-Learning/

2. 收集资源
   保存文章、笔记到 03_Resources/

3. 定期研究
   使用 /research-assistant 整理知识

4. 实践项目
   在 01_Projects/ 创建练习项目

5. 记录洞察
   使用 /thinking-partner 记录理解
```

## 键盘快捷键

### VSCode 内置

- `Cmd+P` (Mac) / `Ctrl+P` (Win) - 快速打开文件
- `Cmd+Shift+P` - 命令面板
- `Cmd+Shift+F` - 全局搜索
- `Cmd+B` - 切换侧边栏

### Markdown 编辑

- `Cmd+B` - 加粗
- `Cmd+I` - 斜体
- `Cmd+Shift+V` - 预览 Markdown

### 代码片段

在 Markdown 文件中输入前缀并按 `Tab`：
- `project` - 项目笔记模板
- `meeting` - 会议笔记模板
- `article` - 文章草稿模板
- `daily` - 每日回顾模板

## 自动化脚本

```bash
# 查看所有可用命令
npm run help

# 文件管理
npm run file:organize    # 整理附件 (按类型分类)
npm run file:orphans     # 查找未引用的附件
npm run file:compress    # 压缩大图片

# 统计分析
npm run stats            # 完整工作区统计
npm run stats:overview   # 快速概览
npm run stats:words      # 按项目/标签统计字数
npm run stats:activity   # 30天活跃度分析

# Git 自动化
npm run git:smart-commit # 智能提交 (分析变更生成提交信息)
npm run git:sync         # 自动同步 (拉取/推送)

# 网页保存
npm run web:save -- "URL"           # 保存单个网页为 Markdown
npm run web:batch -- urls.txt       # 批量保存 URL 列表
```

详细用法请参考 [[commands-reference]]。

## 最佳实践

### 1. 捕获一切

不要担心想法不完整或不成熟，先记录下来。使用 `/quick-capture` 应该像呼吸一样自然。

### 2. 定期整理

建议频率：
- **每日**: 使用 `/daily-review`
- **每周**: 清空收件箱 (`/inbox-processor`)，进行周度综合 (`/weekly-synthesis`)
- **每月**: 回顾项目进展，归档已完成内容

### 3. 建立连接

使用双向链接 `[[笔记名]]` 连接相关内容。好的知识管理不是分类，而是建立连接。

### 4. 思考优先

抵制立即让 AI 生成内容的冲动。先使用 `/thinking-partner` 澄清想法，再进入写作模式。

### 5. 保持简单

不要过度组织。如果不确定放哪里，先放收件箱，稍后整理。

## 常见问题

### Q: 收件箱应该保持多少内容？

A: 理想情况下应该定期清空。如果超过 10 个项目，建议运行 `/inbox-processor` 整理。

### Q: 项目和领域如何区分？

A: 项目有明确的结束点，领域是持续性的。例如"写一篇文章"是项目，"写作"是领域。

### Q: 是否需要 Git？

A: 不是必需的，但强烈推荐。Git 可以追踪笔记的演变，防止意外丢失。

### Q: 如何备份？

A: 建议使用 Git + GitHub。或者定期复制整个文件夹到云盘。

### Q: VSCode 和 Obsidian 哪个更好？

A: VSCode 更适合需要编写代码的技术写作者。Obsidian 更适合纯文字写作和图谱可视化。

## 下一步

- 阅读 [[commands-reference]] 了解所有命令
- 阅读 [[customization-guide]] 学习定制化
- 开始使用 `/quick-capture` 记录第一个想法！

## 获取帮助

- 查看项目 README
- 访问 06_Meta/Docs/ 查看更多文档
- GitHub Issues 反馈问题

祝你使用愉快！🎉
