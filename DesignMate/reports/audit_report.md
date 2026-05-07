# DesignMate v0.2 Audit Report

Generated at: 2026-05-06

## 当前能运行的功能

- `scripts/run_designmate.py` 可以串联扫描、分类和报告生成。
- `scripts/scan_library.py` 可以扫描 `data/inbox/` 和 `data/library/` 中的示例 Markdown 文件。
- `scripts/classify_materials.py` 可以基于关键词生成分类报告。
- `scripts/search_materials.py` 可以进行基础关键词搜索。
- `reports/latest_report.md`、`index/materials_index.md`、`index/classification_report.md` 已能生成。

## 当前脚本问题

- 索引文件写入不是原子操作；并行运行搜索和扫描时，搜索可能读到正在写入的 JSON。
- 搜索只读取 `filename`、`content_preview`、`detected_type`，没有全文搜索、标签搜索、项目过滤和类型过滤。
- 分类规则偏粗，容易被早出现的关键词影响。
- 报告偏统计，缺少“为什么值得看”和“下一步具体任务”。
- `run_designmate.py` 日志仍写着 v0.1 pipeline，需要更新为 v0.2。

## 当前数据结构问题

- `materials_index.json` 中缺少 `content_file`、`parse_status`、`parse_error`、`word_count`、`tags`、`project_guess`、`material_score` 等字段。
- 文本正文没有拆分保存，不利于全文搜索。
- 图片、PDF、DOCX、PPTX 只有很少元信息。
- 资料 ID 依赖扫描顺序，不够稳定。

## v0.2 最需要改进的地方

- 增强文件解析和原子写入，确保索引稳定。
- 建立更适合作品集资料的分类、项目猜测和评分逻辑。
- 搜索支持全文、标签、项目、类型和结果排序。
- 报告从统计升级为每日整理与行动建议。
- 增加一个最小静态 Web UI，方便查看资料库。

