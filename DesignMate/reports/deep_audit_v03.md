# DesignMate v0.3 Deep Audit

Generated at: 2026-05-06

## 1. 当前目录结构

- `backend/`：当前为空目录，v0.3 需要承载数据模型、数据库、搜索、解析、分类、报告和 API。
- `scripts/`：当前承载主要逻辑，包括扫描、分类、搜索、报告、静态站点和测试入口。
- `frontend/`：静态 HTML/CSS/JS 原型，读取 `frontend/data/materials.json`。
- `data/`：资料输入目录和示例资料，尚无 SQLite 数据库。
- `index/`：JSON/Markdown 索引和全文缓存。
- `reports/`：报告、日志、搜索结果和测试记录。
- `review/`、`drafts/`：由报告流程生成的复核和作品集材料草稿。
- `tests/`：基础 unittest 测试，覆盖较浅。

## 2. 当前已实现功能

- 本地扫描 `data/inbox/` 和 `data/library/`。
- md/txt 正文读取并保存到 `index/materials_content/`。
- 可选尝试 PDF/DOCX/PPTX/图片元信息解析。
- 规则分类、项目猜测、标签生成和资料评分。
- JSON/Markdown 索引、分类报告、每日报告。
- 命令行搜索、项目/类型/limit 筛选。
- 静态 Web UI 读取本地 JSON。
- 基础测试和一键运行脚本。

## 3. 当前只是占位的功能

- `backend/` 未实现。
- 没有 SQLite 数据库。
- 没有 FTS 全文索引。
- 没有本地 API 服务。
- Web UI 无 API 数据源、无报告页、无详情页式信息结构。
- 新增/更新文件统计没有历史快照。
- 图片理解仍未实现。
- AI 总结接口未实现。

## 4. 当前搜索质量问题

- 依赖 JSON 文件，数据层不稳定，不适合作为应用后端。
- 没有 SQLite FTS，无法利用数据库全文索引。
- 中英文分词仍是简单包含匹配。
- 搜索结果缺少阶段筛选。
- 示例资料只有 4 条，难以判断排序质量。
- 终端显示中文参数时偶发编码渲染问题，但报告文件正常。

## 5. 当前 UI 问题

- 只有单页静态列表，不像应用。
- 没有报告页。
- 没有阶段筛选和 limit 控件。
- 详情面板信息较少，缺少 why_relevant、确认问题、作品集用途。
- 空状态和错误状态不足。
- 无法从 API 获取最新数据。

## 6. 当前测试覆盖不足

- 测试只覆盖 5 个浅层流程。
- 没有数据库测试。
- 没有 parser/classifier/search_engine/report_service 的单元测试。
- 没有 API smoke test。
- 没有质量门禁。
- 没有对真实一点的数据集做搜索基准。

## 7. v0.3 必须完成的工程任务清单

- 建立 `backend/` 模块和统一 `MaterialRecord` 数据模型。
- 使用 SQLite 存储资料，并在可用时使用 FTS5。
- 把解析、分类、搜索、报告逻辑从脚本迁移到 backend。
- 重构脚本为 backend 的薄入口。
- 实现本地 API 服务。
- 升级 Web UI，支持 dashboard、搜索、详情和报告页。
- 扩展示例数据到 30+ 条。
- 增加搜索 benchmark。
- 增强报告内容，提供项目视角和明日任务。
- 扩展测试到 20+ 项。
- 增加 `quality_gate.py`。

## 8. 本轮完成后如何验收

- `data/designmate.db` 存在且可查询。
- `python DesignMate\scripts\run_designmate.py` 成功。
- 关键搜索命令能返回合理结果。
- `python DesignMate\scripts\build_static_site.py` 成功生成前端数据。
- `python DesignMate\scripts\run_tests.py` 通过。
- `python DesignMate\scripts\quality_gate.py` 生成 PASS/FAIL 报告。
- `frontend/index.html` 可打开并交互筛选。
- `python DesignMate\scripts\start_api.py` 可启动 API；至少 API smoke test 通过。

