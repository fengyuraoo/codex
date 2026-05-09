from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v073.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def check(name: str, passed: bool, detail: str, fix: str = "-") -> dict[str, str]:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail, "fix": "-" if passed else fix}


def exists(path: Path, name: str) -> dict[str, str]:
    return check(name, path.exists(), str(path.relative_to(ROOT)) if path.exists() else f"Missing {path.relative_to(ROOT)}", "Create or restore the file.")


def contains(path: Path, marker: str, name: str) -> dict[str, str]:
    ok = marker in read(path)
    return check(name, ok, f"Found {marker}" if ok else f"Missing {marker}", f"Add `{marker}` to {path.relative_to(ROOT)}.")


def not_contains(path: Path, marker: str, name: str) -> dict[str, str]:
    ok = marker not in read(path)
    return check(name, ok, f"Did not find {marker}" if ok else f"Still found {marker}", f"Remove or replace `{marker}` in {path.relative_to(ROOT)}.")


def run_command(args: list[str], name: str) -> dict[str, str]:
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    combined = (result.stdout + result.stderr).strip().splitlines()
    detail = combined[-1] if combined else f"exit {result.returncode}"
    return check(name, result.returncode == 0, detail, "Run the command directly and fix the reported failure.")


def main() -> int:
    index_html = ROOT / "frontend" / "index.html"
    app_js = ROOT / "frontend" / "app.js"
    checks = [
        exists(ROOT / "docs" / "v0.7.3_minimal_home_ui.md", "v0.7.3 minimal home UI doc exists"),
        contains(index_html, "v0.7.3", "frontend displays version v0.7.3"),
        contains(app_js, "v0.7.3", "frontend script uses version v0.7.3"),
        contains(index_html, "addMaterialsHeroButton", "home has Add Materials action"),
        contains(index_html, "askHeroButton", "home has Ask DesignMate action"),
        contains(index_html, "searchLibraryHeroButton", "home has Search Library action"),
        contains(app_js, 'tagLocalFirst: "本地优先"', "Chinese Local-first label is translated"),
        contains(app_js, 'tagPortfolioAware: "面向作品集"', "Chinese Portfolio-aware label is translated"),
        contains(app_js, 'tagDesignEvidence: "设计证据"', "Chinese Design evidence label is translated"),
        contains(app_js, 'tagPrivacyFriendly: "隐私友好"', "Chinese Privacy-friendly label is translated"),
        contains(app_js, 'tagDesignStudents: "面向设计学生"', "Chinese design-students label is translated"),
        contains(app_js, 'tagPortfolioBuilding: "用于作品集构建"', "Chinese portfolio-building label is translated"),
        not_contains(index_html, "hub-entry\" data-hub-target=\"image\"", "home no longer repeats Image Search card"),
        not_contains(index_html, "hub-entry\" data-hub-target=\"link\"", "home no longer repeats Link Capture card"),
        contains(index_html, "addView", "Add Materials page still exists"),
        contains(index_html, "Paste Note", "Paste Note UI still exists"),
        contains(ROOT / "backend" / "api_server.py", "/api/paste-note", "Paste Note API still exists"),
        run_command([sys.executable, str(ROOT / "scripts" / "quality_gate_v072.py")], "v0.7.2 quality gate still passes"),
        run_command([sys.executable, str(ROOT / "scripts" / "run_tests.py")], "tests still pass"),
    ]
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.3 Quality Gate",
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
