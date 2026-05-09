# DesignMate v0.7 Demo Script

## 60 秒中文演示脚本

大家好，这是 DesignMate v0.7，一个面向设计学生和设计师的本地 AI 设计资料搜索与作品集叙事工具。

设计项目里常常会有草图、调研记录、灵感图、老师反馈、PPT 和作品集草稿，但这些资料分散在不同文件夹里，很难快速变成清晰的作品集故事。

在 DesignMate 首页，我可以直接搜索“用户痛点”或“图信中心动线”。结果不是普通文件列表，而是 Design Evidence Card：它会显示资料来源、项目、设计阶段、资料类型、匹配度，以及它适合放在作品集的哪个位置。

如果我想看自己的真实资料，可以切换 Source 到 User inbox。也可以进入 Ask DesignMate，询问“哪些资料能证明用户痛点？”当前版本会用本地规则版 fallback，根据资料库给出摘要、相关资料、设计判断、作品集位置、待确认问题和下一步建议。

最后，我可以生成作品集页面草稿，或者导出 DesignMate 自身的作品集案例素材。v0.7 的重点不是替代设计判断，而是帮助我从本地资料中快速找证据、理结构、推进作品集叙事。

## 90 秒中文演示脚本

DesignMate v0.7 的定位是：DesignMate Search Hub，一个面向设计作品集资料的本地 AI 搜索中心。

设计学生在做作品集时，不是缺文件，而是缺少把文件变成证据和叙事的系统。一个项目可能同时有访谈记录、竞品分析、草图、灵感图、老师反馈、汇报 PPT 和最终页面草稿。传统文件夹只能帮我存放这些资料，却不能告诉我“哪一条资料能证明用户痛点”“哪一条适合放到调研页”“这个项目还缺什么证据”。

打开 DesignMate，首页首先是一个中心搜索框。我可以搜索“低干扰阅读”“用户痛点”“图信中心”或“老师反馈”。结果会以 Design Evidence Card 显示，每张卡片包含 source mode、项目、设计阶段、资料类型、confidence 和 Portfolio placement。这样我看到的不只是文件，而是这条资料在作品集里的用途。

Text Search 适合检索关键词、项目名、设计阶段和作品集主题。Image Search 当前是展示壳，支持上传区和图片元信息检索，真实视觉模型计划放到 v0.8。Ask DesignMate 则更像作品集助手：它会先检索本地资料，再用规则版 fallback 输出 Summary、Relevant materials、Design insight、Portfolio placement、Things to confirm 和 Next action。

对真实使用来说，DesignMate 也区分 Demo data、User inbox 和 Imported library。这样用户不会把示例资料误认为自己的项目结论。完成整理后，还可以生成作品集页面草稿，或导出 DesignMate 这个产品本身的作品集案例素材。

这个版本的价值是：让本地资料从“散乱文件”变成“可搜索、可解释、可编辑、可导出的设计证据库”。

## 推荐录屏路线

1. 打开 Search Hub 首页，展示中心搜索框、三个入口和 Local-first 标签。
2. 搜索“用户痛点”，展示 Design Evidence Cards。
3. 切换 Source 到 User inbox，说明示例数据和真实数据分离。
4. 点击一张卡片，展示 Evidence Inspector 和可编辑字段。
5. 进入 Image Search，展示上传区和当前版本限制说明。
6. 进入 Ask DesignMate，提问“哪些资料能证明用户痛点？”。
7. 进入 Reports，展示报告、待确认问题、下一步任务和草稿入口。
8. 展示 `portfolio_export/designmate_case.html` 或导出的 Markdown 素材。

## v0.7.1 Link Capture 20 秒演示片段

切到 Link Capture 页面，粘贴一个短视频或网页灵感链接，比如 B站案例、Behance 项目或 Pinterest 参考。填写项目、设计阶段和一句 user note，然后点击 Capture Link。DesignMate 会把这个外部链接转成一张可搜索的 Design Evidence Card，记录平台、原始链接、资料类型、作品集位置和用户备注。对于短视频平台，如果自动提取受限，DesignMate 不会下载视频或绕过限制，而是保存链接和你的说明，让它仍然能进入 Search 和 Ask DesignMate 的作品集证据链。

