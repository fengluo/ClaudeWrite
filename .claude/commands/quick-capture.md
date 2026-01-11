# Quick Capture - 快速捕获

快速、零摩擦地捕获想法、灵感或待办事项到收件箱。

## 核心原则

**零摩擦捕获** - 不要让格式、分类或完善阻碍记录。先捕获，后整理。

## 工作流程

### 1. 获取内容

简洁地询问用户：
```
请告诉我你想捕获什么？(可以是不完整的想法、待办事项或问题)
```

**接受任何形式**：
- 完整的句子或片段
- 一个词或几个关键词
- 问题或困惑
- 链接或引用

### 2. 自动分类

根据内容自动判断类型并建议标签：

**类型判断**：
- `idea` - 创意、想法、灵感
  - 关键词：想法、可以、如果、尝试
- `todo` - 待办事项、行动项
  - 关键词：需要、要做、任务
- `note` - 一般笔记、记录
  - 关键词：记录、笔记
- `question` - 问题、困惑
  - 关键词：为什么、怎么、如何、疑问
- `reference` - 参考资料、链接
  - 包含 URL 或明确是外部资料

**标签建议**：
- 从内容中提取关键概念
- 使用小写加连字符格式（如：`#react-hooks`）
- 建议 2-3 个标签

### 3. 创建文件

使用 Write 工具创建文件：

**文件命名**：`00_Inbox/YYYY-MM-DD-brief-title.md`

- 日期前缀确保排序
- 标题简短描述（3-6个词）
- 使用连字符分隔，小写

**文件内容模板**：
```markdown
---
created: YYYY-MM-DD HH:mm
type: [idea/todo/note/question/reference]
tags: [建议的标签]
status: unprocessed
---

# [从用户输入提取的标题]

[用户的原始输入]
```

### 4. 确认和后续

创建成功后显示：
```
✓ 已保存到 00_Inbox/YYYY-MM-DD-brief-title.md
  类型: [type]
  标签: #tag1 #tag2

是否现在就展开这个想法？
[Y] 使用 /thinking-partner 深入探索
[N] 稍后处理
[P] 直接移动到特定项目
```

根据用户选择：
- `Y`: 说明 "现在可以运行 `/thinking-partner` 继续探索这个想法"
- `N`: 说明 "已保存，使用 `/inbox-processor` 可以稍后整理"
- `P`: 询问目标项目并移动文件

## 行为准则

### 必须做 ✓

- ✓ **快速响应** - 整个流程应该在几秒内完成
- ✓ **接受不完整输入** - 不要要求用户组织或完善想法
- ✓ **智能提取标题** - 从内容中提取最能概括的词作为标题
- ✓ **保留原始内容** - 不要修改用户的输入
- ✓ **自动添加元数据** - 时间戳、类型、标签都自动完成

### 禁止做 ✗

- ✗ **不要要求更多信息** - 除非内容完全为空
- ✗ **不要组织或改写** - 保持原汁原味
- ✗ **不要立即展开** - 除非用户明确要求
- ✗ **不要创建复杂结构** - 一个简单的 Markdown 文件即可

## 使用示例

### 示例 1：捕获想法

```
User: /quick-capture
写一篇关于 React Hooks 最佳实践的深度文章，结合实际项目经验

AI: ✓ 已保存到 00_Inbox/2024-01-10-react-hooks-best-practices-article.md
    类型: idea
    标签: #article #react #hooks #best-practices

是否现在就展开这个想法？
[Y] 使用 /thinking-partner 深入探索
[N] 稍后处理
[P] 直接移动到特定项目

User: Y

AI: 好的！现在可以运行 `/thinking-partner` 来深入探索这个写作想法。

我会帮你：
- 搜索工作区中关于 React Hooks 的已有笔记
- 通过提问帮你澄清文章的角度和结构
- 识别需要研究的主题
```

### 示例 2：捕获待办

```
User: /quick-capture
需要修复登录页面的表单验证bug，用户反馈无法正常提交

AI: ✓ 已保存到 00_Inbox/2024-01-10-fix-login-form-validation.md
    类型: todo
    标签: #bug #login #validation

是否现在就展开这个想法？
[Y] 使用 /thinking-partner 深入探索
[N] 稍后处理
[P] 直接移动到特定项目

User: P

AI: 请选择目标项目：
[1] 01_Projects/Website-Bugfix/
[2] 01_Projects/Frontend-Improvements/
[3] 其他（请输入项目路径）

User: 1

AI: ✓ 已移动到 01_Projects/Website-Bugfix/fix-login-form-validation.md

建议下一步：
- 在项目笔记中记录调试过程
- 完成后更新项目任务列表
```

### 示例 3：捕获问题

```
User: /quick-capture
为什么 useEffect 的依赖数组为空时只执行一次？和 componentDidMount 有什么区别？

AI: ✓ 已保存到 00_Inbox/2024-01-10-useeffect-dependency-array-question.md
    类型: question
    标签: #react #hooks #useeffect #question

是否现在就展开这个想法？
[Y] 使用 /thinking-partner 深入探索
[N] 稍后处理
[P] 直接移动到特定项目

User: Y

AI: 好的！运行 `/thinking-partner` 可以帮你：
- 搜索工作区中关于 React Hooks 的笔记
- 通过对话帮你理解这个概念
- 记录你的理解过程

（现在可以运行 `/thinking-partner` 继续）
```

### 示例 4：捕获极简输入

```
User: /quick-capture
API 设计原则

AI: ✓ 已保存到 00_Inbox/2024-01-10-api-design-principles.md
    类型: note
    标签: #api #design #principles

是否现在就展开这个想法？
[Y] 使用 /thinking-partner 深入探索
[N] 稍后处理
[P] 直接移动到特定项目

User: N

AI: ✓ 已保存！使用 `/inbox-processor` 可以稍后整理收件箱。
```

## 文件内容示例

### 想法类型
```markdown
---
created: 2024-01-10 14:30
type: idea
tags: [article, react, hooks]
status: unprocessed
---

# React Hooks 最佳实践文章

写一篇关于 React Hooks 最佳实践的深度文章，结合实际项目经验。
```

### 待办类型
```markdown
---
created: 2024-01-10 15:20
type: todo
tags: [bug, login, validation]
status: unprocessed
---

# 修复登录表单验证

需要修复登录页面的表单验证bug，用户反馈无法正常提交。
```

### 问题类型
```markdown
---
created: 2024-01-10 16:10
type: question
tags: [react, hooks, useeffect]
status: unprocessed
---

# useEffect 依赖数组问题

为什么 useEffect 的依赖数组为空时只执行一次？和 componentDidMount 有什么区别？
```

## 高级功能（可选）

### 快速标记优先级

如果用户输入包含优先级关键词，自动添加：
- "紧急"、"重要" → `priority: high`
- "稍后"、"可以等" → `priority: low`

### 识别关联

如果内容提到已有的项目或笔记：
```
我注意到这可能与 [[React-Hooks-Tutorial]] 项目相关。
是否要关联？[Y/n]
```

### 批量捕获

支持一次捕获多个想法：
```
User: 多个想法...

AI: 检测到多个想法，为你分别创建：
1. ✓ idea-1.md
2. ✓ idea-2.md
3. ✓ idea-3.md
```

## 记住

快速捕获的价值在于**降低记录的心理门槛**。

用户应该能够：
- 在几秒内完成捕获
- 不用担心格式和组织
- 随时随地记录灵感
- 相信稍后可以整理

**最好的捕获工具是用户感觉不到阻力的工具。**
