from __future__ import annotations

import os
from typing import Any

from .models import MaterialRecord
from .prompt_service import get_prompt


SUPPORTED_PROVIDERS = {"rule_based", "openai", "deepseek", "ollama"}


def configured_provider(provider: str | None = None) -> tuple[str, str]:
    requested = (provider or os.getenv("DESIGNMATE_AI_PROVIDER") or "rule_based").lower()
    if requested not in SUPPORTED_PROVIDERS:
        return "rule_based", "rule_based_fallback"
    if requested == "openai" and not os.getenv("OPENAI_API_KEY"):
        return "rule_based", "rule_based_fallback"
    if requested == "deepseek" and not os.getenv("DEEPSEEK_API_KEY"):
        return "rule_based", "rule_based_fallback"
    if requested == "ollama" and not os.getenv("OLLAMA_BASE_URL"):
        return "rule_based", "rule_based_fallback"
    return requested, requested


def item_line(item: MaterialRecord) -> str:
    tags = ", ".join(item.tags[:5])
    preview = " ".join((item.content_preview or item.notes or "").split())[:120]
    return f"- {item.filename} | {item.material_type}/{item.portfolio_stage}/{item.project_guess} | score {item.material_score} | tags: {tags} | {preview}"


def summarize_material(material: MaterialRecord, provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    summary = (
        f"`{material.filename}` 属于 {material.project_guess} 项目，当前类型为 {material.material_type}，"
        f"适合放在 {material.portfolio_stage} 阶段。它的价值在于：{material.reason or '可作为作品集叙事证据，但需要人工补充用途说明。'}"
    )
    return {"mode": mode, "prompt": get_prompt("material_summary"), "summary": summary, "need_confirm": material.review_status != "confirmed"}


def classify_material_ai(material: MaterialRecord, provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    return {
        "mode": mode,
        "material_type": material.material_type,
        "portfolio_stage": material.portfolio_stage,
        "project_guess": material.project_guess,
        "tags": material.tags,
        "reason": "规则版分类沿用当前数据库字段；真实 AI provider 可在后续接入。",
    }


def generate_portfolio_page(project: str, materials: list[MaterialRecord], provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    strongest = sorted(materials, key=lambda item: item.material_score, reverse=True)[:5]
    lines = [
        f"{project} 可以先生成一页“问题到证据”的作品集页面。",
        "页面应先说明场景和痛点，再展示调研、反馈或草图如何推动设计判断。",
        "可用资料：",
        *[item_line(item) for item in strongest],
    ]
    return {"mode": mode, "page": "\n".join(lines), "used_materials": [item.to_dict() for item in strongest]}


def critique_project(project: str, materials: list[MaterialRecord], provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    stages = {item.portfolio_stage for item in materials}
    missing = [stage for stage in ["research", "insight", "concept", "development", "final"] if stage not in stages]
    return {
        "mode": mode,
        "critique": f"{project} 当前最大风险是证据链不均衡。缺失阶段：{', '.join(missing) if missing else '暂无明显阶段缺口'}。",
        "next_actions": ["补充缺失阶段资料", "为高价值资料写一句作品集用途", "确认哪些资料进入最终页面"],
    }


def ask_designmate(question: str, context_materials: list[MaterialRecord], provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    q = (question or "").strip()
    top = sorted(context_materials, key=lambda item: item.material_score, reverse=True)[:8]
    if not top:
        return {
            "mode": mode,
            "answer": "我暂时没有找到可引用的本地资料。请先把资料放入 data/inbox，运行 run_designmate.py 后再提问。",
            "suggestions": ["导入调研、草图、反馈或页面草稿", "运行 python scripts/run_designmate.py", "尝试用项目名或资料类型提问"],
            "need_confirm": ["当前回答没有资料证据支撑。"],
        }
    evidence = "\n".join(item_line(item) for item in top[:5])
    if any(word in q for word in ["缺少", "问题", "最大问题", "风险"]):
        answer = "从当前资料看，最大问题通常不是资料数量，而是证据是否能串成页面叙事。建议先检查调研、痛点、概念和最终展示之间是否连续。\n\n参考资料：\n" + evidence
    elif any(word in q for word in ["痛点", "调研", "资料", "找"]):
        answer = "我优先找到了和问题、调研或证据相关的资料。可以把这些资料用于调研页、痛点页或设计机会页。\n\n参考资料：\n" + evidence
    elif any(word in q for word in ["几页", "页面", "作品集"]):
        answer = "建议先组织为背景、调研、痛点、概念、发展、最终展示 6 类页面，再按资料强弱删减。\n\n参考资料：\n" + evidence
    else:
        answer = "基于当前命中的本地资料，我建议先把高分资料转成作品集证据，再确认缺失阶段。\n\n参考资料：\n" + evidence
    return {
        "mode": mode,
        "answer": answer,
        "suggestions": ["打开 Search 查看这些资料", "为 Top 资料补 notes", "生成对应项目的页面草稿"],
        "need_confirm": ["规则版回答只基于本地资料字段和关键词，需要人工确认设计结论。"],
    }
