from __future__ import annotations

from datetime import datetime
from html import escape
from pathlib import Path

from .paths import ROOT
from .utils import atomic_write_text


EXPORT_DIR = ROOT / "portfolio_export"


SECTIONS = {
    "project_overview.md": (
        "Project Overview",
        "DesignMate 是一个围绕设计学生作品集资料管理展开的本地 AI 产品原型。项目从“资料很多但叙事很散”的问题出发，尝试把扫描、搜索、分类、编辑、报告和页面草稿生成整合为一个可演示工作流。",
    ),
    "product_positioning.md": (
        "Product Positioning",
        "产品定位为本地 AI 作品集资料库。它不追求替代设计判断，而是让用户在准备作品集时更快找到证据、整理项目逻辑、确认缺失资料，并把资料转化为页面草稿。",
    ),
    "user_pain_points.md": (
        "User Pain Points",
        "目标用户的核心痛点包括资料分散、灵感难回收、调研和方案之间缺少证据链、反馈难沉淀、最终页面叙事常常临时拼接。",
    ),
    "feature_map.md": (
        "Feature Map",
        "核心功能包括资料导入、SQLite 本地数据库、中文搜索、资料详情编辑、批量编辑、Ask DesignMate、每日报告、作品集草稿生成和作品集案例导出。",
    ),
    "user_flow.md": (
        "User Flow",
        "用户每天只需要放入资料、运行扫描、打开 Web UI。之后可以搜索资料、批量确认分类、向 Ask DesignMate 提问、查看报告，并生成页面草稿。",
    ),
    "information_architecture.md": (
        "Information Architecture",
        "信息架构围绕 Dashboard、Search、Ask、Reports 和 Drafts 展开。核心数据对象是 MaterialRecord，包含文件、解析、分类、项目、标签、评分、备注、扫描历史和图片元数据。",
    ),
    "interface_screens.md": (
        "Interface Screens",
        "界面强调克制、清晰和可截图展示。Dashboard 展示导入状态和资料分布，Search 承担整理工作，Ask 提供规则版 AI 问答，Reports 连接下一步行动。",
    ),
    "technical_prototype.md": (
        "Technical Prototype",
        "原型使用 Python 标准库优先、SQLite、可选 FTS5、纯 HTML/CSS/JS 前端和本地 API。没有 API Key 时仍可使用 rule_based fallback。",
    ),
    "iteration_log.md": (
        "Iteration Log",
        "v0.1 完成文件夹 MVP，v0.3 引入 SQLite 和 API，v0.4 实现编辑闭环，v0.5 增加批量编辑和草稿生成，v0.6 增加 AI 抽象、Ask 工作区、扫描历史和作品集导出。",
    ),
    "portfolio_storyboard.md": (
        "Portfolio Storyboard",
        "建议排版为四页：第一页讲用户问题和产品机会，第二页讲信息架构与核心流程，第三页展示 Dashboard/Search/Ask 的界面，第四页展示技术原型、验证和下一步迭代。",
    ),
    "demo_script.md": (
        "Demo Script",
        "演示顺序：导入资料，运行扫描，打开 Dashboard 查看导入状态，搜索“用户痛点”，批量确认资料，向 Ask DesignMate 提问，生成 pain-points 页面草稿，导出作品集案例。",
    ),
    "README.md": (
        "Portfolio Export README",
        "这个目录是 DesignMate 自动生成的作品集案例素材包，可继续排版为两页或四页作品集展示。内容强调设计问题、产品逻辑、交互流程和原型验证。",
    ),
}


def build_markdown(title: str, body: str) -> str:
    return "\n".join(
        [
            f"# {title}",
            "",
            f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
            "",
            "## 作品集叙事",
            "",
            body,
            "",
            "## 可视化建议",
            "",
            "- 放入 Dashboard、Search、Ask 和 Reports 的关键截图。",
            "- 用流程箭头说明资料如何从 inbox 进入数据库，再转化为页面草稿。",
            "- 保留限制和下一步迭代，体现原型验证边界。",
            "",
        ]
    )


def export_portfolio_case() -> dict[str, Path]:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    written: dict[str, Path] = {}
    for filename, (title, body) in SECTIONS.items():
        path = EXPORT_DIR / filename
        atomic_write_text(path, build_markdown(title, body))
        written[filename] = path
    html_parts = [
        "<!doctype html><html lang='zh-CN'><head><meta charset='utf-8'><title>DesignMate Case</title>",
        "<style>body{font-family:Segoe UI,Microsoft YaHei,sans-serif;margin:0;background:#f6f5f1;color:#1b1c1d}main{max-width:980px;margin:auto;padding:36px}section{background:#fff;border:1px solid #d7d2c9;border-radius:8px;margin:16px 0;padding:22px}h1{font-size:34px}h2{color:#146c68}</style></head><body><main>",
        "<h1>DesignMate Portfolio Case</h1><p>本地 AI 作品集资料库原型：从资料管理到页面叙事。</p>",
    ]
    for filename, (title, body) in SECTIONS.items():
        if filename == "README.md":
            continue
        html_parts.append(f"<section><h2>{escape(title)}</h2><p>{escape(body)}</p></section>")
    html_parts.append("</main></body></html>")
    html_path = EXPORT_DIR / "designmate_case.html"
    atomic_write_text(html_path, "\n".join(html_parts))
    written["designmate_case.html"] = html_path
    return written
