from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8", errors="ignore")


class UploadDragUiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.index_html = read("frontend/index.html")
        cls.app_js = read("frontend/app.js")
        cls.api_server = read("backend/api_server.py")
        cls.upload_tests = read("tests/test_v075_file_upload.py")

    def test_frontend_has_drag_events(self) -> None:
        for marker in ["dragenter", "dragover", "dragleave", "drop"]:
            self.assertIn(marker, self.app_js)

    def test_frontend_prevents_default_drag_behavior(self) -> None:
        self.assertIn("preventDefault", self.app_js)
        self.assertIn("stopPropagation", self.app_js)

    def test_frontend_reads_data_transfer_files(self) -> None:
        self.assertIn("dataTransfer.files", self.app_js)

    def test_frontend_has_file_input_and_upload_action(self) -> None:
        self.assertIn("uploadFilesInput", self.index_html)
        self.assertIn("Upload to Library", self.index_html)
        self.assertIn("上传并加入资料库", self.app_js)

    def test_frontend_has_bilingual_drag_prompts(self) -> None:
        self.assertIn("Drop design materials here, or click to choose files", self.app_js)
        self.assertIn("Release to add files", self.app_js)
        self.assertIn("拖入设计资料，或点击选择文件", self.app_js)
        self.assertIn("松开即可添加文件", self.app_js)

    def test_frontend_has_upload_file_list_and_remove_action(self) -> None:
        self.assertIn("uploadFileList", self.index_html)
        self.assertIn("remove-upload-file", self.app_js)
        self.assertIn("data-upload-index", self.app_js)

    def test_upload_api_route_still_exists(self) -> None:
        self.assertIn("/api/upload-materials", self.api_server)

    def test_v075_upload_tests_still_cover_txt_and_md(self) -> None:
        self.assertIn("test_upload_txt_file_success", self.upload_tests)
        self.assertIn("test_upload_md_file_success", self.upload_tests)

    def test_v075_upload_tests_still_cover_unsupported_file(self) -> None:
        self.assertIn("test_unsupported_file_type_returns_error", self.upload_tests)


if __name__ == "__main__":
    unittest.main()
