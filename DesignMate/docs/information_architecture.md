# Information Architecture

## 顶层结构

- `data/`：用户资料输入与示例资料。
- `index/`：系统生成的索引与分类结果。
- `reports/`：整理报告、搜索报告和开发日志。
- `review/`：未来用于存放待用户确认的问题与复盘材料。
- `drafts/`：未来用于存放作品集页面草稿。
- `prompts/`：未来 AI 工作流提示词模板。
- `scripts/`：v0.1 本地 MVP 脚本。
- `frontend/`：未来 UI 原型。
- `backend/`：未来服务端或本地 API。
- `tests/`：未来自动化测试。

## 核心对象

- Material：单个资料文件。
- Material Index：资料索引。
- Classification：资料分类结果。
- Report：整理报告。
- Draft：作品集页面草稿。

## v0.1 信息流

`data/` -> `scripts/scan_library.py` -> `index/` -> `scripts/classify_materials.py` -> `scripts/generate_report.py` -> `reports/`

