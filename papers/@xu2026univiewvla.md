---
tags:
  - paper
status: unread
aliases:
  - UniviewVLA
  - "UniviewVLA: A Unified Multiview Vision-Language-Action Model with World Modeling"
year: 2026
title: "UniviewVLA: A Unified Multiview Vision-Language-Action Model with World Modeling"
doi: "10.48550/arXiv.2606.21501"
url: "https://arxiv.org/abs/2606.21501"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.21501v1"
arxiv_url: "https://arxiv.org/abs/2606.21501"
arxiv_doi: "10.48550/arXiv.2606.21501"
pdf_url: "https://arxiv.org/pdf/2606.21501v1"
published: 2026-06-19
updated: 2026-06-19
pdf: "[[papers/pdfs/2606.21501v1.pdf]]"
reading:
image_index: "[[papers/images/2606.21501v1/index.md]]"
authors:
  - "[[Tao Xu]]"
  - "[[Runhao Zhang]]"
  - "[[Zhijian Huang]]"
  - "[[Jiayi Guan]]"
  - "[[Jiaxin Wang]]"
  - "[[Yifan Ding]]"
  - "[[Yong-Lu Li]]"
  - "[[Long Chen]]"
  - "[[Guang Chen]]"
  - "[[Jinghui Lu]]"
institutions:
  - "[[Tongji University]]"
  - "[[Shanghai Innovation Institute]]"
  - "[[Shanghai Jiao Tong University]]"
  - "[[Xiaomi EV]]"
topics:
  - vision-language-action
  - multiview perception
  - world modeling
  - occlusion-aware manipulation
  - autoregressive VLA
  - UniVLA
  - visual token compression
  - action entropy
  - LIBERO
  - CALVIN
  - sim-to-real
---

# UniviewVLA: A Unified Multiview Vision-Language-Action Model with World Modeling

- [x] PDF:: [[papers/pdfs/2606.21501v1.pdf]]
- [x] 图片索引:: [[papers/images/2606.21501v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[world modeling]], [[multiview perception]], [[occlusion]], [[UniVLA]], [[LIBERO]], [[CALVIN]], [[@kim2026serf]], [[@xu2026egoguide]], [[@chen2026mvwam]], [[@kuzucu2026parcel]], [[@physicalintelligence2024pi0]]
affiliation:: [[Tongji University]], [[Shanghai Innovation Institute]], [[Shanghai Jiao Tong University]], [[Xiaomi EV]]

## 一句话问题

标准 agent-view + wrist-view 在遮挡时丢失动作关键线索，加物理相机要训练-推理相机 parity，显式 3D 重建又贵且只看当前态。UniviewVLA 在 UniVLA 式自回归 VLA 上接世界模型：仅用两路标准相机预测多视角未来场景，再经运动信息 token 压缩与 action-entropy 动态选视角做动作预测，无需额外硬件即可补遮挡与未来演化信息。

## 方法

- 范式：延续 UniVLA 离散 token 自回归 Transformer，语言、标准观测、辅助视角、动作统一建模。
- Stage 1 多视角世界模型后训练：由 agent-view + wrist-view 两帧历史与指令，自回归预测各候选辅助视角的 future VQ-token 序列（multiview + scene evolution）。
- Stage 2 动作微调：Motion-Informative Token Compression——按相邻帧 VQ embedding 余弦距离保留 top-16 运动相关 token（每视角 625→16，五视角 3125→80），再预测 FAST action tokens。
- 推理：training-free Action-Entropy View Selection——周期性在候选生成视角中选 action entropy 最低者作动作条件，适应不同阶段最优视角变化。
- 数据：另建 6 个遮挡导向仿真任务 + 开源多视角采集/处理/评测管线（3D-SpaceMouse 遥操作）。

## 证据

- 标准无遮挡基准：LIBERO **95.8%**；CALVIN ABCD→D **4.60**。
- 定制遮挡仿真（6 任务）：平均成功率 **40.0% → 73.3%**（+33.3 pt）。
- 真机两遮挡任务：平均成功率 **+33.4 pt**。
- 消融：完整辅助视角 token 冗余且慢（单视角 6–7s）；压缩后 **0.2–0.3s** 且保持精度；固定视角劣于动态选视角。
- 动机实验：第三物理相机在遮挡任务可把成功率从 4% 提到 16%，说明 multiview 信息价值，但硬件 parity 难扩展。

## 局限

- 依赖 UniVLA 自回归 VQ 世界模型，生成质量与视角集合 $V_{sel}$ 设计绑定；论文中项目页为占位链接，代码待公开。
- 主要对比物理多视角/显式重建 baseline，与 [[@chen2026mvwam]] / [[@yang2026memorywam]] 等 flow-MoT WAM 的遮挡泛化未直接对标。
- 真机仅 2 个遮挡任务，长时程、双臂、接触丰富场景覆盖有限。
- 动态选视角增加推理轮次逻辑，与 [[@wang2026policytrim]] 类部署加速正交但未联合评测。

## 我的阅读笔记

UniviewVLA 把「多视角」从 **硬件部署问题** 转成 **世界模型推理问题**：与 [[@kim2026serf]] 的显式 neural point map、[[@xu2026egoguide]] 的 head-ego 补全局上下文不同，它用生成式 future auxiliary views 同时补遮挡与未来演化。Motion-Informative Token Compression 与 [[@kuzucu2026parcel]] 同属视觉 token 预算问题，但这里按 **跨帧运动相关性** 而非 pool/query 压缩。

对自己项目：若只有 agent+wrist 两相机、遮挡导致失败，可优先试「生成辅助视角 + 动态选视角」路线，而不必先上第三路物理相机。

## 摘录