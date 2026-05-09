from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, asdict
from html.parser import HTMLParser
from typing import Any
from urllib.parse import urlparse, urlunparse
from urllib.request import Request, urlopen

from . import database
from .models import MaterialRecord, now_iso


SHORT_VIDEO_PLATFORMS = {"douyin", "tiktok", "youtube", "bilibili"}


@dataclass
class LinkCaptureResult:
    ok: bool
    material_id: str = ""
    url: str = ""
    platform: str = "generic webpage"
    title: str = ""
    excerpt: str = ""
    source_type: str = "link"
    cover_url: str = ""
    message: str = ""
    fallback_saved: bool = False
    material: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class MetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.title_parts: list[str] = []
        self.meta: dict[str, str] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "title":
            self.in_title = True
        if tag.lower() == "meta":
            key = (attrs_dict.get("property") or attrs_dict.get("name") or "").lower()
            content = attrs_dict.get("content", "")
            if key and content:
                self.meta[key] = content.strip()

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data.strip())

    @property
    def title(self) -> str:
        return " ".join(part for part in self.title_parts if part).strip()


def normalize_url(url: str) -> str:
    raw = (url or "").strip()
    if not raw:
        raise ValueError("Please paste a URL.")
    if not re.match(r"^https?://", raw, flags=re.I):
        raw = "https://" + raw
    parsed = urlparse(raw)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc or re.search(r"\s", parsed.netloc):
        raise ValueError("The URL is not valid. Please paste a public http or https link.")
    netloc = parsed.netloc.lower()
    path = re.sub(r"/+$", "", parsed.path or "")
    return urlunparse((parsed.scheme.lower(), netloc, path, "", parsed.query, ""))


