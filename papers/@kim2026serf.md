---
tags:
  - paper
status: unread
aliases:
  - SERF
  - "SERF: Spatiotemporal Environment and Robot Feature Map for Long-Horizon Mobile Manipulation"
year: 2026
title: "SERF: Spatiotemporal Environment and Robot Feature Map for Long-Horizon Mobile Manipulation"
doi: "10.48550/arXiv.2606.12956"
url: "https://arxiv.org/abs/2606.12956"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.12956v1"
arxiv_url: "https://arxiv.org/abs/2606.12956"
arxiv_doi: "10.48550/arXiv.2606.12956"
pdf_url: "https://arxiv.org/pdf/2606.12956v1"
project: "https://existentialrobotics.org/serf/"
pdf: "[[papers/pdfs/2606.12956v1.pdf]]"
bilingual:
images: "papers/images/2606.12956v1/"
image_index: "[[papers/images/2606.12956v1/index.md]]"
authors:
  - "[[Sunghwan Kim]]"
  - "[[Byeonghyun Pak]]"
  - "[[Kehan Long]]"
  - "[[Yulun Tian]]"
  - "[[Nikolay Atanasov]]"
institutions:
  - "[[UC San Diego]]"
  - "[[Agency for Defense Development]]"
  - "[[SceniX Inc.]]"
  - "[[University of Michigan]]"
topics:
  - mobile manipulation
  - long-horizon manipulation
  - vision-language-action
  - spatiotemporal feature map
  - neural points
  - robot memory
  - scene representation
  - BEHAVIOR-1K
---

# SERF: Spatiotemporal Environment and Robot Feature Map for Long-Horizon Mobile Manipulation

- [x] PDF:: [[papers/pdfs/2606.12956v1.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/2606.12956v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[mobile manipulation]], [[spatiotemporal feature map]], [[neural points]], [[BEHAVIOR-1K]], [[robot memory]], [[@tang2026frs]]
affiliation:: [[UC San Diego]], [[Agency for Defense Development]], [[SceniX Inc.]], [[University of Michigan]]

## 一句话问题

长时程移动操作不能只靠当前相机图像判断“我在哪里、环境变了什么、任务做到哪一步”；SERF 把环境和机器人本体都表示成同一 latent space 中可随时间更新的 neural points，再把多参考系、多尺度 map tokens 接入 VLA，让策略获得显式的空间记忆和机器人-环境关系。

## 方法

- Spatiotemporal Environment and Robot Feature Map：环境点与机器人点共享 decoder 和 latent feature space，环境点来自 RGB-D/VFM back-projection，机器人点来自 URDF/mesh surface sampling。
- Neural point query：查询位置 $x$ 时，对附近 $K=6$ 个 neural points 的 latent features 做 softmax 距离插值，再经 residual MLP decoder 重建 DINOv3 patch embeddings。
- Map updates：环境中可动物体按 instance label 分组，用 2D keypoint tracking、3D lifting、FGR/ICP 估计 object-level $\mathrm{SE}(3)$；机器人点用当前 proprioception 和 forward kinematics 更新。
- Contrastive feature learning：重建损失之外，加 inter-category 和 intra-instance contrastive losses，使同类/同部位特征聚合、不同类/不同部位分离。
- Map-conditioned VLA：基于 $\pi_{0.5}$，从 map 中抽 8 个 tokens，包括 robot-base 多尺度、左右 end-effector、robot-only、environment-only、global tokens；这些 tokens 与视觉、状态和任务 embedding 一起进入 action expert。

## 证据

- BEHAVIOR-1K 三个任务平均 task progress：image-only $\pi_{0.5}$ fine-tuned 为 44.0%，完整 SERF 为 58.7%。
- 三个任务中 SERF 都取得最高 task progress：Task 21 为 63.5%，Task 22 为 60.1%，Task 26 为 52.5%。
- OOD scene-configuration shifts 中 SERF 均优于 image-only $\pi_{0.5}$：moved goal 50.8% vs 42.9%，additional objects 63.0% vs 50.6%，unvisited region 51.0% vs 28.0%。
- Object-drop recovery：同样 post-drop 状态下，SERF recovery success 从 65% 提到 95%，平均恢复时间从 24.3 s 降到 20.5 s。
- Map token ablation：Task 22 上完整 token set 最好，去掉 robot-base、end-effector、robot-only、environment-only 或 global token 都会降低 task progress。

## 局限

- 目前依赖 execution 前已经学好的 prior map，并在仿真中使用 privileged instance labels；作者把对 image-only baseline 的比较解释为“显式空间记忆增益”，不是完全同输入信号对照。
- 实验在 BEHAVIOR-1K/OmniGibson 中完成，还需要真实移动操作验证。
- 动态更新假设 object-level rigid motion，难以覆盖 articulated / deformable objects。
- map tokenizer 的空间子集是人工设计的，没有显式拆分任务语义、机器人、本体状态和对象状态线索。
- 当前 token 主要来自当前 map；多时间窗口、未来预测状态和 task-conditioned tokenization 仍是后续方向。

## 我的阅读笔记

SERF 适合作为 VLA 长时程状态表征入口：它不是再给 VLA 加更多历史帧，而是把“过去看到的东西、现在机器人身体在哪里、对象被移动到哪里”变成一个可查询的 4D feature map。和 FRS 这类 policy steering 工作相比，SERF 更偏状态侧接口；FRS 问“怎样调用已有 action prior”，SERF 问“怎样把长时程空间记忆作为 VLA 输入”。以后看 tactile / VLA 融合时，可以借它的接口思路：触觉或接触状态未必直接输出动作，而是先进入一个随时间更新、带机器人本体关系的结构化 state token。

## 摘录
