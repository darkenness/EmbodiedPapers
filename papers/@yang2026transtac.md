---
tags:
  - paper
status: unread
aliases:
  - TransTac
  - "TransTac: Visuo-Tactile Modality Transition via Ultraviolet-Encoded Transparent Elastomers"
year: 2026
title: "TransTac: Visuo-Tactile Modality Transition via Ultraviolet-Encoded Transparent Elastomers"
doi: "10.48550/arXiv.2606.04477"
url: "https://arxiv.org/abs/2606.04477"
venue: "2026 IEEE International Conference on Robotics and Automation (ICRA)"
venue_short: "ICRA 2026"
arxiv: "2606.04477v1"
arxiv_url: "https://arxiv.org/abs/2606.04477"
arxiv_doi: "10.48550/arXiv.2606.04477"
pdf_url: "https://arxiv.org/pdf/2606.04477v1"
code: "https://github.com/87361/TransTac"
pdf: "[[papers/pdfs/2606.04477v1.pdf]]"
reading:
images: "papers/images/2606.04477v1/"
image_index: "[[papers/images/2606.04477v1/index.md]]"
authors:
  - "[[Lingyue Yang]]"
  - "[[Bin Fang]]"
institutions:
  - "[[Beijing University of Posts and Telecommunications]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - visuo-tactile sensing
  - transparent tactile sensor
  - ultraviolet markers
  - stereo marker matching
  - RGB-D fusion
  - near-contact perception
  - robotic manipulation
---

# TransTac: Visuo-Tactile Modality Transition via Ultraviolet-Encoded Transparent Elastomers

- [x] PDF:: [[papers/pdfs/2606.04477v1.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2606.04477v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@lin20239dtact]], [[@azulay2024allsight]], [[@do2022densetact]], [[@li2025vbts-classification-review]], [[tactile sensing]], [[robotics]]
affiliation:: [[Beijing University of Posts and Telecommunications]]

## 一句话问题

传统 coated VBTS（带不透明涂层的视觉触觉传感器）能重建接触形变，但挡住外部视觉；RGB-D 相机能看全局几何，却在近距离和即将接触的区域失效。TransTac 用透明硅胶、UV-reflective markers（紫外反光标记）、双目相机和 prior-guided Delaunay stereo matching（先验引导的 Delaunay 双目匹配）把视觉观察和触觉重建放进同一个紧凑传感器。

## 方法

- 硬件：两枚 USB 相机、透明 Solaris 硅胶膜、手工嵌入的不规则 UV 荧光标记、365 nm UV light strip（紫外灯带）、white LED strip（白光灯带）和黑色 3D 打印外壳。
- 成像：RGB illumination（白光/RGB 观察）保留外部视觉语义，UV illumination（紫外照明）突出半透明标记，用 time-multiplexed illumination（分时照明）分离两类信号。
- 检测：用轻量 anchor-free marker detector（无锚点标记检测器）定位密集半透明标记，再用 ByteTrack 做跨帧身份保持。
- 匹配：先用 epipolar nearest-neighbor（极线最近邻）得到初始对应，再用左右视图的 Delaunay triangulation（Delaunay 三角剖分）寻找结构一致的 anchor seeds，并沿相邻三角传播对应关系。
- 融合：近接触时用三角化 marker depth（标记深度）作为稀疏几何约束，把 FoundationStereo 的 dense depth map（稠密深度图）经 RANSAC 和 Umeyama alignment（Umeyama 对齐）校正到 metric scale（公制度量尺度）。

## 证据

- 语义可识别性：ChatGPT-VLM 在 TransTac tactile images 上达到 83.3%，对比 GelSight 30.2%、9DTact 12.5%；Qwen-VLM、YOLO-World、YOLO-E 也明显更高。
- 表征对齐：DINOv2 center similarity 从不透明 tactile baseline 的 0.202-0.236 提升到 0.774，nearest-neighbor top-1 达到 100.0%。
- 近距离深度：Intel RealSense D405 在约 9 cm 以下深度有效比例快速下降，最终低于 10%；TransTac 的 sparse-dense alignment mean error 约 2.44 mm。
- 匹配鲁棒性：Prior-Guided Delaunay 平均正确匹配 90.8 个 marker，优于 Hungarian Assignment 74.9 和 Epipolar Nearest Neighbor 74.5；dense optical flow / SGBM 分别只有 37.9 和 28.7。
- 运行与成本：marker detection 在 RTX 4060 laptop GPU 上约 20 FPS；原型硬件成本约 70 美元。

## 局限

- 目前主要解决 geometric sensing（几何感知）和 contact-surface reconstruction（接触表面重建），尚未直接输出 force / pressure distributions（力或压力分布）。
- 密集 marker detector 需要人工标注训练数据，数据集构建仍费时。
- 近接触 depth fusion 依赖 FoundationStereo 等模型，而这些模型在极近距离/操作场景训练不足，可能造成 scale inaccuracy（尺度误差）。
- 现有原型使用现成双目相机和灯带，离 fingertip-scale gripper integration（指尖级夹爪集成）还有硬件压缩空间。
- UV fluorescent markers（紫外荧光标记）当前依赖手工或半自动制作，长期耐久性和批量制造一致性还没有系统验证。

## 我的阅读笔记

这篇可以作为“透明视觉触觉融合”线索的核心入口：它不是沿 GelSight/DTact 的不透明接触界面继续优化深度精度，而是把问题重新定义为 modality transition（模态过渡）问题，即从 pre-contact RGB-D / stereo vision 到 physical contact tactile reconstruction 之间如何不断档。

## 摘录
