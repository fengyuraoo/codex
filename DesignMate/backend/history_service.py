from __future__ import annotations

from datetime import datetime

from . import database
from .import_service import scan_batch_id


def start_scan_batch() -> tuple[str, str]:
    started_at = datetime.now().isoformat(timespec="seconds")
    batch_id = scan_batch_id(started_at)
    database.create_scan_batch(batch_id, started_at)
    return batch_id, started_at


def finish_scan_batch(batch_id: str, stats: dict[str, int]) -> None:
    database.finish_scan_batch(batch_id, stats, datetime.now().isoformat(timespec="seconds"))
