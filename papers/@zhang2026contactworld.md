---
tags:
  - paper
status: unread
aliases:
  - ContactWorld
  - Contact World
  - "ContactWorld: What Matters in Vision-Tactile World Models for Contact-Rich Manipulation"
year: 2026
title: "ContactWorld: What Matters in Vision-Tactile World Models for Contact-Rich Manipulation"
doi: "10.48550/arXiv.2606.13877"
url: "https://arxiv.org/abs/2606.13877"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.13877v1"
arxiv_url: "https://arxiv.org/abs/2606.13877"
arxiv_doi: "10.48550/arXiv.2606.13877"
pdf_url: "https://arxiv.org/pdf/2606.13877v1"
project: "https://contact-world.github.io/"
code: "https://github.com/PokuangZhou/ContactWorld"
dataset: "https://huggingface.co/datasets/Pokuang/ContactWorld/tree/main"
video: "https://drive.google.com/file/d/1kWCeB5C1ebT7S4B8_Ge6phriIfrAhvMx/view?usp=drive_link"
published: 2026-06-11
updated: 2026-06-11
pdf: "[[papers/pdfs/2606.13877v1.pdf]]"
bilingual:
images: "papers/images/2606.13877v1/"
image_index: "[[papers/images/2606.13877v1/index.md]]"
authors:
  - "[[Zhiyuan Zhang]]"
  - "[[Pokuang Zhou]]"
  - "[[Kaidi Zhang]]"
  - "[[Adeesh Desai]]"
  - "[[Temitope Amosa]]"
  - "[[Davood Soleymanzadeh]]"
  - "[[Jiuzhou Lei]]"
  - "[[Minghui Zheng]]"
  - "[[Yu She]]"
institutions:
  - "[[Purdue University]]"
  - "[[Texas A&M University]]"
topics:
  - vision-tactile world model
  - contact-rich manipulation
  - robot world model
  - tactile sensing
  - point cloud
  - tactile force field
  - latent world model
  - model-predictive control
  - CEM planning
  - multimodal representation
  - manipulation benchmark
---

# ContactWorld: What Matters in Vision-Tactile World Models for Contact-Rich Manipulation

