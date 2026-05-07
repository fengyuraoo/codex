# Search Benchmark v0.4

Generated at: 2026-05-06

## Summary

v0.4 搜索已加入中文去空格、短查询 2-gram/3-gram 辅助匹配和设计作品集同义词扩展。整体召回明显提升，但部分泛词会带来较宽结果，后续需要继续做项目权重和人工确认反馈学习。

| Query | Matches | Top 3 | 是否合理 | 问题 |
| --- | ---: | --- | --- | --- |
| `低干扰` | 15 | reader-design-low-interruption-reading.md; reader-design-competitor-kindle-notion.md; reader-design-research-note-reading-goals.txt | 合理 | 同义词会扩到阅读器相关资料，召回偏宽但可接受。 |
| `用户痛点` | 20 | portfolio-pain-point-analysis.md; reader-design-user-interview-commute.md; reader-design-feedback-mentor.md | 合理 | 结果较多，后续可按项目或阶段提示筛选。 |
| `图信中心` | 10 | info-center-reference-learning-commons.md; info-center-competitor-campus-library.md; info-center-feedback-teacher.md | 合理 | 第 10 条出现 reader-design，需加强项目词权重。 |
| `动线` | 7 | info-center-circulation-flow.md; info-center-feedback-teacher.md; info-center-user-behavior.md | 合理 | 个别 thesis/reader 资料因路径/短词召回，需降低弱命中权重。 |
| `双城通勤` | 8 | thesis-dual-city-commute.md; thesis-transport-connection.md; thesis-research-method-note.md | 合理 | 后几条 reader 资料属于弱召回。 |
| `老师反馈` | 9 | reader-design-feedback-mentor.md; info-center-feedback-wayfinding.md; portfolio-feedback-page-order.md | 合理 | feedback 同义词效果明显。 |
| `草图` | 7 | sketch_reference_note.md; reader-design-sketch-panel-layout.md; portfolio-feedback-page-order.md | 基本合理 | 第 3 条是反馈中提到草图，排序略高。 |
| `灵感` | 6 | info-center-reference-learning-commons.md; sketch_reference_note.md; portfolio-reference-visual-rhythm.md | 合理 | 终端显示中文参数仍可能乱码，文件报告正常。 |
| `作品集页面` | 17 | design_student_notes.md; portfolio-page-structure.md; portfolio-feedback-page-order.md | 合理 | 作品集词较泛，结果多。 |
| `设计机会` | 19 | portfolio-design-opportunity.md; general-design-critique-checklist.md; portfolio-project-narrative.md | 合理 | 可增加 concept 阶段加权。 |
| `阅读` | 13 | reader-design-low-interruption-reading.md; reader-design-competitor-kindle-notion.md; reader-design-research-note-reading-goals.txt | 合理 | 阅读器项目召回好。 |
| `学习空间` | 13 | info-center-reference-learning-commons.md; info-center-competitor-campus-library.md; info-center-space-research.md | 合理 | 后部 thesis 资料弱召回，需继续收敛。 |

## Next Improvements

- 为项目强词如 `图信中心`、`双城通勤`、`阅读器` 增加项目过滤建议。
- 将短词 n-gram 匹配设置为低权重，而不是和同义词同权。
- 在 Web UI 中显示 matched_fields 和 why_relevant，帮助用户理解排序。
- 将人工编辑后的 project/type/stage 作为排序信号。

