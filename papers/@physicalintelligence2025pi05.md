---
tags:
  - paper
status: unread
aliases:
  - pi0.5
  - π0.5
  - "π0.5: a Vision-Language-Action Model with Open-World Generalization"
year: 2025
title: "π0.5: a Vision-Language-Action Model with Open-World Generalization"
doi: "10.48550/arXiv.2504.16054"
url: "https://arxiv.org/abs/2504.16054"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2504.16054v1"
arxiv_url: "https://arxiv.org/abs/2504.16054"
arxiv_doi: "10.48550/arXiv.2504.16054"
pdf_url: "https://arxiv.org/pdf/2504.16054v1"
openalex: "https://openalex.org/W4414674749"
project: "https://www.pi.website/blog/pi05"
code: "https://github.com/Physical-Intelligence/openpi"
published: 2025-04-22
updated: 2025-04-22
pdf: "[[papers/pdfs/2504.16054v1.pdf]]"
bilingual:
images: "papers/images/2504.16054v1/"
image_index: "[[papers/images/2504.16054v1/index.md]]"
authors:
  - "[[Physical Intelligence]]"
  - "[[Kevin Black]]"
  - "[[Noah Brown]]"
  - "[[James Darpinian]]"
  - "[[Karan Dhabalia]]"
  - "[[Danny Driess]]"
  - "[[Adnan Esmail]]"
  - "[[Michael Equi]]"
  - "[[Chelsea Finn]]"
  - "[[Niccolo Fusai]]"
  - "[[Manuel Y. Galliker]]"
  - "[[Dibya Ghosh]]"
  - "[[Lachy Groom]]"
  - "[[Karol Hausman]]"
  - "[[Brian Ichter]]"
  - "[[Szymon Jakubczak]]"
  - "[[Tim Jones]]"
  - "[[Liyiming Ke]]"
  - "[[Devin LeBlanc]]"
  - "[[Sergey Levine]]"
  - "[[Adrian Li-Bell]]"
  - "[[Mohith Mothukuri]]"
  - "[[Suraj Nair]]"
  - "[[Karl Pertsch]]"
  - "[[Allen Z. Ren]]"
  - "[[Lucy Xiaoyang Shi]]"
  - "[[Laura Smith]]"
  - "[[Jost Tobias Springenberg]]"
  - "[[Kyle Stachowicz]]"
  - "[[James Tanner]]"
  - "[[Quan Vuong]]"
  - "[[Homer Walke]]"
  - "[[Anna Walling]]"
  - "[[Haohuan Wang]]"
  - "[[Lili Yu]]"
  - "[[Ury Zhilinsky]]"
institutions:
  - "[[Physical Intelligence]]"
topics:
  - vision-language-action
  - open-world generalization
  - co-training
  - heterogeneous multimodal data
  - high-level subtask prediction
  - mobile manipulation
  - long-horizon manipulation
  - web data
  - object detection
  - in-the-wild robotics
---

# π0.5: a Vision-Language-Action Model with Open-World Generalization

- [x] PDF:: [[papers/pdfs/2504.16054v1.pdf]]
- [x] 项目页:: [π0.5](https://www.pi.website/blog/pi05)
- [x] 代码:: [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi)
- [x] 图片索引:: [[papers/images/2504.16054v1/index.md]]
- [ ] 双语阅读稿::
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[open-world generalization]], [[mobile manipulation]], [[long-horizon manipulation]], [[@physicalintelligence2024pi0]], [[@physicalintelligence2026pi07]], [[@kim2026serf]], [[@xu2026egoguide]], [[@tencent2026hy-embodied-05]], [[@wang2026covla]]
affiliation:: [[Physical Intelligence]]

## 一句话问题

$\pi_0$ 证明了跨机器人灵巧控制，但真实家庭里的 open-world generalization（开放世界泛化）还需要把网络语义、高层子任务推理和低层动作放进同一训练配方；$\pi_{0.5}$ 在 $\pi_0$ 上通过 heterogeneous co-training（异构共训练）和 hybrid multimodal examples（混合多模态样本），让 mobile manipulator 能在训练未见过的家里完成 10–15 分钟厨房/卧室清理。

## 方法

- 基座：延续 $\pi_0$ 的 VLA + action expert 路线，重点改训练数据与任务形式，而非重新发明低层控制头。
- Co-training 混合：多机器人 low-level action data、high-level semantic/subtask prediction、web VQA、object detection labels、in-the-wild mobile/static robot 数据、实验室内静态机器人数据。
- Hybrid multimodal examples：同一训练样本同时携带 image observations、language commands、object detections、semantic subtask prediction、low-level actions，迫使模型在多个抽象层之间迁移知识。
- 部署接口：高层语言任务指令 → 模型内部预测子任务（如 pick up the plate）→ action expert 输出低层动作；可 out-of-the-box 在新家庭执行多阶段清理流程。
- 关键假设：开放世界泛化不能只靠更多机器人轨迹，还必须引入非机器人知识源来补场景语义、物体功能和任务分解。

## 证据

- 首次展示端到端学习系统可在全新家庭里完成 long-horizon dexterous manipulation（长时程灵巧操作），如清理厨房/卧室，单次任务可持续 10–15 分钟。
- 定性样例：面对新厨房，模型能根据“close the cabinets / put items in drawer / wipe the spill / put dishes in sink”等高层指令，自行分解并执行子任务。
- 消融表明：去掉 heterogeneous knowledge transfer（异构知识迁移）会明显损伤 open-world 表现；high-level data 与 low-level data 的配比影响泛化。
- 成为后续工作常见基线，如 [[@kim2026serf]] 的 $\pi_{0.5}$ 对照、[[@wang2026covla]] 的双臂 benchmark 参照、[[@tencent2026hy-embodied-05]] 的真实机器人对比对象。

## 局限

- 强依赖 PI 自采 in-the-wild 家庭数据和复杂 co-training 配方，外部团队难完整复现数据分布。
- 长时程任务成功率与场景复杂度高度相关，论文以定性/部分定量 home eval 为主，公开可比的统一 benchmark 仍有限。
- 高层子任务预测与低层动作共训提升了泛化，但也让训练与推理时的 prompt 结构更复杂。
- 对双臂紧耦合协调任务不一定优于 $\pi_0$；[[@wang2026covla]] 的 RoboTwin 实验显示 $\pi_{0.5}$ 在部分 bimanual 任务上并不稳定超过 $\pi_0$。
- 未引入 $\pi_{0.7}$ 的 metadata / subgoal image conditioning，因此对低质量 autonomous data 的利用仍有限。

## 我的阅读笔记

如果把 $\pi_0$ 看成“把 VLA 跑通并做到极灵巧”，$\pi_{0.5}$ 就是在回答“怎么让 VLA 离开实验室”。核心不是更大 backbone，而是训练样本的抽象层混合：同一模型既学怎么抓盘子，也学怎么理解抽屉/水槽/台面功能，还学怎么把高层家务指令拆成子任务。

这与 [[@xu2026egoguide]] 关注的 demonstration quality、[[@kim2026serf]] 关注的 explicit spatial memory 是不同切口：$\pi_{0.5}$ 更像通过 data scaling + co-training 让 image-only VLA 自带一定长时程 household generalization。

对自己项目的启发是：若只有低层机器人数据，open-world 性能会很快触顶；需要设计 hybrid training examples，把 detection、VQA、subtask language 和 action 绑到同一 episode 语义里，而不是分开训三个模型再硬拼。

## 摘录