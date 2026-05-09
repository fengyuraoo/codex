# Import Real Materials

DesignMate v0.6.1 建议把真实作品集资料放入 `DesignMate/data/inbox`，再运行：

```powershell
python DesignMate/scripts/run_designmate.py
```

## 推荐导入的资料

- 草图说明：每张草图解决什么问题、属于哪个阶段。
- 调研记录：访谈、问卷、观察、用户行为记录。
- 老师反馈：修改意见、评审意见、下一步建议。
- 竞品分析：参考对象、比较维度、设计启发。
- 灵感图说明：图片来源、值得参考的点、可用于哪个项目。
- 项目旧文案：以往作品集草稿、汇报讲稿、页面说明。
- PDF/PPT/Word 资料：课程汇报、论文资料、调研报告。

## Demo 与真实资料

- `data/examples` 会被标记为 `demo`。
- `data/inbox` 会被标记为 `user`。
- `data/library` 会被标记为 `imported`。

在 Web UI 的 Search 里使用 Source 筛选，可以只查看自己的真实资料。不要把 demo 数据当成真实项目结论。
