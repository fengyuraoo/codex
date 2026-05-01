# 工业设计作品集项目管理仓库

这个仓库用于管理我的工业设计作品集资料、过程文档、素材索引和后续展示稿规划。当前重点整理两个核心项目：

1. `reader-design`：阅读器设计
2. `info-center-design`：图信中心设计

本仓库目前优先用于项目管理、文档模板、命名规范和阶段性记录，不用于编造或替代最终设计成果。最终效果图、模型图、版面稿等应在真实产出后再补充。

## 仓库结构

```text
.
├── AGENTS.md
├── README.md
├── assets/
├── docs/
├── notes/
├── portfolio/
│   ├── README.md
│   ├── 00-admin/
│   │   ├── asset-index.md
│   │   ├── portfolio-plan.md
│   │   └── timeline.md
│   └── projects/
│       ├── reader-design/
│       └── info-center-design/
└── src/
```

## 目录使用方式

- `portfolio/`：作品集项目管理主目录，集中保存项目结构、阶段文档和展示稿规划。
- `portfolio/00-admin/`：跨项目管理文件，包括作品集计划、时间线、素材索引和命名规范。
- `portfolio/projects/reader-design/`：阅读器设计项目资料，按 brief、research、concept、development、final、notes 分阶段管理。
- `portfolio/projects/info-center-design/`：图信中心设计项目资料，按 brief、research、concept、development、final、notes 分阶段管理。
- `assets/`：可放置仓库级通用图片、图标、参考素材；项目专属素材建议在对应项目目录下建立 `assets/` 后再存放。
- `docs/`：放置正式说明文档、仓库工作流或后续导出规范。
- `notes/`：放置临时想法、学习笔记、会议记录或尚未归入具体项目的材料。
- `src/`：如后续需要网页作品集、自动化脚本或展示生成工具，可在这里放代码。

## 后续添加材料的方式

### 草图

建议放在对应项目的阶段目录中，例如：

```text
portfolio/projects/reader-design/03-concept/assets/sketches/
portfolio/projects/info-center-design/03-concept/assets/sketches/
```

命名建议：

```text
YYYYMMDD_project_stage_short-description_v01.jpg
```

示例：

```text
20260501_reader_concept_front-form_v01.jpg
```

### 调研资料

用户访谈、竞品图、案例分析、空间观察等应先记录来源、日期和结论，再放入对应研究文档：

```text
portfolio/projects/reader-design/02-research/
portfolio/projects/info-center-design/02-research/
```

### 模型与过程图

建模截图、结构迭代、CMF 测试和空间布局过程图建议放在：

```text
portfolio/projects/reader-design/04-development/assets/
portfolio/projects/info-center-design/04-development/assets/
```

### 展示稿与作品集页面

最终页面文案、版式脚本和展示逻辑先写入：

```text
portfolio/projects/reader-design/05-final/portfolio-page-script.md
portfolio/projects/info-center-design/05-final/portfolio-page-script.md
```

实际导出的 PDF、图片或演示稿可在确认后另建 `exports/` 或放入项目的 `05-final/assets/`。

## 常用 Git 命令

```bash
git status
git add .
git commit -m "Set up portfolio project structure"
git push
```

## 下一步

先补齐两个项目的 brief，再整理已有调研与过程材料，最后再进入作品集页面脚本和视觉呈现整理。
