---
tags:
  - paper
status: unread
aliases:
  - AllSight
  - "AllSight: A Low-Cost and High-Resolution Round Tactile Sensor with Zero-Shot Learning Capability"
year: 2024
title: "AllSight: A Low-Cost and High-Resolution Round Tactile Sensor with Zero-Shot Learning Capability"
doi: "10.1109/LRA.2023.3333701"
url: "https://arxiv.org/abs/2307.02928"
venue: "IEEE Robotics and Automation Letters"
venue_short: "RA-L 2024"
pages: "483-490"
published_url: "https://doi.org/10.1109/LRA.2023.3333701"
arxiv: "2307.02928v2"
pdf_url: "https://arxiv.org/pdf/2307.02928v2"
pdf: "[[papers/pdfs/2307.02928v2.pdf]]"
reading:
images: "papers/images/2307.02928v2/"
image_index: "[[papers/images/2307.02928v2/index.md]]"
authors:
  - "[[Osher Azulay]]"
  - "[[Nimrod Curtis]]"
  - "[[Rotem Sokolovsky]]"
  - "[[Guy Levitski]]"
  - "[[Daniel Slomovik]]"
  - "[[Guy Lilling]]"
  - "[[Avishai Sintov]]"
institutions:
  - "[[Tel Aviv University]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - AllSight
  - round tactile sensor
  - zero-shot learning
  - transfer learning
  - force estimation
  - torsion estimation
  - robotics
---

# AllSight: A Low-Cost and High-Resolution Round Tactile Sensor with Zero-Shot Learning Capability

- [x] PDF:: [[papers/pdfs/2307.02928v2.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2307.02928v2/index.md]]
- [ ] 阅读状态:: unread

related:: [[@li2025r-tac0]], [[@do2022densetact]], [[@do2023densetact-2]], [[@fan2025crystaltac]], [[@li2025vbts-classification-review]], [[tactile sensing]], [[robotics]]
affiliation:: [[Tel Aviv University]]

## 一句话问题

AllSight 是一个 low-cost, high-resolution, round optical tactile sensor（低成本、高分辨率、圆形光学触觉传感器），重点不是单个传感器的最高精度，而是 3D printed（3D 打印）、large contact surface（大接触面）、full contact state（完整接触状态）估计和 zero-shot transfer（零样本迁移）能力。

## 方法

- 硬件：大部分结构 3D 打印，包括透明外壳；触头接近人类拇指大小，圆柱/圆形外表面提供 360 degree sensing。
- 可配置设计：比较 clear/marked elastomer 和 white、RRRGGGBBB、RGBRGBRGB 三种照明配置。
- 估计目标：contact state 定义为 $s \in R^7$，包括 3D contact position、3D force 和 torsion。
- 学习：使用 modified ResNet-18，从参考图像和接触图像估计完整状态，并用仿真预训练减少真实数据需求。
- 迁移：在新制造的传感器上测试 zero-shot 和少量 fine-tuning。

## 证据

- Table I 显示 AllSight 覆盖 position、normal force、tangential force、torsion 和 zero-shot 等能力，体积约 26 x 28 x 38 mm。
- 最优配置为 RRRGGGBBB illumination + dotted markers；主要误差约为 position 0.59 mm、force 0.15 N、torsion 0.0002 Nm。
- Zero-shot inference 在新传感器上已达到 position / force / torsion error: 3.49 ± 0.41 mm、2.06 ± 0.23 N、0.0068 ± 0.0016 Nm。

## 局限

- Zero-shot 精度低于同传感器训练和少量 fine-tuning 后的结果；实际部署仍要权衡标定成本和误差。
- 圆形/曲面形态对图像建模和光照一致性提出更高要求。
- 论文重点是 state estimation benchmark，长期磨损、批量制造一致性和多传感器系统集成仍需和 CrystalTac / Large-scale Deployment 线索合读。

## 我的阅读笔记


## 摘录
