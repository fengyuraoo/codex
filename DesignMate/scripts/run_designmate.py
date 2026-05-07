from __future__ import annotations

import subprocess
import sys
import traceback
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database
from backend.paths import REPORTS_DIR


SCRIPTS = [
    "scan_library.py",
    "classify_materials.py",
    "generate_report.py",
    "build_static_site.py",
]


def append_dev_log(message: str) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    with (REPORTS_DIR / "dev_log.md").open("a", encoding="utf-8") as file:
        file.write(message.rstrip() + "\n")


def run_script(script_name: str) -> str:
    script_path = ROOT / "scripts" / script_name
    result = subprocess.run(
        [sys.executable, str(script_path)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    append_dev_log(f"- `{script_name}` stdout: {result.stdout.strip() or 'No output.'}")
    if result.stderr.strip():
        append_dev_log(f"- `{script_name}` stderr: {result.stderr.strip()}")
    if result.returncode != 0:
        raise RuntimeError(f"{script_name} failed with exit code {result.returncode}")
    return result.stdout.strip()


def main() -> int:
    start = datetime.now().isoformat(timespec="seconds")
    append_dev_log("")
    append_dev_log(f"## Run {start}")
    append_dev_log("- Started DesignMate v0.6 pipeline.")
    try:
        has_fts = database.init_db()
        append_dev_log(f"- SQLite initialized. FTS5 available: {has_fts}.")
        summary = []
        for script in SCRIPTS:
            print(f"Running {script}...")
            summary.append((script, run_script(script)))
        database.rebuild_fts_index()
        stats = database.get_stats()
        append_dev_log(f"- Pipeline completed successfully. Materials: {stats['total_materials']}.")
        print("")
        print("DesignMate v0.6 run completed.")
        print(f"- SQLite DB: data/designmate.db")
        print(f"- Total materials: {stats['total_materials']}")
        print(f"- FTS5 available: {stats['fts5_available']}")
        print("Please review:")
        print("- reports/latest_report.md")
        print("- index/materials_index.md")
        print("- index/classification_report.md")
        print("- frontend/index.html")
        print("- review/latest_next_actions.md")
        return 0
    except Exception as exc:
        append_dev_log(f"- Pipeline failed: {exc}")
        append_dev_log("```text")
        append_dev_log(traceback.format_exc())
        append_dev_log("```")
        print(f"DesignMate run failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
