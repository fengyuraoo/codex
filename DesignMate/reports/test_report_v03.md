# Test Report v0.3

Generated at: 2026-05-06T23:28:44
Exit code: 0

## stdout

```text
# API Smoke Test v0.4

Mode: direct backend service smoke test

- PASS `health`: `{"ok": true, "version": "v0.4"}`
- PASS `stats`: `{"total_materials": 35, "by_type": {"research": 9, "feedback": 9, "idea": 4, "sketch": 2, "draft": 4, "reference": 2, "competitor": 2, "paper": 3}, "by_project": {"general": 10, "reader-design": 10, "info-center": 9, "unknown": 1, "thesis": 5}, "by_stage": {"concept": 5, "presentation": 7, "background": 4, "development": 7, "research": 10, "unknown": 2}, "parse_status": {"parsed": 35}, "high_value_count": 33, "unknown_count": 1, "fts5_available": true}`
- PASS `search`: `{"count": 5}`
- PASS `get material detail`: `{"id": "mat-64831effa44c"}`
- PASS `patch material`: `{"id": "mat-64831effa44c", "filename": "general-design-critique-checklist.md", "path": "data/inbox/general-design-critique-checklist.md", "extension": "md", "size": 354, "modified_time": "2026-05-06T22:36:34", "source_folder": "data/inbox", "content_preview": "# General Design Critique Checklist\n\n��Ʒ���Բ��嵥�������Ƿ���ȷĿ���û����Ƿ�˵������ʹ�㣬�Ƿ��е���֤�ݣ��Ƿ������ƻ��ᣬ�Ƿ�չʾ�����������Ƿ������Ч����ǰ�������Ӧ������ÿ����Ŀ������Ҫһҳ˵����Ϊʲô������ơ����������ֻ�ܿ������ͼ��", "content_full_path": "index/materials_content/mat-64831effa44c.txt", "parse_status": "parsed", "parse_error": "", "word_count": 98, "material_type": "draft", "portfolio_stage": "presentation", "project_guess": "general", "tags": ["api-smoke", "edited"], "material_score": 77, "reason": "�˹��༭���û��� DesignMate v0.4 ��ȷ�ϻ�����˷��ࡣ", "notes": "api smoke test note", "review_status": "confirmed", "created_at": "2026-05-06T22:36:59", "updated_at": "2026-05-06T23:28:42"}`
- PASS `patch verified by get`: `{"id": "mat-64831effa44c", "filename": "general-design-critique-checklist.md", "path": "data/inbox/general-design-critique-checklist.md", "extension": "md", "size": 354, "modified_time": "2026-05-06T22:36:34", "source_folder": "data/inbox", "content_preview": "# General Design Critique Checklist\n\n��Ʒ���Բ��嵥�������Ƿ���ȷĿ���û����Ƿ�˵������ʹ�㣬�Ƿ��е���֤�ݣ��Ƿ������ƻ��ᣬ�Ƿ�չʾ�����������Ƿ������Ч����ǰ�������Ӧ������ÿ����Ŀ������Ҫһҳ˵����Ϊʲô������ơ����������ֻ�ܿ������ͼ��", "content_full_path": "index/materials_content/mat-64831effa44c.txt", "parse_status": "parsed", "parse_error": "", "word_count": 98, "material_type": "draft", "portfolio_stage": "presentation", "project_guess": "general", "tags": ["api-smoke", "edited"], "material_score": 77, "reason": "�˹��༭���û��� DesignMate v0.4 ��ȷ�ϻ�����˷��ࡣ", "notes": "api smoke test note", "review_status": "confirmed", "created_at": "2026-05-06T22:36:59", "updated_at": "2026-05-06T23:28:42"}`
- PASS `rebuild`: `{"fts5_available": true}`
Running scan_library.py...
Running classify_materials.py...
Running generate_report.py...
Running build_static_site.py...

DesignMate v0.3 run completed.
- SQLite DB: data/designmate.db
- Total materials: 35
- FTS5 available: True
Please review:
- reports/latest_report.md
- index/materials_index.md
- index/classification_report.md
- frontend/index.html
- review/latest_next_actions.md
Running scan_library.py...
Running classify_materials.py...
Running generate_report.py...
Running build_static_site.py...

DesignMate v0.3 run completed.
- SQLite DB: data/designmate.db
- Total materials: 35
- FTS5 available: True
Please review:
- reports/latest_report.md
- index/materials_index.md
- index/classification_report.md
- frontend/index.html
- review/latest_next_actions.md
Generated frontend data with 35 materials.
Open E:\GitHub\codex-desktop\DesignMate\frontend\index.html in a browser.

```

