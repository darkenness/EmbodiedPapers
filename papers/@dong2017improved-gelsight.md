---
tags:
  - paper
status: unread
aliases:
  - Improved GelSight
  - "Improved GelSight Tactile Sensor for Measuring Geometry and Slip"
year: 2017
title: "Improved GelSight Tactile Sensor for Measuring Geometry and Slip"
doi: "10.1109/IROS.2017.8202149"
url: "https://arxiv.org/abs/1708.00922"
venue: "2017 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)"
venue_short: "IROS 2017"
pages: "137-144"
published_url: "https://doi.org/10.1109/IROS.2017.8202149"
arxiv: "1708.00922v1"
pdf_url: "https://arxiv.org/pdf/1708.00922v1"
pdf: "[[papers/pdfs/1708.00922v1.pdf]]"
bilingual:
images: "papers/images/1708.00922v1/"
image_index: "[[papers/images/1708.00922v1/index.md]]"
authors:
  - "[[Siyuan Dong]]"
  - "[[Wenzhen Yuan]]"
  - "[[Edward H. Adelson]]"
institutions:
  - "[[MIT CSAIL]]"
  - "[[Massachusetts Institute of Technology]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - GelSight
  - photometric stereo
  - Lambertian membrane
  - slip detection
  - geometry reconstruction
  - robotics
---

# Improved GelSight Tactile Sensor for Measuring Geometry and Slip

- [x] PDF:: [[papers/pdfs/1708.00922v1.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/1708.00922v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@donlon2018gelslim]], [[@wang2021gelsight-wedge]], [[@raskar2004non-photorealistic-camera]], [[tactile sensing]], [[robotics]]
affiliation:: [[MIT CSAIL]], [[Massachusetts Institute of Technology]]

## 一句话问题

这篇论文改进 Fingertip GelSight：用 Lambertian membrane（朗伯反射膜）和新的 illumination system（照明系统）提高 surface normal（表面法线）测量精度，同时利用 marker 与 texture 的相对运动做 translational / rotational slip detection（平移/旋转滑移检测）。

## 方法

- 传感器：把半镜面反射膜改成更接近 Lambertian 的膜层，让颜色变化更适合 photometric stereo。
- 几何测量：用不同颜色/方向的光照估计 surface normal，再积分重建 height map。
- 滑移检测：同时观察物体纹理和膜上 markers，在相邻帧中比较二者的相对位移和旋转。
- 抓取实验：把新 GelSight 装在 WSG-50 parallel gripper 上，用 UR5 和 37 个日常物体测试 grasp、lift 和 slip。

## 证据

- Surface normal 评估显示新设计在 pitch angle 下的颜色变化更接近理想测量，重建出的深度图比旧设计稳定。
- 37 个物体抓取实验中，Table I 把 successful / slip / border cases 分开；slip cases 的正确检测率为 84%，successful cases 为 79%。
- Fig. 7-Fig. 8 展示了物体纹理和 markers 的相对运动，解释为什么可以从视觉触觉图像里分辨滑移。

## 局限

- 滑移检测仍依赖阈值、marker tracking 和纹理可见性；光滑平面和很小剪切力会造成失败。
- 论文主要比较同一传感器设计的改善，尚未处理跨传感器迁移和多传感器部署问题。
- 对光照、膜层和制造一致性的依赖，也为 GelSlim、GelSight Wedge 和后续 PBR Design 提供了继续优化的空间。

## 我的阅读笔记


## 摘录
