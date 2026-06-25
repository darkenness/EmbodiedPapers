---
tags:
  - paper
status: unread
aliases:
  - Tactile Genesis
  - "Tactile Genesis: Exploring Tactile Sensors at Scale for Learning Dexterous Tasks"
year: 2026
title: "Tactile Genesis: Exploring Tactile Sensors at Scale for Learning Dexterous Tasks"
doi: "10.48550/arXiv.2606.22332"
url: "https://arxiv.org/abs/2606.22332"
venue: "Conference on Robot Learning (CoRL)"
venue_short: "CoRL"
arxiv: "2606.22332v1"
arxiv_url: "https://arxiv.org/abs/2606.22332"
arxiv_doi: "10.48550/arXiv.2606.22332"
pdf_url: "https://arxiv.org/pdf/2606.22332v1"
project: "https://neuroagents-lab.github.io/tactile-genesis/"
published: 2026-06-21
updated: 2026-06-21
pdf: "[[papers/pdfs/2606.22332v1.pdf]]"
bilingual:
image_index: "[[papers/images/2606.22332v1/index.md]]"
authors:
  - "[[Trinity Chung]]"
  - "[[Kashu Yamazaki]]"
  - "[[Dhruv Patel]]"
  - "[[Alexis Duburcq]]"
  - "[[Yiling Qiao]]"
  - "[[Katerina Fragkiadaki]]"
  - "[[Aran Nayebi]]"
institutions:
  - "[[Carnegie Mellon University]]"
  - "[[Genesis AI]]"
topics:
  - tactile simulation
  - tactile sensing
  - dexterous manipulation
  - vision-based tactile sensor
  - teacher-student policy
  - reinforcement learning
  - sim-to-real
  - tactile abstraction
  - GPU-parallel simulation
  - Genesis World
  - XHand1
  - contact-rich manipulation
---

# Tactile Genesis: Exploring Tactile Sensors at Scale for Learning Dexterous Tasks

- [x] PDF:: [[papers/pdfs/2606.22332v1.pdf]]
- [x] 项目页:: [Tactile Genesis](https://neuroagents-lab.github.io/tactile-genesis/)
- [x] 图片索引:: [[papers/images/2606.22332v1/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[tactile sensing]], [[dexterous manipulation]], [[sim-to-real]], [[vision-based tactile sensor]], [[Genesis World]], [[@yuan2017gelsight]], [[@li2025vbts-classification-review]], [[@zhang2026contactworld]], [[@niu2026trex]], [[@wang2024large-scale-vbts]]
affiliation:: [[Carnegie Mellon University]], [[Genesis AI]]

## 一句话问题

灵巧操作需要触觉，但硬件各异、实验室难以在同一手型与任务上公平对比“该用哪种触觉抽象”；Tactile Genesis 在 Genesis World 上统一仿真 binary contact、depth、per-taxel force/torque、elastomer marker、proximity、contact audio 与 voxelized temperature，GPU 并行 >20k env / 1000+ taxels，通过 teacher-student 消融回答 placement、resolution、noise 与 sensor type 的取舍，并验证到真机 XHand1。

## 方法

- 平台：7 类传感器抽象 + 统一 pose/radius 几何、可配置 placement/resolution、噪声模型（drift、hysteresis、dead taxels、crosstalk）；相对 FOTS / HydroShear / Tacmap / TacSL 吞吐提升 3–20×，单环境 GPU 内存约降 5×。
- 传感器族：Surface/Contact Depth/Contact Probe、Kinematic Taxel（6D wrench）、Proximity Taxel、Elastomer Taxel（改进 HydroShear，GelSight dilation/shear RMSE 更低）、Temperature Grid、Contact Audio。
- 训练：privileged teacher（PPO + RND，全物体状态）→ DAgger tactile student（8 种下游观测 + proprio-only baseline）；辅助 decoder 从 latent 预测 privileged state 作正则，部署时丢弃。
- 任务（XHand1）：`in_palm_rotate`（掌内重定向）、`in_hand_repose`（手内重摆姿）、`screwdriver`（螺丝刀操作），覆盖持续接触、近连续接触、短暂接触三种 regime。
- 额外：仅用 proprio + temperature 在几何相同 distractor 中定位热物体；真机热敏不足则学不动，说明新模态仿真价值。

## 证据

- 本体感觉 alone 在三任务均不够，最便宜的 binary contact student 也显著更好。
- **Placement > sensor type**：仅指尖远逊于全手覆盖；加 palm + 近节指骨可逼近 privileged teacher。
- **Coverage > resolution**：全手约 200 taxels 即够，继续加密收益有限。
- **Force/torque per taxel** 跨任务最稳默认；任务特异：repose 上各抽象接近，screwdriver 上 force/torque 明显优于 binary/depth，rotate 上 proximity 因预接触塑形略优。
- Sim-to-real：`in_palm_rotate` 部署到真 XHand1（仅指尖 aggregate force），成功率与 sim 中 fingertip agg bool student 一致。
- ElastomerTaxel 对真实 GelSight marker motion 的 RMSE 优于 FOTS / HydroShear。

## 局限

- Student 蒸馏自 privileged teacher，策略上界受 teacher 束缚；未做大规模纯触觉 RL 或 vision+tactile 联合 sweep。
- 任务仅 3 个 + 主手型 XHand1，结论对 VBTS 高分辨率视觉触觉、全身触觉皮肤的泛化需更多验证。
- 代码将开源至 GitHub，截至 arXiv 尚未挂出固定仓库；Genesis 版本可能与论文略有差异。
- Temperature/audio 更多是平台能力展示，主消融仍以力/位移/接触类为主。

## 我的阅读笔记

这篇把“触觉硬件选型”从 **买哪只传感器手** 转成 **在同一仿真接口下扫抽象层**：对 VBTS 路线（[[@yuan2017gelsight]]）和 taxel-array 路线都适用，且直接对话 [[@niu2026trex]] / [[@zhang2026contactworld]] 里“策略到底需要多 rich 的触觉”——结论很硬：**先铺 coverage，再谈 sensor type 升级**。全手 200 taxels 够用的结论对 [[@wang2024large-scale-vbts]] 式多指部署有设计含义：不必盲目追求单点超高分辨率。

与 [[@li2025vbts-classification-review]] 的分类正交：那篇按换能机制分硬件，这篇按 policy 观测抽象分仿真层。后续可追问：Tactile Genesis 的 Kinematic Taxel 能否作为 VLA tactile token 的 sim 预训练前端，以及 ElastomerTaxel 与真实 VBTS sim-to-real 管线如何对接。

## 摘录