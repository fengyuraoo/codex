from __future__ import annotations

import argparse
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database, portfolio_writer


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a rule-based DesignMate portfolio page draft.")
    parser.add_argument("--project", choices=["reader-design", "info-center", "thesis", "general"], default="reader-design")
    parser.add_argument(
        "--page",
        choices=["overview", "background", "research", "pain-points", "insight", "concept", "development", "final", "reflection"],
        default="overview",
    )
    args = parser.parse_args()

    database.init_db()
    output = portfolio_writer.generate_portfolio_draft(args.project, args.page)
    print(f"Generated portfolio draft for {args.project}/{args.page}: {output.relative_to(ROOT)}")
    print(f"Also wrote page-specific draft: drafts/{args.project}_{args.page}_draft.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
