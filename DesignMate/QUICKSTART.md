# Quickstart

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
