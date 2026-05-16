# Quality Gate v0.6.1

Generated at: 2026-05-16T16:50:26

## Commands

| Check | Status | Notes |
| --- | --- | --- |
| `python scripts/run_designmate.py` | PASS | - review/latest_next_actions.md |
| `python scripts/build_static_site.py` | PASS | Open E:\GitHub\codex-desktop\DesignMate\frontend\index.html in a browser. |
| `python scripts/export_portfolio_case.py` | PASS | Open portfolio_export/designmate_case.html for a quick case overview. |
| `python scripts/generate_portfolio_draft.py --project reader-design --page overview` | PASS | Also wrote page-specific draft: drafts/reader-design_overview_draft.md |
| `python scripts/generate_portfolio_draft.py --project reader-design --page pain-points` | PASS | Also wrote page-specific draft: drafts/reader-design_pain-points_draft.md |
| `python scripts/generate_portfolio_draft.py --project info-center --page concept` | PASS | Also wrote page-specific draft: drafts/info-center_concept_draft.md |
| `python scripts/api_smoke_test.py` | PASS | - PASS `rebuild`: `{"fts5_available": true}` |
| `python scripts/run_tests.py` | PASS | Test report written to reports\test_report_v061.md |

## Required Files

| File | Status | Fix Suggestion |
| --- | --- | --- |
| `data/designmate.db` | PASS | - |
| `frontend/index.html` | PASS | - |
| `frontend/app.js` | PASS | - |
| `frontend/style.css` | PASS | - |
| `frontend/data/materials.json` | PASS | - |
| `frontend/data/app_data.js` | PASS | - |
| `reports/latest_report.md` | PASS | - |
| `reports/quality_gate_v061.md` | PASS | - |
| `review/latest_need_confirm.md` | PASS | - |
| `review/latest_next_actions.md` | PASS | - |
| `drafts/latest_portfolio_materials.md` | PASS | - |
| `drafts/latest_portfolio_page_draft.md` | PASS | - |
| `portfolio_export/designmate_case.html` | PASS | - |
| `portfolio_export/a3_portfolio_page_content.md` | PASS | - |
| `portfolio_export/two_page_portfolio_story.md` | PASS | - |
| `portfolio_export/demo_script.md` | PASS | - |
| `portfolio_export/screenshot_checklist.md` | PASS | - |
| `drafts/draft_index.md` | PASS | - |

## Functional Checks

| Check | Status | Fix Suggestion |
| --- | --- | --- |
| materials 数量 > 0 | PASS | - |
| 高价值资料数量 > 0 | PASS | - |
| search 低干扰有结果 | PASS | - |
| search 图信中心有结果 | PASS | - |
| search 用户痛点有结果 | PASS | - |
| update_material 可用 | PASS | - |
| batch update 可用 | PASS | - |
| Ask API/AI service 可用 | PASS | - |
| frontend data 非空 | PASS | - |
| import stats 可用 | PASS | - |
| scan batch 可用 | PASS | - |
| portfolio draft 可用 | PASS | - |
| portfolio export 可用 | PASS | - |
| 无 API Key fallback 不崩溃 | PASS | - |
| source_mode 统计可用 | PASS | - |
| Ask answer_sections 可用 | PASS | - |

Final status: PASS
