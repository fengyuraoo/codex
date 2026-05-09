from __future__ import annotations

from datetime import datetime
from html import escape
from pathlib import Path

from . import database
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
        "2 分钟演示脚本：开场说明 DesignMate 用来把零散设计资料变成作品集叙事；导入资料到 inbox；运行扫描；在 Search 中搜索用户痛点；编辑分类；向 Ask DesignMate 提问；生成页面草稿；导出作品集案例；最后总结当前是规则版 AI，真实模型和图像理解在下一轮接入。",
    ),
    "a3_portfolio_page_content.md": (
        "A3 Portfolio Page Content",
        "项目标题：DesignMate 本地 AI 作品集资料库。一句话定位：把零散设计资料转化为清晰的作品集叙事。A3 页面应包含项目背景、用户痛点、设计机会、工作流、核心功能、界面展示说明、技术架构、版本迭代、当前成果与下一步。",
    ),
    "two_page_portfolio_story.md": (
        "Two Page Portfolio Story",
        "第 1 页讲问题、用户、产品定位和功能架构：资料分散、灵感难回收、作品集叙事困难。第 2 页讲界面、流程、验证和迭代结果：Dashboard、Search、Ask、Reports、Drafts、Export 如何串成完整 demo。",
    ),
    "screenshot_checklist.md": (
        "Screenshot Checklist",
        "建议截图：Dashboard 总览、Search + Detail、Batch Edit、Ask DesignMate、Reports、Portfolio Draft、Export Case。截图时可开启 Showcase Mode，隐藏过多开发提示。",
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
    link_materials = [item for item in database.list_materials(limit=None) if item.url]
    external_lines = [
        "# External References and Link Capture Evidence",
        "",
        f"Generated at: {datetime.now().isoformat(timespec='seconds')}",
        "",
        "This file collects captured external links that can support moodboards, research sources, inspiration evidence and process references.",
        "",
    ]
    if link_materials:
        for item in link_materials[:50]:
            external_lines.extend(
                [
                    f"## {item.title or item.filename}",
                    "",
                    f"- Platform: {item.platform or 'generic webpage'}",
                    f"- Source type: {item.source_type or 'link'}",
                    f"- Project: {item.project_guess or 'unknown'}",
                    f"- Portfolio placement: {item.portfolio_placement or 'Design Inspiration'}",
                    f"- URL: {item.url}",
                    f"- User note: {item.user_note or item.notes or '待补充'}",
                    f"- Excerpt: {item.excerpt or item.content_preview[:240] or '自动提取受限，需人工补充说明。'}",
                    "",
                ]
            )
    else:
        external_lines.extend(["- No captured link material yet.", "- Use Link Capture in the Web UI to add external references.", ""])
    external_path = EXPORT_DIR / "external_references.md"
    atomic_write_text(external_path, "\n".join(external_lines))
    written["external_references.md"] = external_path
    html_parts = [
        "<!doctype html><html lang='zh-CN'><head><meta charset='utf-8'><title>DesignMate Case</title>",
        "<style>body{font-family:Segoe UI,Microsoft YaHei,sans-serif;margin:0;background:#f6f5f1;color:#1b1c1d;line-height:1.65}main{max-width:1120px;margin:auto;padding:42px}header{padding:42px 0}section{background:#fff;border:1px solid #d7d2c9;border-radius:8px;margin:16px 0;padding:24px;box-shadow:0 10px 24px rgba(40,42,44,.06)}h1{font-size:42px;margin:0}h2{color:#146c68;margin-top:0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.tag{display:inline-block;border:1px solid #dcefed;color:#146c68;border-radius:999px;padding:4px 10px;margin-right:8px}</style></head><body><main>",
        "<header><span class='tag'>Local First</span><span class='tag'>AI Fallback</span><span class='tag'>Portfolio Workflow</span><h1>DesignMate Portfolio Case</h1><p>一个帮助设计学生把零散资料转化为作品集叙事的本地 AI 原型。</p></header>",
        "<div class='grid'>",
    ]
    for filename, (title, body) in SECTIONS.items():
        if filename == "README.md":
            continue
        html_parts.append(f"<section><h2>{escape(title)}</h2><p>{escape(body)}</p></section>")
    if link_materials:
        refs = "".join(
            f"<li><strong>{escape(item.title or item.filename)}</strong> · {escape(item.platform or 'generic webpage')} · <a href='{escape(item.url)}'>{escape(item.url)}</a></li>"
            for item in link_materials[:12]
        )
        html_parts.append(f"<section><h2>External References</h2><p>Captured links can be used as inspiration evidence, research sources and moodboard sources.</p><ul>{refs}</ul></section>")
    html_parts.append("</div></main></body></html>")
    html_path = EXPORT_DIR / "designmate_case.html"
    atomic_write_text(html_path, "\n".join(html_parts))
    written["designmate_case.html"] = html_path
    return written
