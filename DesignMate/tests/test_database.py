import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import database
from backend.models import MaterialRecord


class DatabaseTests(unittest.TestCase):
    def test_database_initializes_and_upserts(self):
        db_path = ROOT / "data" / "test_designmate_unit.db"
        if db_path.exists():
            try:
                db_path.unlink()
            except PermissionError:
                pass
        database.init_db(db_path)
        record = MaterialRecord(
            id="mat-test",
            filename="reader-design-test.md",
            path="data/inbox/reader-design-test.md",
            extension="md",
            size=10,
            modified_time="2026-05-06T00:00:00",
            source_folder="data/inbox",
            content_preview="阅读器 低干扰 用户痛点",
            material_type="research",
            portfolio_stage="research",
            project_guess="reader-design",
            tags=["research"],
            material_score=80,
        )
        database.upsert_material(record, db_path)
        loaded = database.get_material("mat-test", db_path)
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.project_guess, "reader-design")

    def test_stats_available(self):
        database.init_db()
        stats = database.get_stats()
        self.assertIn("total_materials", stats)

    def test_update_material_project(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material(item.id, {"project_guess": "general"})
        self.assertEqual(updated.project_guess, "general")

    def test_update_material_type(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material(item.id, {"material_type": "draft"})
        self.assertEqual(updated.material_type, "draft")

    def test_update_material_stage(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material(item.id, {"portfolio_stage": "presentation"})
        self.assertEqual(updated.portfolio_stage, "presentation")

    def test_update_tags(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material_tags(item.id, ["unit", "tag"])
        self.assertIn("unit", updated.tags)

    def test_update_notes(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material_notes(item.id, "unit note")
        self.assertEqual(updated.notes, "unit note")

    def test_empty_database_does_not_crash(self):
        db_path = ROOT / "data" / "empty_unit.db"
        database.init_db(db_path)
        self.assertEqual(database.list_materials(db_path), [])


if __name__ == "__main__":
    unittest.main()
