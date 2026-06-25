---
tags:
  - paper
status: unread
aliases:
  - 9DTact
  - "9DTact: A Compact Vision-Based Tactile Sensor for Accurate 3D Shape Reconstruction and Generalizable 6D Force Estimation"
year: 2023
title: "9DTact: A Compact Vision-Based Tactile Sensor for Accurate 3D Shape Reconstruction and Generalizable 6D Force Estimation"
doi: "10.48550/arXiv.2308.14277"
url: "https://arxiv.org/abs/2308.14277"
venue: "IEEE Robotics and Automation Letters"
arxiv: "2308.14277v2"
project: "https://linchangyi1.github.io/9DTact"
pdf: "[[papers/pdfs/2308.14277v2.pdf]]"
reading:
images: "papers/images/2308.14277v2/"
image_index: "[[papers/images/2308.14277v2/index.md]]"
authors:
  - "[[Changyi Lin]]"
  - "[[Han Zhang]]"
  - "[[Jikai Xu]]"
  - "[[Lei Wu]]"
  - "[[Huazhe Xu]]"
institutions:
  - "[[Shanghai Qi Zhi Institute]]"
  - "[[Tsinghua University]]"
  - "[[Huazhong University of Science and Technology]]"
  - "[[Shanghai Artificial Intelligence Laboratory]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - 3D shape reconstruction
  - 6D force estimation
  - robotics
---

# 9DTact: A Compact Vision-Based Tactile Sensor for Accurate 3D Shape Reconstruction and Generalizable 6D Force Estimation

- [x] PDF:: [[papers/pdfs/2308.14277v2.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2308.14277v2/index.md]]
- [ ] 阅读状态:: unread

related:: [[@lin2022dtact]], [[tactile sensing]], [[robotics]]
affiliation:: [[Shanghai Qi Zhi Institute]], [[Tsinghua University]], [[Huazhong University of Science and Technology]], [[Shanghai Artificial Intelligence Laboratory]]

## 一句话问题

9DTact 试图把 DTact 的 low-cost vision-based tactile sensing（低成本视觉触觉感知）推进到更紧凑、更易制造的硬件，同时保留 3D shape reconstruction（3D 形状重建）并加入不依赖 marker/pattern 的 6D force estimation（六维力估计）。

## 方法

- 硬件：32.5 mm x 25.5 mm x 25.5 mm 的紧凑结构，OV5647 wide-FOV camera、矩形 8-LED board、transparent / translucent / black gel 三层材料。
- 3D 重建：继承 DTact 的 grayscale difference image（灰度差分图）到 depth map（深度图）的标定映射，并加入相机/胶层畸变校正。
- 力估计：利用 translucent gel 的 deformation / flow（凝胶变形/流动）形成 dense deformation representation（稠密变形表示），输入 Densenet-169 回归 6D force。
- 数据：从 175 个复杂 3D 打印物体采集 100,417 对 image-force 数据，使用 6-axis F/T sensor 提供标签。

## 证据

- 传感器尺寸为 32.5 x 25.5 x 25.5 mm，约为 DTact 体积的 22%；成本约 15 美元。
- 3D shape reconstruction 的 MAE 为 0.0462 mm，Std 为 0.0304 mm，略优于 DTact 的 0.0476 mm / 0.0352 mm。
- Standard split 下 6D force estimation 平均误差约 0.307 N / 0.006 Nm；object-based split 下约 0.370 N / 0.0077 Nm。
- Object-based split 使用 18 个 unseen objects 作为测试对象，强调对未见几何的泛化。

## 局限

- 6D force estimation 依赖学习模型和较大数据集，跨传感器、跨制造批次的泛化还需要额外验证。
- 论文说明不同触觉传感器的 force estimation 指标不完全可比，因此横向比较仍有限。
- 手动按压采集提高了几何和运动多样性，但也可能带来采集分布与真实机器人接触分布之间的差距。

## 我的阅读笔记


## 摘录

