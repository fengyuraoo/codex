from __future__ import annotations

import hashlib
from dataclasses import dataclass

from . import database
from .models import MaterialRecord, now_iso
from .paths import CONTENT_DIR, ROOT


@dataclass
class NoteCaptureResult:
    ok: bool
    material_id: str = ""
    material: dict | None = None
    message: str = ""

    def to_dict(self) -> dict:
        return {
            "ok": self.ok,
            "material_id": self.material_id,
            "material": self.material or {},
            "message": self.message,
        }


def normalize_stage(stage: str) -> str:
    value = (stage or "unknown").strip().lower()
    aliases = {
        "inspiration": "concept",
        "reference": "research",
        "ideation": "concept",
        "sketch": "development",
        "feedback": "reflection",
    }
    return aliases.get(value, value or "unknown")


def capture_note(
    *,
    title: str,
    content: str,
    project: str = "unknown",
    design_stage: str = "unknown",
    material_type: str = "draft",
    portfolio_placement: str = "",
) -> NoteCaptureResult:
    clean_title = (title or "").strip() or "Pasted design note"
    clean_content = (content or "").strip()
    if not clean_content:
        raise ValueError("content is required")

    now = now_iso()
    digest = hashlib.sha1(f"{clean_title}\n{clean_content}".encode("utf-8")).hexdigest()[:16]
    material_id = f"note-{digest}"
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    content_path = CONTENT_DIR / f"{material_id}.txt"
    content_path.write_text(clean_content + "\n", encoding="utf-8")

    tags = ["pasted-note", "user-input"]
    if project:
        tags.append(project)
    if design_stage:
        tags.append(design_stage)
    if portfolio_placement:
        tags.append(portfolio_placement)
    if material_type:
        tags.append(material_type)

    word_count = len(clean_content.split()) if " " in clean_content else len(clean_content)
    score = min(92, 64 + (10 if project and project != "unknown" else 0) + (8 if portfolio_placement else 0) + min(10, word_count // 40))
    record = MaterialRecord(
        id=material_id,
        filename=f"{clean_title}.note",
        path=f"pasted-note://{material_id}",
        extension="note",
        size=len(clean_content.encode("utf-8")),
        modified_time=now,
        source_folder="paste-note",
        content_preview=clean_content[:1000],
        content_full_path=str(content_path.relative_to(ROOT)).replace("\\", "/"),
        parse_status="note_captured",
        word_count=word_count,
        material_type=(material_type or "draft").strip() or "draft",
        portfolio_stage=normalize_stage(design_stage),
        project_guess=(project or "unknown").strip() or "unknown",
        tags=tags,
        material_score=score,
        reason="Captured from Add Materials / Paste Note as user-provided design evidence.",
        notes=clean_content,
        review_status="confirmed",
        source_mode="user",
        source_type="note",
        title=clean_title,
        excerpt=clean_content[:500],
        user_note=clean_content[:500],
        design_stage=(design_stage or "unknown").strip() or "unknown",
        portfolio_placement=(portfolio_placement or "").strip(),
        created_at=now,
        updated_at=now,
    )
    database.init_db()
    database.upsert_material(record)
    database.rebuild_fts_index()
    material = database.get_material(material_id) or record
    return NoteCaptureResult(
        ok=True,
        material_id=material_id,
        material=material.to_dict(),
        message="Note saved as searchable design evidence.",
    )
