import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import database, portfolio_writer, report_service


class V05BatchAndDraftTests(unittest.TestCase):
    def test_batch_update_project(self):
        items = database.list_materials(limit=2)
        updated = database.update_materials_batch([item.id for item in items], {"project_guess": "general"})
        self.assertEqual(len(updated), len(items))
        self.assertTrue(all(item.project_guess == "general" for item in updated))

    def test_batch_update_type(self):
        items = database.list_materials(limit=2)
        updated = database.update_materials_batch([item.id for item in items], {"material_type": "feedback"})
        self.assertTrue(all(item.material_type == "feedback" for item in updated))

    def test_batch_update_tags(self):
        items = database.list_materials(limit=2)
        updated = database.update_materials_batch([item.id for item in items], {"tags": "batch, v05"})
        self.assertTrue(all("batch" in item.tags for item in updated))

    def test_batch_update_rejects_empty_ids(self):
        with self.assertRaises(ValueError):
            database.update_materials_batch([], {"project_guess": "general"})

    def test_batch_update_ignores_illegal_field(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_materials_batch([item.id], {"path": "bad", "notes": "legal note"})[0]
        self.assertNotEqual(updated.path, "bad")
        self.assertEqual(updated.notes, "legal note")

    def test_portfolio_draft_generation_reader(self):
        path = portfolio_writer.generate_portfolio_draft("reader-design")
        text = path.read_text(encoding="utf-8")
        self.assertIn("作品集页面草稿", text)
        self.assertIn("页面目标", text)

    def test_portfolio_draft_generation_info_center(self):
        path = portfolio_writer.generate_portfolio_draft("info-center")
        text = path.read_text(encoding="utf-8")
        self.assertIn("图信中心", text)

    def test_portfolio_draft_script(self):
        result = subprocess.run([sys.executable, str(ROOT / "scripts" / "generate_portfolio_draft.py"), "--project", "reader-design"], cwd=ROOT)
        self.assertEqual(result.returncode, 0)

    def test_report_contains_import_guidance(self):
        paths = report_service.generate_reports()
        text = paths["latest_report"].read_text(encoding="utf-8")
        self.assertIn("新增资料提示", text)
        self.assertIn("未解析资料提示", text)

    def test_frontend_data_contains_import_stats(self):
        subprocess.run([sys.executable, str(ROOT / "scripts" / "build_static_site.py")], cwd=ROOT, check=True)
        payload = json.loads((ROOT / "frontend" / "data" / "materials.json").read_text(encoding="utf-8"))
        self.assertIn("import_stats", payload)
        self.assertIn("inbox_file_count", payload["import_stats"])

    def test_frontend_has_batch_toolbar(self):
        html = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
        self.assertIn("batchToolbar", html)

    def test_frontend_has_import_guide(self):
        html = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
        self.assertIn("importGuide", html)


if __name__ == "__main__":
    unittest.main()
