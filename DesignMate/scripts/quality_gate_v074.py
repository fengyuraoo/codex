from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v074.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def check(name: str, passed: bool, detail: str, fix: str = "-") -> dict[str, str]:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail, "fix": "-" if passed else fix}


def exists(path: Path, name: str) -> dict[str, str]:
    return check(name, path.exists(), str(path.relative_to(ROOT)) if path.exists() else f"Missing {path.relative_to(ROOT)}", "Create or restore the file.")


def contains(path: Path, marker: str, name: str) -> dict[str, str]:
    content = read(path)
    ok = marker in content
    return check(name, ok, f"Found {marker}" if ok else f"Missing {marker}", f"Add `{marker}` to {path.relative_to(ROOT)}.")


def contains_any(path: Path, markers: list[str], name: str) -> dict[str, str]:
    content = read(path)
    found = [marker for marker in markers if marker in content]
    ok = bool(found)
    return check(name, ok, f"Found {', '.join(found)}" if ok else f"Missing one of {markers}", f"Add one of `{markers}` to {path.relative_to(ROOT)}.")


def not_contains(path: Path, marker: str, name: str) -> dict[str, str]:
    content = read(path)
    ok = marker not in content
    return check(name, ok, f"Did not find {marker}" if ok else f"Still found {marker}", f"Replace `{marker}` in {path.relative_to(ROOT)}.")


def run_command(args: list[str], name: str) -> dict[str, str]:
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    combined = (result.stdout + result.stderr).strip().splitlines()
    detail = combined[-1] if combined else f"exit {result.returncode}"
    return check(name, result.returncode == 0, detail, "Run the command directly and fix the reported failure.")


def main() -> int:
    index_html = ROOT / "frontend" / "index.html"
    app_js = ROOT / "frontend" / "app.js"
    ai_service = ROOT / "backend" / "ai_service.py"
    checks = [
        exists(ROOT / "docs" / "v0.7.4_design_process_positioning.md", "v0.7.4 positioning doc exists"),
        contains_any(index_html, ["v0.7.4", "v0.7.5"], "frontend displays a compatible v0.7.x version"),
        contains_any(app_js, ["v0.7.4", "v0.7.5"], "frontend script uses a compatible v0.7.x version"),
        contains(app_js, "A Local AI Search Hub for the Design Process", "English home positioning uses design process"),
        contains(app_js, "面向设计全过程的本地 AI 资料助手", "Chinese home positioning uses 设计全过程"),
        contains(app_js, "Design process material assistant", "top subtitle uses design process"),
        not_contains(app_js, "A Local AI Search Hub for Design Portfolio Materials", "old portfolio-only title removed"),
        not_contains(app_js, "Search Hub for local design portfolio materials", "old portfolio-only top subtitle removed"),
        contains(app_js, 'placement: "Use Case"', "Search card field is Use Case"),
        contains(app_js, 'placement: "使用场景"', "Chinese Search card field is 使用场景"),
        contains(app_js, "Project memory", "English tag includes Project memory"),
        contains(app_js, "项目记忆", "Chinese tag includes 项目记忆"),
        contains(app_js, "Portfolio-ready", "Portfolio retained as output capability"),
        contains(index_html, "addView", "Add Materials page still exists"),
        contains(index_html, "askView", "Ask DesignMate page still exists"),
        contains(index_html, "linkView", "Link Capture page still exists"),
        contains(app_js, "Turn external inspiration links into design evidence", "Link Capture title updated"),
        contains(ai_service, '"placement": "Use Cases"', "Ask fallback has English Use Cases section"),
        contains(ai_service, '"placement": "可用场景"', "Ask fallback has Chinese 可用场景 section"),
        run_command([sys.executable, str(ROOT / "scripts" / "quality_gate_v073.py")], "v0.7.3 quality gate still passes"),
        run_command([sys.executable, str(ROOT / "scripts" / "run_tests.py")], "tests still pass"),
    ]
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.4 Quality Gate",
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
