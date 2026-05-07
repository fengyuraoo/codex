from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database, search_engine
from backend.paths import REPORTS_DIR
from backend.utils import atomic_write_json, atomic_write_text


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Search DesignMate local materials.")
    parser.add_argument("query", nargs="+", help="Keyword to search.")
    parser.add_argument("--project", dest="project", help="Filter by project_guess.")
    parser.add_argument("--type", dest="material_type", help="Filter by material_type.")
    parser.add_argument("--stage", dest="stage", help="Filter by portfolio_stage.")
    parser.add_argument("--limit", dest="limit", type=int, default=20)
    parser.add_argument("--json", dest="json_only", action="store_true", help="Print JSON to terminal.")
    return parser.parse_args(argv)


def write_reports(query: str, args: argparse.Namespace, results: list[dict]) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "query": query,
        "filters": {
            "project": args.project,
            "type": args.material_type,
            "stage": args.stage,
            "limit": args.limit,
        },
        "count": len(results),
        "results": results,
    }
    atomic_write_json(REPORTS_DIR / "search_result.json", payload)
    lines = [
        "# Search Result",
        "",
        f"Generated at: {payload['generated_at']}",
        f"Query: `{query}`",
        f"Project filter: `{args.project or 'any'}`",
        f"Type filter: `{args.material_type or 'any'}`",
        f"Stage filter: `{args.stage or 'any'}`",
        f"Matches: {len(results)}",
        "",
    ]
    for item in results:
        lines.extend(
            [
                f"## #{item['rank']} {item['filename']}",
                "",
                f"- Path: `{item['path']}`",
                f"- Material type: `{item['material_type']}`",
                f"- Portfolio stage: `{item['portfolio_stage']}`",
                f"- Project guess: `{item['project_guess']}`",
                f"- Score: {item['score']}",
                f"- Tags: {', '.join(item['tags']) or 'None'}",
                f"- Matched fields: {', '.join(item['matched_fields'])}",
                f"- Why relevant: {item['why_relevant']}",
                f"- Snippet: {item['snippet']}",
                "",
            ]
        )
    if not results:
        lines.append("No matched materials.")
    atomic_write_text(REPORTS_DIR / "search_result.md", "\n".join(lines))


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if not argv:
        print("Usage: python scripts/search_materials.py [--project reader-design] [--type feedback] [--stage research] [--limit 5] <keyword>")
        return 1
    args = parse_args(argv)
    query = " ".join(args.query).strip()
    database.init_db()
    results = search_engine.search(query, project=args.project, material_type=args.material_type, stage=args.stage, limit=args.limit)
    write_reports(query, args, results)
    if args.json_only:
        print(json.dumps({"query": query, "count": len(results), "results": results}, ensure_ascii=False, indent=2))
        return 0
    print(f"Query: {query}")
    print(f"Matches: {len(results)}")
    for item in results:
        print(f"#{item['rank']} {item['filename']} [{item['material_type']} / {item['project_guess']} / {item['portfolio_stage']}] score={item['score']}")
        print(f"  {item['path']}")
    if not results:
        print("No matched materials.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

