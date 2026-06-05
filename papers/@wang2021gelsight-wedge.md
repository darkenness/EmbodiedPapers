---
tags:
  - paper
status: unread
aliases:
  - GelSight Wedge
  - "GelSight Wedge: Measuring High-Resolution 3D Contact Geometry with a Compact Robot Finger"
year: 2021
title: "GelSight Wedge: Measuring High-Resolution 3D Contact Geometry with a Compact Robot Finger"
doi: "10.1109/ICRA48506.2021.9560783"
url: "https://arxiv.org/abs/2106.08851"
venue: "2021 IEEE International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2021"
pages: "6468-6475"
published_url: "https://doi.org/10.1109/ICRA48506.2021.9560783"
arxiv: "2106.08851v1"
project: "https://gelsight.csail.mit.edu/wedge/"
pdf: "[[papers/pdfs/2106.08851v1.pdf]]"
bilingual: "[[papers/bilingual/2106.08851v1_中英混读.md]]"
images: "papers/images/2106.08851v1/"
image_index: "[[papers/images/2106.08851v1/index.md]]"
authors:
  - "[[Shaoxiong Wang]]"
  - "[[Yu She]]"
  - "[[Branden Romero]]"
  - "[[Edward H. Adelson]]"
institutions:
  - "[[MIT CSAIL]]"
  - "[[Massachusetts Institute of Technology]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - GelSight
  - photometric stereo
  - 3D contact geometry
  - compact robot finger
  - pose tracking
  - robotics
---

# GelSight Wedge: Measuring High-Resolution 3D Contact Geometry with a Compact Robot Finger

- [x] PDF:: [[papers/pdfs/2106.08851v1.pdf]]
- [x] 双语阅读稿:: [[papers/bilingual/2106.08851v1_中英混读.md]]
- [x] 图片索引:: [[papers/images/2106.08851v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@lin2022dtact]], [[@lin20239dtact]], [[@do2022densetact]], [[tactile sensing]], [[robotics]]
affiliation:: [[MIT CSAIL]], [[Massachusetts Institute of Technology]]

## 一句话问题

传统 GelSight 能高分辨率恢复 3D contact geometry（3D 接触几何），但硬件太厚、太大，不适合作为 robot finger（机器人手指）；GelSight Wedge 试图在楔形紧凑结构里保留 photometric stereo（光度立体）所需的定向彩色光照与高分辨率 3D 重建能力。

## 方法

- 硬件：楔形结构、Raspberry Pi mini camera、120° FOV、三侧 lensless LED arrays、mirror、clear acrylic、gray filters、diffusers、curved elastomer。
- 光学设计：牺牲 tip light（指尖方向的光）以获得薄手指形态，通过灰滤和扩散片提高颜色对比和照明均匀性。
- 3D 重建：先把 raw imprint unwarp 成矩形，再做 background subtraction 得到 difference image；用 MLP 从 RGBXY 映射到 surface gradients $G_x,G_y$，再用 fast Poisson solver 积分得到 depth。
- 少灯配置：对于 1 light 或 2 opposing lights 的缺失梯度问题，用 synthesized depth images 训练 U-Net 估计 missing gradients，再接 Poisson solver。
- 应用演示：缩小到 human finger size，并用重建点云结合 ICP 做 cube pose tracking。

## 证据

- 相机约 16 美元，640 x 480 下 60 FPS，320 x 240 下 90 FPS。
- 3-light 标定只用 32 张训练图像和 8 张测试图像；相比 GelSlim raw-image learning 需要上千标定图，数据需求更低。
- Table I 显示 RGB 3-light 的梯度误差最低；RG 2 perpendicular lights 接近 RGB；RB / R 配置需要 U-Net 估计缺失轴梯度才能明显改善。
- Marker 插值中 nearest interpolation 在 200 x 150 分辨率约 10 ms，可用于实时反馈；linear / cubic 约 60 / 70 ms。
- ICP pose tracking 约 10 Hz，展示重建点云可以进入 3D pose tracking 管线。

## 局限

- 定量评估主要围绕 calibration ball 的 gradient error 和定性重建；复杂物体的真实 3D 误差和 pose error 没有完整报告。
- 少灯配置依赖合成数据训练 U-Net 估计缺失梯度，1-light 配置仍会有 small bumps 等 artifacts。
- Marker、gel deformation 和 shadow 会干扰 3D 重建；sharp surfaces 和 force-dependent deformation 需要感知端进一步处理。
- 论文展示了 finger-size 版本和 ICP potential，但还不是完整的 manipulation benchmark。

## 我的阅读笔记


## 摘录
