from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "designmate.db"
UPLOADS_DIR = DATA_DIR / "uploads"
INDEX_DIR = ROOT / "index"
CONTENT_DIR = INDEX_DIR / "materials_content"
REPORTS_DIR = ROOT / "reports"
REVIEW_DIR = ROOT / "review"
DRAFTS_DIR = ROOT / "drafts"
FRONTEND_DIR = ROOT / "frontend"
FRONTEND_DATA_DIR = FRONTEND_DIR / "data"
DATA_FOLDERS = [DATA_DIR / "examples", DATA_DIR / "inbox", DATA_DIR / "library", UPLOADS_DIR]
