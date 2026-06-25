---
tags:
  - paper
status: unread
aliases:
  - R-Tac0
  - "R-Tac0: A Rounded High-Frequency Transferable Monochrome Vision-based Tactile Sensor for Shape Reconstruction"
year: 2025
title: "R-Tac0: A Rounded High-Frequency Transferable Monochrome Vision-based Tactile Sensor for Shape Reconstruction"
doi: "10.1109/IROS60139.2025.11246144"
url: "https://eng.bigai.ai/paper/r-tac-a-rounded-high-frequency-transferable-monochrome-vision-based-tactile-sensor-for-shape-reconstruction/"
venue: "2025 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)"
venue_short: "IROS 2025"
pages: "10400-10407"
published_url: "https://doi.org/10.1109/IROS60139.2025.11246144"
code: "https://github.com/bigai-ai/PP-Tac"
pdf_url: "https://www.bigai.ai/wp-content/uploads/2025/09/%E4%BC%9A%E8%AE%AE%E5%85%A8%E6%96%87-%E6%9D%8E%E7%9A%96%E6%9E%97.pdf"
pdf: "[[papers/pdfs/li2025r-tac0.pdf]]"
reading:
images: "papers/images/li2025r-tac0/"
image_index: "[[papers/images/li2025r-tac0/index.md]]"
authors:
  - "[[Wanlin Li]]"
  - "[[Pei Lin]]"
  - "[[Meng Wang]]"
  - "[[Chenxi Xiao]]"
  - "[[Kaspar Althoefer]]"
  - "[[Yao Su]]"
  - "[[Ziyuan Jiao]]"
  - "[[Hangxin Liu]]"
institutions:
  - "[[Beijing Institute for General Artificial Intelligence]]"
  - "[[State Key Laboratory of General Artificial Intelligence]]"
  - "[[ShanghaiTech University]]"
  - "[[Queen Mary University of London]]"
  - "[[Centre for Advanced Robotics at Queen Mary]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - rounded tactile sensor
  - monochrome tactile sensing
  - darkness mapping
  - shape reconstruction
  - transfer learning
  - slip detection
  - robotics
---

# R-Tac0: A Rounded High-Frequency Transferable Monochrome Vision-based Tactile Sensor for Shape Reconstruction

- [x] PDF:: [[papers/pdfs/li2025r-tac0.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/li2025r-tac0/index.md]]
- [ ] 阅读状态:: unread

related:: [[@lin2022dtact]], [[@do2022densetact]], [[@do2023densetact-2]], [[@wang2021gelsight-wedge]], [[@yuan2017gelsight]], [[tactile sensing]], [[robotics]]
affiliation:: [[Beijing Institute for General Artificial Intelligence]], [[State Key Laboratory of General Artificial Intelligence]], [[ShanghaiTech University]], [[Queen Mary University of London]], [[Centre for Advanced Robotics at Queen Mary]]

## 一句话问题

圆弧形 vision-based tactile sensor（视觉触觉传感器）更适合机械手指尖接触，但现有 RGB 多通道方案通常只有 30-60 Hz，且换一个新传感器就要重新标定；R-Tac0 用单通道黑白相机、白光照明和复合圆弧弹性体，把曲面触觉重建推到 120 Hz，并尝试让深度模型跨传感器迁移。

## 方法

- 硬件：圆弧形 contact module（接触模块）、白光 LED ring（环形照明）、单通道 monochrome camera（黑白相机）和 3D 打印外壳。
- 材料：内部填充胶、刚性透明壳、透明 PDMS 层、半透明 Ecoflex 层、黑色吸收涂层，形成 compound rounded elastomer（复合圆弧弹性体）。
- 成像原理：沿用 darkness mapping（暗度映射）思路，但把 RGB 多通道输入简化为 monochrome single-channel image（单通道灰度图）。
- 标定：用相机内参、畸变、外参把已知 3D 曲面投到图像，再用 3D 打印半圆顶凸起图案构造训练样本。
- 重建：输入 differential image（差分图像），用两层 CNN 加两层 MLP 预测每个像素的 differential depth（差分深度），再叠加参考曲面深度得到完整曲面。

## 证据

- R-Tac0 尺寸约 30 mm x 30 mm x 43 mm，重量约 35 g，成本约 60 美元。
- 传感频率 120 Hz，高于论文对比表中多数曲面 VBTS 的 30-60 Hz。
- 已训练传感器上的 mean L1 depth error 为 0.169 mm，75.78% 的误差样本小于 0.1 mm。
- 换到未见过的新传感器时 mean L1 error 为 0.328 mm；用 100 个样本 fine-tuning 后降到 0.271 mm。
- 高速滑移实验中，120 fps 下的平均滑移位移为 3.1 ± 1.2 cm，明显小于 30 fps 下的 8.2 ± 3.2 cm。
- 曲面传感器在 -40 度到 40 度接触角下都能工作；平面传感器在 ±40 度时因接触面积不足无法重复测量。

## 局限

- 形状重建主要依赖 3D 打印标定件和特定接触样式，真实复杂物体、大力接触和长期磨损后的稳定性还需要继续验证。
- transferability（跨传感器迁移）已经展示趋势，但新传感器误差仍明显高于原训练传感器。
- 动态位姿跟踪主要是展示 ICP 配合重建曲面的可行性，定量 pose error 没有展开。
- force perception（力感知）和 onboard computation（板载部署）留作未来工作。

## 我的阅读笔记


## 摘录
