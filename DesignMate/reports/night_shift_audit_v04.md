# DesignMate v0.4 Night Shift Audit

Generated at: 2026-05-06

## 1. 当前功能状态

- v0.3 一键流程可运行。
- SQLite 数据库、资料扫描、分类、搜索、报告和静态 Web UI 均可生成。
- 当前资料库包含 35 条示例资料。
- `run_tests.py` 现有 20 项测试通过。
- `quality_gate.py` 当前 v0.3 门禁通过。

## 2. 当前 Web UI 问题

- 详情面板只读，不能编辑项目、类型、阶段、标签或备注。
- Reports 页面直接显示纯文本，视觉层级不足。
- 搜索缺少快捷筛选、排序和当前筛选摘要。
- Dashboard 缺少最近更新资料和更清晰的待确认状态。
- 静态模式和 API 模式没有明确区分。

## 3. 当前 API 问题

- API 支持 health/stats/materials/search/report/reindex，但没有 PATCH。
- 不能保存用户对资料分类的人工修改。
- 没有 `/api/rebuild` 别名。
- API smoke test 未覆盖编辑闭环。

## 4. 当前数据库问题

- `materials` 表没有 `notes` 字段。
- 没有人工确认状态字段。
- 缺少受控更新函数，非法字段过滤不足。
- 更新后需要自动刷新 FTS 搜索索引。

## 5. 当前搜索体验问题

- 中文搜索仍主要依赖直接包含。
- 同义词和 2-gram/3-gram 辅助匹配不足。
- why_relevant 不够像产品说明。
- 搜索 benchmark 仍停留在 v0.3。

## 6. 当前报告体验问题

- 报告内容可读，但前端没有 Markdown 结构化渲染。
- Need Confirm 和 Next Actions 没有视觉强调。
- 报告对人工确认状态和备注使用不足。

## 7. v0.4 验收标准

- API 支持获取、编辑、保存资料，并能重建索引。
- Web UI 可编辑 project/type/stage/tags/score/notes 并保存到 SQLite。
- 静态模式下明确提示无法保存。
- 搜索支持中文短词、同义词和更清晰相关性说明。
- Reports 页面有基础 Markdown 渲染。
- 启动脚本和 BAT 脚本可用。
- 测试不少于 30 项。
- `quality_gate.py` 输出 `reports/quality_gate_v04.md` 且主要流程 PASS。

