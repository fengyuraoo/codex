from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from pathlib import Path

from . import database
from .models import MaterialRecord
from .paths import DRAFTS_DIR
from .utils import atomic_write_text


PROJECT_LABELS = {
    "reader-design": "阅读器设计",
    "info-center": "图信中心设计",
    "thesis": "论文资料",
    "general": "通用作品集资料",
}

PROJECT_PURPOSES = {
    "reader-design": "证明项目从低干扰阅读场景出发，能够把用户痛点转化为清晰的产品功能与交互逻辑。",
    "info-center": "证明空间设计不是形式堆叠，而是由用户行为、功能分区和动线组织共同驱动。",
    "thesis": "证明论文资料中的城市、通勤和空间结构问题可以被整理为有证据链的研究页面。",
    "general": "把通用作品集方法沉淀为页面结构、叙事逻辑和表达规范。",
}

STAGE_NEEDS = {
    "background": ["项目背景", "问题来源", "使用场景"],
    "research": ["用户访谈", "问卷", "观察记录"],
    "insight": ["痛点归纳", "需求证据", "设计机会"],
    "concept": ["概念方向", "功能设想", "方案取舍"],
    "development": ["草图演进", "原型迭代", "反馈修改"],
    "final": ["最终页面", "效果图", "关键交互说明"],
}

PAGE_CONFIG = {
    "overview": ("项目总览", "证明项目的背景、目标用户、核心问题和设计路径。", ["background", "research", "insight"]),
    "background": ("背景页", "说明问题发生的场景、用户和项目边界。", ["background", "research"]),
    "research": ("调研页", "证明设计判断来自真实观察、访谈或案例研究。", ["research"]),
    "pain-points": ("用户痛点页", "把调研资料转化为具体、可设计的问题。", ["insight", "research", "feedback"]),
    "insight": ("洞察页", "说明资料背后的判断和设计机会。", ["insight", "research"]),
    "concept": ("概念页", "证明概念方向如何回应痛点并形成方案策略。", ["concept", "sketch", "development"]),
    "development": ("发展页", "展示草图、反馈和迭代如何推动方案变清晰。", ["development", "sketch", "feedback"]),
    "final": ("最终展示页", "展示最终方案如何对应前文问题和证据。", ["final", "presentation"]),
    "reflection": ("复盘页", "说明项目限制、验证结果和下一轮迭代方向。", ["reflection", "feedback"]),
}


def clean_preview(item: MaterialRecord, limit: int = 120) -> str:
    text = " ".join((item.content_preview or "").split())
    return text[:limit] + ("..." if len(text) > limit else "")


def select_materials(project: str, limit: int = 18) -> list[MaterialRecord]:
    items = database.list_materials(project=project, limit=None)
    if not items and project == "general":
        items = database.list_materials(limit=None)
    return sorted(items, key=lambda item: (item.material_score, item.updated_at), reverse=True)[:limit]


def build_claims(items: list[MaterialRecord]) -> list[str]:
    claims: list[str] = []
    if any(item.material_type == "research" for item in items):
        claims.append("项目需要先用调研资料建立真实场景，再进入方案表达。")
    if any(item.material_type == "feedback" for item in items):
        claims.append("老师或他人反馈可以作为迭代依据，帮助页面说明设计判断如何被修正。")
    if any(item.material_type in {"sketch", "idea"} for item in items):
        claims.append("草图和概念资料能够展示方案从模糊问题到具体功能的形成过程。")
    if not claims:
        claims.append("当前资料可以先作为项目叙事的初始证据，但还需要补充更明确的调研、图像和迭代说明。")
    return claims[:3]


def missing_evidence(items: list[MaterialRecord]) -> list[str]:
    existing_types = {item.material_type for item in items}
    existing_stages = {item.portfolio_stage for item in items}
    missing: list[str] = []
    if "research" not in existing_types:
        missing.append("缺少用户调研或场景观察资料。")
    if "sketch" not in existing_types and "idea" not in existing_types:
        missing.append("缺少草图、概念发散或方案演进资料。")
    if "competitor" not in existing_types:
        missing.append("缺少竞品或案例对比，功能取舍的依据还不够清楚。")
    if "feedback" not in existing_types:
        missing.append("缺少反馈与修改记录，迭代过程不够可见。")
    for stage, labels in STAGE_NEEDS.items():
        if stage not in existing_stages:
            missing.append(f"缺少 {stage} 阶段资料，可补充：{'、'.join(labels)}。")
            break
    return missing[:6] or ["基础证据较完整，下一步应补充图像编号、来源和页面排版关系。"]


def page_materials(items: list[MaterialRecord], page: str) -> list[MaterialRecord]:
    _, _, priorities = PAGE_CONFIG.get(page, PAGE_CONFIG["overview"])
    selected = [
        item
        for item in items
        if item.portfolio_stage in priorities or item.material_type in priorities or any(token in item.filename.lower() for token in priorities)
    ]
    return sorted(selected or items, key=lambda item: item.material_score, reverse=True)[:12]


