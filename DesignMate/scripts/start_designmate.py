from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def run(command: list[str]) -> None:
    result = subprocess.run(command, cwd=ROOT)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> None:
    run([sys.executable, str(ROOT / "scripts" / "run_designmate.py")])
    run([sys.executable, str(ROOT / "scripts" / "build_static_site.py")])
    print("")
    print("DesignMate is ready.")
    print("Start API:")
    print("  python scripts/start_api.py")
    print("Start frontend:")
    print("  python scripts/start_frontend.py")
    print("Then open:")
    print("  http://127.0.0.1:8766/")


if __name__ == "__main__":
    main()

