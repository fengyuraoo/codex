import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend import report_service


class ReportTests(unittest.TestCase):
    def test_report_generation_succeeds(self):
        paths = report_service.generate_reports()
        self.assertTrue(paths["latest_report"].exists())
        self.assertIn("DesignMate 本地资料报告", paths["latest_report"].read_text(encoding="utf-8"))

    def test_latest_report_file_exists(self):
        self.assertTrue((ROOT / "reports" / "latest_report.md").exists())


if __name__ == "__main__":
    unittest.main()
