import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class PipelineTests(unittest.TestCase):
    def test_run_designmate_succeeds(self):
        result = subprocess.run([sys.executable, str(ROOT / "scripts" / "run_designmate.py")], cwd=ROOT)
        self.assertEqual(result.returncode, 0)
        self.assertTrue((ROOT / "data" / "designmate.db").exists())
        self.assertTrue((ROOT / "reports" / "latest_report.md").exists())


if __name__ == "__main__":
    unittest.main()

