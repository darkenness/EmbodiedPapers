---
tags:
  - paper
status: unread
aliases:
  - GelSight
  - "GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force"
year: 2017
title: "GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force"
doi: "10.3390/s17122762"
url: "https://www.mdpi.com/1424-8220/17/12/2762"
venue: "Sensors"
volume: 17
issue: 12
pages: "2762"
pdf_url: "https://www.mdpi.com/1424-8220/17/12/2762/pdf"
pdf_mirror: "https://web.stanford.edu/class/cs114/readings/MK-Yuan.pdf"
pdf: "[[papers/pdfs/yuan2017gelsight.pdf]]"
bilingual:
images: "papers/images/yuan2017gelsight/"
image_index: "[[papers/images/yuan2017gelsight/index.md]]"
authors:
  - "[[Wenzhen Yuan]]"
  - "[[Siyuan Dong]]"
  - "[[Edward H. Adelson]]"
institutions:
  - "[[MIT CSAIL]]"
  - "[[Massachusetts Institute of Technology]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - GelSight
  - photometric stereo
  - 3D geometry reconstruction
  - force estimation
  - robotics
---

# GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force

- [x] PDF:: [[papers/pdfs/yuan2017gelsight.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/yuan2017gelsight/index.md]]
- [ ] 阅读状态:: unread

related:: [[@lin2022dtact]], [[@lin20239dtact]], [[tactile sensing]], [[robotics]]
affiliation:: [[MIT CSAIL]], [[Massachusetts Institute of Technology]]

## 一句话问题

GelSight 试图回答机器人触觉到底需要什么信息：不仅是 force（力），还需要由软接触表面提供的 high-resolution geometry（高分辨率几何）、texture（纹理）、slip（滑移）和局部形变。

## 方法

- 硬件：透明 elastomer（弹性体）表面覆盖 reflective membrane（反射膜），物体接触时膜面形成目标表面的 relief replica（浮雕复制）。
- 形状：相机从背面拍摄不同方向/颜色照明下的膜面 shading（明暗），用 photometric stereo（光度立体）和标定 lookup table（查找表）恢复 surface normal，再积分得到 height map。
- 力和滑移：在膜面下打印 black markers（黑色标记点），用 marker displacement field（标记点位移场）估计 normal force、shear force、torque，以及 incipient slip（将要滑移）。
- 机器人版本：论文综述了 desktop GelSight、fingertip GelSight、改进版 fingertip GelSight 的设计和制造取舍。

## 证据

- 分辨率：优化高分辨率场景可达到 1-2 microns；紧凑机器人手指版本通常为 30-100 microns。
- 力敏感性：表 1 中多数接触条件下最小可分辨力小于 0.05 N。
- 几何评估：用直径 3.96 mm 的小球做 surface normal 校验，重建能保留常见物体的整体形状和局部纹理。
- 力评估：VGG-16 风格 CNN 从 GelSight 差分图预测 $F_x,F_y,F_z,T_z$，在简单未见物体上 force measurement 的 $R^2$ 高于 0.9。

## 局限

- Photometric stereo 对照明、反射膜、材料制备和单传感器标定要求较高。
- Marker-based force measurement 在接触几何变化时关系会变得非线性；CNN 方法依赖训练数据覆盖足够多的几何和接触条件。
- USB camera 版本有实时性和图像延迟问题，力/滑移估计也仍是初步实验。

## 我的阅读笔记

