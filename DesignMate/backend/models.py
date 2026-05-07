from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


@dataclass
class MaterialRecord:
    id: str
    filename: str
    path: str
    extension: str
    size: int
    modified_time: str
    source_folder: str
    content_preview: str = ""
    content_full_path: str = ""
    parse_status: str = "unknown"
    parse_error: str = ""
    word_count: int = 0
    material_type: str = "unknown"
    portfolio_stage: str = "unknown"
    project_guess: str = "unknown"
    tags: list[str] = field(default_factory=list)
    material_score: int = 0
    reason: str = ""
    notes: str = ""
    review_status: str = "needs_review"
    file_hash: str = ""
    first_seen_at: str = ""
    last_seen_at: str = ""
    scan_batch_id: str = ""
    is_duplicate: bool = False
    image_preview_path: str = ""
    image_width: int = 0
    image_height: int = 0
    image_note: str = ""
    created_at: str = field(default_factory=now_iso)
    updated_at: str = field(default_factory=now_iso)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "MaterialRecord":
        data = dict(payload)
        if isinstance(data.get("tags"), str):
            data["tags"] = [tag for tag in data["tags"].split(",") if tag]
        allowed = set(cls.__dataclass_fields__.keys())
        filtered = {key: value for key, value in data.items() if key in allowed}
        return cls(**filtered)
