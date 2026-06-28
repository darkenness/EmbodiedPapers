本目录是用户自己的 Obsidian 研究阅读库。细则见下文。默认只维护功能文件，不新增面向用户的说明文档，除非用户明确要求。

以后在本目录内处理论文 PDF 或文献阅读稿时，遵守这些约定：

- 不联动 Zotero，不生成 Zotero URI，不依赖 Citations 插件。
- 每篇文献可以有一个本地 PDF、一个精读稿 Markdown 和一个本地图片目录；文献笔记通过 `pdf`、`reading`、`images`、`image_index` 字段链接它们。`reading` 是唯一状态源：填写有效双链且文件存在后，才算“已有精读稿”。
- 处理 arXiv PDF 时，默认先用本地脚本从 arXiv source package / PDF 中抽取图片，保存到 `papers/images/<pdf-stem>/`，并生成 `index.md`。不要默认让 AI 逐图视觉分析，除非用户明确要求。
- 用户提到使用精读稿生成流程时，只生成精读稿 `<stem>_精读稿.md`。不要默认生成“表达与逻辑审查”文件，也不要插入审查标注，除非用户明确要求。
- 精读稿要保留论文结构、公式、表格、图题和关键英文术语，中文解释为主，英文术语以 `English（中文）` 形式保留。
- 精读稿默认写成“完整论文讲解稿”，不是短摘要。除非用户明确要求精简，否则要逐节覆盖论文的主要 section/subsection，解释每节的目的、关键论点、方法机制、假设、证据和与全文主线的关系。
- 精读稿默认采用精读讲解结构：`论文主线`、`结构地图`、按原文 section 展开的正文讲解、`主张-证据-边界矩阵`、`局限与可追问点`、`精读路线 / 为什么需要回看`。每个原文 section 下固定包含 `高层故事流`、`论证功能表`（正文要点 / 承担的论证功能 / 证据位置 / 读者应注意的边界）和关键公式、表格、原文图嵌入与解释。原论文没有的栏目可以用简短说明标记，不要凭空补造。
- 公式要尽量保留并解释变量含义、直观含义和使用位置；表格要尽量转成 Markdown 或保留关键行列、指标和数值结论；图题和图号要保留，正文要解释重要图在证明什么。
- 精读稿不要在顶部堆叠图片索引或批量预览图；完整图片清单放在独立 `papers/images/<pdf-stem>/index.md`，正文只把精选图片嵌入到对应的设计、方法、实验或应用讲解段落中。
- 增加、删除或重命名 `papers/@*.md` 文献笔记时，必须同步维护根目录 `论文地图.md` 的 `## 快速索引`；地图只保留 `#map/... :: [[@citekey|短名]] · ...` 分类线索行，不维护「书架」或 `问题 -> 方法钩子 -> 回看理由` 长条目（这些内容写在各文献笔记里）。尚未链接精读稿的文献，在快速索引短名前保留 `⌛` 标记；可用 `python setting/scripts/check_paper_map.py --sync-reading-markers` 按 `reading` 字段自动同步。完成或新增精读稿后，更新文献笔记 `reading` 与 checklist，并运行 `python setting/scripts/check_paper_map.py`，确认地图覆盖、精读稿标记与 `reading` 字段一致。`## 精读稿状态` 由 Dataview 自动汇总，不需手写清单。
- 不替用户强行设计正文文件夹结构；脚本和模板应保持可配置、可移动。
- 功能入口：`.obsidian/` 是 Obsidian 配置，`setting/js/research.js` 是 Dataview/CustomJS 汇总逻辑，`setting/templates/template-folder/` 是 Templater 模板，`setting/templater-scripts/` 是 OpenAlex/ROR 生成脚本，`setting/scripts/` 是本地批处理脚本。
