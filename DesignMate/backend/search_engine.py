from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from . import database
from .models import MaterialRecord
from .paths import DB_PATH


SYNONYMS = {
    "痛点": ["问题", "困扰", "需求", "用户痛点", "阻碍"],
    "调研": ["访谈", "问卷", "观察", "用户研究", "research"],
    "草图": ["手绘", "方案草图", "sketch", "线稿", "草绘"],
    "灵感": ["参考", "案例", "moodboard", "reference", "inspiration"],
    "反馈": ["老师反馈", "修改意见", "建议", "评审"],
    "作品集": ["portfolio", "页面", "叙事", "项目展示"],
    "图信中心": ["图书馆", "信息中心", "学习空间", "learning commons"],
    "阅读器": ["低干扰", "阅读", "标注", "知识卡片", "摘录"],
    "动线": ["路径", "流线", "空间动线", " circulation"],
    "设计机会": ["机会", "概念", "方向", "策略"],
}


def norm(text: str) -> str:
    return re.sub(r"\s+", "", (text or "").lower())


def has_chinese(text: str) -> bool:
    return bool(re.search(r"[\u4e00-\u9fff]", text))


def ngrams(text: str, size: int) -> list[str]:
    compact = norm(text)
    if len(compact) < size:
        return []
    return [compact[index : index + size] for index in range(len(compact) - size + 1)]


def expand_query(query: str) -> list[str]:
    base = [query.strip()]
    for key, values in SYNONYMS.items():
        if key in query or query in values:
            base.extend([key, *values])
    if has_chinese(query) and len(norm(query)) <= 6:
        base.extend(ngrams(query, 2))
        base.extend(ngrams(query, 3))
    return list(dict.fromkeys([item for item in base if item.strip()]))


def count_hit(text: str, token: str) -> int:
    if not token:
        return 0
    if has_chinese(token):
        return norm(text).count(norm(token))
    return (text or "").lower().count(token.lower())


def snippet(text: str, query: str, length: int = 220) -> str:
    clean = re.sub(r"\s+", " ", text or "").strip()
    if not clean:
        return "No text snippet available."
    tokens = expand_query(query)
    index = -1
    hit = query
    for token in tokens:
        index = clean.lower().find(token.lower())
        if index >= 0:
            hit = token
            break
    if index < 0:
        return clean[:length]
    start = max(0, index - 70)
    end = min(len(clean), index + len(hit) + 150)
    return ("..." if start else "") + clean[start:end] + ("..." if end < len(clean) else "")


def field_hits(text: str, tokens: list[str]) -> int:
    return sum(count_hit(text, token) for token in tokens)


def score_record(record: MaterialRecord, query: str, project: str | None, material_type: str | None, stage: str | None) -> dict[str, Any] | None:
    tokens = expand_query(query)
    content_full = database.read_full_content(record)
    fields = {
        "filename": (record.filename, 50),
        "tags": (" ".join(record.tags), 35),
        "content_preview": (record.content_preview, 25),
        "content_full": (content_full, 20),
        "notes": (record.notes, 18),
        "project_guess": (record.project_guess, 10),
        "material_type": (record.material_type, 10),
        "portfolio_stage": (record.portfolio_stage, 10),
    }
    score = 0.0
    matched_fields = []
    field_details = []
    for field, (text, weight) in fields.items():
        hits = field_hits(text, tokens)
        if hits:
            matched_fields.append(field)
            field_details.append(f"{field}({hits})")
            score += hits * weight
    if not matched_fields:
        return None
    if project and record.project_guess == project:
        score += 10
    if material_type and record.material_type == material_type:
        score += 10
    if stage and record.portfolio_stage == stage:
        score += 10
    score += min(15, record.material_score * 0.15)
    why = []
    if "filename" in matched_fields:
        why.append("命中文件名")
    if "tags" in matched_fields:
        why.append("命中标签")
    if "content_preview" in matched_fields or "content_full" in matched_fields:
        why.append("命中正文摘要/全文")
    if "notes" in matched_fields:
        why.append("命中人工备注")
    if record.material_score >= 70:
        why.append("资料评分较高")
    why.append("命中字段：" + "、".join(field_details))
    return {
        "id": record.id,
        "filename": record.filename,
        "path": record.path,
        "score": round(score, 2),
        "material_type": record.material_type,
        "portfolio_stage": record.portfolio_stage,
        "project_guess": record.project_guess,
        "tags": record.tags,
        "snippet": snippet(content_full or record.content_preview or record.notes, query),
        "content_snippet": snippet(content_full or record.content_preview or record.notes, query),
        "matched_fields": matched_fields,
        "why_relevant": " + ".join(why) + "。",
        "material_score": record.material_score,
        "parse_status": record.parse_status,
        "word_count": record.word_count,
    }


def search(query: str, project: str | None = None, material_type: str | None = None, stage: str | None = None, limit: int = 20, db_path: Path = DB_PATH) -> list[dict[str, Any]]:
    candidates = database.search_materials(query, project=project, material_type=material_type, stage=stage, limit=max(limit, 100), db_path=db_path)
    results = []
    for record in candidates:
        result = score_record(record, query, project, material_type, stage)
        if result:
            results.append(result)
    results.sort(key=lambda item: item["score"], reverse=True)
    for rank, item in enumerate(results[:limit], start=1):
        item["rank"] = rank
    return results[:limit]
