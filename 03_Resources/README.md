# 📚 Resources - 资源

资源是你感兴趣的主题和参考资料的知识库。

## 什么是资源？

资源的特征:
- ✅ 参考性质，而非行动导向
- ✅ 可以反复查阅
- ✅ 按主题组织
- ✅ 持续积累

## 与项目/领域的区别

| 资源 | 项目 | 领域 |
|------|------|------|
| 参考材料 | 行动导向 | 责任维护 |
| 按需查阅 | 有截止日期 | 持续进行 |
| 被动积累 | 主动推进 | 定期回顾 |

## 子目录

```
03_Resources/
├── Articles/       # 保存的文章和博客
├── Books/          # 读书笔记和摘要
├── Courses/        # 课程笔记和资料
└── Research/       # 研究资料和论文
```

根据需要可以添加更多分类:
- `Code-Snippets/` - 代码片段集合
- `Checklists/` - 各种检查清单
- `Templates/` - 可复用的模板
- `Quotes/` - 引用和摘录

## 使用建议

### 保存文章

使用 `/research-assistant` 命令或网页保存工具:
```bash
# 如果配置了 Firecrawl
npm run web:save -- "URL" "03_Resources/Articles"
```

### 读书笔记

为每本书创建一个文件:
```
03_Resources/Books/
└── book-title-author.md
```

包含:
- 书籍信息
- 核心观点
- 重要引用
- 个人思考
- 行动项

### 课程笔记

按课程组织:
```
03_Resources/Courses/
└── Course-Name/
    ├── README.md       # 课程概述
    ├── lesson-01.md    # 课程笔记
    ├── lesson-02.md
    └── project.md      # 课程项目
```

## 连接资源

资源应该通过双向链接连接到:
- 相关项目 (`01_Projects/`)
- 相关领域 (`02_Areas/`)
- 相关上下文笔记中的洞察区块

例如:
```markdown
这篇关于 React Hooks 的文章与 [[React-Hooks-Tutorial]] 项目相关。
```

## 定期维护

建议定期:
1. 回顾和整理资源
2. 删除过时或不再相关的内容
3. 将有价值的资源提炼为洞察
4. 移动长期不用的资源到归档
