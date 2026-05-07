from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database
from backend.paths import DRAFTS_DIR, FRONTEND_DATA_DIR, FRONTEND_DIR, REPORTS_DIR, REVIEW_DIR
from backend.utils import atomic_write_json, atomic_write_text


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def main() -> None:
    database.init_db()
    materials = [record.to_dict() for record in database.list_materials(limit=None)]
    stats = database.get_stats()
    import_stats = database.get_import_stats()
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = {"count": len(materials), "stats": stats, "import_stats": import_stats, "materials": materials}
    latest_report = read_text(REPORTS_DIR / "latest_report.md")
    need_confirm = read_text(REVIEW_DIR / "latest_need_confirm.md")
    next_actions = read_text(REVIEW_DIR / "latest_next_actions.md")
    drafts = []
    if DRAFTS_DIR.exists():
        for path in sorted(DRAFTS_DIR.glob("*_draft.md"), key=lambda item: item.stat().st_mtime, reverse=True)[:20]:
            drafts.append({"path": str(path.relative_to(ROOT)).replace("\\", "/"), "modified_time": path.stat().st_mtime})
    atomic_write_json(FRONTEND_DATA_DIR / "materials.json", payload)
    atomic_write_text(FRONTEND_DATA_DIR / "latest_report.txt", latest_report)
    atomic_write_text(FRONTEND_DATA_DIR / "latest_need_confirm.txt", need_confirm)
    atomic_write_text(FRONTEND_DATA_DIR / "latest_next_actions.txt", next_actions)
    app_data = {
        "materials": payload,
        "import_stats": import_stats,
        "latest_report": latest_report,
        "latest_need_confirm": need_confirm,
        "latest_next_actions": next_actions,
        "drafts": drafts,
    }
    atomic_write_text(
        FRONTEND_DATA_DIR / "app_data.js",
        "window.DESIGNMATE_DATA = " + json.dumps(app_data, ensure_ascii=False, indent=2) + ";\n",
    )
    print(f"Generated frontend data with {len(materials)} materials.")
    print(f"Open {FRONTEND_DIR / 'index.html'} in a browser.")


if __name__ == "__main__":
    main()