def layout_advice(page: str) -> list[str]:
    base = {
        "research": ["左侧放研究方法和样本说明", "右侧放关键发现卡片", "底部用一句话连接到痛点页"],
        "pain-points": ["顶部用一句话定义核心痛点", "中段放 2-3 条用户证据", "底部转译为设计机会"],
        "concept": ["先放概念原则", "再放功能模块或草图", "最后说明为什么选择这个方向"],
        "development": ["按时间线展示草图和反馈", "每轮迭代只强调一个修改判断", "避免堆叠无解释的过程图"],
        "final": ["用主图建立完成度", "用局部图说明关键功能", "用使用流程图回扣用户问题"],
    }
    return base.get(page, ["首屏说明页面目的", "中段展示证据和判断", "尾部连接到下一页叙事"])


def build_portfolio_draft(project: str, page: str = "overview") -> str:
    items = select_materials(project)
    focused = page_materials(items, page)
    label = PROJECT_LABELS.get(project, project)
    page_title, page_purpose, _ = PAGE_CONFIG.get(page, PAGE_CONFIG["overview"])
    by_stage: dict[str, list[MaterialRecord]] = defaultdict(list)
    for item in focused:
        by_stage[item.portfolio_stage].append(item)
    lines = [
        "# 页面标题",
        "",
        f"{label} - {page_title}",
        "",
        "> 作品集页面草稿",
        "",
        f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
        "",
        "## 页面目的",
        "",
        page_purpose + " " + PROJECT_PURPOSES.get(project, "说明该项目的设计问题、关键证据、方案逻辑和下一步补充方向。"),
        "",
        "## 页面目标",
        "",
        "这一页的目标是把本地资料转译为可被作品集读者理解的证据链。",
        "",
        "## 可用资料",
        "",
    ]
    if focused:
        for item in focused[:12]:
            lines.append(f"- `{item.filename}`：{item.material_type} / {item.portfolio_stage} / score {item.material_score}。{clean_preview(item, 80)}")
    else:
        lines.append("- 暂无该项目资料。请先把资料放入 `data/inbox` 并运行 `python scripts/run_designmate.py`。")
    lines.extend(["", "## 核心论点", ""])
    for claim in build_claims(focused):
        lines.append(f"- {claim}")
    lines.extend(["", "## 页面文案", ""])
    lines.append(
        f"{label} 的页面可以从“为什么需要这个设计”开始，而不是直接展示最终方案。"
        "先用调研、反馈或场景资料说明问题如何出现，再把草图、功能设想和方案迭代作为设计判断的证据。"
        "页面叙事应避免只罗列素材，重点展示每一类资料如何推动下一步决策。"
    )
    if focused:
        best = focused[0]
        lines.append(
            f"当前最适合作为页面入口的资料是 `{best.filename}`，因为它的评分较高，且与 `{best.project_guess}` 的 `{best.portfolio_stage}` 阶段相关。"
            "可以把它放在页面上方作为问题或证据入口，再向下展开设计机会和方案发展。"
        )
    lines.extend(["", "## 图像建议", ""])
    lines.extend(
        [
            "- 首屏放一张能够代表项目场景或核心问题的图，而不是只放最终效果。",
            "- 调研页使用访谈摘录、观察照片或竞品对比表。",
            "- 概念与发展页使用草图序列、功能模块图或关键决策标注。",
            "- 最终展示页用 2-4 张主图串起使用流程，并保留问题、行动、反馈之间的关系。",
        ]
    )
    lines.extend(["", "## 排版建议", ""])
    for advice in layout_advice(page):
        lines.append(f"- {advice}")
    lines.extend(["", "## 缺失证据", ""])
    for item in missing_evidence(focused):
        lines.append(f"- {item}")
    lines.extend(["", "## AI 自检", ""])
    lines.append("- 规则版草稿可能把资料字段当作结论，需要人工确认真实设计证据。")
    lines.append("- 如果页面文案听起来像方法论，而不是项目事实，请补充具体用户、场景、图像或反馈。")
    lines.append("")
    lines.extend(["## 推荐页面结构", ""])
    for stage, title in [
        ("background", "背景与场景"),
        ("research", "调研证据"),
        ("insight", "痛点与机会"),
        ("concept", "概念方向"),
        ("development", "方案迭代"),
        ("final", "最终展示"),
    ]:
        candidates = by_stage.get(stage, [])
        example = f"可用资料：`{candidates[0].filename}`" if candidates else "待补充资料"
        lines.append(f"- {title}：{example}")
    lines.append("")
    return "\n".join(lines)


def generate_portfolio_draft(project: str, page: str = "overview", output_path: Path | None = None) -> Path:
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    safe_page = page.replace("/", "-")
    output = output_path or (DRAFTS_DIR / "latest_portfolio_page_draft.md")
    project_output = DRAFTS_DIR / f"{project}_{safe_page}_draft.md"
    legacy_output = DRAFTS_DIR / "portfolio_page_draft.md"
    content = build_portfolio_draft(project, page)
    atomic_write_text(output, content)
    atomic_write_text(project_output, content)
    atomic_write_text(legacy_output, content)
    return output
