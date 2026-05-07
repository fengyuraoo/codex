# Search Benchmark v0.3

Generated at: 2026-05-06

## 搜索测试

| Query | Matches | Top 3 是否合理 | Top 3 |
| --- | ---: | --- | --- |
| `低干扰` | 6 | 合理 | reader-design-low-interruption-reading.md; reader-design-feedback-mentor.md; portfolio-design-opportunity.md |
| `用户痛点` | 3 | 合理 | reader-design-feedback-mentor.md; reader-design-user-interview-commute.md; portfolio-pain-point-analysis.md |
| `图信中心` | 9 | 合理 | info-center-feedback-teacher.md; info-center-space-research.md; info-center-circulation-flow.md |
| `动线` | 4 | 合理 | info-center-circulation-flow.md; info-center-feedback-teacher.md; info-center-space-research.md |
| `双城通勤` | 4 | 合理 | thesis-dual-city-commute.md; thesis-langfang-urban-structure.md; thesis-research-method-note.md |
| `老师反馈` | 6 | 合理 | portfolio-feedback-page-order.md; reader-design-feedback-mentor.md; design_student_notes.md |
| `--project reader-design 阅读` | 10 | 合理 | reader-design-low-interruption-reading.md; reader-design-competitor-kindle-notion.md; reader-design-research-note-reading-goals.txt |
| `--project info-center 空间` | 8 | 合理 | info-center-space-research.md; info-center-reference-learning-commons.md; info-center-competitor-campus-library.md |
| `--type feedback 修改` | 5 | 合理 | portfolio-feedback-page-order.md; reader-design-feedback-mentor.md; info-center-feedback-teacher.md |
| `--stage research 调研` | 4 | 基本合理 | research_feedback.md; info-center-space-research.md; reader-design-research-note-reading-goals.txt |

## 发现的问题

- 终端输出中文查询词时仍可能出现编码渲染异常，但 Markdown/JSON 报告中的数据正常。
- `portfolio-design-opportunity.md` 被归入 reader-design，是因为正文中使用了低干扰阅读示例；后续可以增加“通用资料优先级”规则。
- `info-center-feedback-wayfinding.md` 的 stage 为 unknown，说明导视资料的阶段规则还需要补充。
- FTS5 已建立，但中文搜索排序主要仍依赖应用层加权，后续可以增加中文 token 化策略。

## 后续改进建议

- 增加人工确认字段，允许用户把误判项目改为 general。
- 为 stage 增加 wayfinding、service、layout 等设计语境关键词。
- 为中文搜索加入双字词或字符 n-gram 辅助索引。
- 在 Web UI 中显示命中字段和 matched snippet。

