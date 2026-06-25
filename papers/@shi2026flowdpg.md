---
tags:
  - paper
status: unread
aliases:
  - FlowDPG
  - "FlowDPG: Deterministic Policy Gradient on Flow Matching Policies for Real-World Manipulation"
year: 2026
title: "FlowDPG: Deterministic Policy Gradient on Flow Matching Policies for Real-World Manipulation"
doi: "10.48550/arXiv.2606.22303"
url: "https://arxiv.org/abs/2606.22303"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.22303v1"
arxiv_url: "https://arxiv.org/abs/2606.22303"
arxiv_doi: "10.48550/arXiv.2606.22303"
pdf_url: "https://arxiv.org/pdf/2606.22303v1"
project: "https://flowdpg.github.io"
published: 2026-06-21
updated: 2026-06-21
pdf: "[[papers/pdfs/2606.22303v1.pdf]]"
bilingual:
image_index: "[[papers/images/2606.22303v1/index.md]]"
authors:
  - "[[Kexin Shi]]"
  - "[[Junyao Shi]]"
  - "[[Poorvi Hebbar]]"
  - "[[Zhuolun Zhao]]"
  - "[[Tarun Amarnath]]"
  - "[[Yifan Su]]"
  - "[[Shikhar Bahl]]"
  - "[[Deepak Pathak]]"
institutions:
  - "[[Skild AI]]"
  - "[[Carnegie Mellon University]]"
  - "[[University of Pennsylvania]]"
topics:
  - flow matching
  - deterministic policy gradient
  - reinforcement learning
  - offline-to-online RL
  - real-world manipulation
  - actor-critic
  - IQL
  - vision-language-action
  - dual-arm manipulation
  - contact-rich manipulation
  - long-horizon robotics
  - behavioral cloning
---

# FlowDPG: Deterministic Policy Gradient on Flow Matching Policies for Real-World Manipulation

- [x] PDF:: [[papers/pdfs/2606.22303v1.pdf]]
- [x] 项目页:: [FlowDPG](https://flowdpg.github.io)
- [x] 图片索引:: [[papers/images/2606.22303v1/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[flow matching]], [[reinforcement learning]], [[deterministic policy gradient]], [[IQL]], [[behavioral cloning]], [[vision-language-action]], [[@physicalintelligence2024pi0]], [[@tang2026frs]], [[@guo2026fafm]], [[@wang2026covla]], [[@wang2026policytrim]]
affiliation:: [[Skild AI]], [[Carnegie Mellon University]], [[University of Pennsylvania]]

## 一句话问题

Flow matching 策略要把 critic 的 $\nabla_a Q$ 反传进 actor，必须沿多步 denoising ODE 做 BPTT，成本高且数值脆弱，导致表达力强的 flow policy 与 value-driven RL 难以稳定结合。FlowDPG 在训练时把 DDPG 式 critic gradient 蒸馏进 velocity field：演示驱动速度保可行，critic 修正导向更高价值，推理仍为标准 flow ODE，无需部署时查 critic。

## 方法

- 价值估计：twin-critic IQL + TD3 风格 target；稠密奖励来自 SARM stage-aware reward predictor（progress + stage transition + terminal）。
- 核心技巧：flow matching 可用单步 velocity 前向从任意 $x_t$ 投影 clean action $\hat{a} = x_t + (1-t)\cdot v_\theta(x_t,t,s)$，在此评估 $\nabla_{\hat{a}} Q$ 而无需 BPTT。
- Adaptive shift：按局部 velocity 尺度归一化 critic 步长 $\Delta = \alpha \cdot \frac{\|u_t\|}{\|g\|+\varepsilon}\cdot g$，构造 value-improved target $a^* = \hat{a}+\Delta$，再蒸馏 $u^*_t = a^*-x_0$ 回 velocity field（L2 + BC anchor）。
- 理论：FlowDPG 更新方向可在三个显式近似下与 vanilla DPG 建立联系，相对 QAM 等 adjoint-based 方法更贴近经典 DDPG 文献。
- 训练管线：offline 阶段共享视觉 backbone + frozen reward predictor + critic + flow actor；online 阶段真机 rollout，replay buffer 混合 demos 与 rollouts，异步更新 critic/actor。

## 证据

- 真机任务：长时程、接触丰富、双臂 AirPods 组装（8 子阶段：抓盒、开盒、抓/插左右 Pod、关盒、放置），随机初始位姿、无阶段重置、毫米级插入精度。
- 端到端成功率：FlowDPG + online **92%**，较 BC base（64%）+28 pt，较强 prior RL baseline +12 pt；online 将 offline 88% 提升到 92%。
- 对比族：value-conditioning（RA-BC、AWR、RECAP）受 demonstration support 限制；auxiliary-module（DSRL、PLD、RLT）不改 base flow policy；critic-gradient 类中 FlowDPG 直接更新 velocity field，优于 QAM 等 adjoint 路线。
- 机制消融：去掉 adaptive shift、projection 或 stage-transition reward 会显著掉点；在线阶段对 OOD 扰动（重抓、重排、人为干扰）恢复能力明显强于纯 BC / value-conditioning。
- 涌现行为：重复微调插入角、双抓后仍能插入一只等超出示教分布的 corner case。

## 局限

- 验证集中在单一高难真机任务与 Skild 双臂平台，泛化到其他 VLA 骨干（$\pi_0$、OpenVLA）需额外工程。
- 依赖 SARM 等 stage-aware dense reward；无可靠 progress 信号时长时程任务 reward 设计成本高。
- 与 [[@tang2026frs]] / DSRL 同属“在 flow policy 上做 RL”，但 FlowDPG 改 velocity field 本身，和 noise-space steering 的叠加关系未展开。
- 项目页以视频结果为主，公开代码/训练配方尚未随 arXiv 一并发布。

## 我的阅读笔记

FlowDPG 解决的是 [[@physicalintelligence2024pi0]] 这类 flow-matching VLA 家族在 **post-BC 强化** 时的梯度通路问题：不是换 action 表示（[[@guo2026fafm]]）也不是推理时 steering（[[@tang2026frs]]），而是让 $\nabla_a Q$ 以 DDPG 方式进入 **velocity field 蒸馏**，且推理零额外开销。对双臂长时程任务（与 [[@wang2026covla]] 场景相近）尤其 relevant——IL 在 Insert Pod 等阶段瓶颈明显，value-conditioning 只能选 better mode，FlowDPG 能探索更高价值的新动作并出现重抓恢复。

后续可追问：FlowDPG 与 PolicyTrim（[[@wang2026policytrim]]）能否串联——一个改策略价值/鲁棒性，一个改 chunk 执行效率；以及 IQL+SARM reward 能否替换为更轻量的 success-only signal。

## 摘录