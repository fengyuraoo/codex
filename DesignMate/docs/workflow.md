# v0.1 Workflow

## 1. 用户放入资料

输入：用户把文件放入 `data/inbox/` 或 `data/library/`。

输出：本地文件保持原位，不移动、不删除。

保存位置：

- 临时待整理资料：`data/inbox/`
- 长期资料库：`data/library/`

## 2. 用户运行脚本

输入：

```powershell
python scripts/run_designmate.py
```

输出：系统依次运行扫描、分类和报告生成流程。

保存位置：

- 日志：`reports/dev_log.md`

## 3. 系统自动扫描文件

输入：

- `data/inbox/`
- `data/library/`

输出：

- 文件路径
- 文件类型
- 文件大小
- 修改时间
- 文本预览
- 初步资料类型

保存位置：

- `index/materials_index.json`
- `index/materials_index.md`

## 4. 系统生成资料索引

输入：扫描结果。

输出：可读的 Markdown 索引和机器可读 JSON 索引。

保存位置：

- `index/materials_index.json`
- `index/materials_index.md`

## 5. 系统根据规则分类

输入：`index/materials_index.json`

输出：

- `material_type`
- `portfolio_stage`
- 分类依据说明

保存位置：

- `index/classification_report.json`
- `index/classification_report.md`

## 6. 系统允许关键词搜索

输入：

```powershell
python scripts/search_materials.py 关键词
```

输出：终端匹配结果和搜索报告。

保存位置：

- `reports/search_result.md`

## 7. 系统生成整理报告

输入：

- `index/materials_index.json`
- `index/classification_report.json`

输出：

- 扫描概况
- 文件类型统计
- 资料类型统计
- 可能最有价值的资料
- 未分类资料
- 下一步建议
- 需要用户确认的问题

保存位置：

- `reports/latest_report.md`
- `reports/YYYY-MM-DD-designmate-report.md`

## 8. 用户查看输出

用户查看：

- `reports/`
- `review/`
- `drafts/`
- `index/`

## 用户每天最少需要做什么

1. 把当天新增资料放入 `data/inbox/`。
2. 运行 `python scripts/run_designmate.py`。
3. 查看 `reports/latest_report.md`。
4. 把报告中的“需要确认的问题”补充到项目资料里。

