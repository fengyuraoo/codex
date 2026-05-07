# DesignMate v0.6 Recovery Audit

Generated at: 2026-05-07T15:05:00

## 1. v0.6 新增文件是否存在

- PASS：`backend/ai_service.py`
- PASS：`backend/prompt_service.py`
- PASS：`backend/import_service.py`
- PASS：`backend/history_service.py`
- PASS：`backend/export_service.py`
- PASS：`config/ai_settings.example.json`
- PASS：`scripts/export_portfolio_case.py`
- PASS：`tests/test_v06_ai_import_export.py`

## 2. 主要代码是否完整

- PASS：API 已升级到 v0.6，并包含 `POST /api/ask`。
- PASS：数据库已增加 file hash、scan batch、图片 metadata 字段。
- PASS：作品集草稿生成器支持 `--page` 参数。
- PASS：前端已增加 Ask 页面、图片 metadata 展示和 v0.6 标识。

## 3. README / QUICKSTART / ROADMAP 是否写到一半

- README：已更新到 v0.6，包含运行、API、Web UI、Ask、草稿、导出和 fallback 说明。
- QUICKSTART：已更新到每日最简流程。
- ROADMAP：已包含 v0.6 状态，但本次收尾会再统一整理版本结构。

## 4. reports/dev_log.md 是否已更新

- 部分更新：已有多次 v0.6 pipeline 运行日志。
- 待补齐：需要追加一段 v0.6 完整开发总结。

## 5. reports/next_tasks.md 是否已更新

- 待补齐：当前任务清单仍需要改为 v0.7 优先级列表。

## 6. reports/quality_gate_v06.md 是否存在

- PASS：`reports/quality_gate_v06.md` 已存在，最近一次状态 PASS。

## 7. portfolio_export 是否生成

- PASS：`portfolio_export/designmate_case.html` 已生成。
- PASS：`portfolio_export/demo_script.md` 已生成。

## 8. drafts/latest_portfolio_page_draft.md 是否生成

- PASS：`drafts/latest_portfolio_page_draft.md` 已生成。

## 9. 恢复结论

v0.6 功能现场完整，不需要重做或回滚。收尾重点是统一文档、重新运行最终验收命令链，并把最终结果写入 dev log、next tasks 和 quality gate。
