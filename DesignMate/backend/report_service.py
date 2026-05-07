from __future__ import annotations

from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path
from typing import Any

from . import database
from .classifier import needs_confirmation
from .models import MaterialRecord
from .paths import DRAFTS_DIR, REPORTS_DIR, REVIEW_DIR, ROOT
from .utils import atomic_write_text


PROJECTS = ["reader-design", "info-center", "thesis", "general", "unknown"]
STAGE_LABELS = {
    "background": "背景页",
    "research": "调研页",
    "insight": "痛点页",
    "concept": "概念页",
    "development": "发展页",
    "final": "最终展示页",
    "presentation": "最终展示页",
    "reflection": "复盘页",
    "unknown": "待确认",
}


def table(counts: Counter[str]) -> list[str]:
    lines = ["| 项目 | 数量 |", "| --- | ---: |"]
    for key, value in sorted(counts.items()):
        lines.append(f"| {key} | {value} |")
    return lines


def strongest(items: list[MaterialRecord]) -> MaterialRecord | None:
    return sorted(items, key=lambda item: item.material_score, reverse=True)[0] if items else None


def gap_for_project(project: str, items: list[MaterialRecord]) -> str:
    stages = {item.portfolio_stage for item in items}
    if not items:
        return "暂无资料，需要先补充项目背景、调研和方案说明。"
    for stage in ["research", "insight", "concept", "development", "final"]:
        if stage not in stages:
            return f"缺少 {stage} 阶段资料，作品集叙事会断层。"
    return "基础阶段较完整，下一步应验证证据质量和页面表达。"


def concrete_questions(items: list[MaterialRecord]) -> list[str]:
    questions = []
    for item in items:
        if needs_confirmation(item):
            questions.append(f"`{item.filename}` 当前为 {item.material_type}/{item.project_guess}/{item.portfolio_stage}，是否符合真实项目语境？")
        if item.parse_status not in {"parsed", "metadata_only"}:
            questions.append(f"`{item.filename}` 解析状态为 {item.parse_status}，是否需要补充文本版摘要？")
        if item.material_score >= 70 and item.portfolio_stage == "unknown":
            questions.append(f"`{item.filename}` 分数较高但阶段未知，应该放在作品集哪一页？")
    defaults = [
        "阅读器设计是否已有明确目标用户和低干扰阅读场景？",
        "阅读器设计的竞品分析是否能支持功能取舍？",
        "图信中心设计是否已有空间动线证据？",
        "图信中心设计的功能分区是否对应真实用户行为？",
        "论文资料是否需要独立于作品集项目管理？",
        "通用作品集资料是否需要转成页面模板？",
        "哪些资料应该从 inbox 移入 library？",
        "哪些高价值资料需要配图或截图？",
        "哪些资料只适合做内部参考，不进入最终作品集？",
        "下一轮是否需要为每个项目建立单独报告？",
    ]
    for question in defaults:
        if len(questions) >= 10:
            break
        questions.append(question)
    return questions[:12]


def next_tasks(items: list[MaterialRecord]) -> list[str]:
    tasks = [
        "P0：复核 unknown 项目归属，优先处理高分资料。",
        "P0：为阅读器设计补充一条用户痛点到设计机会的证据链。",
        "P0：为图信中心设计补充空间动线和功能分区之间的关系。",
        "P0：检查 feedback 类资料，把可执行修改点拆成任务。",
        "P1：把 Top 10 高价值资料分别标注可进入的作品集页。",
        "P1：为 thesis 资料确认是否进入作品集或独立论文资料库。",
        "P1：为每个项目补一段 100 字项目概括。",
        "P1：将 inbox 中已确认资料迁移到 library。",
        "P2：给图片资料补充手动描述，方便后续搜索。",
        "P2：整理一份页面结构草稿，把背景、调研、洞察、方案串起来。",
        "P2：准备 PDF/DOCX/PPTX 解析测试文件。",
        "P2：记录 Web UI 中最想先编辑的字段。",
    ]
    return tasks


