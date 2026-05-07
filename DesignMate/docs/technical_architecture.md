# Technical Architecture

DesignMate v0.6 是本地优先的 Python + SQLite + 标准库 HTTP API + 静态 Web UI 原型。核心原则是：没有外部 API Key 也能完整运行，真实 AI 能力通过抽象层逐步接入。

## Backend

- `backend/models.py`：统一资料模型 `MaterialRecord`，包含文件信息、解析状态、分类字段、评分、备注、扫描历史、hash、重复标记和图片元数据。
- `backend/database.py`：SQLite 初始化、资料 upsert、单条更新、批量更新、FTS 重建、统计和扫描批次记录。
- `backend/material_parser.py`：扫描 `data/inbox` / `data/library`，解析文本资料，记录图片元数据，生成 content 文件。
- `backend/classifier.py`：规则分类、项目推断、标签生成和资料评分。
- `backend/search_engine.py`：中文同义词、短词匹配、字段加权和本地搜索排序。
- `backend/report_service.py`：生成每日资料报告、待确认问题、下一步行动和作品集资料清单。
- `backend/ai_service.py`：AI 服务抽象层，支持 `rule_based`、`openai`、`deepseek`、`ollama`，无 Key 时 fallback。
- `backend/prompt_service.py`：集中管理设计作品集语境提示词。
- `backend/portfolio_writer.py`：按项目和页面类型生成规则版作品集页面草稿。
- `backend/import_service.py`：文件 hash、图片预览复制、扫描批次 id。
- `backend/history_service.py`：扫描批次开始与结束记录。
- `backend/export_service.py`：导出 DesignMate 作品集案例包。

## SQLite

数据库文件：

- `data/designmate.db`

核心表：

- `materials`：资料主表。
- `search_index`：FTS5 或 fallback 搜索索引。
- `reports`：报告记录。
- `app_logs`：应用日志。
- `scan_batches`：扫描批次，记录 total/new/updated/duplicate/failed。

## API

- `GET /api/health`
- `GET /api/stats`
- `GET /api/materials`
- `GET /api/materials/{id}`
- `PATCH /api/materials/{id}`
- `PATCH /api/materials/batch`
- `GET /api/search?q=...`
- `POST /api/ask`
- `GET /api/report/latest`
- `POST /api/reindex`
- `POST /api/rebuild`

## Scripts

- `scripts/run_designmate.py`：一键扫描、分类、报告、静态站点数据生成。
- `scripts/build_static_site.py`：从 SQLite 和 reports 同步生成 `frontend/data`。
- `scripts/generate_portfolio_draft.py`：按项目与页面类型生成草稿。
- `scripts/export_portfolio_case.py`：导出 DesignMate 作品集案例包。
- `scripts/start_api.py`：启动本地 API。
- `scripts/start_frontend.py`：启动静态前端服务器。
- `scripts/api_smoke_test.py`：后端 smoke test。
- `scripts/run_tests.py`：运行 unittest。
- `scripts/quality_gate.py`：运行 v0.6 质量门禁。

## Frontend

- `frontend/index.html`
- `frontend/style.css`
- `frontend/app.js`
- `frontend/data/materials.json`
- `frontend/data/app_data.js`

前端支持静态模式和 API 模式。静态模式可查看资料、报告和搜索；API 模式可保存单条编辑、批量编辑，并使用 Ask DesignMate。

## Quality Gate

`scripts/quality_gate.py` 检查：

- 一键流程是否成功。
- 静态站点数据是否生成。
- 作品集草稿是否生成。
- 作品集案例是否导出。
- API smoke test 是否通过。
- 66 项测试是否通过。
- Ask、搜索、编辑、批量编辑、fallback 是否可用。
