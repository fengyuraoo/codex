from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "quality_gate_v07.md"


def read(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="ignore")


def check_exists(path: Path, label: str) -> dict[str, str]:
    return {
        "name": label,
        "status": "PASS" if path.exists() else "FAIL",
        "detail": str(path.relative_to(ROOT)) if path.exists() else f"Missing {path.relative_to(ROOT)}",
        "fix": "No action needed." if path.exists() else "Create or regenerate the file.",
    }


def check_contains(path: Path, marker: str, label: str) -> dict[str, str]:
    content = read(path)
    passed = marker in content
    return {
        "name": label,
        "status": "PASS" if passed else "FAIL",
        "detail": f"Found marker: {marker}" if passed else f"Missing marker: {marker}",
        "fix": "No action needed." if passed else f"Update {path.relative_to(ROOT)} with the v0.7 Search Hub content.",
    }


def main() -> int:
    checks: list[dict[str, str]] = []
    checks.extend(
        [
            check_exists(ROOT / "docs" / "v0.7_search_hub.md", "v0.7 product document exists"),
            check_exists(ROOT / "docs" / "demo_script_v07.md", "v0.7 demo script exists"),
            check_exists(ROOT / "frontend" / "index.html", "Search Hub HTML exists"),
            check_exists(ROOT / "frontend" / "app.js", "Search Hub app JS exists"),
            check_exists(ROOT / "frontend" / "style.css", "Search Hub CSS exists"),
            check_exists(ROOT / "scripts" / "export_portfolio_case.py", "portfolio export script exists"),
            check_exists(ROOT / "backend" / "api_server.py", "API server file exists"),
            check_exists(ROOT / "scripts" / "start_api.py", "API startup script exists"),
            check_exists(ROOT / "frontend" / "data" / "app_data.js", "frontend app data exists"),
        ]
    )
    index_html = ROOT / "frontend" / "index.html"
    app_js = ROOT / "frontend" / "app.js"
    css = ROOT / "frontend" / "style.css"
    checks.extend(
        [
            check_contains(index_html, "A Local AI Search Hub for Design Portfolio Materials", "Search Hub positioning present"),
            check_contains(index_html, "Text Search", "Text Search entry present"),
            check_contains(index_html, "Image Search", "Image Search entry present"),
            check_contains(index_html, "Ask DesignMate", "Ask DesignMate entry present"),
            check_contains(index_html, "Design Evidence Cards", "Design Evidence Cards label present"),
            check_contains(index_html, "Current version uses image metadata and filename matching", "Image Search limitation copy present"),
            check_contains(index_html, "Local-first", "Local-first tag present"),
            check_contains(app_js, "portfolioPlacement", "portfolio placement inference exists"),
            check_contains(app_js, "sourceLabel", "source mode rendering exists"),
            check_contains(app_js, "confidence", "confidence rendering exists"),
            check_contains(app_js, "renderImageSearch", "image metadata search shell exists"),
            check_contains(css, "search-hero", "Search Hub hero styles exist"),
            check_contains(css, "evidence-card", "Design Evidence Card styles exist"),
        ]
    )

    final = "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL"
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# DesignMate v0.7 Quality Gate",
        "",
        f"- Generated at: {datetime.now().isoformat(timespec='seconds')}",
        f"- Final status: {final}",
        "",
        "| Check | Status | Detail | Fix |",
        "| --- | --- | --- | --- |",
    ]
    for item in checks:
        lines.append(f"| {item['name']} | {item['status']} | {item['detail']} | {item['fix']} |")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0 if final == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
