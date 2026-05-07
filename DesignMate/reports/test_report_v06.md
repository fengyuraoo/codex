# Test Report v0.6

Generated at: 2026-05-07T15:27:30
Exit code: 0

## stdout

```text
# API Smoke Test v0.6

Mode: direct backend service smoke test

- PASS `health`: `{"ok": true, "version": "v0.6"}`
- PASS `stats`: `{"total_materials": 36, "by_type": {"research": 9, "feedback": 9, "idea": 4, "sketch": 2, "draft": 4, "reference": 2, "competitor": 2, "paper": 3, "unknown": 1}, "by_project": {"general": 10, "reader-design": 10, "info-center": 9, "unknown": 2, "thesis": 5}, "by_stage": {"concept": 5, "presentation": 7, "background": 4, "development": 8, "research": 10, "unknown": 2}, "parse_status": {"parsed": 35, "parse_failed": 1}, "high_value_count": 33, "unknown_count": 2, "fts5_available": true, "import": {"inbox_file_count": 36, "library_file_count": 0, "last_scan_time": "2026-05-07T15:27:23", "last_report_time": "2026-05-07T15:27:23", "watched_folders": ["data/inbox", "data/library"], "latest_batch": {"id": "scan-99a305f72ebe", "started_at": "2026-05-07T15:27:22", "finished_at": "2026-05-07T15:27:23", "total_files": 36, "new_files": 0, "updated_files": 36, "duplicate_files": 0, "failed_files": 1}}}`
- PASS `search`: `{"count": 5}`
- PASS `get material detail`: `{"id": "mat-64831effa44c"}`
- PASS `patch material`: `{"id": "mat-64831effa44c", "filename": "general-design-critique-checklist.md", "path": "data/inbox/general-design-critique-checklist.md", "extension": "md", "size": 354, "modified_time": "2026-05-06T22:36:34", "source_folder": "data/inbox", "content_preview": "# General Design Critique Checklist\n\n��Ʒ���Բ��嵥�������Ƿ���ȷĿ���û����Ƿ�˵������ʹ�㣬�Ƿ��е���֤�ݣ��Ƿ������ƻ��ᣬ�Ƿ�չʾ�����������Ƿ������Ч����ǰ�������Ӧ������ÿ����Ŀ������Ҫһҳ˵����Ϊʲô������ơ����������ֻ�ܿ������ͼ��", "content_full_path": "index/materials_content/mat-64831effa44c.txt", "parse_status": "parsed", "parse_error": "", "word_count": 98, "material_type": "draft", "portfolio_stage": "presentation", "project_guess": "general", "tags": ["api-smoke", "edited"], "material_score": 77, "reason": "�˹��༭���û��� DesignMate v0.4 ��ȷ�ϻ�����˷��ࡣ", "notes": "api smoke test note", "review_status": "confirmed", "file_hash": "577fca56ffc8a136247697a64282c66606fdcad5", "first_seen_at": "2026-05-06T22:36:59", "last_seen_at": "2026-05-07T15:27:23", "scan_batch_id": "scan-99a305f72ebe", "is_duplicate": false, "image_preview_path": "", "image_width": 0, "image_height": 0, "image_note": "", "created_at": "2026-05-06T22:36:59", "updated_at": "2026-05-07T15:27:23"}`
- PASS `patch verified by get`: `{"id": "mat-64831effa44c", "filename": "general-design-critique-checklist.md", "path": "data/inbox/general-design-critique-checklist.md", "extension": "md", "size": 354, "modified_time": "2026-05-06T22:36:34", "source_folder": "data/inbox", "content_preview": "# General Design Critique Checklist\n\n��Ʒ���Բ��嵥�������Ƿ���ȷĿ���û����Ƿ�˵������ʹ�㣬�Ƿ��е���֤�ݣ��Ƿ������ƻ��ᣬ�Ƿ�չʾ�����������Ƿ������Ч����ǰ�������Ӧ������ÿ����Ŀ������Ҫһҳ˵����Ϊʲô������ơ����������ֻ�ܿ������ͼ��", "content_full_path": "index/materials_content/mat-64831effa44c.txt", "parse_status": "parsed", "parse_error": "", "word_count": 98, "material_type": "draft", "portfolio_stage": "presentation", "project_guess": "general", "tags": ["api-smoke", "edited"], "material_score": 77, "reason": "�˹��༭���û��� DesignMate v0.4 ��ȷ�ϻ�����˷��ࡣ", "notes": "api smoke test note", "review_status": "confirmed", "file_hash": "577fca56ffc8a136247697a64282c66606fdcad5", "first_seen_at": "2026-05-06T22:36:59", "last_seen_at": "2026-05-07T15:27:23", "scan_batch_id": "scan-99a305f72ebe", "is_duplicate": false, "image_preview_path": "", "image_width": 0, "image_height": 0, "image_note": "", "created_at": "2026-05-06T22:36:59", "updated_at": "2026-05-07T15:27:23"}`
- PASS `batch patch material`: `{"count": 2}`
- PASS `batch patch verified`: `{"ids": ["mat-76512a8f2d58", "mat-d4580285d017"]}`
- PASS `ask designmate fallback`: `{"mode": "rule_based"}`
- PASS `ask designmate answer`: `{"answer_length": 1347}`
- PASS `rebuild`: `{"fts5_available": true}`
Running scan_library.py...
Running classify_materials.py...
Running generate_report.py...
Running build_static_site.py...

DesignMate v0.6 run completed.
- SQLite DB: data/designmate.db
- Total materials: 36
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

DesignMate v0.6 run completed.
- SQLite DB: data/designmate.db
- Total materials: 36
- FTS5 available: True
Please review:
- reports/latest_report.md
- index/materials_index.md
- index/classification_report.md
- frontend/index.html
- review/latest_next_actions.md
Generated frontend data with 36 materials.
Open E:\GitHub\codex-desktop\DesignMate\frontend\index.html in a browser.
Generated frontend data with 36 materials.
Open E:\GitHub\codex-desktop\DesignMate\frontend\index.html in a browser.
Generated portfolio draft for reader-design/overview: drafts\latest_portfolio_page_draft.md
Also wrote page-specific draft: drafts/reader-design_overview_draft.md
Exported 13 portfolio case files to portfolio_export.
Open portfolio_export/designmate_case.html for a quick case overview.

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
test_batch_update_ignores_illegal_field (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_batch_update_ignores_illegal_field) ... ok
test_batch_update_project (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_batch_update_project) ... ok
test_batch_update_rejects_empty_ids (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_batch_update_rejects_empty_ids) ... ok
test_batch_update_tags (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_batch_update_tags) ... ok
test_batch_update_type (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_batch_update_type) ... ok
test_frontend_data_contains_import_stats (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_frontend_data_contains_import_stats) ... ok
test_frontend_has_batch_toolbar (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_frontend_has_batch_toolbar) ... ok
test_frontend_has_import_guide (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_frontend_has_import_guide) ... ok
test_portfolio_draft_generation_info_center (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_portfolio_draft_generation_info_center) ... ok
test_portfolio_draft_generation_reader (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_portfolio_draft_generation_reader) ... ok
test_portfolio_draft_script (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_portfolio_draft_script) ... ok
test_report_contains_import_guidance (test_v05_batch_and_drafts.V05BatchAndDraftTests.test_report_contains_import_guidance) ... ok
test_ai_service_fallback_without_key (test_v06_ai_import_export.V06AiImportExportTests.test_ai_service_fallback_without_key) ... ok
test_ai_service_rule_based_summary (test_v06_ai_import_export.V06AiImportExportTests.test_ai_service_rule_based_summary) ... ok
test_ask_designmate_empty_context (test_v06_ai_import_export.V06AiImportExportTests.test_ask_designmate_empty_context) ... ok
test_ask_designmate_returns_answer (test_v06_ai_import_export.V06AiImportExportTests.test_ask_designmate_returns_answer) ... ok
test_export_portfolio_case_outputs_html (test_v06_ai_import_export.V06AiImportExportTests.test_export_portfolio_case_outputs_html) ... ok
test_export_script_runs (test_v06_ai_import_export.V06AiImportExportTests.test_export_script_runs) ... ok
test_image_metadata_fields_exist (test_v06_ai_import_export.V06AiImportExportTests.test_image_metadata_fields_exist) ... ok
test_image_notes_can_save (test_v06_ai_import_export.V06AiImportExportTests.test_image_notes_can_save) ... ok
test_material_has_file_hash (test_v06_ai_import_export.V06AiImportExportTests.test_material_has_file_hash) ... ok
test_no_api_key_does_not_crash (test_v06_ai_import_export.V06AiImportExportTests.test_no_api_key_does_not_crash) ... ok
test_portfolio_writer_info_concept_page (test_v06_ai_import_export.V06AiImportExportTests.test_portfolio_writer_info_concept_page) ... ok
test_portfolio_writer_pain_points_page (test_v06_ai_import_export.V06AiImportExportTests.test_portfolio_writer_pain_points_page) ... ok
test_portfolio_writer_research_page (test_v06_ai_import_export.V06AiImportExportTests.test_portfolio_writer_research_page) ... ok
test_portfolio_writer_unknown_project_does_not_crash (test_v06_ai_import_export.V06AiImportExportTests.test_portfolio_writer_unknown_project_does_not_crash) ... ok
test_project_filtered_ask_context (test_v06_ai_import_export.V06AiImportExportTests.test_project_filtered_ask_context) ... ok
test_prompt_service_returns_prompt (test_v06_ai_import_export.V06AiImportExportTests.test_prompt_service_returns_prompt) ... ok
test_repeated_scan_does_not_duplicate_count (test_v06_ai_import_export.V06AiImportExportTests.test_repeated_scan_does_not_duplicate_count) ... ok
test_scan_batch_record_exists (test_v06_ai_import_export.V06AiImportExportTests.test_scan_batch_record_exists) ... ok

----------------------------------------------------------------------
Ran 66 tests in 7.774s

OK

```

Final status: PASS
