from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v072.md"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""


def check(name: str, passed: bool, detail: str, fix: str = "-") -> dict[str, str]:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail, "fix": "-" if passed else fix}


def exists(path: Path, name: str) -> dict[str, str]:
    return check(name, path.exists(), str(path.relative_to(ROOT)) if path.exists() else f"Missing {path.relative_to(ROOT)}", "Create or restore the file.")


def contains(path: Path, marker: str, name: str) -> dict[str, str]:
    ok = marker in read(path)
    return check(name, ok, f"Found {marker}" if ok else f"Missing {marker}", f"Add `{marker}` to {path.relative_to(ROOT)}.")


def run_command(args: list[str], name: str) -> dict[str, str]:
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    combined = (result.stdout + result.stderr).strip().splitlines()
    detail = combined[-1] if combined else f"exit {result.returncode}"
    return check(name, result.returncode == 0, detail, "Run the command directly and fix the reported failure.")


def contains_any(path: Path, markers: list[str], name: str) -> dict[str, str]:
    content = read(path)
    found = [marker for marker in markers if marker in content]
    ok = bool(found)
    return check(name, ok, f"Found {', '.join(found)}" if ok else f"Missing one of {markers}", f"Add one of `{markers}` to {path.relative_to(ROOT)}.")


def main() -> int:
    app_js = ROOT / "frontend" / "app.js"
    index_html = ROOT / "frontend" / "index.html"
    checks = [
        exists(ROOT / "docs" / "v0.7.2_bilingual_workflow.md", "v0.7.2 bilingual doc exists"),
        contains(app_js, "const translations", "frontend translation dictionary exists"),
        contains(app_js, "zh:", "translation dictionary has zh"),
        contains(app_js, "en:", "translation dictionary has en"),
        contains(app_js, "localStorage", "language persists to localStorage"),
        contains(app_js, "setLanguage", "language switch handler exists"),
        contains_any(index_html, ["v0.7.2", "v0.7.3", "v0.7.4", "v0.7.5", "v0.7.6"], "frontend displays a compatible v0.7.x version"),
        contains(index_html, "langZh", "Chinese language button exists"),
        contains(index_html, "langEn", "English language button exists"),
        contains(index_html, "data-view=\"add\"", "Add Materials navigation exists"),
        contains(index_html, "addView", "Add Materials page exists"),
        contains(index_html, "Paste Note", "Paste Note section exists"),
        contains(app_js, "navAdd", "Add Materials translation key exists"),
        contains(app_js, "addMaterialsIntro", "Add Materials bilingual intro key exists"),
        contains(app_js, "savePastedNote", "Paste Note frontend save handler exists"),
        contains(ROOT / "backend" / "api_server.py", "/api/paste-note", "Paste Note API route exists"),
        contains(ROOT / "backend" / "note_capture_service.py", "capture_note", "note capture service exists"),
        contains(index_html, "Link Capture", "Link Capture page still exists"),
        contains(index_html, "Ask DesignMate", "Ask DesignMate page still exists"),
        contains(ROOT / "backend" / "ai_service.py", "section_keys", "Ask fallback has bilingual section keys"),
        contains(ROOT / "tests" / "test_v072_bilingual.py", "test_translation_dictionary_has_zh_and_en", "bilingual tests exist"),
        run_command([sys.executable, str(ROOT / "scripts" / "quality_gate_v071.py")], "v0.7.1 quality gate still passes"),
        run_command([sys.executable, str(ROOT / "scripts" / "run_tests.py")], "existing tests pass"),
    ]
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.2 Quality Gate",
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
