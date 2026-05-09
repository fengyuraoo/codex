from __future__ import annotations

import json
import sqlite3
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Any

from .models import MaterialRecord, now_iso
from .paths import DATA_FOLDERS, DB_PATH, REPORTS_DIR, ROOT


ALLOWED_UPDATE_FIELDS = {
    "material_type",
    "portfolio_stage",
    "project_guess",
    "tags",
    "material_score",
    "notes",
    "review_status",
    "reason",
    "url",
    "platform",
    "source_type",
    "title",
    "excerpt",
    "cover_url",
    "user_note",
    "design_stage",
    "portfolio_placement",
}


def connect(db_path: Path = DB_PATH) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def fts5_available(conn: sqlite3.Connection) -> bool:
    try:
        conn.execute("CREATE VIRTUAL TABLE IF NOT EXISTS fts_probe USING fts5(value)")
        conn.execute("DROP TABLE IF EXISTS fts_probe")
        return True
    except sqlite3.DatabaseError:
        return False


def init_db(db_path: Path = DB_PATH) -> bool:
    with connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS materials (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                path TEXT NOT NULL,
                extension TEXT,
                size INTEGER,
                modified_time TEXT,
                source_folder TEXT,
                content_preview TEXT,
                content_full_path TEXT,
                parse_status TEXT,
                parse_error TEXT,
                word_count INTEGER,
                material_type TEXT,
                portfolio_stage TEXT,
                project_guess TEXT,
                tags TEXT,
                material_score INTEGER,
                reason TEXT,
                notes TEXT,
                review_status TEXT,
                file_hash TEXT,
                first_seen_at TEXT,
                last_seen_at TEXT,
                scan_batch_id TEXT,
                is_duplicate INTEGER DEFAULT 0,
                image_preview_path TEXT,
                image_width INTEGER DEFAULT 0,
                image_height INTEGER DEFAULT 0,
                image_note TEXT,
                source_mode TEXT DEFAULT 'unknown',
                url TEXT DEFAULT '',
                platform TEXT DEFAULT '',
                source_type TEXT DEFAULT '',
                title TEXT DEFAULT '',
                excerpt TEXT DEFAULT '',
                cover_url TEXT DEFAULT '',
                user_note TEXT DEFAULT '',
                design_stage TEXT DEFAULT '',
                portfolio_placement TEXT DEFAULT '',
                created_at TEXT,
                updated_at TEXT
            )
            """
        )
        ensure_column(conn, "materials", "notes", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "review_status", "TEXT DEFAULT 'needs_review'")
        ensure_column(conn, "materials", "file_hash", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "first_seen_at", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "last_seen_at", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "scan_batch_id", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "is_duplicate", "INTEGER DEFAULT 0")
        ensure_column(conn, "materials", "image_preview_path", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "image_width", "INTEGER DEFAULT 0")
        ensure_column(conn, "materials", "image_height", "INTEGER DEFAULT 0")
        ensure_column(conn, "materials", "image_note", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "source_mode", "TEXT DEFAULT 'unknown'")
        ensure_column(conn, "materials", "url", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "platform", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "source_type", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "title", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "excerpt", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "cover_url", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "user_note", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "design_stage", "TEXT DEFAULT ''")
        ensure_column(conn, "materials", "portfolio_placement", "TEXT DEFAULT ''")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scan_batches (
                id TEXT PRIMARY KEY,
                started_at TEXT,
                finished_at TEXT,
                total_files INTEGER,
                new_files INTEGER,
                updated_files INTEGER,
                duplicate_files INTEGER,
                failed_files INTEGER
            )
            """
        )
        has_fts = fts5_available(conn)
        if has_fts:
            conn.execute(
                """
                CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
                    id UNINDEXED,
                    filename,
                    tags,
                    content_preview,
                    content_full,
                    project_guess,
                    material_type,
                    portfolio_stage
                )
                """
            )
        else:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS search_index (
                    id TEXT PRIMARY KEY,
                    filename TEXT,
                    tags TEXT,
                    content_preview TEXT,
                    content_full TEXT,
                    project_guess TEXT,
                    material_type TEXT,
                    portfolio_stage TEXT
                )
                """
            )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                path TEXT,
                content TEXT,
                created_at TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS app_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT,
                message TEXT,
                created_at TEXT
            )
            """
        )
        conn.execute("PRAGMA user_version = 3")
        return has_fts


def ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    columns = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if column not in columns:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


def row_to_material(row: sqlite3.Row) -> MaterialRecord:
    payload = dict(row)
    payload["tags"] = json.loads(payload.get("tags") or "[]")
    payload["is_duplicate"] = bool(payload.get("is_duplicate"))
    return MaterialRecord.from_dict(payload)


