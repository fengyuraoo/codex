# DesignMate

## v0.7.2 Bilingual Design Workflow

DesignMate v0.7.2 adds a lightweight Chinese / English interface switch for the main workflow.

What changed:
- Top navigation now has `中 / EN` language buttons.
- Language preference is saved in `localStorage`.
- Main UI copy switches between Chinese and English across Search Hub, Text Search, Image Search, Link Capture, Ask DesignMate, Reports, static mode prompts and Design Evidence Cards.
- Ask DesignMate can return Chinese section titles when the user asks in Chinese, even if the UI is currently English.
- Link Capture success cards show bilingual-friendly fields such as Title / 链接标题, Platform / 平台, User Note / 我的备注 and Portfolio Placement / 作品集位置.
- v0.7.2 quality gate: `python DesignMate/scripts/quality_gate_v072.py`.

## v0.7.1 Link Capture

DesignMate v0.7.1 adds **Link Capture**, a safe way to turn external inspiration links into searchable design evidence.

What it does:
- Saves webpage, portfolio case, social post and short-video links as link materials.
- Detects platforms such as xiaohongshu, douyin, bilibili, tiktok, youtube, pinterest, behance, dribbble, wechat article and generic webpages.
- Attempts public webpage metadata extraction when access is allowed.
- Gracefully falls back for restricted social/short-video platforms by saving the original link and user note.
- Makes captured links available in Search, Ask DesignMate and Portfolio Export.

What it does not do:
- It does not download videos.
- It does not bypass login, anti-scraping systems or platform restrictions.
- It does not download copyrighted video content.

API:

```http
POST /api/link-capture
```

Frontend:
- Open the Web UI and choose `Link Capture`.
- Paste a design inspiration link, add project/stage/user note/portfolio placement, then click `Capture Link`.

## v0.7 Search Hub

DesignMate v0.7 reframes the product as **DesignMate Search Hub: A Local AI Search Hub for Design Portfolio Materials**.

Current v0.7 additions:
- A centered Search Hub home page with a large local search box.
- Three primary entries: Text Search, Image Search and Ask DesignMate.
- Search results are shown as **Design Evidence Cards** instead of plain file rows.
- Each card infers source mode, project, design stage, material type, confidence and portfolio placement.
- Image Search has an upload shell and metadata/filename matching. Real vision model integration is planned for v0.8.
- Ask DesignMate returns portfolio-oriented sections: Summary, Relevant materials, Design insight, Portfolio placement, Things to confirm and Next action.
- Showcase status displays total materials, user materials, demo materials, generated drafts and export status.
- v0.7 docs live in `docs/v0.7_search_hub.md` and `docs/demo_script_v07.md`.

Run the v0.7 checks:

```powershell
python DesignMate/scripts/run_tests.py
python DesignMate/scripts/quality_gate_v07.py
```

DesignMate 是一个面向设计学生的本地 AI 作品集资料管理与创作辅助工具。v0.6.1 是作品集演示稳定版：在 v0.6 的功能基础上，进一步区分 Demo/真实资料，优化 Web UI 截图表现，增强 Ask DesignMate 的结构化回答，并把作品集导出内容打磨成可用于项目展示的素材。

## v0.6.1 能做什么

- 扫描 `data/inbox/` 和 `data/library/`，写入 `data/designmate.db`。
- 记录文件 hash、首次出现时间、最近出现时间、扫描批次和重复标记。
- Dashboard 显示 inbox/library 数量、最近扫描批次、新增/更新/重复/失败文件数。
- 支持 Search、筛选、单个资料编辑和批量编辑。
- 增加 Ask DesignMate 工作区：先搜索本地资料，再用规则版 AI 生成回答。
- 增加 AI 服务抽象层：`rule_based`、`openai`、`deepseek`、`ollama`。
- 没有 API Key 时自动 fallback 到 `rule_based_fallback`，应用不会崩溃。
- 图片资料记录尺寸、预览路径、图片说明提示；未接入视觉模型时可手动写 notes。
- 作品集草稿支持页面类型：overview、background、research、pain-points、insight、concept、development、final、reflection。
- 一键导出 DesignMate 作品集案例：`portfolio_export/`。
- 区分数据来源：`demo` / `user` / `imported` / `unknown`。
- Search 支持 Source 筛选，可只看自己的 `data/inbox` 资料。
- Ask DesignMate 返回结构化 sections 和 confidence。
- Showcase Mode 可隐藏部分开发提示，便于截图展示。
- 作品集导出增加 A3 页面内容、两页叙事、演示脚本和截图清单。
- 提供 82 项测试和 `quality_gate_v061.md`。

## 一键运行

```powershell
python scripts/run_designmate.py
```

从仓库根目录运行：

```powershell
python DesignMate/scripts/run_designmate.py
```

## 打开 Web UI

```powershell
python scripts/start_frontend.py
```

打开：

- `http://127.0.0.1:8766/`

## 启动 API

```powershell
python scripts/start_api.py
```

默认地址：

- `http://127.0.0.1:8765/api/health`

## Ask DesignMate

1. 启动 API 和前端。
2. 打开 Web UI 的 Ask 页面。
3. 输入问题，例如“阅读器项目可以生成哪几页作品集？”。
4. DesignMate 会先检索本地资料，再返回回答摘要、相关资料、设计判断、作品集位置、需要确认和下一步建议。

## 只查看真实资料

在 Web UI 的 Search 页面使用 Source 筛选：

- `User inbox`：只看 `data/inbox` 中的真实资料。
- `Demo data`：只看示例资料。
- `Imported library`：只看 `data/library` 中的长期资料。

Demo 数据只用于演示，不应当被当成真实项目结论。

## AI 配置

默认不需要 API Key：

- provider: `rule_based`
- mode: `rule_based` 或 `rule_based_fallback`

未来可通过环境变量配置：

- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `OLLAMA_BASE_URL`

参考配置文件：

- `config/ai_settings.example.json`

如果配置了 `openai`、`deepseek` 或 `ollama` 但没有对应 Key/URL，DesignMate 会自动回退到规则版逻辑。

## 生成作品集页面草稿

```powershell
python scripts/generate_portfolio_draft.py --project reader-design --page pain-points
python scripts/generate_portfolio_draft.py --project info-center --page concept
```

输出：

- `drafts/latest_portfolio_page_draft.md`
- `drafts/{project}_{page}_draft.md`

## 导出作品集案例

```powershell
python scripts/export_portfolio_case.py
```

输出：

- `portfolio_export/designmate_case.html`
- `portfolio_export/a3_portfolio_page_content.md`
- `portfolio_export/two_page_portfolio_story.md`
- `portfolio_export/demo_script.md`
- `portfolio_export/screenshot_checklist.md`
- `portfolio_export/*.md`

## Showcase Mode

打开 Web UI 后点击顶部 `Showcase Mode` 按钮，可以隐藏部分开发提示，让 Dashboard/Search/Ask/Reports 更适合截图放入作品集。

## 当前限制

- Ask DesignMate 当前是规则版 AI，不调用真实模型。
- 图片理解尚未接入，只支持元数据、预览和人工 notes。
- PDF/DOCX/PPTX 解析依赖为可选，复杂文件可能只记录元信息。
- 扫描批次已记录，但还未提供完整历史对比 UI。
