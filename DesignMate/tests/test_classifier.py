import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.classifier import classify
from backend.models import MaterialRecord


def record(filename, text):
    return MaterialRecord(
        id="mat-test",
        filename=filename,
        path=f"data/inbox/{filename}",
        extension="md",
        size=len(text),
        modified_time="2026-05-06T00:00:00",
        source_folder="data/inbox",
        content_preview=text,
        parse_status="parsed",
        word_count=len(text),
    )


class ClassifierTests(unittest.TestCase):
    def test_classifies_sketch(self):
        result = classify(record("reader-design-sketch.md", "阅读器 草图 手绘 形态推敲"), "阅读器 草图 手绘")
        self.assertEqual(result.material_type, "sketch")

    def test_classifies_feedback(self):
        result = classify(record("info-center-feedback.md", "老师反馈 修改意见 空间动线"), "老师反馈 修改意见")
        self.assertEqual(result.material_type, "feedback")

    def test_classifies_research(self):
        result = classify(record("research.md", "用户访谈 问卷 调研"), "用户访谈 问卷 调研")
        self.assertEqual(result.material_type, "research")

    def test_project_reader(self):
        result = classify(record("reader-design-note.md", "阅读器 低干扰 阅读"), "阅读器 低干扰")
        self.assertEqual(result.project_guess, "reader-design")

    def test_project_info_center(self):
        result = classify(record("info-center-note.md", "图信中心 空间动线 功能分区"), "图信中心 空间")
        self.assertEqual(result.project_guess, "info-center")


if __name__ == "__main__":
    unittest.main()

