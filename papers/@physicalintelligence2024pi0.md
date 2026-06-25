---
tags:
  - paper
status: unread
aliases:
  - pi0
  - π0
  - pi-zero
  - "π0: A Vision-Language-Action Flow Model for General Robot Control"
year: 2024
title: "π0: A Vision-Language-Action Flow Model for General Robot Control"
doi: "10.48550/arXiv.2410.24164"
url: "https://arxiv.org/abs/2410.24164"
venue: "Robotics: Science and Systems (RSS) 2025"
venue_short: "RSS 2025"
arxiv: "2410.24164v4"
arxiv_url: "https://arxiv.org/abs/2410.24164"
arxiv_doi: "10.48550/arXiv.2410.24164"
pdf_url: "https://arxiv.org/pdf/2410.24164v4"
openalex: "https://openalex.org/W4404350116"
project: "https://www.pi.website/blog/pi0"
code: "https://github.com/Physical-Intelligence/openpi"
published: 2024-10-31
updated: 2026-01-08
pdf: "[[papers/pdfs/2410.24164v4.pdf]]"
bilingual:
image_index: "[[papers/images/2410.24164v4/index.md]]"
authors:
  - "[[Kevin Black]]"
  - "[[Noah Brown]]"
  - "[[Danny Driess]]"
  - "[[Adnan Esmail]]"
  - "[[Michael Equi]]"
  - "[[Chelsea Finn]]"
  - "[[Niccolo Fusai]]"
  - "[[Lachy Groom]]"
  - "[[Karol Hausman]]"
  - "[[Brian Ichter]]"
  - "[[Szymon Jakubczak]]"
  - "[[Tim Jones]]"
  - "[[Liyiming Ke]]"
  - "[[Sergey Levine]]"
  - "[[Adrian Li-Bell]]"
  - "[[Mohith Mothukuri]]"
  - "[[Suraj Nair]]"
  - "[[Karl Pertsch]]"
  - "[[Lucy Xiaoyang Shi]]"
  - "[[James Tanner]]"
  - "[[Quan Vuong]]"
  - "[[Anna Walling]]"
  - "[[Haohuan Wang]]"
  - "[[Ury Zhilinsky]]"
institutions:
  - "[[Physical Intelligence]]"
topics:
  - vision-language-action
  - robot foundation model
  - flow matching
  - cross-embodiment learning
  - PaliGemma
  - action expert
  - action chunking
  - dexterous manipulation
  - pre-training
  - post-training
---

# π0: A Vision-Language-Action Flow Model for General Robot Control

- [x] PDF:: [[papers/pdfs/2410.24164v4.pdf]]
- [x] 项目页:: [π0](https://www.pi.website/blog/pi0)
- [x] 代码:: [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi)
- [x] 图片索引:: [[papers/images/2410.24164v4/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[flow matching]], [[cross-embodiment learning]], [[PaliGemma]], [[Open X-Embodiment]], [[@physicalintelligence2025pi05]], [[@physicalintelligence2026pi07]], [[@tang2026frs]], [[@wang2026covla]], [[@kim2026serf]], [[@tencent2026hy-embodied-05]]
affiliation:: [[Physical Intelligence]]

## 一句话问题

机器人要走出实验室，需要 generalist robot policy（通用机器人策略）在多种机器人、多种任务上共享预训练；$\pi_0$ 在 PaliGemma VLM 上接 flow-matching action expert，用 10k+ 小时跨 embodiment 数据和 pre-training/post-training 分离，把 Internet-scale 语义理解转成最高 50 Hz 的连续灵巧控制。

## 方法

- 架构：3B PaliGemma VLM backbone + 300M action expert；VLM 处理图像与语言，action expert 处理 robot state 与 action tokens，通过 flow matching 输出连续动作 chunk。
- 动作建模：action chunking $A_t=[a_t,\ldots,a_{t+H-1}]$，$H=50$；条件 flow matching loss 学习从 noise 到 action 的 vector field；推理用 10 步 Euler 积分，action expert 内 bidirectional attention。
- 观测：2–3 路 RGB 图像 + 语言指令 + proprioception（关节角）；跨单臂、双臂、mobile manipulator 统一训练。
- 数据：自有 7 种机器人配置、68 项灵巧任务数据 + 全量 OXE（22 种机器人）；语言标签含 task name 与约 2 秒粒度的 segment annotations。
- 训练配方：大规模多样化 pre-training 学泛化与纠错；高质量 post-training 学效率、鲁棒性和高难任务专精（叠衣、收桌、装盒等）。

## 证据

- 相对 OpenVLA、Octo，$\pi_0$ 在五项高难评测上显著更好：Bussing Easy 0.971 vs OpenVLA 0；Shirt Folding 1.0；Grocery Bagging 0.786；完整 $\pi_0$ 比 $\pi_0$-small（无 VLM 预训练）平均提升 >2×。
- 零样本 prompting 可完成多阶段任务；post-training 后可长时间自主叠衣、收桌、装纸盒、微波炉放碗等。
- 可跟随人类语言，也可接 high-level VLM policy 输出的中间语言子指令完成长时程任务。
- 预训练规模：>10,000 小时机器人数据。

## 局限

- 复杂任务仍常需 task-specific post-training，零样本能力对最难任务（如完整 laundry pipeline）有限。
- 依赖大规模跨机器人遥操作数据，复现成本高；OXE 与自采数据混合比例和权重设计是关键但难完全公开复刻。
- flow matching 推理需多步积分，实时部署对算力和 KV cache 设计有要求。
- 论文聚焦 manipulation，未系统覆盖 mobile navigation、双臂紧耦合协调等后续 $\pi_{0.5}$ / Co-VLA 关注的问题。
- 评测以 PI 自有任务为主，与公开 benchmark 的横向对比仍少于 OpenVLA 路线。

## 我的阅读笔记

$\pi_0$ 是 Physical Intelligence VLA 系列的起点，也是后来 $\pi_{0.5}$、$\pi_{0.7}$、[[@tang2026frs]]、[[@kim2026serf]]、[[@wang2026covla]] 的共同参照系。它最重要的工程判断是：机器人 foundation model 应该像 LLM 一样分 pre-train / post-train，而不是只用高质量示教端到端训到底。

对自己最有用的三个钩子：(1) VLM backbone 只负责看和懂，action expert 负责高频连续控制；(2) flow matching 而不是离散 action token，使 FRS 这类 noise-space steering 成为可能；(3) cross-embodiment + segment-level language 让同一模型既能 prompt 又能 fine-tune。

如果后续要做自己的 VLA 或 tactile-conditioned action head，应把 $\pi_0$ 当作 action interface 基线：chunked continuous actions、多图像观测、以及“宽预训练 + 窄后训练”的数据配方。

## 摘录