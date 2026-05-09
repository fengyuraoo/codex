# Next Tasks for v0.7

## v0.7.2 / v0.8 Link Capture next steps

### P0

- Test Link Capture with real user-provided links from portfolio references.
- Add clearer duplicate handling for repeated captured URLs.
- Add a link-only source filter in Search.
- Show captured link count in Search Hub status cards.
- Add a safer editable title field for captured links.
- Improve user-note prompts so link cards are more useful for Ask DesignMate.
- Add API-level tests for `/api/link-capture` with a local HTTP handler.
- Verify Portfolio Export external references with multiple real projects.

### P1

- Add optional readability extraction for public webpage articles.
- Add Open Graph image preview display for link cards.
- Add per-platform help text for xiaohongshu, douyin, bilibili, pinterest and behance.
- Add link collections for Moodboard / Research / Inspiration.
- Add manual screenshot attachment for links where metadata is unavailable.
- Add link recapture / refresh metadata command.

### P2

- Plan v0.8 real vision model integration.
- Explore user-authorized subtitle or transcript extraction where legally available.
- Add stronger citation formatting for portfolio exports.
- Add browser bookmarklet or simple paste helper later, without platform bypass.

## v0.8 priorities after v0.7 Search Hub

### P0

- Verify the Search Hub UI with real user materials, not only demo materials.
- Improve Design Evidence Card ranking with better field weighting.
- Add a clearer empty state when `User inbox` has no real materials.
- Test the Search Hub layout on small screens and presentation screenshots.
- Tighten Ask DesignMate answers so they cite fewer but stronger materials.
- Add API-backed Text Search results to match the frontend local search presentation.
- Add visual regression screenshots for Search Hub, Evidence Cards, Ask and Reports.
- Fix any remaining mojibake in older Chinese documentation that predates v0.7.

### P1

- Integrate real image understanding for Image Search in v0.8.
- Add optional OpenAI / DeepSeek / Ollama calls behind the current fallback interface.
- Add vector search or hybrid semantic ranking for design evidence retrieval.
- Add richer PDF/DOCX/PPTX parsing with dependency detection.
- Add project-level portfolio storyline generation across multiple pages.
- Improve portfolio export visual templates for two-page and A3 layouts.
- Add saved searches and reusable portfolio page themes.
- Add evidence confirmation workflow for user-only materials.

### P2

- Explore Electron or another desktop packaging path.
- Add a guided onboarding sample project that can be hidden from real work.
- Add user testing checklist for design students.
- Prepare a short demo video script and shot list from `docs/demo_script_v07.md`.
- Add export to static HTML case pages for selected projects.

## P0

- 用真实阅读器项目资料跑完整导入、搜索、Ask 和草稿生成流程。
- 用真实图信中心资料跑空间调研、动线、功能分区关键词测试。
- 清理或隔离测试图片样本，避免混入真实 user inbox 统计。
- 优化 Ask DesignMate 的回答准确性，减少模板化表达。
- 让 Ask 更明确引用资料路径、source_mode 和作品集阶段。
- 增加 Ask 的“不确定/资料不足”更强提示。
- 修复 UI 中 Source 筛选与 quick filter 的组合边界。
- 增加 scan batch 历史列表 UI。
- 增加新增/更新/重复资料的独立列表。
- 增加真实 HTTP API 集成测试。
- 增加前端保存失败重试和恢复提示。
- 优化 Showcase Mode 的截图布局。

## P1

- 接入真实 OpenAI API provider。
- 接入真实 DeepSeek API provider。
- 接入 Ollama 本地模型 provider。
- 增加 AI provider timeout、重试和错误日志。
- 增加图片理解：自动生成 image_note。
- 增加图片缩略图压缩和缓存清理。
- 增加 PDF 深度解析和页码来源记录。
- 增加 DOCX 段落结构解析。
- 增加 PPTX slide 文本和备注解析。
- 增加向量搜索或本地 embedding fallback。
- 增加关键词 + FTS + 向量 + 人工评分的混合排序。
- 增加项目级报告生成。
- 增加项目级作品集草稿批量生成。

## P2

- 探索 Electron 桌面打包。
- 增加 Windows 一键后台启动 API + 前端。
- 优化 `portfolio_export/designmate_case.html` 的视觉版式。
- 增加作品集最终展示页 HTML 导出。
- 增加 Demo 录屏脚本和分镜。
- 增加真实用户测试记录模板。
- 增加隐私说明页面。
- 增加用户自定义分类词典。
- 增加 tags 管理页面。
- 增加编辑历史可视化。
- 增加导出当前搜索结果为 Markdown。
- 增加发布前检查清单。
- 增加安装说明和常见问题。
