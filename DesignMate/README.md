# DesignMate

DesignMate 是一个面向设计学生的本地 AI 作品集资料管理与创作辅助工具。v0.6 已升级为更像真实 AI 产品的本地原型：它能导入资料、建立 SQLite 索引、搜索与编辑、批量整理、向 Ask DesignMate 提问、生成作品集页面草稿，并导出 DesignMate 自身的作品集案例包。

## v0.6 能做什么

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
- 提供 66 项测试和 `quality_gate_v06.md`。

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
4. DesignMate 会先检索本地资料，再返回规则版回答、使用资料、后续建议和需要确认的问题。

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
- `portfolio_export/demo_script.md`
- `portfolio_export/*.md`

## 当前限制

- Ask DesignMate 当前是规则版 AI，不调用真实模型。
- 图片理解尚未接入，只支持元数据、预览和人工 notes。
- PDF/DOCX/PPTX 解析依赖为可选，复杂文件可能只记录元信息。
- 扫描批次已记录，但还未提供完整历史对比 UI。
