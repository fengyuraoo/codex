from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v075.md"


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


def main() -> int:
    index_html = ROOT / "frontend" / "index.html"
    app_js = ROOT / "frontend" / "app.js"
    api_server = ROOT / "backend" / "api_server.py"
    upload_service = ROOT / "backend" / "upload_service.py"
    checks = [
        exists(ROOT / "docs" / "v0.7.5_real_file_upload.md", "v0.7.5 upload doc exists"),
        exists(upload_service, "upload service exists"),
        contains(api_server, "/api/upload-materials", "upload API route exists"),
        contains(index_html, "uploadToLibraryButton", "Add Materials upload button exists"),
        contains(index_html, "Upload to Library", "English Upload to Library exists"),
        contains(app_js, "uploadToLibrary", "upload i18n key exists"),
        contains(app_js, "上传并加入资料库", "Chinese upload action exists"),
        contains(app_js, "Uploading requires the API", "English API-required message exists"),
        contains(app_js, "上传需要先启动 API", "Chinese API-required message exists"),
        contains(upload_service, "UPLOADS_DIR", "upload path uses DesignMate uploads dir"),
        contains(upload_service, "safe_filename", "safe filename handling exists"),
        contains(api_server, "/api/link-capture", "Link Capture API still exists"),
        contains(api_server, "/api/paste-note", "Paste Note API still exists"),
        run_command([sys.executable, str(ROOT / "scripts" / "quality_gate_v074.py")], "v0.7.4 quality gate still passes"),
        run_command([sys.executable, str(ROOT / "scripts" / "run_tests.py")], "tests still pass"),
    ]
    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    lines = [
        "# DesignMate v0.7.5 Quality Gate",
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