def detect_platform(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if "xiaohongshu.com" in host or "xhslink.com" in host:
        return "xiaohongshu"
    if "douyin.com" in host or "iesdouyin.com" in host:
        return "douyin"
    if "bilibili.com" in host or "b23.tv" in host:
        return "bilibili"
    if "tiktok.com" in host:
        return "tiktok"
    if "youtube.com" in host or "youtu.be" in host:
        return "youtube"
    if "pinterest." in host or "pin.it" in host:
        return "pinterest"
    if "behance.net" in host:
        return "behance"
    if "dribbble.com" in host:
        return "dribbble"
    if "mp.weixin.qq.com" in host:
        return "wechat article"
    return "generic webpage"


def infer_source_type(platform: str, url: str) -> str:
    if platform in SHORT_VIDEO_PLATFORMS:
        return "short_video"
    if platform in {"xiaohongshu", "pinterest"}:
        return "social_post"
    if platform in {"behance", "dribbble"}:
        return "reference"
    if platform == "wechat article":
        return "article"
    return "webpage"


def extract_webpage_metadata(url: str, timeout: float = 6.0) -> dict[str, str]:
    request = Request(
        url,
        headers={
            "User-Agent": "DesignMate-LinkCapture/0.7.1 (+local portfolio research tool)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    with urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type and "application/xhtml" not in content_type:
            return {"parse_error": f"Unsupported content type: {content_type or 'unknown'}"}
        body = response.read(400_000).decode(response.headers.get_content_charset() or "utf-8", errors="ignore")
    parser = MetadataParser()
    parser.feed(body)
    title = parser.meta.get("og:title") or parser.meta.get("twitter:title") or parser.title
    excerpt = parser.meta.get("og:description") or parser.meta.get("description") or parser.meta.get("twitter:description")
    cover = parser.meta.get("og:image") or parser.meta.get("twitter:image")
    text = re.sub(r"<(script|style).*?</\1>", " ", body, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return {
        "title": (title or "").strip(),
        "excerpt": (excerpt or text[:500] or "").strip(),
        "cover_url": (cover or "").strip(),
        "content_text": text[:2500],
    }


def stage_to_portfolio_stage(design_stage: str) -> str:
    value = (design_stage or "").strip().lower()
    mapping = {
        "research": "research",
        "inspiration": "research",
        "reference": "background",
        "feedback": "reflection",
        "unknown": "unknown",
    }
    return mapping.get(value, value if value in {"background", "insight", "concept", "development", "final", "reflection"} else "unknown")


def default_portfolio_placement(source_type: str, design_stage: str, requested: str = "") -> str:
    if requested:
        return requested
    if design_stage == "research":
        return "Research"
    if design_stage in {"inspiration", "reference"}:
        return "Moodboard"
    if source_type in {"reference", "social_post"}:
        return "Design Inspiration"
    if design_stage == "feedback":
        return "Process Evidence"
    return "Design Inspiration"


def material_id_for_url(url: str) -> str:
    return "link-" + hashlib.sha1(url.encode("utf-8")).hexdigest()[:16]


def build_material(
    *,
    url: str,
    platform: str,
    source_type: str,
    title: str,
    excerpt: str,
    cover_url: str,
    user_note: str,
    project: str,
    design_stage: str,
    portfolio_placement: str,
    message: str,
) -> MaterialRecord:
    now = now_iso()
    material_id = material_id_for_url(url)
    display_title = title or f"{platform} link"
    preview_parts = [
        f"Title: {display_title}",
        f"Platform: {platform}",
        f"URL: {url}",
        f"Excerpt: {excerpt}" if excerpt else "",
        f"User note: {user_note}" if user_note else "",
        f"Capture note: {message}",
    ]
    preview = "\n".join(part for part in preview_parts if part)
    tags = ["link", "external-reference", platform, source_type, design_stage or "unknown"]
    score = 68
    if user_note:
        score += 10
    if excerpt:
        score += 8
    if project and project != "unknown":
        score += 6
    return MaterialRecord(
        id=material_id,
        filename=display_title[:120],
        path=url,
        extension="link",
        size=0,
        modified_time=now,
        source_folder="link-capture",
        content_preview=preview[:1000],
        parse_status="link_captured",
        parse_error="" if excerpt or title else message,
        word_count=len(preview.split()),
        material_type="reference" if source_type in {"reference", "social_post", "short_video"} else "research",
        portfolio_stage=stage_to_portfolio_stage(design_stage),
        project_guess=project or "unknown",
        tags=list(dict.fromkeys(tags)),
        material_score=min(95, score),
        reason=f"Captured external {source_type} link for {portfolio_placement}.",
        notes=user_note,
        review_status="needs_review",
        file_hash=hashlib.sha1(url.encode("utf-8")).hexdigest(),
        first_seen_at=now,
        last_seen_at=now,
        source_mode="imported",
        url=url,
        platform=platform,
        source_type=source_type,
        title=display_title,
        excerpt=excerpt,
        cover_url=cover_url,
        user_note=user_note,
        design_stage=design_stage or "unknown",
        portfolio_placement=portfolio_placement,
        created_at=now,
        updated_at=now,
    )


def capture_link(
    url: str,
    user_note: str = "",
    project: str = "unknown",
    design_stage: str = "unknown",
    portfolio_placement: str = "",
    fetch_metadata: bool = True,
) -> LinkCaptureResult:
    try:
        normalized = normalize_url(url)
    except ValueError as exc:
        return LinkCaptureResult(ok=False, message=str(exc), fallback_saved=False)

    platform = detect_platform(normalized)
    source_type = infer_source_type(platform, normalized)
    metadata: dict[str, str] = {}
    message = "Link captured."
    if fetch_metadata and source_type not in {"short_video", "social_post"}:
        try:
            metadata = extract_webpage_metadata(normalized)
            if metadata.get("parse_error"):
                message = metadata["parse_error"]
        except Exception as exc:
            message = f"Automatic metadata extraction was limited: {exc}. The link was saved with your note."
    elif source_type in {"short_video", "social_post"}:
        message = "This platform may limit automatic extraction. The link is saved, and your note will help DesignMate understand why it matters."

    material = build_material(
        url=normalized,
        platform=platform,
        source_type=source_type,
        title=metadata.get("title", ""),
        excerpt=metadata.get("excerpt", ""),
        cover_url=metadata.get("cover_url", ""),
        user_note=user_note.strip(),
        project=project or "unknown",
        design_stage=design_stage or "unknown",
        portfolio_placement=default_portfolio_placement(source_type, design_stage or "unknown", portfolio_placement),
        message=message,
    )
    database.init_db()
    database.upsert_material(material)
    database.rebuild_fts_index()
    return LinkCaptureResult(
        ok=True,
        material_id=material.id,
        url=normalized,
        platform=platform,
        title=material.title,
        excerpt=material.excerpt,
        source_type=source_type,
        cover_url=material.cover_url,
        message=message,
        fallback_saved=not bool(material.excerpt or material.title != f"{platform} link"),
        material=material.to_dict(),
    )
