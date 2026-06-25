---
tags:
  - paper
status: unread
aliases:
  - PolicyTrim
  - "PolicyTrim: Boosting Intrinsic Policy Efficiency of Vision-Language-Action Models"
year: 2026
title: "PolicyTrim: Boosting Intrinsic Policy Efficiency of Vision-Language-Action Models"
doi: "10.48550/arXiv.2606.22540"
url: "https://arxiv.org/abs/2606.22540"
venue: "European Conference on Computer Vision (ECCV)"
venue_short: "ECCV"
arxiv: "2606.22540v1"
arxiv_url: "https://arxiv.org/abs/2606.22540"
arxiv_doi: "10.48550/arXiv.2606.22540"
pdf_url: "https://arxiv.org/pdf/2606.22540v1"
project: "https://inceptionwang.github.io/PolicyTrim/"
code: "https://github.com/INCEPTIONwang/PolicyTrim"
huggingface: "https://huggingface.co/INCEPTIONwang/PolicyTrim"
published: 2026-06-21
updated: 2026-06-21
pdf: "[[papers/pdfs/2606.22540v1.pdf]]"
reading:
image_index: "[[papers/images/2606.22540v1/index.md]]"
authors:
  - "[[Xianghui Wang]]"
  - "[[Feng Chen]]"
  - "[[Wenbo Zhang]]"
  - "[[Hua Yan]]"
  - "[[Zixuan Wang]]"
  - "[[Changsheng Li]]"
  - "[[Yinjie Lei]]"
institutions:
  - "[[Sichuan University]]"
  - "[[The University of Adelaide]]"
  - "[[Beijing Institute of Technology]]"
topics:
  - vision-language-action
  - policy efficiency
  - action chunking
  - reinforcement learning
  - GRPO
  - post-training
  - deployment efficiency
  - step reduction
  - LIBERO
  - ManiSkill
  - Meta-World
  - OpenVLA
  - robotic manipulation
---

# PolicyTrim: Boosting Intrinsic Policy Efficiency of Vision-Language-Action Models

- [x] PDF:: [[papers/pdfs/2606.22540v1.pdf]]
- [x] 代码:: [PolicyTrim](https://github.com/INCEPTIONwang/PolicyTrim)
- [x] 项目页:: [PolicyTrim](https://inceptionwang.github.io/PolicyTrim/)
- [x] 图片索引:: [[papers/images/2606.22540v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[action chunking]], [[reinforcement learning]], [[GRPO]], [[LIBERO]], [[ManiSkill]], [[Meta-World]], [[OpenVLA]], [[@physicalintelligence2024pi0]], [[@physicalintelligence2025pi05]], [[@guo2026fafm]], [[@tang2026frs]], [[@kuzucu2026parcel]]
affiliation:: [[Sichuan University]], [[The University of Adelaide]], [[Beijing Institute of Technology]]

## 一句话问题

VLA 真实部署的总耗时由“每次推理延迟 × 推理次数”共同决定；现有工作几乎只优化 compute-centric efficiency（单步推理更快），却忽视 intrinsic policy efficiency（每次能可靠执行多长的 action chunk、完成任务需要多少物理步）。PolicyTrim 用两阶段 GRPO 后训练，在不改架构、不加示教的前提下延长可信 chunk 长度并削减冗余物理步，实现最高 5.83× 端到端加速且基本不掉成功率。

## 方法

- 问题分解：policy efficiency 由 effective executable chunk length 与 total physical steps 共同决定；二者乘积决定 forward inference call 总数。
- 现象：VLA 在 action chunk 尾部预测退化，强行拉长执行窗口会同时降成功率、增物理步；同一任务多次 rollout 的步数方差很大，说明更短路径可达但只能靠运气。
- Stage 1 — Reliable Action Chunk Extension：在 GRPO 组内给不同 rollout 分配不同 execution window，做 progressive reliability sweep；成功完成更长 chunk 的轨迹获更高 reward，把可信规划前沿推向经验极限。
- Stage 2 — Redundancy-Aware Step Reduction：step-saving reward 奖励更少物理步的成功完成，stability regularizer 惩罚不可复现的 shortcut，消除冗余纠正动作。
- 插件式：不改 VLA 架构、不增加 expert data；基于 GRPO 消除 value model 内存开销，适合大 backbone 后训练。

## 证据

- 三个 benchmark（LIBERO、ManiSkill、Meta-World）× 三个 VLA（$\pi_{0.5}$、OpenVLA-OFT、GR00T）：action chunk utilization 提升约 3×，物理执行步数减少 51.4%，端到端 speedup 最高 5.83×，成功率基本保持。
- LIBERO 四子集：OpenVLA-OFT 上 h_chunk 从 5 提到 10–15，Stotal 约减半，Spd↑ 最高 5.83×（Object）。
- 真实部署：Agilex Piper 臂上平均 wall-clock speedup 1.86×，标准/动态成功率维持或略升。
- 架构泛化：除 parallel-decoding OpenVLA-OFT 外，对 autoregressive OpenVLA 也有效（S2 单独即可 1.41× speedup）。

## 局限

- 与 token pruning / KV-cache / quantization 等 compute-centric 方法正交，论文强调可叠加，但联合部署的工程验证仍有限。
- RL 后训练依赖 rollout 环境与 reward 设计；真实世界 reward 稀疏、sim-to-real gap 时 step-saving signal 是否稳定需个案验证。
- 主要评测基于已有 IL 预训练 VLA；与 [[@tang2026frs]] steering 或 [[@guo2026fafm]] 频域动作正则的叠加关系未系统讨论。
- Stage 1/2 顺序依赖：chunk extension 为 step reduction 提供更长可信 horizon，单阶段效果因模型而异（如 OpenVLA 仅 S2 也有收益）。

## 我的阅读笔记

PolicyTrim 把 VLA 部署瓶颈从“算得快”扩成“算得少”：即使 [[@kuzucu2026parcel]] 把视觉 token 压到极低，若策略每 5 步就要重新推理、还走大量冗余纠正轨迹，总墙钟时间仍被 policy efficiency 卡住。它与 [[@guo2026fafm]]（训练目标改动作连续性）和 [[@tang2026frs]]（推理时 noise steering）都不同，走的是 **GRPO 后训练改 rollout 行为** 路线，且 reward 专门打破 binary success 在高成功率下的梯度塌缩。

对自己项目的价值：若已有 $\pi_0$ / OpenVLA 类策略在真机上“能做成但很慢”，不必先动骨干，可优先试 post-training 拉长 chunk + 压步数；与 UMI/混合频率数据管线（[[@xu2026egoguide]]）也可能互补——示教冗余多、执行步数方差大时，PolicyTrim 类 signal 更有空间。

## 摘录