---
tags:
  - paper
status: unread
aliases:
  - Non-photorealistic camera
  - Non-photorealistic Camera
  - "Non-Photorealistic Camera: Depth Edge Detection and Stylized Rendering Using Multi-Flash Imaging"
year: 2004
title: "Non-Photorealistic Camera: Depth Edge Detection and Stylized Rendering Using Multi-Flash Imaging"
doi: "10.1145/1015706.1015779"
url: "https://www.merl.com/publications/TR2004-050"
venue: "ACM Transactions on Graphics"
venue_short: "SIGGRAPH 2004 / TOG"
volume: 23
issue: 3
pages: "679-688"
technical_report: "MERL TR2004-050"
pdf_url: "https://www.merl.com/publications/docs/TR2004-050.pdf"
pdf: "[[papers/pdfs/raskar2004non-photorealistic-camera.pdf]]"
reading:
images: "papers/images/raskar2004non-photorealistic-camera/"
image_index: "[[papers/images/raskar2004non-photorealistic-camera/index.md]]"
authors:
  - "[[Ramesh Raskar]]"
  - "[[Kar-Han Tan]]"
  - "[[Rogerio Feris]]"
  - "[[Jingyi Yu]]"
  - "[[Matthew Turk]]"
institutions:
  - "[[Mitsubishi Electric Research Laboratories]]"
  - "[[University of California, Santa Barbara]]"
  - "[[Massachusetts Institute of Technology]]"
  - "[[MIT CSAIL]]"
topics:
  - computational photography
  - multi-flash imaging
  - non-photorealistic rendering
  - depth edge detection
  - stylized rendering
  - image-based rendering
  - computer vision
---

# Non-Photorealistic Camera: Depth Edge Detection and Stylized Rendering Using Multi-Flash Imaging

- [x] PDF:: [[papers/pdfs/raskar2004non-photorealistic-camera.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/raskar2004non-photorealistic-camera/index.md]]
- [ ] 阅读状态:: unread

related:: [[@redkin2024dynamic-illumination]], [[@yuan2017gelsight]], [[computational photography]], [[vision-based tactile sensor]]
affiliation:: [[Mitsubishi Electric Research Laboratories]], [[University of California, Santa Barbara]], [[Massachusetts Institute of Technology]], [[MIT CSAIL]]

## 一句话问题

这篇论文问的是：如果给普通相机加一圈位置已知的 flashes（闪光灯），能不能不重建完整 3D model（几何模型），只利用投影阴影直接检测真实场景中的 depth edges（深度边缘），再生成更容易理解形状的 NPR / stylized rendering（非真实感渲染）图像。

## 方法

- 硬件：在相机光心附近布置多个 flash，依次拍摄同一场景；每个 flash 都会在 depth discontinuity（深度不连续）旁边投下窄 shadow sliver（阴影条）。
- 检测：先减去 ambient image，再取所有闪光图的 maximum composite `Imax`，用 `R_k = I_k / Imax` 得到 ratio image（比值图）；沿每个 flash 的 epipolar ray（极线）寻找负跳变，标记为 depth edge。
- 分类：material edges（材质/纹理边缘）在不同闪光下保持在 `Imax` 中，通常不会变成 ratio image 中的局部阴影负跳变，因此可通过排除法与 depth edges 区分。
- 修正：用多 baseline flash 处理 detached shadow（阴影脱离），用 gradient median + Poisson reconstruction 抑制 specularity（高光）造成的假边缘。
- 合成：把 signed depth edges（带前景/背景符号的深度边缘）用于线稿、边缘粗细、toon rendering、texture de-emphasis（纹理弱化）和动态场景变化检测。

## 证据

- 图 1 展示 car engine 和 flower plant 的照片与 stylized result 对照：低对比、复杂几何和纹理背景中，形状边界变得更清楚。
- 图 3-4 给出核心几何和检测流程：深度边缘投影阴影沿 epipolar ray 出现，ratio image 中的负跳变定位边缘。
- 图 8、图 17 对比说明普通 Canny / intensity edge 对材质纹理和低对比区域不稳，而 multi-flash depth edge 更接近形状边界。
- 结果覆盖机械件、植物、骨骼、房间尺度场景、内窥镜和动态手部视频，说明方法不是单一示例。
- 实现代价：论文原型每张图捕获约 2 秒，C++ 检测约 5 秒，2D Poisson 渲染约 3 分钟；这是 2004 年原型，不是实时系统。

## 局限

- 依赖 flash contribution（闪光贡献）和 opaque object shadows（不透明物体阴影）；强室外光、远距离、透明/半透明/发光/镜面物体都不适合。
- 如果背景缺失、背景反照率太低、物体太薄、阴影脱离或深度边缘本身处在阴影中，检测会失败或产生假边缘。
- 动态场景版本依赖运动单调、相邻帧位移较小、深度边缘和纹理边缘不交叉等假设。
- 输出本质上是为 stylized depiction 服务的形状线索，不等价于完整深度图或物理精确 3D reconstruction。

## 我的阅读笔记