## v0.7.2 中文 60 秒演示脚本

这是 DesignMate v0.7.2，一个面向设计学生和设计师的本地 AI 作品集资料搜索助手。现在它支持中文和英文切换。日常整理时，我可以使用中文界面，搜索草图、调研笔记、反馈截图和外部灵感链接，把它们变成 Design Evidence Card。比如我粘贴一个 B站或 Behance 链接，填写“我的备注”和“作品集位置”，DesignMate 会把它保存为可搜索的设计证据。然后我可以问 DesignMate：“哪些资料适合放 moodboard？”它会根据本地资料返回摘要、相关资料、设计洞察、作品集位置、需要确认和下一步建议。切换到英文后，界面更适合截图、录屏和作品集展示。

## v0.7.2 English 60-second demo script

This is DesignMate v0.7.2, a local AI search hub for design portfolio materials. It now supports a bilingual workflow. In Chinese, design students can organize real project notes, feedback, sketches and inspiration links in a familiar working language. In English, the same product becomes cleaner for portfolio screenshots and demo recordings. I can search local materials as Design Evidence Cards, capture an external inspiration link, add a user note and portfolio placement, then ask DesignMate which references support a moodboard or research page. The current assistant uses a rule-based fallback, so it remains usable without an API key while keeping all materials local-first.

## v0.7.2 中文录屏路径

1. 切换到“中”。
2. 展示搜索中心首页。
3. 搜索“用户痛点”。
4. 打开一张 Design Evidence Card。
5. 进入“链接采集”，保存一个网页或短视频参考。
6. 进入“问 DesignMate”，用中文提问。
7. 展示报告和作品集草稿入口。

## v0.7.2 English recording route

1. Switch to `EN`.
2. Show the Search Hub hero screen.
3. Search for a design topic.
4. Open a Design Evidence Card.
5. Capture an inspiration link.
6. Ask DesignMate an English portfolio question.
7. Show Reports and Export.

## v0.7.2 推荐截图

- 中文首页。
- 英文首页。
- 中文 Link Capture。
- 英文 Ask DesignMate。
- 中英两种 Design Evidence Card。
- 静态模式提示。

## v0.7.2 Add Materials 演示路径

新的推荐演示路线是：

1. 添加资料：打开 Add Materials / 添加资料，展示 Upload Files、Capture Link、Paste Note 和 Import Folder 四个入口。
2. 搜索资料：回到 Search Hub 或 Text Search，搜索刚加入的笔记、链接或本地文件。
3. 问 DesignMate：进入 Ask DesignMate，询问“哪些资料能证明用户痛点？”或 “Which materials support the research page?”
4. 链接采集：粘贴一个网页、B站、Behance 或 Pinterest 灵感链接，说明短视频平台不会下载视频，只保存链接和用户备注。
5. 导出作品集叙事：进入 Reports / Drafts / Export，展示作品集草稿和 DesignMate 案例导出路径。

这条路线更符合真实设计学生工作流：先收集资料，再搜索证据，再让 DesignMate 辅助整理叙事，最后导出作品集素材。

## 推荐截图清单

- Search Hub 首页全屏。
- Text Search + Design Evidence Cards。
- Source 筛选只看 User inbox。
- Evidence Inspector 编辑区。
- Image Search 上传区。
- Ask DesignMate 结构化回答。
- Reports / Drafts / Export 页面。
- `portfolio_export/designmate_case.html` 页面。

## 作品集页面讲解逻辑

### 第 1 屏：问题

说明设计学生资料多、分散、难转化为作品集叙事。

### 第 2 屏：产品定位

展示 DesignMate 是本地优先的设计资料 Search Hub，而不是通用文件搜索。

### 第 3 屏：核心流程

Collect -> Search -> Ask -> Organize -> Export。

### 第 4 屏：界面与交互

展示 Search Hub、Design Evidence Card、Evidence Inspector 和 Ask DesignMate。

### 第 5 屏：原型验证

展示本地 SQLite、示例资料、真实资料筛选、测试和 quality gate。

### 第 6 屏：下一步

说明真实 AI API、视觉理解、向量搜索、桌面打包和真实用户测试仍在 v0.7 之后推进。
