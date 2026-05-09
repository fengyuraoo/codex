# DesignMate Roadmap

## v0.7.1 Link Capture (completed)

- Add Link Capture for external inspiration links.
- Save links as first-class materials in the existing SQLite `materials` table.
- Detect xiaohongshu, douyin, bilibili, tiktok, youtube, pinterest, behance, dribbble, wechat article and generic webpage links.
- Add `POST /api/link-capture`.
- Add Web UI page for pasted links, project, design stage, user note and portfolio placement.
- Make link materials searchable through Design Evidence Cards.
- Include link materials in Ask DesignMate context and Portfolio Export as External References.
- Add `docs/v0.7.1_link_capture.md`, Link Capture tests and `scripts/quality_gate_v071.py`.

## v0.7 Search Hub (current polish)

- Reposition DesignMate as **DesignMate Search Hub: A Local AI Search Hub for Design Portfolio Materials**.
- Replace the dashboard-first home screen with a search-first home page.
- Add Text Search, Image Search and Ask DesignMate as the three primary product entries.
- Render search results as Design Evidence Cards with inferred source mode, project, design stage, material type, confidence and portfolio placement.
- Keep Image Search honest: current version uses image metadata and filename matching; real vision model integration remains planned for v0.8.
- Add v0.7 product and demo docs: `docs/v0.7_search_hub.md` and `docs/demo_script_v07.md`.
- Add `scripts/quality_gate_v07.py` to verify the v0.7 Search Hub deliverables.

## v0.8 next direction

- Real vision model integration for sketch/reference/screenshot understanding.
- Real AI provider wiring for OpenAI / DeepSeek / Ollama while preserving fallback.
- Vector search and richer design evidence ranking.
- More polished portfolio export pages and desktop packaging research.

## v0.1 文件夹驱动 MVP（已完成）

- 建立项目结构、核心文档和提示词模板。
- 完成本地资料扫描、索引、分类报告和命令行搜索。
- 生成每日整理报告，跑通 `run_designmate.py`。

## v0.2 本地搜索增强（已完成）

- 增强全文搜索、标签/项目/阶段字段和资料评分。
- 增加 `materials_dashboard.md` 和最小静态 Web UI。
- 增加基础测试和搜索基准报告。

## v0.3 本地资料搜索应用原型（已完成）

- 引入 SQLite 数据库、backend 模块、FTS/fallback 搜索。
- 增加本地 API、Dashboard/Search/Reports UI。
- 扩展示例资料集，建立质量门禁。

## v0.4 可编辑本地资料库原型（已完成）

- 增加单个资料编辑闭环和 `PATCH /api/materials/{id}`。
- Web UI 支持编辑 project/type/stage/tags/score/notes 并保存到 SQLite。
- 增强中文搜索、Markdown 报告渲染、启动脚本和 36 项测试。

## v0.5 真实资料管理 Demo（已完成）

- 增加真实资料导入引导和 inbox/library 状态展示。
- 增加批量编辑和 `PATCH /api/materials/batch`。
- 增加规则版作品集页面草稿生成器和 `portfolio_case/` 素材。
- 升级到 48 项测试和 `quality_gate_v05.md`。

## v0.6 AI Assistant 与作品集导出（当前完成）

- 增加 AI 服务抽象层：rule_based、openai、deepseek、ollama。
- 无 API Key 时自动使用 `rule_based_fallback`。
- 增加 Ask DesignMate API 和 Web UI 工作区。
- 增强作品集草稿生成，支持 page 参数和 AI 自检。
- 增加扫描批次、文件 hash、首次/最近出现时间、重复标记。
- 增强图片资料元数据、预览路径和手动说明入口。
- 增加 `portfolio_export/` 作品集案例导出。
- 升级到 66 项测试和 `quality_gate_v06.md`。

## v0.6.1 Portfolio Demo Polish（当前完成）

- 增加 source_mode，区分 demo / user / imported / unknown。
- Dashboard 和 Search 支持真实资料状态与 Source 筛选。
- 增加真实资料导入文档 `docs/import_real_materials.md`。
- 优化 Web UI 视觉层级和 Showcase Mode。
- Ask DesignMate 输出结构化 answer_sections 和 confidence。
- 作品集草稿升级为 7 段式作品集页面结构，并生成 `drafts/draft_index.md`。
- `portfolio_export` 增加 A3 页面内容、两页叙事、演示脚本和截图清单。
- 升级到 82 项测试和 `quality_gate_v061.md`。

## v0.7 真实 AI 与发布准备

- 接入真实 OpenAI / DeepSeek / Ollama 调用。
- 增加真实图像理解与图片描述生成。
- 增加 PDF/DOCX/PPTX 深度解析。
- 增加更高级向量搜索和混合检索排序。
- 增加 Electron 或其他桌面打包方案。
- 增加真实用户测试、Demo 录屏脚本和作品集展示页导出优化。

## v1.0 可发布版本

- 完成本地资料库管理闭环。
- 支持项目级作品集叙事生成和可视化导出。
- 完成隐私说明、安装说明、发布检查和真实资料验证。
