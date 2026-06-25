---
tags:
  - paper
status: unread
aliases:
  - TacShade
  - "TacShade: A New 3D-printed Soft Optical Tactile Sensor Based on Light, Shadow and Greyscale for Shape Reconstruction"
year: 2024
title: "TacShade: A New 3D-printed Soft Optical Tactile Sensor Based on Light, Shadow and Greyscale for Shape Reconstruction"
doi: "10.1109/ICRA57147.2024.10610508"
url: "https://arxiv.org/abs/2406.00485"
venue: "2024 IEEE International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2024"
pages: "17153-17159"
published_url: "https://doi.org/10.1109/ICRA57147.2024.10610508"
arxiv: "2406.00485v1"
pdf_url: "https://arxiv.org/pdf/2406.00485v1"
pdf: "[[papers/pdfs/2406.00485v1.pdf]]"
bilingual:
images: "papers/images/2406.00485v1/"
image_index: "[[papers/images/2406.00485v1/index.md]]"
authors:
  - "[[Zhenyu Lu]]"
  - "[[Jialong Yang]]"
  - "[[Haoran Li]]"
  - "[[Yifan Li]]"
  - "[[Weiyong Si]]"
  - "[[Nathan F. Lepora]]"
  - "[[Chenguang Yang]]"
institutions:
  - "[[University of the West of England]]"
  - "[[South China University of Technology]]"
  - "[[Peng Cheng Laboratory]]"
  - "[[University of Bristol]]"
  - "[[Bristol Robotics Laboratory]]"
  - "[[University of Liverpool]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - TacShade
  - TacTip
  - shape from shading
  - greyscale tactile image
  - light and shadow
  - shape reconstruction
  - robotics
---

# TacShade: A New 3D-printed Soft Optical Tactile Sensor Based on Light, Shadow and Greyscale for Shape Reconstruction

- [x] PDF:: [[papers/pdfs/2406.00485v1.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/2406.00485v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@li2025vbts-classification-review]], [[@abad2020visuotactile-review]], [[@donlon2018gelslim]], [[@lin2022dtact]], [[@lin20239dtact]], [[tactile sensing]], [[robotics]]
affiliation:: [[University of the West of England]], [[South China University of Technology]], [[Peng Cheng Laboratory]], [[University of Bristol]], [[Bristol Robotics Laboratory]], [[University of Liverpool]]

## 一句话问题

TacShade 想解决稀疏 marker displacement（标记点位移）不适合高分辨率形状重建的问题：它把 TacTip 的内部结构改成可产生 light / shadow / greyscale（光、影、灰度）变化的黑白图案，再用改进的 shape from shading（明暗恢复形状）从单张触觉图像做粗但快速的 2.5D/3D 形状重建。

## 方法

- 硬件：继承 TacTip 的单相机、软触头、乳突结构，但把白色 markers 分布在 papillae pins 的缝隙中，让接触时产生可见的明暗密度变化。
- 图像线索：白色 markers 勾勒接触轮廓，黑色 pins 与白色 markers 的面积/密度变化间接携带 contact depth（接触深度）。
- 算法：先做 circular mask、greyscale conversion、binarization 和 TVD smoothing，再把灰度变化送入改进的 SFS 管线估计高度。
- 实验：一个实验用不同几何物体验证单图重建和分类，另一个实验用机器人多次接触大面积 touchpad，并通过图像拼接重建大区域起伏。

## 证据

- Table I 给出 cube、crescent、ball、cylinder 等物体的 shape reconstruction error，其中 ball 的 ME 为 0.1039 mm，cube 为 0.9120 mm。
- Fig. 6 展示单次接触下原图、处理图、重建高度图和物体对比。
- Fig. 7 展示 touchpad 大区域扫描，说明 TacShade 的灰度线索不仅能做小物体，也可以通过多接触拼接覆盖较大区域。

## 局限

- 重建是 coarse reconstruction（粗重建），作者明确指出需要 accurate greyscale calibration and height mapping（准确灰度标定和高度映射）才能得到更精确的形状。
- 大面积平面接触时，中间区域灰度变化不明显，边界比内部更清楚。
- 球形触头和垂直接触模式会让靠近传感器边缘的接触区域重建不足。

## 我的阅读笔记


## 摘录
