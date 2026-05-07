from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database
from backend.material_parser import scan_library
from backend.paths import INDEX_DIR
from backend.utils import atomic_write_json, atomic_write_text


def write_index(records) -> None:
    payload = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "count": len(records),
        "materials": [record.to_dict() for record in records],
    }
    atomic_write_json(INDEX_DIR / "materials_index.json", payload)

    lines = ["# Materials Index", "", f"Generated at: {payload['generated_at']}", f"Total materials: {len(records)}", ""]
    for record in sorted(records, key=lambda item: item.material_score, reverse=True):
        preview = record.content_preview.replace("\n", " ")[:260]
        lines.extend(
            [
                f"## {record.id} {record.filename}",
                "",
                f"- Path: `{record.path}`",
                f"- Extension: `{record.extension}`",
                f"- Source: `{record.source_folder}`",
                f"- Parse status: `{record.parse_status}`",
                f"- Parse error: {record.parse_error or 'None'}",
                f"- Content full path: `{record.content_full_path or 'None'}`",
                f"- Word count: {record.word_count}",
                f"- Material type: `{record.material_type}`",
                f"- Portfolio stage: `{record.portfolio_stage}`",
                f"- Project guess: `{record.project_guess}`",
                f"- Tags: {', '.join(record.tags) or 'None'}",
                f"- Material score: {record.material_score}",
                f"- Reason: {record.reason or 'None'}",
                f"- Preview: {preview or 'No preview.'}",
                "",
            ]
        )
    atomic_write_text(INDEX_DIR / "materials_index.md", "\n".join(lines))


def main() -> None:
    database.init_db()
    records = scan_library()
    for record in records:
        database.upsert_material(record)
    database.rebuild_fts_index()
    write_index(records)
    print(f"Scanned and indexed {len(records)} materials.")


if __name__ == "__main__":
    main()