def build_latest_report(items: list[MaterialRecord]) -> str:
    type_counts = Counter(item.material_type for item in items)
    project_counts = Counter(item.project_guess for item in items)
    stage_counts = Counter(item.portfolio_stage for item in items)
    parse_counts = Counter(item.parse_status for item in items)
    top = sorted(items, key=lambda item: item.material_score, reverse=True)[:10]
    by_project = defaultdict(list)
    by_stage = defaultdict(list)
    for item in items:
        by_project[item.project_guess].append(item)
        by_stage[item.portfolio_stage].append(item)

    high_value = sum(1 for item in items if item.material_score >= 70)
    unknown = sum(1 for item in items if item.material_type == "unknown" or item.project_guess == "unknown")
    import_stats = database.get_import_stats()
    unparsed = [item for item in items if item.parse_status not in {"parsed", "metadata_only"}]
    latest_batch = import_stats.get("latest_batch") or {}
    inbox_count = import_stats.get("inbox_file_count", 0)
    library_count = import_stats.get("library_file_count", 0)
    lines = [
        "# DesignMate 本地资料报告",
        "",
        f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
        "",
        "## 1. 今日摘要",
        "",
        f"当前资料库共有 {len(items)} 条资料，其中 {high_value} 条属于高价值资料，{unknown} 条仍需要确认分类或项目归属。`data/inbox` 中有 {inbox_count} 个文件，`data/library` 中有 {library_count} 个文件；资料已经写入本地 SQLite，并同步生成搜索索引、报告和 Web UI 数据。",
        "",
        "### 新增资料提示",
        "",
        f"- 当前 inbox 文件数：{inbox_count}。如果今天刚加入真实项目资料，建议先在 Search 中用项目名、痛点、调研、反馈等关键词检查命中情况。",
        f"- 上次扫描时间：{import_stats.get('last_scan_time') or '暂无扫描记录'}。",
        f"- 上次报告生成时间：{import_stats.get('last_report_time') or '暂无报告记录'}。",
        f"- 最近扫描批次：{latest_batch.get('id', '暂无')}，新增 {latest_batch.get('new_files', 0)}，更新 {latest_batch.get('updated_files', 0)}，重复 {latest_batch.get('duplicate_files', 0)}，失败 {latest_batch.get('failed_files', 0)}。",
        "",
        "### 未解析资料提示",
        "",
        f"- 未解析或解析异常资料：{len(unparsed)} 条。",
        "- 对 PDF、DOCX、PPTX 或图片资料，建议补一份同名 Markdown 摘要，写清项目、场景、证据价值和可用于作品集的位置。",
        "",
        "### 建议补充资料",
        "",
        "- 阅读器设计：补充低干扰阅读的用户访谈摘录、草图演进和功能取舍说明。",
        "- 图信中心设计：补充空间调研照片说明、动线观察记录和功能分区依据。",
        "- 论文资料：补充双城通勤的概念定义、样本来源和结论边界。",
        "",
        "### 本次扫描资料状态",
        "",
        f"- 本次新增资料：{latest_batch.get('new_files', 0)} 条。",
        f"- 本次更新资料：{latest_batch.get('updated_files', 0)} 条。",
        f"- 重复资料：{latest_batch.get('duplicate_files', 0)} 条。",
        f"- 解析失败资料：{latest_batch.get('failed_files', 0)} 条。",
        "",
        "## 2. 资料分布",
        "",
        "### 类型分布",
        "",
        *table(type_counts),
        "",
        "### 项目分布",
        "",
        *table(project_counts),
        "",
        "### 阶段分布",
        "",
        *table(stage_counts),
        "",
        "### 解析状态",
        "",
        *table(parse_counts),
        "",
        "## 3. 高价值资料 Top 10",
        "",
    ]
    for item in top:
        lines.extend(
            [
                f"### {item.filename}",
                "",
                f"- 为什么重要：{item.reason or '包含可转化为作品集叙事的关键词和正文。'}",
                f"- 可用于哪个项目：{item.project_guess}",
                f"- 可用于作品集哪个阶段：{item.portfolio_stage}",
                f"- 需要补充什么：补充来源、图像证据或设计决策说明。",
                "",
            ]
        )

    lines.extend(["## 4. 项目视角分析", ""])
    for project in PROJECTS:
        project_items = by_project.get(project, [])
        best = strongest(project_items)
        lines.extend(
            [
                f"### {project}",
                "",
                f"- 当前资料数量：{len(project_items)}",
                f"- 最强资料：{best.filename if best else '暂无'}",
                f"- 最大缺口：{gap_for_project(project, project_items)}",
                "- 下一步建议：补齐缺口阶段，并为高价值资料写一句作品集用途说明。",
                "",
            ]
        )

    lines.extend(["## 5. 作品集转化建议", ""])
    stage_map = [
        ("background", "背景页可用资料"),
        ("research", "调研页可用资料"),
        ("insight", "痛点页可用资料"),
        ("concept", "概念页可用资料"),
        ("development", "发展页可用资料"),
        ("final", "最终展示页可用资料"),
    ]
    for stage, title in stage_map:
        lines.extend([f"### {title}", ""])
        candidates = by_stage.get(stage, [])[:8]
        if candidates:
            for item in candidates:
                lines.append(f"- `{item.filename}`：{item.reason or '可作为页面证据。'}")
        else:
            lines.append("- 暂无明确资料。")
        lines.append("")

    lines.extend(["## 6. 需要确认的问题", ""])
    for question in concrete_questions(items):
        lines.append(f"- {question}")
    lines.extend(["", "## 7. 明日任务", ""])
    for task in next_tasks(items):
        lines.append(f"- {task}")
    lines.append("")
    return "\n".join(lines)


