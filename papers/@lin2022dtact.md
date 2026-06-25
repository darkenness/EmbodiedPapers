---
tags:
  - paper
status: reading
aliases:
  - DTact
  - DTact: A Vision-Based Tactile Sensor that Measures High-Resolution 3D Geometry Directly from Darkness
year: 2023
preprint_year: 2022
title: "DTact: A Vision-Based Tactile Sensor that Measures High-Resolution 3D Geometry Directly from Darkness"
doi: "10.1109/ICRA48891.2023.10160796"
url: "https://arxiv.org/abs/2209.13916"
venue: "2023 IEEE International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2023"
pages: "10359-10366"
published_url: "https://doi.org/10.1109/ICRA48891.2023.10160796"
arxiv: "2209.13916v1"
project: "https://sites.google.com/view/dtact-sensor"
pdf: "[[papers/pdfs/2209.13916v1.pdf]]"
reading:
images: "papers/images/2209.13916v1/"
image_index: "[[papers/images/2209.13916v1/index.md]]"
authors:
  - "[[Changyi Lin]]"
  - "[[Ziqi Lin]]"
  - "[[Shaoxiong Wang]]"
  - "[[Huazhe Xu]]"
institutions:
  - "[[Shanghai Qi Zhi Institute]]"
  - "[[Tsinghua University]]"
  - "[[Massachusetts Institute of Technology]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - 3D shape reconstruction
  - robotics
---

# DTact: A Vision-Based Tactile Sensor that Measures High-Resolution 3D Geometry Directly from Darkness

- [x] PDF:: [[papers/pdfs/2209.13916v1.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2209.13916v1/index.md]]
- [ ] 阅读状态:: reading

related:: [[tactile sensing]], [[robotics]]
affiliation:: [[Shanghai Qi Zhi Institute]], [[Tsinghua University]], [[Massachusetts Institute of Technology]]

## 一句话问题

GelSight 类 vision-based tactile sensor（视觉触觉传感器）依赖严格的内部照明和 photometric stereo（光度立体），制造与扩展到 non-planar surface（非平面表面）都很麻烦；DTact 尝试用半透明弹性体“受压变暗”的现象，直接从灰度变化估计 3D geometry（3D 几何）。

## 方法

- 结构：perception module（相机和 LED）、diffusion module（透明弹性体扩散光）、contact module（半透明层 + 黑色吸收层）。
- 原理：接触区域压得越深，半透明层越薄，反射回相机的光越少，图像越暗。
- 重建：用单张金属球压痕图像标定 intensity-to-depth mapping list（强度到深度映射表），后续把灰度差映射为 depth map。
- 结果处理：图像校正、裁剪、灰度差分、映射深度、Gaussian smoothing（高斯平滑）、生成 point cloud（点云）。

## 证据

- 传感器主体尺寸约 45mm x 45mm x 47mm；不含相机的组件与模具成本低于 7 美元。
- 标准设置下，single image method 的 MAE 为 0.0476 mm，优于 linear regression method 的 0.0534 mm。
- 在多种 LED 配置下，single image method 的 MAE 仍保持在约 0.0509-0.0650 mm。
- 从原始图像得到 depth map 的处理约 25 ms；带可视化的算法约 20 Hz。
- object recognition（物体识别）实验收集 4,320 张 tactile images，12 类对象，ResNet-18 测试集准确率约 96%。

## 局限

- 定量重建主要围绕球体标定和若干代表物体展示，复杂真实接触场景仍需要更多验证。
- non-planar surface 展示偏概念验证，尚未看到大规模任务评估。
- 厚度实验说明 finer geometry（更细几何）与 measurable depth range（可测深度范围）存在权衡。

## 我的阅读笔记


## 摘录