def read_full_content(record: MaterialRecord) -> str:
    if not record.content_full_path:
        return ""
    path = ROOT / record.content_full_path
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="ignore")


def upsert_material(record: MaterialRecord, db_path: Path = DB_PATH) -> None:
    now = now_iso()
    with connect(db_path) as conn:
        existing = conn.execute("SELECT created_at FROM materials WHERE id = ?", (record.id,)).fetchone()
        created_at = existing["created_at"] if existing else record.created_at or now
        record.created_at = created_at
        record.first_seen_at = record.first_seen_at or created_at
        record.last_seen_at = now
        record.updated_at = now
        conn.execute(
            """
            INSERT INTO materials (
                id, filename, path, extension, size, modified_time, source_folder,
                content_preview, content_full_path, parse_status, parse_error, word_count,
                material_type, portfolio_stage, project_guess, tags, material_score,
                reason, notes, review_status, file_hash, first_seen_at, last_seen_at,
                scan_batch_id, is_duplicate, image_preview_path, image_width, image_height,
                image_note, source_mode, url, platform, source_type, title, excerpt,
                cover_url, user_note, design_stage, portfolio_placement, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                filename=excluded.filename,
                path=excluded.path,
                extension=excluded.extension,
                size=excluded.size,
                modified_time=excluded.modified_time,
                source_folder=excluded.source_folder,
                content_preview=excluded.content_preview,
                content_full_path=excluded.content_full_path,
                parse_status=excluded.parse_status,
                parse_error=excluded.parse_error,
                word_count=excluded.word_count,
                material_type=excluded.material_type,
                portfolio_stage=excluded.portfolio_stage,
                project_guess=excluded.project_guess,
                tags=excluded.tags,
                material_score=excluded.material_score,
                reason=excluded.reason,
                notes=CASE
                    WHEN materials.notes IS NOT NULL AND materials.notes != '' THEN materials.notes
                    ELSE excluded.notes
                END,
                review_status=CASE
                    WHEN materials.review_status = 'confirmed' THEN materials.review_status
                    ELSE excluded.review_status
                END,
                file_hash=excluded.file_hash,
                first_seen_at=CASE
                    WHEN materials.first_seen_at IS NOT NULL AND materials.first_seen_at != '' THEN materials.first_seen_at
                    ELSE excluded.first_seen_at
                END,
                last_seen_at=excluded.last_seen_at,
                scan_batch_id=excluded.scan_batch_id,
                is_duplicate=excluded.is_duplicate,
                image_preview_path=excluded.image_preview_path,
                image_width=excluded.image_width,
                image_height=excluded.image_height,
                image_note=excluded.image_note,
                source_mode=excluded.source_mode,
                url=excluded.url,
                platform=excluded.platform,
                source_type=excluded.source_type,
                title=excluded.title,
                excerpt=excluded.excerpt,
                cover_url=excluded.cover_url,
                user_note=CASE
                    WHEN materials.user_note IS NOT NULL AND materials.user_note != '' THEN materials.user_note
                    ELSE excluded.user_note
                END,
                design_stage=excluded.design_stage,
                portfolio_placement=excluded.portfolio_placement,
                updated_at=excluded.updated_at
            """,
            (
                record.id,
                record.filename,
                record.path,
                record.extension,
                record.size,
                record.modified_time,
                record.source_folder,
                record.content_preview,
                record.content_full_path,
                record.parse_status,
                record.parse_error,
                record.word_count,
                record.material_type,
                record.portfolio_stage,
                record.project_guess,
                json.dumps(record.tags, ensure_ascii=False),
                record.material_score,
                record.reason,
                record.notes,
                record.review_status,
                record.file_hash,
                record.first_seen_at,
                record.last_seen_at,
                record.scan_batch_id,
                int(record.is_duplicate),
                record.image_preview_path,
                record.image_width,
                record.image_height,
                record.image_note,
                record.source_mode,
                record.url,
                record.platform,
                record.source_type,
                record.title,
                record.excerpt,
                record.cover_url,
                record.user_note,
                record.design_stage,
                record.portfolio_placement,
                record.created_at,
                record.updated_at,
            ),
        )


def update_material_classification(record: MaterialRecord, db_path: Path = DB_PATH) -> None:
    upsert_material(record, db_path)


