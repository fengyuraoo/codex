import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class StaticSiteTests(unittest.TestCase):
    def test_static_site_files_exist(self):
        result = subprocess.run([sys.executable, str(ROOT / "scripts" / "build_static_site.py")], cwd=ROOT)
        self.assertEqual(result.returncode, 0)
        self.assertTrue((ROOT / "frontend" / "index.html").exists())
        self.assertTrue((ROOT / "frontend" / "style.css").exists())
        self.assertTrue((ROOT / "frontend" / "app.js").exists())
        self.assertTrue((ROOT / "frontend" / "data" / "materials.json").exists())

    def test_frontend_materials_json_exists(self):
        self.assertTrue((ROOT / "frontend" / "data" / "materials.json").exists())

    def test_app_data_js_exists(self):
        self.assertTrue((ROOT / "frontend" / "data" / "app_data.js").exists())


if __name__ == "__main__":
    unittest.main()
