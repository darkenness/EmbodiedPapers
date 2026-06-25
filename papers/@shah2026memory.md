---
tags:
  - paper
status: unread
aliases:
  - HALO
  - "Memory Retrieval in Visuomotor Policies for Long-Horizon Robot Control"
year: 2026
title: "Memory Retrieval in Visuomotor Policies for Long-Horizon Robot Control"
doi: "10.48550/arXiv.2606.25136"
url: "https://arxiv.org/abs/2606.25136"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.25136v1"
arxiv_url: "https://arxiv.org/abs/2606.25136"
arxiv_doi: "10.48550/arXiv.2606.25136"
pdf_url: "https://arxiv.org/pdf/2606.25136v1"
project: "https://robin-lab.cs.utexas.edu/HALO"
published: 2026-06-23
updated: 2026-06-23
pdf: "[[papers/pdfs/2606.25136v1.pdf]]"
reading:
image_index: "[[papers/images/2606.25136v1/index.md]]"
authors:
  - "[[Rutav Shah]]"
  - "[[Yisu Li]]"
  - "[[Femi Bello]]"
  - "[[Yuke Zhu]]"
  - "[[Roberto Martín-Martín]]"
institutions:
  - "[[The University of Texas at Austin]]"
topics:
  - visuomotor policy
  - memory retrieval
  - long-horizon control
  - partial observability
  - imitation learning
  - vision-language model
  - video question answering
  - sparse attention
  - ReMemBench
  - household manipulation
  - mobile manipulation
---

# Memory Retrieval in Visuomotor Policies for Long-Horizon Robot Control

- [x] PDF:: [[papers/pdfs/2606.25136v1.pdf]]
- [x] 项目页:: [HALO](https://robin-lab.cs.utexas.edu/HALO)
- [x] 图片索引:: [[papers/images/2606.25136v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[memory retrieval]], [[visuomotor policy]], [[long-horizon control]], [[partial observability]], [[video question answering]], [[sparse attention]], [[ReMemBench]], [[@kim2026serf]], [[@yang2026memorywam]], [[@jing2026learning]], [[@xu2026univiewvla]], [[@wang2026covla]]
affiliation:: [[The University of Texas at Austin]]

## 一句话问题

家庭等部分可观测场景里，长时程操作要回忆物体位置、事件时刻、计数与人机协作进度，但把长上下文 Transformer 直接用于离线模仿学习会遇到虚假相关与闭环误差累积。HALO 用 VLM 导出的 memory-dependent VQA 监督引导 attention 检索任务相关信息，再用 top-$k$ sparse retrieval 抑制噪声历史，从而从最长约 8 分钟经验中稳定取回多样记忆并执行动作。

## 方法

- HALO（History-Aware visuomotor policy for LOng-horizon imitation learning）：非参数 episodic memory 存过去观测/动作，learned query-key attention 做 associative retrieval，再预测低层动作。
- VLM prior distillation：从 demonstration 自动生成 memory-dependent VQA（空间、关系、计数、事件时刻等），与动作模仿联合训练，使检索偏向任务相关信息；VQA 与 action head 可访问不同信息，避免纯文本摘要丢控制细节。
- Top-$k$ sparse attention：每步只检索最相关的 $k$ 条历史，减少闭环中预测误差写入 memory 后的 drift 与级联失败。
- 评测覆盖 ReMemBench 四类记忆（spatial / relational / numerical / event-time）仿真任务，以及固定基座与移动操作平台上的 5 个真机长时程任务。

## 证据

- 仿真 ReMemBench（50 rollouts/task）：HALO 平均成功率 **41%**，较 Standard Transformer **22%**（+19 pt）、SAM2Act++ **20%**（+21 pt）、ReMemBer **18%**（+23 pt）、Hand-Designed Features **29%**（+12 pt）、SMT **34%**（+7 pt）、Token Merging **29%**（+12 pt）。
- 真机（20 rollouts/task）：HALO **55%** vs Standard Transformer **36%**（+19 pt）；含最长 8 分钟加热、人机协作放杯等任务。
- 消融：去掉 VQA 监督平均 **31%**（VLM prior +10 pt）；top-$k$ 相对全 attention +9 pt；仅 VLM prior 无 action grounding 约 **18%**，HALO 完整版 **41%**。
- 机制对比（Table III）：HALO 在 Retrieve/Return 任务上优于 LSTM、Mamba、Transformer-XL、Window/Strided/Hierarchical/Gated Attention 等；Grad-CAM 显示更少 manipulation failure 与 memory failure。

## 局限

- 基于模仿学习离线轨迹，对分布外闭环误差、新物体/新布局的鲁棒性未系统量化。
- 8 分钟上下文依赖存储全部历史 + 选择性检索，部署时 memory 规模与延迟随轨迹增长，与 [[@yang2026memorywam]] 式 gist 压缩未直接对比。
- 与 [[@jing2026learning]] history token、[[@kim2026serf]] 显式空间地图等不同记忆接口，跨架构联合评测缺失。
- 同组 PRISM（短程记忆 / ReMemBench 前作）关系紧密，但本文聚焦更长上下文（分钟级）与 VQA 蒸馏，代码公开状态待跟进。

## 我的阅读笔记

HALO 把「记忆」拆成两个可学习问题：**检索什么**（VQA 把 VLM 语义先验灌进 attention，压制虚假相关）和 **检索多少/多噪**（top-$k$ 抑制闭环 drift）。这与 [[@yang2026memorywam]] 在 WAM 里用 anchor/gist 控成本、[[@kim2026serf]] 用 neural point map 补空间记忆是同一问题的不同解法——HALO 更偏通用 episodic retrieval + IL，不依赖手工 object-centric 或文本摘要规则。

对自己项目：若长时程家务/协作任务失败在「忘了早先事件」而非瞬时感知，可优先试 **VQA 共训练 + sparse top-k retrieval**；若 memory 预算紧，再对照 WAM/gist 或 SERF 式显式状态。

## 摘录