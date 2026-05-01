# Portfolio

这里是工业设计作品集的项目管理主目录，用于集中管理作品集计划、素材索引、项目过程文档和最终展示稿准备。

## 当前项目

| 项目 | 目录 | 当前目标 |
| --- | --- | --- |
| 阅读器设计 | `projects/reader-design/` | 整理设计问题、用户场景、调研证据、概念演进和最终展示脚本 |
| 图信中心设计 | `projects/info-center-design/` | 整理空间/服务系统问题、用户旅程、案例研究、分区规划和展示脚本 |

## 管理文件

- `00-admin/portfolio-plan.md`：作品集整体目标、项目定位、页面结构和工作原则。
- `00-admin/timeline.md`：阶段计划、里程碑和每周推进节奏。
- `00-admin/asset-index.md`：素材登记表，记录草图、照片、模型、图纸和展示稿的位置与状态。

## 项目目录规则

每个项目按同一套阶段结构管理：

```text
01-brief/       # 项目背景、问题定义、目标用户、约束
02-research/    # 用户调研、竞品/案例、洞察
03-concept/     # 概念方向、草图记录、空间/功能构想
04-development/ # 造型/布局/交互/系统/CMF 等迭代
05-final/       # 最终说明、作品集页面脚本、展示材料清单
06-notes/       # 周记录、待办、复盘
```

## 命名规范

文件夹使用英文小写和连字符，例如 `reader-design`、`user-research`。Markdown 文档可以使用中文说明。

素材文件建议使用：

```text
YYYYMMDD_project_stage_content_v01.ext
```

示例：

```text
20260501_reader_research_user-interview-notes_v01.md
20260501_info-center_concept_zoning-sketch_v01.jpg
```

## 工作原则

- 先记录真实资料，再提炼设计故事。
- 每个结论尽量对应调研、草图、模型或测试证据。
- 未完成内容标记为“待补充”，不要写成已经完成的最终成果。
- 每次整理一小步，及时提交 Git 记录。
