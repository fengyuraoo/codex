from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v071.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def row(name: str, passed: bool, detail: str, fix: str = "-") -> dict[str, str]:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail, "fix": fix if not passed else "-"}


def exists(path: Path, name: str) -> dict[str, str]:
    return row(name, path.exists(), str(path.relative_to(ROOT)) if path.exists() else f"Missing {path.relative_to(ROOT)}", "Create the missing file.")


def contains(path: Path, marker: str, name: str) -> dict[str, str]:
    ok = marker in read(path)
    return row(name, ok, f"Found {marker}" if ok else f"Missing {marker}", f"Add `{marker}` to {path.relative_to(ROOT)}.")


def run_tests() -> dict[str, str]:
    result = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "run_tests.py")],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    tail = (result.stdout + result.stderr).strip().splitlines()[-1:] or [""]
    return row("existing tests pass", result.returncode == 0, tail[0], "Run python DesignMate/scripts/run_tests.py and fix failures.")


def main() -> int:
    checks: list[dict[str, str]] = [
        exists(ROOT / "backend" / "link_capture_service.py", "backend link capture service exists"),
        exists(ROOT / "app" / "services" / "link_capture_service.py", "app service link capture entry exists"),
        exists(ROOT / "docs" / "v0.7.1_link_capture.md", "v0.7.1 Link Capture doc exists"),
        exists(ROOT / "frontend" / "index.html", "frontend HTML exists"),
        exists(ROOT / "frontend" / "app.js", "frontend JS exists"),
        exists(ROOT / "backend" / "api_server.py", "API server exists"),
        exists(ROOT / "backend" / "search_engine.py", "Search engine exists"),
        exists(ROOT / "backend" / "ai_service.py", "Ask DesignMate service exists"),
        exists(ROOT / "backend" / "export_service.py", "Portfolio export service exists"),
        contains(ROOT / "backend" / "api_server.py", "/api/link-capture", "POST /api/link-capture exists"),
        contains(ROOT / "frontend" / "index.html", "Link Capture", "frontend Link Capture entry exists"),
        contains(ROOT / "frontend" / "app.js", "captureLink", "frontend captureLink handler exists"),
        contains(ROOT / "frontend" / "app.js", "Open source link", "link material card support exists"),
        contains(ROOT / "backend" / "search_engine.py", "user_note", "Search indexes link user notes"),
        contains(ROOT / "backend" / "export_service.py", "External References", "Portfolio Export includes link materials"),
        contains(ROOT / "docs" / "demo_script_v07.md", "Link Capture 20", "demo script includes Link Capture segment"),
        contains(ROOT / "tests" / "test_v071_link_capture.py", "test_short_video_fallback_saved", "Link Capture tests exist"),
    ]
    checks.append(run_tests())
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.1 Quality Gate",
        "",
        f"- Generated at: {datetime.now().isoformat(timespec='seconds')}",
        f"- Final status: {final}",
        "",
        "| Check | Status | Detail | Fix |",
        "| --- | --- | --- | --- |",
    ]
    for item in checks:
        lines.append(f"| {item['name']} | {item['status']} | {item['detail']} | {item['fix']} |")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0 if final == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