- [x] PDF:: [[papers/pdfs/2606.13877v1.pdf]]
- [x] 项目页:: [ContactWorld](https://contact-world.github.io/)
- [x] 代码:: [PokuangZhou/ContactWorld](https://github.com/PokuangZhou/ContactWorld)
- [x] 数据集:: [Hugging Face ContactWorld](https://huggingface.co/datasets/Pokuang/ContactWorld/tree/main)
- [x] 视频:: [Project video](https://drive.google.com/file/d/1kWCeB5C1ebT7S4B8_Ge6phriIfrAhvMx/view?usp=drive_link)
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/2606.13877v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[vision-tactile world model]], [[contact-rich manipulation]], [[robot world model]], [[tactile sensing]], [[point cloud]], [[model-predictive control]], [[latent world model]], [[@processbench2026roboprocessbench]], [[@kim2026serf]], [[@lin2026physbrain]], [[@xu2026egoguide]], [[@tencent2026hy-embodied-05]]
affiliation:: [[Purdue University]], [[Texas A&M University]]

## 一句话问题

接触丰富操作中的 world model 既要预测几何关系，又要处理局部接触、摩擦、遮挡和长时程误差累积；ContactWorld 用 12 个 contact-rich manipulation tasks 和 6 类视觉/触觉模态系统比较 representation structure、cross-modal compatibility 与 long-horizon robustness 到底怎样影响 latent world model planning。

## 方法

- ContactWorld benchmark：12 个任务，覆盖 insertion、disassembly、screwing、exploration 四类接触丰富交互；任务基于 TacSL / Isaac Gym 触觉仿真，统一 Franka Panda、relative pose control 和 10 Hz 控制频率。
- 视觉模态：Wrist View、Front View、PointCloud。论文把 PointCloud 视为同时有 explicit spatial geometry 和 global temporal continuity 的视觉表征。
- 触觉模态：TacRGB、TacDepth、TacFF。TacFF 是 $10 \times 14 \times 3$ tactile force field，每个 taxel 有 normal force $f_z$ 和 tangential shear forces $f_x,f_y$。
- World model：JEPA-style latent predictive world model，不重建像素，而是用 modality-specific encoders 把观测编码到 latent，再用 action-conditioned GRU predictor 做 autoregressive latent rollout。
- 默认 multimodal fusion：late concatenation；默认 regularization placement 是只对 visual latent 做 VC regularization，避免把强平滑/去相关约束压到局部、突变的 tactile latent 上。
- Planning：latent-space MPC + CEM。规划器采样候选动作序列，用 world model roll out 到 $H$ 步后和 goal latent 比距离，只执行第一步动作，然后 receding-horizon replanning。

## 证据

- 平均成功率：Wrist View 20.7%，Front View 22.0%，PointCloud 32.1%；PointCloud+TacFF 达到 36.1%，是主表里整体最强组合。
- 触觉不是无条件有益：Wrist+TacDepth 从 20.7% 到 24.3%，Front+TacDepth 从 22.0% 到 24.5%；但 PointCloud 搭配 TacDepth / TacRGB 反而低于 PointCloud-only，只有 TacFF 提升到 36.1%。
- 长时程鲁棒性：PointCloud-only 在 12/24/36/48 step goal offset 下为 52.1 / 36.6 / 23.7 / 16.0；PointCloud+TacFF 为 54.4 / 41.6 / 27.8 / 20.5，长 horizon 下触觉增益更明显。
- 表征解释：wrist image 在插入和对齐阶段容易被 gripper / object 遮挡；front image 保持较好全局连续性；point cloud 显式保留 3D 几何；TacFF 能显示 phase-dependent force response，因此和 point cloud 更兼容。
- 真实机器人 valve screwing：10 次 trial 下 PointCloud-only 达到 90%；Wrist+TacRGB 从 70% 到 90%，Front+TacRGB 从 70% 到 80%，但 TacDepth / TacFF 的仿真优势没有完整迁移到真实触觉重建。
- 消融：IMPALA-style end-to-end encoders 在主设置中胜过 DINOv2 / ViT 视觉特征；复杂 fusion 不稳定胜过 simple late concat；Vision-only regularization 对 PointCloud+TacFF 尤其关键。

## 局限

- 任务虽然覆盖四类接触模式，但多数仍是 single-stage、goal-directed，不是复杂 hierarchical multi-stage manipulation。
- 48-step goal offset 已经明显掉分，说明长时程 latent rollout 的误差累积仍没有解决；真实机器人长期接触操作会更难。
- 主要证据来自仿真触觉；真实世界里 TacDepth / TacFF 需要从 marker tracking、depth estimation、force inference 和 calibration 中重建，噪声导致 sim-to-real gap。
- 指标是 goal-state 几何一致性和 success rate；对策略安全、接触力上限、硬件磨损、在线计算预算等部署因素讨论有限。
- ViT predictor 消融显示 token-heavy transformer planning 频率约低 20 倍；如果扩展到更大视觉/触觉 token 预算，需要重新处理推理效率。

## 我的阅读笔记

这篇适合放在 WMA / world-model-planning 入口。它不是又提出一个更大的 world model，而是在问“什么表征真的让 contact-rich planning 稳”。最有用的结论是：触觉不是简单加模态就赢，关键是 tactile representation 和 visual representation 的结构兼容。PointCloud+TacFF 有效，是因为两者都保留空间结构和接触动态；image-like tactile cue 与 point cloud 反而可能不对齐。

和 [[@kim2026serf]] 相比，ContactWorld 不维护长时程环境地图，而是用统一 benchmark 研究 latent rollout 中的表示选择。和 [[@lin2026physbrain]] / [[@tencent2026hy-embodied-05]] 相比，它不强调 VLM backbone 或语言推理，而是直接面向 predictive planning 与 contact dynamics。和触觉传感器库里的 VBTS 文献相比，它把 TacRGB / TacDepth / TacFF 放在 world model planning 里评估，适合回答“触觉表征进策略或 world model 时到底该用什么形式”。

后续回看重点：PointCloud+TacFF 的表征兼容性是否能迁移到真实 GelSight / DIGIT / 自制 VBTS；vision-only regularization 的设计能否用于更大的 video world model；ContactWorld 的 Hugging Face 数据是否可以作为本地 tactile-world-model baseline。

## 摘录

- 核心数值：Wrist 20.7%，Front 22.0%，PointCloud 32.1%，PointCloud+TacFF 36.1%。
- 长 horizon 关键数值：PointCloud+TacFF 在 48-step offset 下 20.5%，高于 PointCloud-only 16.0%。
- 真实机器人提醒：仿真里 TacFF 最强，但真实 valve screwing 中 TacRGB 对 image-based view 更稳，说明 reconstructed tactile modalities 的 sim-to-real gap 不能忽略。
