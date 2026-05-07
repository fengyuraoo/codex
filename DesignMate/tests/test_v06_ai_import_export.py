import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import ai_service, database, portfolio_writer, prompt_service, search_engine
from backend.export_service import export_portfolio_case
from backend.material_parser import parse_material, scan_library


class V06AiImportExportTests(unittest.TestCase):
    def test_ai_service_rule_based_summary(self):
        item = database.list_materials(limit=1)[0]
        result = ai_service.summarize_material(item, provider="rule_based")
        self.assertIn("summary", result)
        self.assertIn(result["mode"], {"rule_based", "rule_based_fallback"})

    def test_ai_service_fallback_without_key(self):
        item = database.list_materials(limit=1)[0]
        result = ai_service.summarize_material(item, provider="openai")
        self.assertEqual(result["mode"], "rule_based_fallback")

    def test_prompt_service_returns_prompt(self):
        self.assertIn("作品集", prompt_service.get_prompt("ask_designmate"))

    def test_ask_designmate_returns_answer(self):
        context = [database.get_material(row["id"]) for row in search_engine.search("用户痛点", limit=5)]
        context = [item for item in context if item]
        result = ai_service.ask_designmate("这个项目最大问题是什么？", context)
        self.assertTrue(result["answer"])

    def test_ask_designmate_empty_context(self):
        result = ai_service.ask_designmate("没有资料时会怎样？", [])
        self.assertTrue(result["answer"])

    def test_project_filtered_ask_context(self):
        rows = search_engine.search("阅读", project="reader-design", limit=5)
        self.assertTrue(all(row["project_guess"] == "reader-design" for row in rows))

    def test_portfolio_writer_pain_points_page(self):
        path = portfolio_writer.generate_portfolio_draft("reader-design", "pain-points")
        text = path.read_text(encoding="utf-8")
        self.assertIn("AI 自检", text)
        self.assertTrue((ROOT / "drafts" / "reader-design_pain-points_draft.md").exists())

    def test_portfolio_writer_research_page(self):
        path = portfolio_writer.generate_portfolio_draft("reader-design", "research")
        self.assertIn("调研", path.read_text(encoding="utf-8"))

    def test_portfolio_writer_info_concept_page(self):
        path = portfolio_writer.generate_portfolio_draft("info-center", "concept")
        self.assertIn("概念", path.read_text(encoding="utf-8"))

    def test_portfolio_writer_unknown_project_does_not_crash(self):
        text = portfolio_writer.build_portfolio_draft("unknown", "overview")
        self.assertIn("页面标题", text)

    def test_export_portfolio_case_outputs_html(self):
        written = export_portfolio_case()
        self.assertTrue((ROOT / "portfolio_export" / "designmate_case.html").exists())
        self.assertIn("demo_script.md", written)

    def test_export_script_runs(self):
        result = subprocess.run([sys.executable, str(ROOT / "scripts" / "export_portfolio_case.py")], cwd=ROOT)
        self.assertEqual(result.returncode, 0)

    def test_scan_batch_record_exists(self):
        scan_library()
        stats = database.get_import_stats()
        self.assertTrue(stats.get("latest_batch"))

    def test_repeated_scan_does_not_duplicate_count(self):
        database.init_db()
        before = database.get_stats()["total_materials"]
        records = scan_library()
        for record in records:
            database.upsert_material(record)
        after = database.get_stats()["total_materials"]
        self.assertEqual(before, after)

    def test_material_has_file_hash(self):
        item = database.list_materials(limit=1)[0]
        self.assertTrue(hasattr(item, "file_hash"))

    def test_image_metadata_fields_exist(self):
        sample = ROOT / "data" / "examples" / "v06-fake-image.png"
        sample.write_bytes(b"not a real png")
        record = parse_material(sample, ROOT / "data" / "examples", "test-batch")
        self.assertEqual(record.extension, "png")
        self.assertTrue(hasattr(record, "image_note"))

    def test_image_notes_can_save(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material_notes(item.id, "图片说明或资料备注可被搜索")
        self.assertIn("说明", updated.notes)

    def test_no_api_key_does_not_crash(self):
        result = ai_service.critique_project("reader-design", database.list_materials(project="reader-design", limit=5), provider="deepseek")
        self.assertEqual(result["mode"], "rule_based_fallback")


if __name__ == "__main__":
    unittest.main()
