# Quickstart

## v0.7.1 Link Capture quick use

1. Start the API:

```powershell
python DesignMate/scripts/start_api.py
```

2. Start the frontend:

```powershell
python DesignMate/scripts/start_frontend.py
```

3. Open `http://127.0.0.1:8766/` and choose `Link Capture`.
4. Paste a webpage, portfolio case, social post or short-video reference.
5. Add a short user note explaining why the link matters.
6. Click `Capture Link`.
7. Search the captured link later in Text Search or ask DesignMate about external references, moodboard sources or process evidence.

## v0.7 daily Search Hub flow

1. Put your own design materials into `DesignMate/data/inbox`.
2. Run the local pipeline:

```powershell
python DesignMate/scripts/run_designmate.py
```

3. Start the API if you want to save edits or use Ask DesignMate:

```powershell
python DesignMate/scripts/start_api.py
```

4. Start the frontend:

```powershell
python DesignMate/scripts/start_frontend.py
```

5. Open `http://127.0.0.1:8766/`.
6. Use the Search Hub home page:
   - Text Search for keywords, pain points, stages and portfolio page topics.
   - Image Search for filename/metadata matching of sketches, references and screenshots.
   - Ask DesignMate for portfolio-oriented rule-based answers.
7. To only view your own real materials, open Text Search and set Source to `User inbox`.
8. Use Showcase Mode before screenshots or screen recording.

每天最简流程：

1. 把 Markdown、TXT、PDF、图片等资料放进 `data/inbox/`。
2. 运行：

```powershell
python scripts/run_designmate.py
```

3. 启动 API：

```powershell
python scripts/start_api.py
```

4. 启动前端：

```powershell
python scripts/start_frontend.py
```

5. 打开：

- `http://127.0.0.1:8766/`

6. 在网页中：

- Dashboard：查看导入状态和最近扫描。
- Search：搜索、编辑、批量整理资料；用 Source 筛选只看 `User inbox` 真实资料。
- Ask：向 DesignMate 提问。
- Reports：查看报告和草稿入口。

7. 需要截图展示时，点击顶部 `Showcase Mode`，隐藏部分开发提示。

8. 生成作品集页面草稿：

```powershell
python scripts/generate_portfolio_draft.py --project reader-design --page pain-points
```

9. 导出 DesignMate 作品集案例：

```powershell
python scripts/export_portfolio_case.py
```

10. 查看导出素材：

- `portfolio_export/designmate_case.html`
- `portfolio_export/a3_portfolio_page_content.md`
- `portfolio_export/two_page_portfolio_story.md`
- `portfolio_export/demo_script.md`

注意：Demo 数据只用于演示。正式整理作品集时，请优先使用 Source = `User inbox`。
