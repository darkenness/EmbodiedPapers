---
tags:
  - paper
status: unread
aliases:
  - DenseTact 2.0
  - "DenseTact 2.0: Optical Tactile Sensor for Shape and Force Reconstruction"
year: 2023
preprint_year: 2022
title: "DenseTact 2.0: Optical Tactile Sensor for Shape and Force Reconstruction"
doi: "10.1109/ICRA48891.2023.10161150"
url: "https://arxiv.org/abs/2209.10122"
venue: "2023 IEEE International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2023"
pages: "12549-12555"
published_url: "https://doi.org/10.1109/ICRA48891.2023.10161150"
arxiv: "2209.10122v2"
code: "https://github.com/armlabstanford/DenseTact"
video: "https://youtu.be/5S74w0iSPz8"
pdf: "[[papers/pdfs/2209.10122v2.pdf]]"
bilingual: "[[papers/bilingual/2209.10122v2_中英混读.md]]"
images: "papers/images/2209.10122v2/"
image_index: "[[papers/images/2209.10122v2/index.md]]"
authors:
  - "[[Won Kyung Do]]"
  - "[[Bianca Jurewicz]]"
  - "[[Monroe Kennedy]]"
institutions:
  - "[[Stanford ARMLab]]"
  - "[[Stanford University]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - 3D shape reconstruction
  - 6D force estimation
  - optical tactile sensor
  - transfer learning
  - robotics
---

# DenseTact 2.0: Optical Tactile Sensor for Shape and Force Reconstruction

- [x] PDF:: [[papers/pdfs/2209.10122v2.pdf]]
- [x] 双语阅读稿:: [[papers/bilingual/2209.10122v2_中英混读.md]]
- [x] 图片索引:: [[papers/images/2209.10122v2/index.md]]
- [ ] 阅读状态:: unread

related:: [[@do2022densetact]], [[@lin20239dtact]], [[@kota2026-3dcal]], [[@yuan2017gelsight]], [[tactile sensing]], [[robotics]]
affiliation:: [[Stanford ARMLab]], [[Stanford University]]

## 一句话问题

DenseTact 1.0 证明了半球形 optical tactile sensor 可以做稠密 3D shape reconstruction；DenseTact 2.0 进一步把硬件做小、做模块化，并把同一类内部图像用于 calibrated shape reconstruction（标定形状重建）和 6-axis wrench estimation（六维力/力矩估计）。

## 方法

- 硬件：缩小的半球形 gel（凝胶）模块、相机模块、LED 模块、镜面内壁和可修复 reflective surface。
- 图案：用 Voronoi stippling 与 TSP 路径生成 randomized pattern（随机化纹理），让大形变下的光流/局部变化更可追踪。
- 形状重建：沿用 DenseTact 1.0 的图像到 radial depth image 监督学习，但加入 bulging effect（鼓胀效应）建模并提高输出分辨率。
- 力估计：用 ATI force/torque sensor 采集 6D wrench 标签，比较 DenseNet-based CNN 与 Swin Transformer / NeWCRF 类架构。
- 迁移学习：用预训练模型校准新 finger，以较少数据得到接近完整训练的性能。

## 证据

- 传感器整体尺寸约 32 x 32 x 43 mm，重量约 34 g，接触表面积和体积比从 DenseTact 1.0 的 0.0707 mm^-1 提升到 0.1229 mm^-1。
- 形状重建最佳模型的总体误差约 0.3633 mm。
- 力估计平均误差约 0.410 N，力矩估计平均误差约 0.387 N·mm。
- 迁移学习可以用约 12% 的原始数据量获得接近非迁移训练的表现，并明显缩短训练时间。
- DenseNet 系列模型参数量和推理/训练开销低于更大的 Swin Transformer 方案，同时结果更好或相当。

## 局限

- 形状、力、力矩估计仍依赖传感器级数据采集和监督学习；跨制造批次、长期磨损后的鲁棒性需要继续验证。
- 输出是 net wrench（合力/合力矩），论文把 force distribution（力分布）作为未来工作。
- 随机 pattern 改善了可观测性，但也引入印刷、贴合和表面磨损维护的问题。

## 我的阅读笔记


## 摘录
