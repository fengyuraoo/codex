from __future__ import annotations

import hashlib
import shutil
from pathlib import Path

from .paths import FRONTEND_DATA_DIR, ROOT


def file_hash(path: Path) -> str:
    digest = hashlib.sha1()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def image_preview(path: Path, material_id: str) -> str:
    images_dir = FRONTEND_DATA_DIR / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    target = images_dir / f"{material_id}{path.suffix.lower()}"
    try:
        shutil.copy2(path, target)
    except OSError:
        return ""
    return str(target.relative_to(ROOT / "frontend")).replace("\\", "/")


def scan_batch_id(started_at: str) -> str:
    return "scan-" + hashlib.sha1(started_at.encode("utf-8")).hexdigest()[:12]