def list_materials(db_path: Path = DB_PATH, project: str | None = None, material_type: str | None = None, stage: str | None = None, source_mode: str | None = None, limit: int | None = None) -> list[MaterialRecord]:
    query = "SELECT * FROM materials WHERE 1=1"
    params: list[Any] = []
    if project:
        query += " AND project_guess = ?"
        params.append(project)
    if material_type:
        query += " AND material_type = ?"
        params.append(material_type)
    if stage:
        query += " AND portfolio_stage = ?"
        params.append(stage)
    if source_mode:
        query += " AND source_mode = ?"
        params.append(source_mode)
    query += " ORDER BY material_score DESC, updated_at DESC"
    if limit:
        query += " LIMIT ?"
        params.append(limit)
    with connect(db_path) as conn:
        return [row_to_material(row) for row in conn.execute(query, params).fetchall()]


def get_material(material_id: str, db_path: Path = DB_PATH) -> MaterialRecord | None:
    with connect(db_path) as conn:
        row = conn.execute("SELECT * FROM materials WHERE id = ?", (material_id,)).fetchone()
        return row_to_material(row) if row else None


def normalize_updates(updates: dict[str, Any]) -> dict[str, Any]:
    filtered = {key: value for key, value in updates.items() if key in ALLOWED_UPDATE_FIELDS}
    if "tags" in filtered:
        tags = filtered["tags"]
        if isinstance(tags, str):
            tags = [tag.strip() for tag in tags.replace("，", ",").split(",") if tag.strip()]
        if not isinstance(tags, list):
            raise ValueError("tags must be a list or comma-separated string")
        filtered["tags"] = json.dumps([str(tag).strip() for tag in tags if str(tag).strip()], ensure_ascii=False)
    if "material_score" in filtered:
        score = int(filtered["material_score"])
        if score < 0 or score > 100:
            raise ValueError("material_score must be between 0 and 100")
        filtered["material_score"] = score
    return filtered


def update_material(material_id: str, updates: dict[str, Any], db_path: Path = DB_PATH) -> MaterialRecord | None:
    filtered = normalize_updates(updates)
    if not filtered:
        return get_material(material_id, db_path)
    if any(key in filtered for key in {"material_type", "portfolio_stage", "project_guess", "tags", "material_score", "notes"}):
        filtered.setdefault("review_status", "confirmed")
    if "reason" not in filtered and any(key in filtered for key in {"material_type", "portfolio_stage", "project_guess", "tags", "material_score"}):
        filtered["reason"] = "人工编辑：用户在 DesignMate v0.4 中确认或调整了分类。"
    if not get_material(material_id, db_path):
        return None
    filtered["updated_at"] = now_iso()
    assignments = ", ".join(f"{key} = ?" for key in filtered)
    params = list(filtered.values()) + [material_id]
    with connect(db_path) as conn:
        conn.execute(f"UPDATE materials SET {assignments} WHERE id = ?", params)
    rebuild_fts_index(db_path)
    return get_material(material_id, db_path)


def update_material_tags(material_id: str, tags: list[str] | str, db_path: Path = DB_PATH) -> MaterialRecord | None:
    return update_material(material_id, {"tags": tags}, db_path)


def update_material_notes(material_id: str, notes: str, db_path: Path = DB_PATH) -> MaterialRecord | None:
    return update_material(material_id, {"notes": notes}, db_path)


def update_material_score(material_id: str, score: int, db_path: Path = DB_PATH) -> MaterialRecord | None:
    return update_material(material_id, {"material_score": score}, db_path)


def update_materials_batch(material_ids: list[str], updates: dict[str, Any], db_path: Path = DB_PATH) -> list[MaterialRecord]:
    if not isinstance(material_ids, list) or not material_ids:
        raise ValueError("ids must be a non-empty list")
    filtered = normalize_updates(updates)
    update_payload = {key: updates[key] for key in updates if key in ALLOWED_UPDATE_FIELDS}
    if not filtered:
        return [item for item_id in material_ids if (item := get_material(str(item_id), db_path))]
    updated: list[MaterialRecord] = []
    for material_id in material_ids:
        item = update_material(str(material_id), update_payload, db_path)
        if item:
            updated.append(item)
    rebuild_fts_index(db_path)
    return updated


