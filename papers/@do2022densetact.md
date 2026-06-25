---
tags:
  - paper
status: unread
aliases:
  - DenseTact
  - "DenseTact: Optical Tactile Sensor for Dense Shape Reconstruction"
year: 2022
title: "DenseTact: Optical Tactile Sensor for Dense Shape Reconstruction"
doi: "10.1109/ICRA46639.2022.9811966"
url: "https://arxiv.org/abs/2201.01367"
venue: "2022 International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2022"
pages: "6188-6194"
published_url: "https://doi.org/10.1109/ICRA46639.2022.9811966"
arxiv: "2201.01367v4"
code: "https://github.com/armlabstanford/DenseTact"
video: "https://youtu.be/nhQZhsjbcQA"
pdf: "[[papers/pdfs/2201.01367v4.pdf]]"
reading:
images: "papers/images/2201.01367v4/"
image_index: "[[papers/images/2201.01367v4/index.md]]"
authors:
  - "[[Won Kyung Do]]"
  - "[[Monroe Kennedy]]"
institutions:
  - "[[Stanford ARMLab]]"
  - "[[Stanford University]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - dense shape reconstruction
  - 3D calibration
  - hemispherical sensor
  - in-hand manipulation
  - robotics
---

# DenseTact: Optical Tactile Sensor for Dense Shape Reconstruction

- [x] PDF:: [[papers/pdfs/2201.01367v4.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2201.01367v4/index.md]]
- [ ] 阅读状态:: unread

related:: [[@do2023densetact-2]], [[@lin2022dtact]], [[@lin20239dtact]], [[@yuan2017gelsight]], [[tactile sensing]], [[robotics]]
affiliation:: [[Stanford ARMLab]], [[Stanford University]]

## 一句话问题

Dexterous manipulation（灵巧操作）需要高分辨率触觉几何，但很多 optical tactile sensors（光学触觉传感器）要么表面形状偏平面、要么光学结构和标定复杂；DenseTact 试图用半球形软弹性体、鱼眼相机和学习模型做 dense 3D surface reconstruction（稠密三维表面重建）。

## 方法

- 硬件：soft hemispherical silicone elastomer（半球形软硅胶弹性体）、reflective surface（反射表面）、fisheye lens camera（鱼眼相机）、LED strip（LED 灯带）和 3D printed mount。
- 标定：先标定鱼眼相机像素到半球表面 spherical coordinates（球坐标）的映射，再用已知 STL 的 3D printed indenters（3D 打印压头）产生 ground-truth radial depth images（径向深度真值图）。
- 重建：把传感器内部 RGB 图像输入带 skip connection 的 autoencoder；encoder 使用 pretrained DenseNet-161，输出 radial depth image，再转换成 3D point cloud。
- 训练损失：结合 point-wise L1 depth loss、depth gradient L1 loss 和 SSIM loss。

## 证据

- 传感器高度约 35 mm，半球半径约 25 mm，可覆盖接近 4,000 mm^2 的弹性体表面。
- 组件成本低于 80 美元；其中相机约 70 美元，非相机部分约 10 美元。
- 标定数据包含 30,200 个接触配置，其中 29,200 用于训练，1,000 用于测试。
- 平均推理时间约 18.17 ms，能支持 30 fps 附近的实时操作。
- 测试集平均 L1 reprojection error 约 0.2811 mm，平均 L2 error 约 0.03208 mm。
- Allegro Hand 上的 in-hand localization 展示了用重建点云配合 ICP 估计物体位置的可行性。

## 局限

- 数据集依赖 3D 打印件和 STL 模型生成真值，ground truth 质量受到打印精度、装夹、步进电机和人工旋转设置影响。
- 本文主要输出 shape reconstruction（形状重建）；force distribution（力分布）只作为未来方向提出。
- 学习式映射需要每种传感器或制造批次的标定数据，跨传感器泛化还不是这篇工作的重点。

## 我的阅读笔记


## 摘录
