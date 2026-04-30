# 仓库初始化与配置建议

## 1) 建议创建的基础目录

```text
src/      # 项目源代码
assets/   # 图片/图标/素材
docs/     # 正式文档
notes/    # 学习笔记、需求、会议记录
```

## 2) 建议补充的基础文件

- `.editorconfig`：统一缩进与换行风格。
- `.gitattributes`：统一行尾（LF）并规范文本文件处理。
- `docs/ARCHITECTURE.md`：记录系统结构和模块边界。
- `docs/ROADMAP.md`：记录里程碑与优先级。

## 3) 建议的 Git 工作流

1. 创建功能分支：`git checkout -b feat/<name>`
2. 小步提交：每个改动点一个 commit
3. 使用清晰提交信息（祈使句，简短）
4. 通过 PR 合并到主分支

## 4) 建议下一步

- 明确本仓库首个项目目标（例如 CLI、小型 Web、自动化脚本）。
- 在 `notes/` 新建第一份需求文档（背景、目标、范围、验收标准）。
- 按项目类型初始化技术栈（Python/Node/Rust 等）。
