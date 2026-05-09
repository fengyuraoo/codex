from __future__ import annotations

import unittest
from pathlib import Path

from backend.ai_service import ask_designmate
from backend.link_capture_service import capture_link


ROOT = Path(__file__).resolve().parents[1]


class BilingualWorkflowTests(unittest.TestCase):
    def test_translation_dictionary_has_zh_and_en(self) -> None:
        app_js = (ROOT / "frontend" / "app.js").read_text(encoding="utf-8")
        self.assertIn("const translations", app_js)
        self.assertIn("zh:", app_js)
        self.assertIn("en:", app_js)

    def test_navigation_keys_have_bilingual_copy(self) -> None:
        app_js = (ROOT / "frontend" / "app.js").read_text(encoding="utf-8")
        for key in ["navDashboard", "navSearch", "navImage", "navLink", "navAsk", "navReport"]:
            self.assertIn(key, app_js)
        self.assertIn("搜索中心", app_js)
        self.assertIn("Search Hub", app_js)

    def test_ask_fallback_supports_chinese_sections(self) -> None:
        result = ask_designmate("哪些资料适合放 moodboard？", [], language="en")
        self.assertIn("摘要", result["answer_sections"])
        self.assertIn("相关资料", result["answer_sections"])
        self.assertIn("下一步建议", result["answer_sections"])

    def test_ask_fallback_supports_english_sections(self) -> None:
        result = ask_designmate("Which materials work for moodboard?", [], language="en")
        self.assertIn("Summary", result["answer_sections"])
        self.assertIn("Relevant Materials", result["answer_sections"])
        self.assertIn("Next Action", result["answer_sections"])

    def test_link_capture_without_language_field(self) -> None:
        result = capture_link(
            "https://www.behance.net/gallery/bilingual-test",
            user_note="bilingual workflow reference",
            project="general",
            design_stage="reference",
            fetch_metadata=False,
        )
        self.assertTrue(result.ok)
        self.assertEqual(result.platform, "behance")


if __name__ == "__main__":
    unittest.main()
