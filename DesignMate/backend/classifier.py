from __future__ import annotations

from collections import Counter
from typing import Any

from .models import MaterialRecord, now_iso


MATERIAL_RULES = [
    ("feedback", ["feedback", "老师反馈", "修改意见", "建议", "反馈", "comment", "评审"]),
    ("sketch", ["sketch", "草图", "手绘", "线稿", "草绘", "形态推敲"]),
    ("reference", ["reference", "灵感", "案例", "moodboard", "参考", "inspiration", "案例分析"]),
    ("research", ["research", "调研", "访谈", "问卷", "用户研究", "观察", "field study", "行为记录"]),
    ("competitor", ["competitor", "竞品", "对比", "benchmark", "竞品分析"]),
    ("draft", ["draft", "文案", "copy", "草稿", "页面草稿", "叙事"]),
    ("presentation", ["presentation", "汇报", "ppt", "pptx", "路演", "展示页"]),
    ("paper", ["paper", "论文", "文献", "双城通勤", "城市空间结构", "廊坊"]),
    ("idea", ["idea", "想法", "概念", "机会", "功能设想", "方向"]),
]

STAGE_RULES = [
    ("reflection", ["复盘", "反思", "reflection", "总结"]),
    ("presentation", ["presentation", "汇报", "作品集", "portfolio", "ppt", "展示页", "排版"]),
    ("final", ["final", "最终", "渲染", "成品", "落地", "最终展示"]),
    ("development", ["development", "迭代", "草图", "sketch", "模型", "推敲", "动线", "功能分区"]),
    ("concept", ["concept", "概念", "方案", "ideation", "想法", "设计机会", "功能设想"]),
    ("insight", ["insight", "洞察", "痛点", "机会", "发现"]),
    ("research", ["research", "调研", "访谈", "问卷", "用户研究", "场景", "行为"]),
    ("background", ["背景", "background", "问题", "目标", "城市空间结构"]),
]

PROJECT_RULES = [
    ("reader-design", ["reader-design", "reader", "阅读器", "阅读", "magread", "低干扰"]),
    ("info-center", ["info-center", "图信中心", "图信", "信息中心", "图书馆", "空间动线", "功能分区"]),
    ("thesis", ["thesis", "论文", "毕业", "课题", "双城通勤", "廊坊", "城市空间结构", "通勤人群", "交通联系"]),
    ("general", ["作品集", "portfolio", "设计学生", "资料", "灵感", "页面结构", "排版建议"]),
]

TAG_RULES = {
    "portfolio": ["作品集", "portfolio", "页面"],
    "user": ["用户", "user", "人群", "访谈对象"],
    "pain-point": ["痛点", "问题", "pain", "负担"],
    "research": ["调研", "访谈", "问卷", "research", "观察"],
    "sketch": ["草图", "手绘", "sketch", "线稿"],
    "feedback": ["反馈", "老师", "修改意见", "建议", "评审"],
    "concept": ["概念", "方案", "机会", "idea", "功能设想"],
    "presentation": ["汇报", "presentation", "ppt", "展示"],
    "space": ["空间", "动线", "功能分区", "图信中心"],
    "thesis": ["论文", "双城通勤", "廊坊", "城市空间"],
}

VALUE_KEYWORDS = ["用户", "痛点", "调研", "草图", "反馈", "方案", "洞察", "机会", "作品集", "动线", "低干扰", "双城通勤"]


def weighted_match(text: str, rules: list[tuple[str, list[str]]]) -> tuple[str, list[str], int]:
    lowered = text.lower()
    scores: Counter[str] = Counter()
    matched: dict[str, list[str]] = {}
    for label, keywords in rules:
        for keyword in keywords:
            hits = lowered.count(keyword.lower())
            if hits:
                scores[label] += hits
                matched.setdefault(label, []).append(keyword)
    if not scores:
        return "unknown", [], 0
    label, score = scores.most_common(1)[0]
    return label, list(dict.fromkeys(matched.get(label, []))), score


def infer_tags(text: str) -> list[str]:
    lowered = text.lower()
    tags = []
    for tag, keywords in TAG_RULES.items():
        if any(keyword.lower() in lowered for keyword in keywords):
            tags.append(tag)
    return tags


def apply_filename_priority(filename: str, material_type: str, keywords: list[str]) -> tuple[str, list[str]]:
    lowered = filename.lower()
    priorities = [
        ("feedback", ["feedback", "反馈", "修改意见"]),
        ("sketch", ["sketch", "草图", "手绘"]),
        ("competitor", ["competitor", "竞品"]),
        ("reference", ["reference", "灵感", "案例"]),
        ("draft", ["draft", "草稿", "文案"]),
        ("paper", ["paper", "论文", "双城通勤"]),
        ("research", ["research", "调研", "访谈", "问卷"]),
        ("idea", ["idea", "设想", "机会"]),
    ]
    for label, keys in priorities:
        if any(key.lower() in lowered for key in keys):
            return label, list(dict.fromkeys([f"filename:{label}", *keywords]))
    return material_type, keywords


def score_material(record: MaterialRecord, text: str, material_type: str, stage: str, project: str) -> tuple[int, str]:
    score = 10
    reasons = []
    if record.word_count > 0:
        score += 18
        reasons.append("有正文")
    if record.word_count >= 120:
        score += 10
        reasons.append("正文信息量较足")
    if record.parse_status in {"parsed", "metadata_only"}:
        score += 8
    if material_type != "unknown":
        score += 14
        reasons.append(f"类型明确为 {material_type}")
    if stage != "unknown":
        score += 10
        reasons.append(f"可对应 {stage} 阶段")
    if project != "unknown":
        score += 10
        reasons.append(f"项目归属为 {project}")

    lowered = text.lower()
    matched_value = [keyword for keyword in VALUE_KEYWORDS if keyword.lower() in lowered]
    score += min(30, len(matched_value) * 5)
    if matched_value:
        reasons.append("包含 " + "、".join(matched_value[:5]))
    if material_type == "unknown":
        score -= 12
    if project == "unknown":
        score -= 5
    if record.parse_status.endswith("_unavailable"):
        score -= 4
    return max(0, min(100, score)), "；".join(reasons) or "需要补充更多上下文"


def classify(record: MaterialRecord, content_full: str = "") -> MaterialRecord:
    text = " ".join(
        [
            record.filename,
            record.extension,
            record.content_preview,
            content_full,
            " ".join(record.tags),
            record.project_guess,
            record.material_type,
        ]
    )
    material_type, material_keywords, _ = weighted_match(text, MATERIAL_RULES)
    material_type, material_keywords = apply_filename_priority(record.filename, material_type, material_keywords)
    stage, stage_keywords, _ = weighted_match(text, STAGE_RULES)
    project, project_keywords, _ = weighted_match(text, PROJECT_RULES)
    tags = sorted(set(record.tags + infer_tags(text)))
    score, reason = score_material(record, text, material_type, stage, project)

    record.material_type = material_type
    record.portfolio_stage = stage
    record.project_guess = project
    record.tags = tags
    record.material_score = score
    record.reason = reason
    record.updated_at = now_iso()
    return record


def needs_confirmation(record: MaterialRecord) -> bool:
    return record.material_type == "unknown" or record.project_guess == "unknown" or record.material_score < 45

