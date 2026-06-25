---
tags:
  - paper
status: unread
aliases:
  - PBR Design
  - "Vision-based tactile sensor design using physically based rendering"
  - "Design of vision-based tactile sensors using physically based rendering"
year: 2025
title: "Vision-based tactile sensor design using physically based rendering"
doi: "10.1038/s44172-025-00350-4"
url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11828998/"
venue: "Communications Engineering"
venue_short: "Commun Eng. 2025"
pages: "Article 21"
published_url: "https://doi.org/10.1038/s44172-025-00350-4"
pmid: "39953115"
pmcid: "PMC11828998"
pdf_url: "https://www.nature.com/articles/s44172-025-00350-4.pdf"
pdf: "[[papers/pdfs/s44172-025-00350-4.pdf]]"
reading:
images: "papers/images/agarwal2025-pbr-design/"
image_index: "[[papers/images/agarwal2025-pbr-design/index.md]]"
authors:
  - "[[Arpit Agarwal]]"
  - "[[Achu Wilson]]"
  - "[[Timothy Man]]"
  - "[[Edward H. Adelson]]"
  - "[[Ioannis Gkioulekas]]"
  - "[[Wenzhen Yuan]]"
institutions:
  - "[[Carnegie Mellon University]]"
  - "[[Massachusetts Institute of Technology]]"
  - "[[University of Illinois Urbana-Champaign]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - physically based rendering
  - optical simulation
  - sensor design
  - photometric stereo
  - RGB2Normal
  - robotics
---

# Vision-based tactile sensor design using physically based rendering

- [x] PDF:: [[papers/pdfs/s44172-025-00350-4.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/agarwal2025-pbr-design/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@dong2017improved-gelsight]], [[@donlon2018gelslim]], [[@wang2021gelsight-wedge]], [[tactile sensing]], [[robotics]]
affiliation:: [[Carnegie Mellon University]], [[Massachusetts Institute of Technology]], [[University of Illinois Urbana-Champaign]]

## 一句话问题

PBR Design 把 VBTS 的光学结构设计从 trial-and-error（反复试错）转成 simulation-driven design（仿真驱动设计）：用 physically based rendering（基于物理的渲染）模拟照明、形状、厚度和涂层材料，再用 RGB2Normal 一类目标函数评价哪个设计更适合恢复 surface normals（表面法线）。

## 方法

- 阶段 1：设计 illumination（光源类型和光源位置），用光学仿真生成触觉图像，并通过 RGB2Normal 评估法线恢复质量。
- 阶段 2：用低维 shape parameterization（形状参数化）生成不同传感器几何，再把候选形状送入渲染和评价流程。
- 物理建模：模拟输入包括 sensor surface mesh、refractive indices、coating material 和 illumination profile。
- 真实校验：通过 real-to-sim experiments（真实到仿真的校准实验）拟合光源和涂层材料参数，再比较模拟图像与真实原型图像。

## 证据

- 论文展示仿真框架可以复现实物 VBTS 原型的 tactile images，并能探索照明、表面形状、厚度和涂层材料的设计空间。
- 优化设计在 simulation 中的 3D surface reconstruction 指标比初始设计提升约 35%，真实传感器 RGB2Normal objective 比 human-expert design 高约 15.6%。
- 在真实 robotic embossed text detection 中，优化设计约比既有人类专家设计好 5 倍。
- 评价目标围绕 surface normal recovery，因为 photometric stereo 是 GelSight-style 3D shape reconstruction 的基础。
- 作者强调评价函数并不绑定具体图像生成过程，因此可以被改写为 force、pressure 或其他任务目标。

## 局限

- 框架依赖光源、材料、涂层和几何的准确物理模型；更复杂的照明或材料需要额外标定方法。
- RGB2Normal 主要服务几何重建，若目标是力、滑移或长期磨损稳定性，需要改写 objective function。

## 我的阅读笔记


## 摘录
