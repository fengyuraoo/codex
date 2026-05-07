from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import ai_service, database, search_engine


REPORT = ROOT / "reports" / "quality_gate_v06.md"

COMMANDS = [
    ["python", "scripts/run_designmate.py"],
    ["python", "scripts/build_static_site.py"],
    ["python", "scripts/generate_portfolio_draft.py", "--project", "reader-design", "--page", "pain-points"],
    ["python", "scripts/generate_portfolio_draft.py", "--project", "info-center", "--page", "concept"],
    ["python", "scripts/export_portfolio_case.py"],
    ["python", "scripts/api_smoke_test.py"],
    ["python", "scripts/run_tests.py"],
]

REQUIRED_FILES = [
    "data/designmate.db",
    "frontend/index.html",
    "frontend/app.js",
    "frontend/style.css",
    "frontend/data/materials.json",
    "frontend/data/app_data.js",
    "reports/latest_report.md",
    "reports/quality_gate_v06.md",
    "review/latest_need_confirm.md",
    "review/latest_next_actions.md",
    "drafts/latest_portfolio_materials.md",
    "drafts/latest_portfolio_page_draft.md",
    "portfolio_export/designmate_case.html",
    "portfolio_export/demo_script.md",
]


def run_command(command: list[str]) -> tuple[bool, str]:
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    output = (result.stdout + "\n" + result.stderr).strip()
    return result.returncode == 0, output


def passfail(condition: bool) -> str:
    return "PASS" if condition else "FAIL"


def main() -> int:
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    if not REPORT.exists():
        REPORT.write_text("# Quality Gate v0.6\n\nStatus: running\n", encoding="utf-8")
    lines = ["# Quality Gate v0.6", "", f"Generated at: {datetime.now().isoformat(timespec='seconds')}", ""]
    all_pass = True
    lines.extend(["## Commands", "", "| Check | Status | Notes |", "| --- | --- | --- |"])
    for command in COMMANDS:
        ok, output = run_command(command)
        all_pass = all_pass and ok
        note = output.splitlines()[-1] if output.splitlines() else ""
        lines.append(f"| `{' '.join(command)}` | {passfail(ok)} | {note[:120]} |")

    lines.extend(["", "## Required Files", "", "| File | Status | Fix Suggestion |", "| --- | --- | --- |"])
    for rel in REQUIRED_FILES:
        exists = (ROOT / rel).exists()
        all_pass = all_pass and exists
        lines.append(f"| `{rel}` | {passfail(exists)} | {'-' if exists else 'Run python scripts/run_designmate.py'} |")

    database.init_db()
    stats = database.get_stats()
    materials_json = ROOT / "frontend" / "data" / "materials.json"
    frontend_non_empty = False
    if materials_json.exists():
        payload = json.loads(materials_json.read_text(encoding="utf-8"))
        frontend_non_empty = bool(payload.get("materials"))
    first = database.list_materials(limit=1)[0] if stats["total_materials"] else None
    updated = database.update_material(first.id, {"notes": "quality gate update", "material_score": 75}) if first else None
    batch_items = database.list_materials(limit=2)
    batch_updated = database.update_materials_batch([item.id for item in batch_items], {"tags": "quality-gate,batch"}) if batch_items else []
    import_stats = database.get_import_stats()
    ask_context = [database.get_material(row["id"]) for row in search_engine.search("用户痛点", limit=5)]
    ask_context = [item for item in ask_context if item]
    ask_result = ai_service.ask_designmate("图信中心项目缺少什么证据？", ask_context, provider="openai")
    functional = [
        ("materials 数量 > 0", stats["total_materials"] > 0, "Run scan_library"),
        ("高价值资料数量 > 0", stats["high_value_count"] > 0, "Check scoring rules"),
        ("search 低干扰有结果", len(search_engine.search("低干扰")) > 0, "Check search index"),
        ("search 图信中心有结果", len(search_engine.search("图信中心")) > 0, "Check sample data"),
        ("search 用户痛点有结果", len(search_engine.search("用户痛点")) > 0, "Check synonym search"),
        ("update_material 可用", updated is not None and updated.notes == "quality gate update", "Check database.update_material"),
        ("batch update 可用", bool(batch_updated) and all("quality-gate" in item.tags for item in batch_updated), "Check database.update_materials_batch"),
        ("Ask API/AI service 可用", bool(ask_result.get("answer")), "Check ai_service.ask_designmate"),
        ("frontend data 非空", frontend_non_empty, "Run build_static_site"),
        ("import stats 可用", "inbox_file_count" in import_stats and "library_file_count" in import_stats, "Check database.get_import_stats"),
        ("scan batch 可用", bool(import_stats.get("latest_batch")), "Check scan_batches"),
        ("portfolio draft 可用", (ROOT / "drafts" / "latest_portfolio_page_draft.md").exists(), "Run generate_portfolio_draft"),
        ("portfolio export 可用", (ROOT / "portfolio_export" / "designmate_case.html").exists(), "Run export_portfolio_case"),
        ("无 API Key fallback 不崩溃", ask_result.get("mode") == "rule_based_fallback", "Check ai_service fallback"),
    ]
    lines.extend(["", "## Functional Checks", "", "| Check | Status | Fix Suggestion |", "| --- | --- | --- |"])
    for name, ok, fix in functional:
        all_pass = all_pass and ok
        lines.append(f"| {name} | {passfail(ok)} | {'-' if ok else fix} |")

    lines.extend(["", f"Final status: {passfail(all_pass)}", ""])
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print("\n".join(lines))
    return 0 if all_pass else 1


if __name__ == "__main__":
    raise SystemExit(main())
