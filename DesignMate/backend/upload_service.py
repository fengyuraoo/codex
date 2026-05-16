from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from . import database
from .material_parser import SUPPORTED_EXTENSIONS, parse_material
from .paths import ROOT, UPLOADS_DIR


ALLOWED_UPLOAD_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf", ".docx", ".pptx", ".txt", ".md", ".csv", ".xlsx"}


@dataclass
class UploadFileInput:
    filename: str
    content: bytes


def safe_filename(filename: str) -> str:
    raw = (filename or "").strip()
    if not raw:
        raise ValueError("Filename is required.")
    if "/" in raw or "\\" in raw or ".." in Path(raw).parts or raw != Path(raw).name:
        raise ValueError(f"Unsafe filename rejected: {raw}")
    name = Path(raw).name
    stem = Path(name).stem.strip() or "material"
    suffix = Path(name).suffix.lower()
    if suffix not in ALLOWED_UPLOAD_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {suffix or 'unknown'}")
    safe_stem = re.sub(r"[^\w\u4e00-\u9fff.-]+", "-", stem, flags=re.UNICODE).strip(".-_") or "material"
    return f"{safe_stem}{suffix}"


def unique_upload_path(filename: str, upload_dir: Path = UPLOADS_DIR) -> Path:
    upload_dir.mkdir(parents=True, exist_ok=True)
    safe = safe_filename(filename)
    candidate = upload_dir / safe
    if not candidate.exists():
        return candidate
    digest = hashlib.sha1(f"{safe}-{datetime.now().isoformat()}".encode("utf-8")).hexdigest()[:8]
    return upload_dir / f"{Path(safe).stem}-{digest}{Path(safe).suffix}"


def ensure_inside_designmate(path: Path) -> None:
    resolved = path.resolve()
    root = ROOT.resolve()
    if root not in resolved.parents and resolved != root:
        raise ValueError("Upload path must stay inside DesignMate.")


def apply_upload_metadata(record, *, project: str = "", design_stage: str = "", use_case: str = "", user_note: str = ""):
    if project:
        record.project_guess = project
    if design_stage:
        record.design_stage = design_stage
        if record.portfolio_stage == "unknown":
            record.portfolio_stage = design_stage
    if use_case:
        record.portfolio_placement = use_case
    if user_note:
        record.user_note = user_note
        record.notes = user_note
        record.content_preview = (record.content_preview + "\n\nUser note: " + user_note).strip()[:1000]
    record.source_mode = "user"
    record.source_folder = "data/uploads"
    record.tags = sorted(set([*record.tags, "uploaded", *(project and [project] or []), *(design_stage and [design_stage] or []), *(use_case and [use_case] or [])]))
    record.reason = (record.reason + " Uploaded through Add Materials.").strip()
    return record


def upload_materials(
    files: list[UploadFileInput],
    *,
    project: str = "",
    design_stage: str = "",
    use_case: str = "",
    user_note: str = "",
) -> dict:
    if not files:
        raise ValueError("No files were uploaded.")
    database.init_db()
    saved_files = []
    materials_created = []
    errors = []
    for upload in files:
        try:
            if not upload.content:
                raise ValueError(f"{upload.filename}: file is empty")
            target = unique_upload_path(upload.filename)
            ensure_inside_designmate(target)
            target.write_bytes(upload.content)
            record = parse_material(target, UPLOADS_DIR)
            record = apply_upload_metadata(record, project=project.strip(), design_stage=design_stage.strip(), use_case=use_case.strip(), user_note=user_note.strip())
            database.upsert_material(record)
            saved_files.append(
                {
                    "filename": record.filename,
                    "path": record.path,
                    "extension": record.extension,
                    "size": record.size,
                    "parse_status": record.parse_status,
                }
            )
            materials_created.append(record.to_dict())
        except ValueError as exc:
            errors.append({"filename": upload.filename, "message": str(exc)})
    if materials_created:
        database.rebuild_fts_index()
    return {
        "ok": bool(materials_created) and not errors,
        "saved_files": saved_files,
        "materials_created": materials_created,
        "errors": errors,
        "message": "Upload completed." if not errors else "Some files could not be uploaded.",
    }


def supported_extensions() -> set[str]:
    return set(ALLOWED_UPLOAD_EXTENSIONS | SUPPORTED_EXTENSIONS)