def build_need_confirm(items: list[MaterialRecord]) -> str:
    lines = ["# Latest Need Confirm", "", f"Generated at: {datetime.now().isoformat(timespec='seconds')}", ""]
    for question in concrete_questions(items):
        lines.append(f"- [ ] {question}")
    return "\n".join(lines)


def build_next_actions(items: list[MaterialRecord]) -> str:
    lines = ["# Latest Next Actions", "", f"Generated at: {datetime.now().isoformat(timespec='seconds')}", ""]
    for task in next_tasks(items):
        lines.append(f"- [ ] {task}")
    return "\n".join(lines)


def build_portfolio_materials(items: list[MaterialRecord]) -> str:
    lines = ["# Latest Portfolio Materials", "", f"Generated at: {datetime.now().isoformat(timespec='seconds')}", ""]
    for item in sorted(items, key=lambda row: row.material_score, reverse=True):
        if item.material_score < 55:
            continue
        lines.extend(
            [
                f"## {item.filename}",
                "",
                f"- 类型：{item.material_type}",
                f"- 项目：{item.project_guess}",
                f"- 作品集阶段：{item.portfolio_stage}",
                f"- 分数：{item.material_score}",
                f"- 可用理由：{item.reason}",
                f"- 路径：`{item.path}`",
                "",
            ]
        )
    return "\n".join(lines)


def generate_reports() -> dict[str, Path]:
    items = database.list_materials()
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    REVIEW_DIR.mkdir(parents=True, exist_ok=True)
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    latest = build_latest_report(items)
    latest_path = REPORTS_DIR / "latest_report.md"
    dated_path = REPORTS_DIR / f"{date.today().isoformat()}-designmate-report.md"
    need_confirm_path = REVIEW_DIR / "latest_need_confirm.md"
    next_actions_path = REVIEW_DIR / "latest_next_actions.md"
    portfolio_path = DRAFTS_DIR / "latest_portfolio_materials.md"
    atomic_write_text(latest_path, latest)
    atomic_write_text(dated_path, latest)
    atomic_write_text(need_confirm_path, build_need_confirm(items))
    atomic_write_text(next_actions_path, build_next_actions(items))
    atomic_write_text(portfolio_path, build_portfolio_materials(items))
    database.save_report("latest_report", str(latest_path.relative_to(ROOT)).replace("\\", "/"), latest)
    return {
        "latest_report": latest_path,
        "dated_report": dated_path,
        "need_confirm": need_confirm_path,
        "next_actions": next_actions_path,
        "portfolio_materials": portfolio_path,
    }
