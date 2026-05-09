from __future__ import annotations

import unittest
from pathlib import Path

from backend import database
from backend.note_capture_service import capture_note
from backend.search_engine import search


ROOT = Path(__file__).resolve().parents[1]


class AddMaterialsTests(unittest.TestCase):
    def test_add_materials_navigation_and_page_exist(self) -> None:
        html = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
        self.assertIn('data-view="add"', html)
        self.assertIn("addView", html)
        self.assertIn("Upload Files", html)
        self.assertIn("Paste Note", html)

    def test_add_materials_i18n_keys_exist(self) -> None:
        app_js = (ROOT / "frontend" / "app.js").read_text(encoding="utf-8")
        for key in ["navAdd", "addMaterialsIntro", "uploadFallback", "pasteNote", "importFolder"]:
            self.assertIn(key, app_js)

    def test_capture_note_saves_searchable_material(self) -> None:
        marker = "add-materials-unit-search-token"
        result = capture_note(
            title="Add Materials unit note",
            content=f"{marker} 用户痛点来自课堂反馈，适合放进作品集调研页。",
            project="reader-design",
            design_stage="research",
            material_type="research",
            portfolio_placement="User Research",
        )
        self.assertTrue(result.ok)
        material = database.get_material(result.material_id)
        self.assertIsNotNone(material)
        self.assertEqual(material.source_mode, "user")
        self.assertEqual(material.source_type, "note")
        rows = search(marker, project="reader-design", limit=5)
        self.assertGreaterEqual(len(rows), 1)


if __name__ == "__main__":
    unittest.main()
