# 07 Technical Prototype

## 本地优先架构

DesignMate v0.5 使用 Python 标准库优先的方式构建。资料扫描、分类、搜索、报告和 API 均可在本地运行，数据库文件保存在 `data/designmate.db`。

## Backend

`backend/database.py` 负责 SQLite 存储、更新、批量编辑和 FTS 重建。`backend/search_engine.py` 负责中文关键词、同义词和评分排序。`backend/api_server.py` 提供健康检查、资料列表、搜索、单条编辑和批量编辑接口。

## Frontend

前端使用纯 HTML/CSS/JS。静态模式可以直接打开本地页面查看数据；API 模式下可以保存编辑结果。`scripts/build_static_site.py` 把数据库和报告同步为 `frontend/data` 下的 JSON 与文本文件。

## Reports and Drafts

`backend/report_service.py` 生成每日资料报告、待确认问题、下一步任务和作品集可用资料。`backend/portfolio_writer.py` 根据项目资料生成规则版作品集页面草稿。

## 测试与质量门禁

`scripts/run_tests.py` 运行标准库 unittest；`scripts/quality_gate.py` 串联一键流程、静态站点生成、草稿生成、API smoke test 和文件检查，保证 Demo 可重复运行。
