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
    preview = " ".join((item.content_preview or item.user_note or item.notes or item.excerpt or "").split())[:120]
    link_bits = f" | platform {item.platform} | placement {item.portfolio_placement}" if item.url else ""
    return f"- {item.filename} | {item.material_type}/{item.portfolio_stage}/{item.project_guess}{link_bits} | score {item.material_score} | tags: {tags} | {preview}"


def summarize_material(material: MaterialRecord, provider: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    summary = (
        f"`{material.filename}` 属于 {material.project_guess} 项目，当前类型为 {material.material_type}，"
        f"适合放在 {material.portfolio_stage} 阶段。它的价值在于：{material.reason or '可作为设计过程证据，但需要人工补充用途说明。'}"
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
        "next_actions": ["补充缺失阶段资料", "为高价值资料写一句使用场景", "确认哪些资料进入汇报、复盘或作品集输出"],
    }


def has_chinese(text: str) -> bool:
    return any("\u4e00" <= char <= "\u9fff" for char in text or "")


def resolve_language(question: str, language: str | None = None) -> str:
    if has_chinese(question):
        return "zh"
    return "zh" if language == "zh" else "en"


def section_keys(language: str) -> dict[str, str]:
    if language == "zh":
        return {
            "summary": "摘要",
            "materials": "相关资料",
            "insight": "设计洞察",
            "placement": "可用场景",
            "confirm": "需要确认",
            "actions": "下一步建议",
        }
    return {
        "summary": "Summary",
        "materials": "Relevant Materials",
        "insight": "Design Insight",
        "placement": "Use Cases",
        "confirm": "Things to Confirm",
        "actions": "Next Action",
    }


def ask_designmate(question: str, context_materials: list[MaterialRecord], provider: str | None = None, language: str | None = None) -> dict[str, Any]:
    _, mode = configured_provider(provider)
    q = (question or "").strip()
    lang = resolve_language(q, language)
    keys = section_keys(lang)
    top = sorted(context_materials, key=lambda item: item.material_score, reverse=True)[:8]
    if not top:
        if lang == "zh":
            sections = {
                keys["summary"]: "暂时没有找到可引用的本地资料。",
                keys["materials"]: [],
                keys["insight"]: "没有证据时，DesignMate 不会编造设计判断。",
                keys["placement"]: "请先导入项目证据，再判断它适合项目复盘、方案汇报、作品集页面、客户沟通还是下一轮设计迭代。",
                keys["confirm"]: ["当前回答没有本地资料支撑。"],
                keys["actions"]: ["导入调研、草图、反馈或外部链接", "运行 python scripts/run_designmate.py", "带上项目名重新提问"],
            }
        else:
            sections = {
                keys["summary"]: "No local materials were found for this question yet.",
                keys["materials"]: [],
                keys["insight"]: "DesignMate cannot make a reliable design judgement without evidence.",
                keys["placement"]: "Import project evidence first, then decide whether it supports project reflection, design presentation, portfolio pages, client communication or the next design iteration.",
                keys["confirm"]: ["This answer has no supporting local evidence yet."],
                keys["actions"]: ["Import research notes, sketches, feedback or links", "Run python scripts/run_designmate.py", "Ask again with a project name or material type"],
            }
        return {
            "mode": mode,
            "answer": sections_to_markdown(sections),
            "answer_sections": sections,
            "suggestions": sections[keys["actions"]],
            "need_confirm": sections[keys["confirm"]],
            "confidence": 0.2,
        }
    evidence = "\n".join(item_line(item) for item in top[:5])
    related = [item.filename for item in top[:5]]
    stages = sorted({item.portfolio_stage for item in top if item.portfolio_stage})
    if any(word in q for word in ["缺少", "问题", "最大问题", "风险"]):
        summary = "当前最大问题不是资料数量，而是证据链是否能支撑设计判断和后续输出。"
        judgement = "建议检查调研、痛点、概念和最终展示之间是否连续，避免只展示素材而没有设计判断。"
    elif any(word in q for word in ["痛点", "调研", "资料", "找", "灵感链接", "短视频", "外部参考", "moodboard", "参考"]):
        summary = "已优先找到与问题、调研或证据相关的资料。"
        judgement = "这些资料适合转化为调研页、痛点页、Moodboard 或设计机会页；外部链接需要用 user note 说明它为何能支撑项目判断。"
    elif any(word in q for word in ["几页", "页面", "作品集"]):
        summary = "建议先组织为背景、调研、痛点、概念、发展、最终展示 6 类页面。"
        judgement = "页面数量应由证据强度决定，高分资料进入主线，弱资料作为补充或内部参考。"
    else:
        summary = "基于当前命中的本地资料，建议先把高分资料转成可追溯的设计证据。"
        judgement = "下一步应确认缺失阶段，并为每条关键资料写一句可用场景。"
    if lang == "en":
        if any(item.url for item in top):
            judgement = "Some matched materials are external links. Use their user notes to explain why they matter before placing them in a moodboard, research source list or process evidence section."
        sections = {
            keys["summary"]: summary if not has_chinese(summary) else "Based on the matched local materials, prioritize high-scoring evidence and turn it into traceable design evidence.",
            keys["materials"]: related,
            keys["insight"]: judgement if not has_chinese(judgement) else "Check whether research, pain points, concept development and final presentation form a continuous evidence chain.",
            keys["placement"]: f"Use these materials for project reflection, design presentation, portfolio pages, client communication or next iteration. Strongest stages: {', '.join(stages[:5]) or 'research / insight / concept'}.",
            keys["confirm"]: ["This rule-based answer is based on local fields and keyword evidence; confirm the design conclusion manually."],
            keys["actions"]: ["Open Text Search to inspect these materials", "Add notes to the top evidence cards", "Use them in a report, critique or portfolio draft", "Add missing image, link or research evidence"],
        }
    else:
        sections = {
            keys["summary"]: summary,
            keys["materials"]: related,
            keys["insight"]: judgement,
            keys["placement"]: f"可用于项目复盘、方案汇报、作品集页面、客户沟通或下一轮设计迭代。当前最强阶段：{', '.join(stages[:5]) or 'research / insight / concept'}。",
            keys["confirm"]: ["这是规则版回答，只基于本地字段、关键词和用户备注，需要人工确认设计结论。"],
            keys["actions"]: ["打开文本搜索检查这些资料", "为高价值资料补充备注", "用于汇报、复盘或作品集草稿", "补充缺失的图片、链接或调研证据"],
        }
    return {
        "mode": mode,
        "answer": sections_to_markdown(sections) + "\n\n## 原始命中\n" + evidence,
        "answer_sections": sections,
        "suggestions": sections[keys["actions"]],
        "need_confirm": sections[keys["confirm"]],
        "confidence": min(0.9, 0.45 + len(top) * 0.05),
    }


def sections_to_markdown(sections: dict[str, Any]) -> str:
    lines: list[str] = []
    for title, value in sections.items():
        lines.extend([f"## {title}", ""])
        if isinstance(value, list):
            lines.extend([f"- {item}" for item in value] or ["- 暂无"])
        else:
            lines.append(str(value))
        lines.append("")
    return "\n".join(lines)
