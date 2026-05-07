import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.material_parser import parse_file_text, parse_material, scan_library


class ParserTests(unittest.TestCase):
    def test_scan_inbox_succeeds(self):
        records = scan_library()
        self.assertGreaterEqual(len(records), 30)

    def test_md_text_reading_succeeds(self):
        path = ROOT / "data" / "inbox" / "reader-design-low-interruption-reading.md"
        text, status, error = parse_file_text(path)
        self.assertEqual(status, "parsed")
        self.assertIn("低干扰", text)

    def test_image_without_real_image_does_not_crash(self):
        with tempfile.TemporaryDirectory() as tmp:
            image_path = Path(tmp) / "fake.png"
            image_path.write_text("not a real image", encoding="utf-8")
            text, status, error = parse_file_text(image_path)
            self.assertIn(status, {"parse_failed", "image_metadata_unavailable", "metadata_only"})


if __name__ == "__main__":
    unittest.main()

