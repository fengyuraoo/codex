import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import database, search_engine


class SearchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        subprocess.run([sys.executable, str(ROOT / "scripts" / "run_designmate.py")], cwd=ROOT, check=True)

    def test_low_interruption_has_results(self):
        self.assertGreater(len(search_engine.search("低干扰")), 0)

    def test_info_center_has_results(self):
        self.assertGreater(len(search_engine.search("图信中心")), 0)

    def test_missing_word_does_not_crash(self):
        self.assertEqual(len(search_engine.search("不存在的资料关键词")), 0)

    def test_project_filter_effective(self):
        results = search_engine.search("阅读", project="reader-design")
        self.assertTrue(results)
        self.assertTrue(all(item["project_guess"] == "reader-design" for item in results))

    def test_type_filter_effective(self):
        results = search_engine.search("修改", material_type="feedback")
        self.assertTrue(results)
        self.assertTrue(all(item["material_type"] == "feedback" for item in results))

    def test_stage_filter_effective(self):
        results = search_engine.search("调研", stage="research")
        self.assertTrue(results)
        self.assertTrue(all(item["portfolio_stage"] == "research" for item in results))

    def test_synonym_search(self):
        results = search_engine.search("困扰")
        self.assertTrue(results)

    def test_portfolio_page_search(self):
        results = search_engine.search("作品集页面")
        self.assertTrue(results)


if __name__ == "__main__":
    unittest.main()
