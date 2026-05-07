from __future__ import annotations

import sys
from collections import Counter
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database
from backend.classifier import classify, needs_confirmation
from backend.paths import INDEX_DIR
from backend.utils import atomic_write_json, atomic_write_text


def write_reports(records) -> None:
    payload = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "count": len(records),
        "classifications": [record.to_dict() | {"needs_confirmation": needs_confirmation(record)} for record in records],
    }
    atomic_write_json(INDEX_DIR / "classification_report.json", payload)

    type_counts = Counter(record.material_type for record in records)
    stage_counts = Counter(record.portfolio_stage for record in records)
    project_counts = Counter(record.project_guess for record in records)
    lines = ["# Classification Report", "", f"Generated at: {payload['generated_at']}", f"Total materials: {len(records)}", ""]
    for title, counts in [("Material Type Stats", type_counts), ("Portfolio Stage Stats", stage_counts), ("Project Stats", project_counts)]:
        lines.extend([f"## {title}", ""])
        for key, value in sorted(counts.items()):
            lines.append(f"- {key}: {value}")
        lines.append("")
    lines.append("## Details")
    lines.append("")
    for record in sorted(records, key=lambda item: item.material_score, reverse=True):
        lines.extend(
            [
                f"### {record.id} {record.filename}",
                "",
                f"- Path: `{record.path}`",
                f"- Material type: `{record.material_type}`",
                f"- Portfolio stage: `{record.portfolio_stage}`",
                f"- Project guess: `{record.project_guess}`",
                f"- Score: {record.material_score}",
                f"- Tags: {', '.join(record.tags) or 'None'}",
                f"- Needs confirmation: {needs_confirmation(record)}",
                f"- Reason: {record.reason}",
                "",
            ]
        )
    atomic_write_text(INDEX_DIR / "classification_report.md", "\n".join(lines))

    dash = ["# Materials Dashboard", "", f"Generated at: {payload['generated_at']}", "", f"- 总资料数：{len(records)}", ""]
    for title, counts in [("各类型数量", type_counts), ("各项目数量", project_counts), ("各阶段数量", stage_counts)]:
        dash.extend([f"## {title}", "", "| 名称 | 数量 |", "| --- | ---: |"])
        for key, value in sorted(counts.items()):
            dash.append(f"| {key} | {value} |")
        dash.append("")
    dash.extend(["## 高价值资料 Top 10", ""])
    for record in sorted(records, key=lambda item: item.material_score, reverse=True)[:10]:
        dash.append(f"- `{record.filename}`：{record.material_score} 分，{record.material_type} / {record.project_guess} / {record.portfolio_stage}")
    dash.extend(["", "## 需要用户确认的资料", ""])
    confirm = [record for record in records if needs_confirmation(record)]
    if confirm:
        for record in confirm[:20]:
            dash.append(f"- `{record.filename}`：{record.reason or '需要补充上下文'}")
    else:
        dash.append("- 当前资料均有基础分类。")
    atomic_write_text(INDEX_DIR / "materials_dashboard.md", "\n".join(dash))


def main() -> None:
    database.init_db()
    records = []
    for record in database.list_materials(limit=None):
        if record.review_status == "confirmed":
            records.append(record)
            continue
        full = database.read_full_content(record)
        classified = classify(record, full)
        database.update_material_classification(classified)
        records.append(classified)
    database.rebuild_fts_index()
    write_reports(records)
    print(f"Reclassified {len(records)} materials.")
    print("Generated index/classification_report.md and index/materials_dashboard.md.")


if __name__ == "__main__":
    main()
