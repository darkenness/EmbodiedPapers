---
tags:
  - paper
status: unread
aliases:
  - GelSlim
  - "GelSlim: A High-Resolution, Compact, Robust, and Calibrated Tactile-sensing Finger"
year: 2018
title: "GelSlim: A High-Resolution, Compact, Robust, and Calibrated Tactile-sensing Finger"
doi: "10.1109/IROS.2018.8593661"
url: "https://arxiv.org/abs/1803.00628"
venue: "2018 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)"
venue_short: "IROS 2018"
pages: "1927-1934"
published_url: "https://doi.org/10.1109/IROS.2018.8593661"
arxiv: "1803.00628v1"
pdf_url: "https://arxiv.org/pdf/1803.00628v1"
pdf: "[[papers/pdfs/1803.00628v1.pdf]]"
bilingual: "[[papers/bilingual/1803.00628v1_中英混读.md]]"
images: "papers/images/1803.00628v1/"
image_index: "[[papers/images/1803.00628v1/index.md]]"
authors:
  - "[[Elliott Donlon]]"
  - "[[Siyuan Dong]]"
  - "[[Melody Liu]]"
  - "[[Jianhua Li]]"
  - "[[Edward H. Adelson]]"
  - "[[Alberto Rodriguez]]"
institutions:
  - "[[Massachusetts Institute of Technology]]"
  - "[[MIT CSAIL]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - GelSight
  - GelSlim
  - compact robot finger
  - optical path
  - calibration
  - durability
  - robotics
---

# GelSlim: A High-Resolution, Compact, Robust, and Calibrated Tactile-sensing Finger

- [x] PDF:: [[papers/pdfs/1803.00628v1.pdf]]
- [x] 双语阅读稿:: [[papers/bilingual/1803.00628v1_中英混读.md]]
- [x] 图片索引:: [[papers/images/1803.00628v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@dong2017improved-gelsight]], [[@wang2021gelsight-wedge]], [[@do2022densetact]], [[@li2025vbts-classification-review]], [[tactile sensing]], [[robotics]]
affiliation:: [[Massachusetts Institute of Technology]], [[MIT CSAIL]]

## 一句话问题

GelSlim 把 GelSight-style high-resolution tactile imaging（高分辨率触觉成像）压缩成适合夹爪的 slim finger（细长手指），同时强调 robust materials（耐用材料）、fabric skin（织物皮肤）和 calibration（标定维护），使传感器能承受真实抓取中的持续磨损。

## 方法

- 光路：用 light guides（导光结构）和 mirror reflections（镜面反射）把照明、相机和触觉面折叠进薄手指。
- 结构：软 gel、织物外皮、刚性机身和指尖形态共同提高耐久性和抓取适配性。
- 标定：第一步做制造后透视校正和非均匀照明校正；第二步用在线维护指标追踪光强、信号强度、分布和 gel condition。
- 评估：在 WSG-50 gripper 和工业机械臂上做超过 3300 次 grasp-and-lift（抓取并提起）实验，周期性用标定目标检查信号质量。

## 证据

- 论文给出三类校准目标：sharp-corner rectangle、ball-bearing array、3D printed dome。
- 3300 次抓取后，原始图像的亮度和信号强度下降明显；背景光照校正和自适应直方图均衡能维持更一致的触觉输出。
- Fig. 3-Fig. 6 把 GelSight 光路、单反射折叠结构和设计变量的 trade-off 讲清楚，是理解 GelSlim / GelSight Wedge / 后续紧凑 VBTS 的硬件基线。

## 局限

- GelSlim 强调紧凑、耐久和一致性，但主要仍是 finger pad 形态，并非大面积覆盖或全方向曲面传感器。
- 论文关注 2D tactile image consistency（触觉图像一致性）和抓取耐久性，完整 3D 几何、力和 slip 的一体化能力在后续 GelSlim 3.0 中才进一步展开。
- 光路和材料设计依然依赖人工结构优化，后续 PBR Design 类工作把这类选择转成可仿真的设计优化问题。

## 我的阅读笔记


## 摘录
