from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import database, report_service


def main() -> None:
    database.init_db()
    paths = report_service.generate_reports()
    print("Generated reports:")
    for key, path in paths.items():
        print(f"- {key}: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

