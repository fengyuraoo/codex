import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import ai_service, database, portfolio_writer
from backend.export_service import export_portfolio_case
from backend.material_parser import parse_material


class V061PolishTests(unittest.TestCase):
    def test_source_mode_demo(self):
        path = ROOT / "data" / "examples" / "design_student_notes.md"
        record = parse_material(path, ROOT / "data" / "examples", "test")
        self.assertEqual(record.source_mode, "demo")

    def test_source_mode_user(self):
        path = ROOT / "data" / "inbox" / "design_student_notes.md"
        record = parse_material(path, ROOT / "data" / "inbox", "test")
        self.assertEqual(record.source_mode, "user")

    def test_source_mode_filter_user(self):
        database.init_db()
        items = database.list_materials(source_mode="user", limit=5)
        self.assertTrue(all(item.source_mode == "user" for item in items))

    def test_import_real_materials_doc_exists(self):
        self.assertTrue((ROOT / "docs" / "import_real_materials.md").exists())

    def test_frontend_showcase_mode_hook_exists(self):
        text = (ROOT / "frontend" / "app.js").read_text(encoding="utf-8")
        self.assertIn("showcase", text)

    def test_export_a3_content(self):
        export_portfolio_case()
        self.assertTrue((ROOT / "portfolio_export" / "a3_portfolio_page_content.md").exists())

    def test_export_two_page_story(self):
        export_portfolio_case()
        self.assertTrue((ROOT / "portfolio_export" / "two_page_portfolio_story.md").exists())

    def test_export_demo_script(self):
        export_portfolio_case()
        self.assertTrue((ROOT / "portfolio_export" / "demo_script.md").exists())

    def test_export_screenshot_checklist(self):
        export_portfolio_case()
        self.assertTrue((ROOT / "portfolio_export" / "screenshot_checklist.md").exists())

    def test_draft_index_generated(self):
        portfolio_writer.generate_portfolio_draft("reader-design", "overview")
        self.assertTrue((ROOT / "drafts" / "draft_index.md").exists())

    def test_ask_answer_sections_exist(self):
        item = database.list_materials(limit=1)[0]
        result = ai_service.ask_designmate("这个项目最大问题是什么？", [item])
        self.assertIn("answer_sections", result)

    def test_ask_confidence_exists(self):
        item = database.list_materials(limit=1)[0]
        result = ai_service.ask_designmate("哪些资料能证明用户痛点？", [item])
        self.assertIn("confidence", result)

    def test_ask_common_question_pages(self):
        items = database.list_materials(project="reader-design", limit=5)
        result = ai_service.ask_designmate("reader-design 适合生成哪几页作品集？", items)
        self.assertIn("背景", result["answer"])

    def test_frontend_data_has_source_stats(self):
        subprocess.run([sys.executable, str(ROOT / "scripts" / "build_static_site.py")], cwd=ROOT, check=True)
        payload = json.loads((ROOT / "frontend" / "data" / "materials.json").read_text(encoding="utf-8"))
        self.assertIn("by_source", payload["stats"])

    def test_reports_data_exists(self):
        self.assertTrue((ROOT / "frontend" / "data" / "latest_report.txt").exists())

    def test_quality_gate_v061_report_path(self):
        text = (ROOT / "scripts" / "quality_gate.py").read_text(encoding="utf-8")
        self.assertIn("quality_gate_v061.md", text)


if __name__ == "__main__":
    unittest.main()
