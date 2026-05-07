# DesignMate v0.6 Preflight Audit

Generated at: 2026-05-07T14:45:47

## 1. 当前 v0.5 状态

- SQLite 数据库、扫描、搜索、报告、Web UI、单条编辑、批量编辑和作品集页面草稿生成器均可运行。
- `quality_gate.py` 当前仍为 v0.5，最终状态 PASS。
- 示例资料库当前有 35 条材料，FTS5 可用。

## 2. 已通过命令

- `python DesignMate/scripts/run_designmate.py`
- `python DesignMate/scripts/build_static_site.py`
- `python DesignMate/scripts/generate_portfolio_draft.py --project reader-design`
- `python DesignMate/scripts/generate_portfolio_draft.py --project info-center`
- `python DesignMate/scripts/api_smoke_test.py`
- `python DesignMate/scripts/run_tests.py`
- `python DesignMate/scripts/quality_gate.py`

## 3. 失败命令和修复情况

- 预检阶段无失败命令。

## 4. 当前最大短板

- 没有统一 AI 服务抽象，Ask DesignMate 尚不存在。
- 草稿生成仍是项目级规则版，缺少页面类型控制和自检。
- 导入状态没有扫描批次和文件 hash，无法区分新增、更新、重复。
- 图片资料只记录基础文本提示，缺少尺寸、预览路径和图片说明入口。
- DesignMate 自身的作品集案例素材还没有一键导出包。

## 5. v0.6 本轮验收标准

- 无 API Key 时 AI 服务使用 rule_based fallback，应用不崩溃。
- Web UI 增加 Ask DesignMate 工作区。
- 草稿生成支持 page 参数，并输出 latest 与项目页面文件。
- 扫描记录 scan_batches，资料记录包含 hash、首次/最近出现时间、重复标记。
- 图片资料包含 image metadata，并在前端可查看。
- 可一键导出 DesignMate 作品集案例包。
- 测试数不少于 60，`quality_gate_v06.md` 最终 PASS。