## stderr

```text
test_api_get_material_equivalent (test_api.ApiLikeTests.test_api_get_material_equivalent) ... ok
test_api_health_equivalent (test_api.ApiLikeTests.test_api_health_equivalent) ... ok
test_api_patch_material_equivalent (test_api.ApiLikeTests.test_api_patch_material_equivalent) ... ok
test_api_search_equivalent (test_api.ApiLikeTests.test_api_search_equivalent) ... ok
test_api_smoke_script (test_api.ApiLikeTests.test_api_smoke_script) ... ok
test_api_stats_equivalent (test_api.ApiLikeTests.test_api_stats_equivalent) ... ok
test_classifies_feedback (test_classifier.ClassifierTests.test_classifies_feedback) ... ok
test_classifies_research (test_classifier.ClassifierTests.test_classifies_research) ... ok
test_classifies_sketch (test_classifier.ClassifierTests.test_classifies_sketch) ... ok
test_project_info_center (test_classifier.ClassifierTests.test_project_info_center) ... ok
test_project_reader (test_classifier.ClassifierTests.test_project_reader) ... ok
test_database_initializes_and_upserts (test_database.DatabaseTests.test_database_initializes_and_upserts) ... ok
test_empty_database_does_not_crash (test_database.DatabaseTests.test_empty_database_does_not_crash) ... ok
test_stats_available (test_database.DatabaseTests.test_stats_available) ... ok
test_update_material_project (test_database.DatabaseTests.test_update_material_project) ... ok
test_update_material_stage (test_database.DatabaseTests.test_update_material_stage) ... ok
test_update_material_type (test_database.DatabaseTests.test_update_material_type) ... ok
test_update_notes (test_database.DatabaseTests.test_update_notes) ... ok
test_update_tags (test_database.DatabaseTests.test_update_tags) ... ok
test_image_without_real_image_does_not_crash (test_parser.ParserTests.test_image_without_real_image_does_not_crash) ... ok
test_md_text_reading_succeeds (test_parser.ParserTests.test_md_text_reading_succeeds) ... ok
test_scan_inbox_succeeds (test_parser.ParserTests.test_scan_inbox_succeeds) ... ok
test_run_designmate_succeeds (test_pipeline.PipelineTests.test_run_designmate_succeeds) ... ok
test_latest_report_file_exists (test_report.ReportTests.test_latest_report_file_exists) ... ok
test_report_generation_succeeds (test_report.ReportTests.test_report_generation_succeeds) ... ok
test_info_center_has_results (test_search.SearchTests.test_info_center_has_results) ... ok
test_low_interruption_has_results (test_search.SearchTests.test_low_interruption_has_results) ... ok
test_missing_word_does_not_crash (test_search.SearchTests.test_missing_word_does_not_crash) ... ok
test_portfolio_page_search (test_search.SearchTests.test_portfolio_page_search) ... ok
test_project_filter_effective (test_search.SearchTests.test_project_filter_effective) ... ok
test_stage_filter_effective (test_search.SearchTests.test_stage_filter_effective) ... ok
test_synonym_search (test_search.SearchTests.test_synonym_search) ... ok
test_type_filter_effective (test_search.SearchTests.test_type_filter_effective) ... ok
test_app_data_js_exists (test_static_site.StaticSiteTests.test_app_data_js_exists) ... ok
test_frontend_materials_json_exists (test_static_site.StaticSiteTests.test_frontend_materials_json_exists) ... ok
test_static_site_files_exist (test_static_site.StaticSiteTests.test_static_site_files_exist) ... ok

----------------------------------------------------------------------
Ran 36 tests in 1.946s

OK

```

Final status: PASS