def rebuild_fts_index(db_path: Path = DB_PATH) -> bool:
    has_fts = init_db(db_path)
    materials = list_materials(db_path)
    with connect(db_path) as conn:
        conn.execute("DELETE FROM search_index")
        for record in materials:
            conn.execute(
                """
                INSERT INTO search_index (
                    id, filename, tags, content_preview, content_full,
                    project_guess, material_type, portfolio_stage
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record.id,
                    record.filename,
                    " ".join(record.tags),
                    record.content_preview,
                    read_full_content(record),
                    record.project_guess,
                    record.material_type,
                    record.portfolio_stage,
                ),
            )
    return has_fts


def search_materials(query: str, project: str | None = None, material_type: str | None = None, stage: str | None = None, limit: int = 20, db_path: Path = DB_PATH) -> list[MaterialRecord]:
    # The ranked app search lives in search_engine.py. This DB helper returns filtered candidates.
    return list_materials(db_path, project=project, material_type=material_type, stage=stage, limit=None)[: max(limit, 100)]


def get_stats(db_path: Path = DB_PATH) -> dict[str, Any]:
    materials = list_materials(db_path)
    by_type = Counter(item.material_type for item in materials)
    by_project = Counter(item.project_guess for item in materials)
    by_stage = Counter(item.portfolio_stage for item in materials)
    by_parse = Counter(item.parse_status for item in materials)
    by_source = Counter(item.source_mode for item in materials)
    import_stats = get_import_stats(db_path)
    return {
        "total_materials": len(materials),
        "by_type": dict(by_type),
        "by_project": dict(by_project),
        "by_stage": dict(by_stage),
        "parse_status": dict(by_parse),
        "by_source": dict(by_source),
        "high_value_count": sum(1 for item in materials if item.material_score >= 70),
        "unknown_count": sum(1 for item in materials if item.material_type == "unknown" or item.project_guess == "unknown"),
        "fts5_available": init_db(db_path),
        "import": import_stats,
    }


def count_files(folder: Path) -> int:
    if not folder.exists():
        return 0
    return sum(1 for path in folder.rglob("*") if path.is_file())


def get_import_stats(db_path: Path = DB_PATH) -> dict[str, Any]:
    inbox = ROOT / "data" / "inbox"
    library = ROOT / "data" / "library"
    last_scan = ""
    latest_batch = {}
    with connect(db_path) as conn:
        row = conn.execute("SELECT MAX(updated_at) AS last_scan FROM materials").fetchone()
        last_scan = row["last_scan"] if row and row["last_scan"] else ""
        batch = conn.execute("SELECT * FROM scan_batches ORDER BY started_at DESC LIMIT 1").fetchone()
        latest_batch = dict(batch) if batch else {}
    latest_report = REPORTS_DIR / "latest_report.md"
    last_report = ""
    if latest_report.exists():
        last_report = datetime.fromtimestamp(latest_report.stat().st_mtime).isoformat(timespec="seconds")
    return {
        "inbox_file_count": count_files(inbox),
        "library_file_count": count_files(library),
        "last_scan_time": last_scan,
        "last_report_time": last_report,
        "watched_folders": [str(path.relative_to(ROOT)).replace("\\", "/") for path in DATA_FOLDERS],
        "latest_batch": latest_batch,
    }


def create_scan_batch(batch_id: str, started_at: str, db_path: Path = DB_PATH) -> None:
    init_db(db_path)
    with connect(db_path) as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO scan_batches (
                id, started_at, finished_at, total_files, new_files, updated_files,
                duplicate_files, failed_files
            )
            VALUES (?, ?, ?, 0, 0, 0, 0, 0)
            """,
            (batch_id, started_at, ""),
        )


def finish_scan_batch(batch_id: str, stats: dict[str, int], finished_at: str, db_path: Path = DB_PATH) -> None:
    init_db(db_path)
    with connect(db_path) as conn:
        conn.execute(
            """
            UPDATE scan_batches
            SET finished_at = ?, total_files = ?, new_files = ?, updated_files = ?,
                duplicate_files = ?, failed_files = ?
            WHERE id = ?
            """,
            (
                finished_at,
                stats.get("total_files", 0),
                stats.get("new_files", 0),
                stats.get("updated_files", 0),
                stats.get("duplicate_files", 0),
                stats.get("failed_files", 0),
                batch_id,
            ),
        )


def material_exists(material_id: str, db_path: Path = DB_PATH) -> bool:
    return get_material(material_id, db_path) is not None


def hash_seen_elsewhere(material_id: str, file_hash: str, db_path: Path = DB_PATH) -> bool:
    if not file_hash:
        return False
    with connect(db_path) as conn:
        row = conn.execute("SELECT id FROM materials WHERE file_hash = ? AND id != ? LIMIT 1", (file_hash, material_id)).fetchone()
        return row is not None


def log(level: str, message: str, db_path: Path = DB_PATH) -> None:
    with connect(db_path) as conn:
        conn.execute(
            "INSERT INTO app_logs (level, message, created_at) VALUES (?, ?, ?)",
            (level, message, now_iso()),
        )


def save_report(name: str, path: str, content: str, db_path: Path = DB_PATH) -> None:
    with connect(db_path) as conn:
        conn.execute(
            "INSERT INTO reports (name, path, content, created_at) VALUES (?, ?, ?, ?)",
            (name, path, content, now_iso()),
        )
