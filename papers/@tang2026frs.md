---
tags:
  - paper
status: unread
aliases:
  - FRS
  - Flow Reversal Steering
  - "Improving Robotic Generalist Policies via Flow Reversal Steering"
year: 2026
title: "Improving Robotic Generalist Policies via Flow Reversal Steering"
doi: "10.48550/arXiv.2606.13675"
url: "https://arxiv.org/abs/2606.13675"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.13675v1"
arxiv_url: "https://arxiv.org/abs/2606.13675"
arxiv_doi: "10.48550/arXiv.2606.13675"
pdf_url: "https://arxiv.org/pdf/2606.13675v1"
project: "https://flow-reversal-steering.github.io"
pdf: "[[papers/pdfs/2606.13675v1.pdf]]"
bilingual: "[[papers/bilingual/2606.13675v1_中英混读.md]]"
images: "papers/images/2606.13675v1/"
image_index: "[[papers/images/2606.13675v1/index.md]]"
authors:
  - "[[Andy Tang]]"
  - "[[William Chen]]"
  - "[[Andrew Wagenmaker]]"
  - "[[Chelsea Finn]]"
  - "[[Sergey Levine]]"
institutions:
  - "[[Stanford University]]"
  - "[[University of California, Berkeley]]"
topics:
  - robotic generalist policies
  - vision-language-action
  - flow matching
  - policy steering
  - diffusion steering
  - reinforcement learning
  - behavioral cloning
  - vision-language models
  - LIBERO
  - DROID
---

# Improving Robotic Generalist Policies via Flow Reversal Steering

- [x] PDF:: [[papers/pdfs/2606.13675v1.pdf]]
- [x] 双语阅读稿:: [[papers/bilingual/2606.13675v1_中英混读.md]]
- [x] 图片索引:: [[papers/images/2606.13675v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[robotics]], [[vision-language-action]], [[flow matching]], [[reinforcement learning]], [[policy steering]], [[behavioral cloning]], [[LIBERO]], [[DROID]]
affiliation:: [[Stanford University]], [[University of California, Berkeley]]

## 一句话问题

通用机器人策略已经学到很多“合理动作”先验，但在新任务上直接按语言命令采样常会失败；FRS 用人或 VLM 给出的粗粒度方向动作反向穿过 flow policy，找到对应噪声，再让原 VLA 正向去噪，把粗动作投影成更像通用策略分布内的精细机器人动作。

## 方法

- Flow reversal：对 flow matching VLA 的 ODE 做反向积分，从参考动作 $a_1$ 得到噪声 $\hat{a}_0=\mu_\theta^{-1}(a_1,o)$，再正向去噪得到 $\hat{a}_1=\mu_\theta(\hat{a}_0,o)$。
- Semantic steering：人或 Gemini-ER-1.6 VLM 只输出笛卡尔方向或 defer/fine 操作，不直接负责精细关节动作。
- Zero-shot FRS：每个 action chunk 都由 reasoner 给参考动作，经 FRS 转成可执行动作。
- DSBC：把 FRS 得到的噪声当作 expert noise actions，用监督学习训练小型 noise policy。
- DSRL + FRS：把 FRS 成功轨迹预填到 DSRL replay buffer，并在 actor 更新中加入 BC 辅助项，减少早期随机探索。

## 证据

- LIBERO zero-shot：在 92 个任务上比较 base policy、直接执行 VLM 动作、partial noising、sample-and-rank 和 FRS；FRS 总体最好，并在 42 个 base success <= 2% 的困难任务中让 11 个任务获得至少 10% 绝对提升。
- LIBERO DSBC：15 个 FRS 有明显提升的 LIBERO-90 任务上，DSBC 可蒸馏 zero-shot FRS 的收益，优于在同一 FRS 成功轨迹上训练标准 BC。
- LIBERO RL：DSRL + FRS 在 15 个任务和 10 个更困难任务上都比标准 DSRL、residual RL / RoboMeter 引导更有效；困难任务里只用一个 FRS 成功轨迹即可 warm-start。
- 真实机器人：DROID Franka 六个任务中，DSBC 只用每任务 10 条成功 human-FRS 轨迹训练，平均绝对成功率提升约 60%；towel hanging 从 5% base 到 50% DSBC，再经 RL 到 80%。
- Offline DSBC：普通机器人示教数据没有 noise，也可通过 flow reversal 补出 noise；LIBERO-90 离线 DSBC 从 30% base 提到 40%，真实 hang tape 任务也优于 base 和标准 BC。

## 局限

- 主要依赖 flow matching / deterministic sampling，虽然作者说可扩展到 deterministic DDIM，但实验核心是 $\pi_{0.5}$ 系列 flow VLA。
- FRS 不是保证最优控制，只是在有限步反向/正向积分误差下把参考动作偏向附近的策略动作 mode；参考动作质量会明显影响结果。
- VLM steering 仍需要外部相机、plumb line 标注和手写 prompt；真实系统的人类方向控制也有查询成本。
- 实验集中在 LIBERO 与 DROID，真实任务数量为 6 个，安全约束、长期任务、强接触动力学和多机器人泛化还没系统展开。
- 方法要求基础 VLA 已经包含相关技能先验；如果动作模式从未出现在 generalist prior 中，FRS 不能凭空创造技能。

## 我的阅读笔记

这篇是 VLA 改进线里很有用的“把语义指导接到动作先验”的论文。它和 V-GPS / DSRL 的关系很清楚：V-GPS 用 value/ranking 重排动作，DSRL 在 noise space 里用 RL 找好噪声，FRS 则用 flow reversal 把粗动作直接映射到噪声，缩短了“找到第一个好行为”的过程。

最值得回看的点不是具体 VLM prompt，而是两层接口：semantic reasoner 只给低带宽方向信号，VLA 负责把它变成分布内动作；随后这些噪声又能训练小 policy 或 warm-start RL。这对以后做 tactile / VLA 结合时也有启发：触觉模块未必需要直接输出动作，可以先输出粗约束或目标方向，再让大策略的 action prior 接管低层执行。

## 摘录

