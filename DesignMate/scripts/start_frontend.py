from __future__ import annotations

import argparse
import http.server
import socketserver
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"


def main() -> None:
    parser = argparse.ArgumentParser(description="Start DesignMate static frontend server.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()
    handler = http.server.SimpleHTTPRequestHandler
    print(f"DesignMate frontend running at http://{args.host}:{args.port}/")
    print(f"Serving {FRONTEND}")
    with socketserver.TCPServer((args.host, args.port), handler) as server:
        import os

        os.chdir(FRONTEND)
        server.serve_forever()


if __name__ == "__main__":
    main()

