from __future__ import annotations

import unittest

from backend import database
from backend.search_engine import search
from backend.upload_service import UploadFileInput, safe_filename, upload_materials


class FileUploadTests(unittest.TestCase):
    def test_upload_txt_file_success(self) -> None:
        result = upload_materials(
            [UploadFileInput("v075-upload-note.txt", b"v075-upload-token text research feedback")],
            project="general",
            design_stage="research",
            use_case="Research",
            user_note="uploaded through unit test",
        )
        self.assertTrue(result["materials_created"])
        material = result["materials_created"][0]
        self.assertEqual(material["source_mode"], "user")
        self.assertIn("data/uploads/", material["path"])

    def test_upload_md_file_success(self) -> None:
        result = upload_materials([UploadFileInput("v075-upload-research.md", b"# Upload Research\n\nunique-v075-md")])
        self.assertTrue(result["materials_created"])
        self.assertEqual(result["materials_created"][0]["extension"], "md")

    def test_upload_image_creates_material(self) -> None:
        result = upload_materials([UploadFileInput("v075-sketch.png", b"not-real-image-but-recorded")], use_case="Design Process")
        self.assertTrue(result["materials_created"])
        material = result["materials_created"][0]
        self.assertEqual(material["extension"], "png")
        self.assertEqual(material["source_mode"], "user")

    def test_unsupported_file_type_returns_error(self) -> None:
        result = upload_materials([UploadFileInput("v075-malware.exe", b"bad")])
        self.assertFalse(result["ok"])
        self.assertTrue(result["errors"])
        self.assertIn("Unsupported file type", result["errors"][0]["message"])

    def test_path_traversal_is_blocked(self) -> None:
        with self.assertRaises(ValueError):
            safe_filename("../evil.txt")

    def test_duplicate_filename_does_not_overwrite(self) -> None:
        first = upload_materials([UploadFileInput("v075-duplicate.txt", b"first duplicate upload")])
        second = upload_materials([UploadFileInput("v075-duplicate.txt", b"second duplicate upload")])
        self.assertTrue(first["materials_created"])
        self.assertTrue(second["materials_created"])
        self.assertNotEqual(first["materials_created"][0]["path"], second["materials_created"][0]["path"])

    def test_uploaded_material_source_mode_user(self) -> None:
        result = upload_materials([UploadFileInput("v075-source-mode.txt", b"source mode upload")])
        material = database.get_material(result["materials_created"][0]["id"])
        self.assertIsNotNone(material)
        self.assertEqual(material.source_mode, "user")

    def test_uploaded_material_searchable_by_filename(self) -> None:
        token = "v075searchabletoken"
        upload_materials([UploadFileInput("v075-searchable-file.txt", f"{token} searchable upload body".encode("utf-8"))])
        rows = search(token, limit=10)
        self.assertGreaterEqual(len(rows), 1)


if __name__ == "__main__":
    unittest.main()
