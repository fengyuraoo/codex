# Interface Concept

DesignMate v0.6 的界面目标是让设计学生能在一个本地 Web UI 中完成“导入资料、搜索资料、整理分类、询问助手、查看报告、生成草稿、导出案例”的日常工作。

## 顶部导航

- DesignMate v0.6 标识。
- “本地 AI 作品集资料库”定位。
- Dashboard / Search / Ask / Reports 四个主视图。
- 右下角状态显示 API 已连接、静态模式、保存中、保存成功或失败。

## Dashboard

Dashboard 是每日进入后的总览页：

- 导入说明：提示把资料放入 `DesignMate/data/inbox` 并运行扫描。
- inbox/library 文件数。
- 上次扫描时间和报告生成时间。
- 最近扫描批次：新增、更新、重复、失败文件数。
- 总资料数、高价值资料、待确认资料、未分类资料、解析失败。
- 项目分布和类型分布。
- Ask DesignMate 入口。
- Portfolio Draft 入口。
- 高价值资料 Top 5 和最近更新资料。

## Search

Search 是主要资料管理工作区：

- 关键词搜索。
- Project / Type / Stage / Limit / Sort 筛选。
- 快捷筛选：高价值、待确认、Reader Design、Info Center、Feedback、Research、Unknown。
- 资料卡片显示文件名、缩略图或文件占位、项目、类型、阶段、标签、评分、摘要和确认状态。
- checkbox 多选资料。
- 批量编辑工具栏：project、type、stage、tags。

## Detail Inspector

Detail Inspector 用于人工确认资料：

- 文件路径、解析状态、字数、更新时间。
- file hash、图片尺寸、图片预览。
- 分类编辑：project、type、stage、tags、score、notes。
- 图片资料提示：当前未接入图像理解，可在 notes 中手动填写图片说明。
- 作品集用途和需要确认的问题。
- 页面草稿生成命令提示。

## Ask DesignMate

Ask 是 v0.6 新增的 AI Assistant 工作区：

- 输入问题。
- 选择项目范围。
- 提问后先检索本地资料，再生成规则版回答。
- 展示回答、使用资料、后续建议和需要确认的问题。
- 显示当前模式：`rule_based` 或 `rule_based_fallback`。

## Reports

Reports 用于查看整理结果：

- Latest Report：资料报告。
- Need Confirm：待确认问题。
- Next Actions：下一步任务。
- Portfolio Draft：草稿生成命令和最近草稿列表。

## Drafts / Export

Drafts 和 Export 目前通过命令生成：

- `scripts/generate_portfolio_draft.py` 生成页面草稿。
- `scripts/export_portfolio_case.py` 导出 DesignMate 作品集案例包。

后续 v0.7 可以把草稿生成和导出操作直接做成 UI 按钮。
