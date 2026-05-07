from __future__ import annotations

import argparse
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.api_server import run


def main() -> None:
    parser = argparse.ArgumentParser(description="Start DesignMate local API server.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    print(f"Health check: http://{args.host}:{args.port}/api/health")
    run(args.host, args.port)


if __name__ == "__main__":
    main()
