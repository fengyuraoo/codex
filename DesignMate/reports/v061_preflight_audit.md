# DesignMate v0.6.1 Preflight Audit

Generated at: 2026-05-07T23:32:00

## 1. 当前 v0.6 状态

- v0.6 主流程可运行：扫描、静态站点生成、API smoke、测试和质量门禁均已有 PASS 记录。
- 当前资料库包含 36 条资料，其中 1 条为测试图片解析失败样本。
- Ask DesignMate、批量编辑、草稿生成和作品集案例导出均可用。

## 2. 通过命令

- `python DesignMate/scripts/run_designmate.py`
- `python DesignMate/scripts/build_static_site.py`
- `python DesignMate/scripts/api_smoke_test.py`
- `python DesignMate/scripts/quality_gate.py`

## 3. 失败命令与修复情况

- 初次并行复查时 `run_tests.py` 出现临时文件写入竞争，原因是多个扫描进程使用同一个 `.tmp` 文件名。
- 已修复：`backend/utils.py` 的 atomic write 改为进程 id + uuid 唯一临时文件名。

## 4. 当前 UI 展示问题

- Dashboard 对真实资料和 Demo 数据的区分不够清楚。
- Search 缺少 source 筛选。
- Ask 回答此前是长文本，不利于截图展示。
- Reports / Drafts / Export 的路径提示需要更像产品功能入口。

## 5. 当前真实资料导入问题

- 用户容易把 demo 资料误当成真实项目资料。
- 缺少单独的真实资料准备说明。
- source_mode 需要进入数据库、报告、前端筛选和测试。

## 6. 当前作品集展示问题

- `portfolio_export` 内容偏开发说明，需要更像作品集案例叙事。
- 作品集草稿需要更明确的页面结构、导师视角自检和 draft index。
- Web UI 需要 Showcase Mode，方便截图。

## 7. v0.6.1 验收标准

- source_mode 可用，并能区分 demo/user/imported/unknown。
- Dashboard 和 Search 能清楚展示真实资料状态。
- Ask 返回 answer_sections 和 confidence。
- 草稿生成输出更适合作品集，并生成 `drafts/draft_index.md`。
- `portfolio_export` 生成 A3、一页/两页故事、demo script 和截图清单。
- 测试不少于 75 项，`quality_gate_v061.md` PASS。
