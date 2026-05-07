# DesignMate PRD

## 产品目标

DesignMate 帮助设计学生把零散资料转化为可搜索、可复盘、可推进的作品集资料库。

## v0.3 功能定义

- 本地资料扫描：读取 `data/inbox/` 和 `data/library/`。
- 本地数据库：使用 SQLite 保存资料元信息、分类、报告和日志。
- 本地全文搜索：使用 SQLite FTS5 或 fallback 搜索，支持项目、类型、阶段筛选。
- 资料解析：md/txt 完整解析，PDF/DOCX/PPTX/图片可选解析并优雅降级。
- 资料分类：生成 material_type、portfolio_stage、project_guess、tags、material_score、reason。
- Web UI：Dashboard、Search、Reports 三个视图。
- API 服务：提供 health、stats、materials、search、report、reindex 接口。
- 报告生成：输出本地资料报告、待确认问题、下一步任务和作品集材料草稿。
- 测试体系：20 项 unittest 和质量门禁。

## 用户场景

1. 用户把资料放入 `data/inbox/`。
2. 运行 `python scripts/run_designmate.py`。
3. 打开 `frontend/index.html` 搜索和筛选资料。
4. 查看 `reports/latest_report.md` 理解资料库状态。
5. 根据 `review/latest_next_actions.md` 推进第二天任务。

## 非目标功能

- 不做云同步。
- 不做账号系统。
- 不复制第三方项目。
- 不自动替用户编造设计成果。
- v0.3 不实现 AI 图像理解和在线模型调用。

## 成功标准

- SQLite 数据库存在且可查询。
- 搜索“低干扰”“图信中心”“双城通勤”有合理结果。
- Web UI 可打开并本地交互筛选。
- API smoke test 通过。
- `scripts/run_tests.py` 和 `scripts/quality_gate.py` 通过。

