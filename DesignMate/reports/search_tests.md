# Search Tests

Generated at: 2026-05-06

## Commands

| Command | Result |
| --- | --- |
| `python DesignMate\scripts\search_materials.py 作品集` | 3 matches |
| `python DesignMate\scripts\search_materials.py 草图` | 2 matches |
| `python DesignMate\scripts\search_materials.py 反馈` | 2 matches |
| `python DesignMate\scripts\search_materials.py --limit 5 设计` | 4 matches |
| `python DesignMate\scripts\search_materials.py --project reader-design 痛点` | 0 matches; 当前示例资料未明确归属 reader-design |
| `python DesignMate\scripts\search_materials.py --type feedback 修改` | 0 matches; 当前反馈示例包含“建议/反馈”，不包含“修改” |

## Notes

- 搜索已支持 filename、content_preview、content_file 全文、tags、project_guess、material_type。
- 搜索结果会输出到 `reports/search_result.md` 和 `reports/search_result.json`。
- 终端显示中文参数时偶发编码显示问题，但 JSON/Markdown 报告中的查询词正确。

