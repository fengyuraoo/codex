from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports" / "test_report_v061.md"


def main() -> int:
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", str(ROOT / "tests"), "-v"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Test Report v0.6.1",
        "",
        f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
        f"Exit code: {result.returncode}",
        "",
        "## stdout",
        "",
        "```text",
        result.stdout,
        "```",
        "",
        "## stderr",
        "",
        "```text",
        result.stderr,
        "```",
        "",
        "Final status: " + ("PASS" if result.returncode == 0 else "FAIL"),
        "",
    ]
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    safe_stdout = result.stdout.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
    safe_stderr = result.stderr.encode("utf-8", errors="replace").decode("utf-8", errors="replace")
    sys.stdout.buffer.write(safe_stdout.encode("utf-8", errors="replace"))
    sys.stdout.buffer.write(b"\n")
    sys.stdout.buffer.write(safe_stderr.encode("utf-8", errors="replace"))
    sys.stdout.buffer.write(b"\n")
    print(f"Test report written to {REPORT.relative_to(ROOT)}")
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
