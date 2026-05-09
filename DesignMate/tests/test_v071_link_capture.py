from __future__ import annotations

import unittest

from backend import database
from backend.link_capture_service import capture_link, detect_platform, normalize_url


class LinkCaptureTests(unittest.TestCase):
    def test_generic_webpage_platform(self) -> None:
        self.assertEqual(detect_platform(normalize_url("https://example.com/design-case")), "generic webpage")

    def test_xiaohongshu_platform(self) -> None:
        self.assertEqual(detect_platform(normalize_url("https://www.xiaohongshu.com/explore/abc")), "xiaohongshu")

    def test_douyin_platform(self) -> None:
        self.assertEqual(detect_platform(normalize_url("https://v.douyin.com/abc")), "douyin")

    def test_bilibili_platform(self) -> None:
        self.assertEqual(detect_platform(normalize_url("https://www.bilibili.com/video/BV1xx")), "bilibili")

    def test_generic_webpage_fallback_capture(self) -> None:
        result = capture_link(
            "https://example.com/design-reference",
            user_note="example reference for moodboard",
            project="general",
            design_stage="reference",
            fetch_metadata=False,
        )
        self.assertTrue(result.ok)
        self.assertEqual(result.platform, "generic webpage")
        self.assertTrue(result.material_id)
        material = database.get_material(result.material_id)
        self.assertIsNotNone(material)
        self.assertEqual(material.source_type, "webpage")

    def test_short_video_fallback_saved(self) -> None:
        result = capture_link(
            "https://www.douyin.com/video/123",
            user_note="short video reference for interaction motion",
            project="reader-design",
            design_stage="inspiration",
            fetch_metadata=True,
        )
        self.assertTrue(result.ok)
        self.assertEqual(result.platform, "douyin")
        self.assertEqual(result.source_type, "short_video")
        self.assertIn("limit automatic extraction", result.message)

    def test_invalid_url_friendly_error(self) -> None:
        result = capture_link("not a valid url with spaces")
        self.assertFalse(result.ok)
        self.assertFalse(result.fallback_saved)
        self.assertIn("valid", result.message.lower())


if __name__ == "__main__":
    unittest.main()
