from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v076.md"


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
    return check(name, ok, f"Did not find {marker}" if ok else f"Still found {marker}", f"Remove `{marker}` from {path.relative_to(ROOT)}.")


def run_command(args: list[str], name: str) -> dict[str, str]:
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    combined = (result.stdout + result.stderr).strip().splitlines()
    detail = combined[-1] if combined else f"exit {result.returncode}"
    return check(name, result.returncode == 0, detail, "Run the command directly and fix the reported failure.")


def main() -> int:
    index_html = ROOT / "frontend" / "index.html"
    app_js = ROOT / "frontend" / "app.js"
    api_server = ROOT / "backend" / "api_server.py"
    checks = [
        exists(ROOT / "docs" / "v0.7.6_home_dedup_upload_drag.md", "v0.7.6 doc exists"),
        contains(index_html, "v0.7.6", "frontend displays v0.7.6"),
        contains(app_js, "v0.7.6", "frontend script uses v0.7.6"),
        contains(index_html, "addMaterialsHeroButton", "home keeps Add Materials CTA"),
        contains(index_html, "askHeroButton", "home keeps Ask DesignMate CTA"),
        not_contains(index_html, "searchLibraryHeroButton", "home removed repeated Search Library CTA"),
        not_contains(index_html, "hub-entry-grid", "home no longer renders three large feature cards"),
        contains(index_html, "library-status", "home has Library Status area"),
        contains(app_js, "dragover", "frontend handles dragover"),
        contains(app_js, "drop", "frontend handles drop"),
        contains(app_js, "dataTransfer.files", "frontend reads dropped files"),
        contains(app_js, "preventDefault", "frontend prevents browser file open"),
        contains(app_js, "stopPropagation", "frontend stops drag propagation"),
        contains(index_html, "uploadFileList", "frontend has upload pending file list"),
        contains(app_js, "Drop design materials here, or click to choose files", "English drag prompt exists"),
        contains(app_js, "Release to add files", "English drag-over prompt exists"),
        contains(app_js, "拖入设计资料，或点击选择文件", "Chinese drag prompt exists"),
        contains(app_js, "松开即可添加文件", "Chinese drag-over prompt exists"),
        contains(api_server, "/api/upload-materials", "upload API still exists"),
        run_command([sys.executable, str(ROOT / "scripts" / "quality_gate_v075.py")], "v0.7.5 quality gate still passes"),
        run_command([sys.executable, str(ROOT / "scripts" / "run_tests.py")], "tests still pass"),
    ]
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.6 Quality Gate",
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
