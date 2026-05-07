from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.export_service import export_portfolio_case


def main() -> int:
    written = export_portfolio_case()
    print(f"Exported {len(written)} portfolio case files to portfolio_export.")
    print("Open portfolio_export/designmate_case.html for a quick case overview.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
