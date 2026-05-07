import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import database, search_engine


class ApiLikeTests(unittest.TestCase):
    def test_api_health_equivalent(self):
        self.assertTrue(database.init_db())

    def test_api_stats_equivalent(self):
        self.assertGreater(database.get_stats()["total_materials"], 0)

    def test_api_search_equivalent(self):
        self.assertGreater(len(search_engine.search("低干扰")), 0)

    def test_api_get_material_equivalent(self):
        item = database.list_materials(limit=1)[0]
        self.assertIsNotNone(database.get_material(item.id))

    def test_api_patch_material_equivalent(self):
        item = database.list_materials(limit=1)[0]
        updated = database.update_material(item.id, {"notes": "api equivalent patch", "material_score": 76})
        self.assertEqual(updated.notes, "api equivalent patch")

    def test_api_smoke_script(self):
        result = subprocess.run([sys.executable, str(ROOT / "scripts" / "api_smoke_test.py")], cwd=ROOT)
        self.assertEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
