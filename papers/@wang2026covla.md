---
tags:
  - paper
status: unread
aliases:
  - Co-VLA
  - Structured Action Expert
  - SAE
  - Latent-Aware Controller
  - LAC
  - Co-Motion
  - "Co-VLA: Coordination-Aware Structured Action Modeling for Dual-Arm Vision-Language-Action Systems"
year: 2026
title: "Co-VLA: Coordination-Aware Structured Action Modeling for Dual-Arm Vision-Language-Action Systems"
doi: "10.48550/arXiv.2606.20285"
url: "https://arxiv.org/abs/2606.20285"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.20285v1"
arxiv_url: "https://arxiv.org/abs/2606.20285"
arxiv_doi: "10.48550/arXiv.2606.20285"
pdf_url: "https://arxiv.org/pdf/2606.20285v1"
openalex: "https://openalex.org/W7165390006"
published: 2026-06-18
updated: 2026-06-18
pdf: "[[papers/pdfs/2606.20285v1.pdf]]"
bilingual: "[[papers/bilingual/2606.20285v1_中英混读.md]]"
images: "papers/images/2606.20285v1/"
image_index: "[[papers/images/2606.20285v1/index.md]]"
authors:
  - "[[Yandong Wang]]"
  - "[[Jiaqian Yu]]"
  - "[[Xiongfeng Peng]]"
  - "[[Lu Xu]]"
  - "[[Yamin Mao]]"
  - "[[Weiming Li]]"
  - "[[Jaewook Yoo]]"
  - "[[Dongwook Lee]]"
  - "[[Daehyun Ji]]"
  - "[[Mingbo Zhao]]"
  - "[[Chao Zhang]]"
institutions:
  - "[[Donghua University]]"
  - "[[Samsung R&D Institute China-Beijing]]"
  - "[[Samsung AI Center]]"
topics:
  - vision-language-action
  - dual-arm manipulation
  - bimanual coordination
  - structured action modeling
  - shared-residual decomposition
  - latent-aware controller
  - pi0
  - RoboTwin
  - execution refinement
  - coordination-aware loss
---

# Co-VLA: Coordination-Aware Structured Action Modeling for Dual-Arm Vision-Language-Action Systems

- [x] PDF:: [[papers/pdfs/2606.20285v1.pdf]]
- [x] 图片索引:: [[papers/images/2606.20285v1/index.md]]
- [x] 双语阅读稿:: [[papers/bilingual/2606.20285v1_中英混读.md]]
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[dual-arm manipulation]], [[bimanual coordination]], [[@physicalintelligence2024pi0]], [[@physicalintelligence2025pi05]], [[RoboTwin]], [[@tang2026frs]], [[@kim2026serf]], [[@tencent2026hy-embodied-05]], [[@processbench2026roboprocessbench]]
affiliation:: [[Donghua University]], [[Samsung R&D Institute China-Beijing]], [[Samsung AI Center]]

## 一句话问题

双臂 VLA 往往把左右臂动作拼成单一向量端到端回归，协作意图与执行细节混在一起，紧耦合任务上隐式协调不够稳定；Co-VLA 在 $\pi_0$ 骨干上把 action head 换成 Structured Action Expert（SAE），把共享协调意图与左右臂 residual 执行拆开，并用 Latent-Aware Controller（LAC）在部署时解释这些 latent 来调节同步、不对称和平滑性。

## 方法

- Structured Action Expert (SAE)：从 transformer hidden state 同时解码 shared latent $z^s$ 与左右 residual latent $z^L, z^R$，再经 additive composition 得到 $a_{t,L}=a_{t,L}^s+a_{t,L}^r$、$a_{t,R}=a_{t,R}^s+a_{t,R}^r$，保留原 joint-level action interface。
- Task-adaptive coordination losses：按任务协调模式选择辅助损失——$\mathcal{L}_{\text{sparse}}$ 约束对称任务 residual 稀疏、$\mathcal{L}_{\text{shared}}$ 让 shared component 对齐双臂平均速度、$\mathcal{L}_{\text{sync}}$ 鼓励双臂加速/减速时间耦合；$\lambda=0.001$。
- Latent-Aware Controller (LAC)：部署时根据 shared/residual 能量比 $\rho_t$ 与 residual opposition score $\omega_t$ 自适应调节执行刚度，并用低通滤波平滑 joint commands；无需力控/阻抗控制。
- Co-Motion：探索性双臂并发示范范式，通过 staged parallel scheduling 和 shared reference frames 提高训练集中并发协调样本密度。

## 证据

- 紧耦合任务上相对 monolithic VLA baseline 成功率提升约 27%。
- OOD 真实场景成功率从 13% 提升到 27%，超过翻倍。
- 任务完成时间最多减少约 25%。
- 实验覆盖 simulation 与 real-world benchmarks，包含 RoboTwin 与真实双臂任务。

## 局限

- 方法建立在现有 VLA 骨干（论文以 $\pi_0$ 为例）之上，SAE/LAC 收益与 backbone 质量、预训练数据和任务协调结构先验绑定。
- task-adaptive loss 选择依赖对任务协调模式的先验判断，跨任务自动选择机制尚未完全验证。
- Co-Motion 示范范式揭示效率与可学习性之间的 trade-off，高密度协调数据并不总是直接带来更好泛化。
- LAC 在 joint-command 层做后处理，对需要力/阻抗级协调或接触力精细调节的任务覆盖有限。
- 论文未公开项目页、代码或数据集链接，复现细节需回查正文与附录。

## 我的阅读笔记

Co-VLA 的核心判断是：双臂协作不是“一个动作”，而是“动作之上的结构”。这和 [[@tang2026frs]] 从 noise/action steering 改策略、[[@kim2026serf]] 从 map memory 补状态不同，它直接在 action head 上引入 shared–residual 分解，把 task-level coordination intent 与 arm-specific execution 显式分开。

对自己最有参考价值的部分是三层分工：SAE 负责表征结构，coordination-aware loss 负责按任务模式塑形 latent，LAC 负责把学到的结构翻译成部署时可调的同步强度、不对称和平滑约束。这比单纯增大模型容量或堆更多 demonstration 更像“给 VLA 加协作归纳偏置”。

如果后续要做双臂/双手+触觉 VLA，可以回看 SAE 的 additive composition 接口——它不改 joint-level I/O，因此比较容易接到现有 flow-matching VLA 上；LAC 则提供了一个不依赖力传感器的 execution refinement 思路，适合和标准控制栈拼接。

## 摘录