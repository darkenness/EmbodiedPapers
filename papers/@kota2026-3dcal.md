---
tags:
  - paper
status: unread
aliases:
  - 3D Cal
  - py3DCal
  - "3D Cal: An Open-Source Software Library for Calibrating Tactile Sensors"
  - "3D Cal: An Open-Source Software Library for Depth Reconstruction on Vision-Based Tactile Sensors"
year: 2026
preprint_year: 2025
title: "3D Cal: An Open-Source Software Library for Calibrating Tactile Sensors"
published_title: "3D Cal: An Open-Source Software Library for Depth Reconstruction on Vision-Based Tactile Sensors"
doi: "10.1109/LRA.2026.3673994"
url: "https://doi.org/10.1109/LRA.2026.3673994"
venue: "IEEE Robotics and Automation Letters"
venue_short: "RA-L"
ieee: "https://ieeexplore.ieee.org/document/11433757"
arxiv: "2511.03078v2"
arxiv_url: "https://arxiv.org/abs/2511.03078"
arxiv_doi: "10.48550/arXiv.2511.03078"
pdf_url: "https://arxiv.org/pdf/2511.03078"
project: "https://rohankotanu.github.io/3DCal/"
code: "https://github.com/rohankotanu/py3DCal"
dataset: "https://zenodo.org/records/18462608"
dataset_doi: "10.5281/zenodo.18462608"
pypi: "https://pypi.org/project/py3dcal/"
pdf: "[[papers/pdfs/kota2026-3dcal.pdf]]"
bilingual:
images: "papers/images/kota2026-3dcal/"
image_index: "[[papers/images/kota2026-3dcal/index.md]]"
authors:
  - "[[Rohan Kota]]"
  - "[[Kaival Shah]]"
  - "[[J. Edward Colgate]]"
  - "[[Gregory Reardon]]"
institutions:
  - "[[Northwestern University]]"
  - "[[Center for Robotics and Biosystems]]"
topics:
  - tactile sensing
  - tactile sensor calibration
  - vision-based tactile sensor
  - depth reconstruction
  - open-source software
  - robot manipulation
---

# 3D Cal: An Open-Source Software Library for Calibrating Tactile Sensors

- [x] PDF:: [[papers/pdfs/kota2026-3dcal.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/kota2026-3dcal/index.md]]
- [ ] 阅读状态:: unread

related:: [[@li2025vbts-classification-review]], [[@yuan2017gelsight]], [[@lin20239dtact]], [[tactile sensing]], [[robotics]]
affiliation:: [[Northwestern University]], [[Center for Robotics and Biosystems]]

## 一句话问题

3D Cal 把低成本 FDM 3D printer（熔融沉积 3D 打印机）改造成自动 probing device（探针设备），用来为 DIGIT、GelSight Mini 等 tactile sensors 采集带坐标标签的校准数据，并训练 TouchNet 把视觉触觉图像转换成 depth maps。

## 方法

- 硬件流程：先 3D 打印 sensor base 固定传感器位置，再把 spherical probe tip 装到打印头上，用 G-code 控制打印机按 CSV 坐标自动按压。
- 软件流程：3D Cal 提供 printer / sensor abstraction，支持 Ender 3、DIGIT、GelSight Mini 和 OpenCV-compatible vision-based tactile sensors。
- 模型：TouchNet 使用 3-channel RGB tactile image 加 2-channel x,y coordinate embedding 作为 5-channel 输入，输出 x/y surface gradients，再用 Fast Poisson Solver 积分成 depth map。
- 实验：在 DIGIT 和 GelSight Mini 上沿 0.5 mm x 0.5 mm grid 采集数据；分别得到 1,221 和 1,209 个 probe locations，每个位置采 30 张图。
- 消融：比较 P = 80%、40%、20%、10%、5%、1% 空间采样比例，研究多少校准点足够。

## 证据

- Fig. 1 给出从打印底座、插入传感器、安装 probe、自动采集，到训练 TouchNet 和生成 depth map 的完整流程。
- Fig. 2 / Fig. 3 显示 P = 1% 明显不足；P = 5% 对单个测试物体视觉上可用，但空间误差稳定性继续受采样密度影响。
- 作者建议至少 probing 20% 的总坐标，约 240 个 0.5 mm x 0.5 mm grid 上的随机空间位置。
- 未见物体测试包括 hemispheres、pill、pawn；整体误差在 DIGIT 上约 16.274-52.211 um，在 GelSight Mini 上约 22.413-48.821 um。
- Type 1 error 在两种传感器上均低于 20 um，说明模型很擅长识别无接触区域；Type 2 error 较大，尤其 pawn 的阴影/颈部几何更难。

## 局限

- 当前模型训练和推理主要面向 vision-based tactile sensing 的 depth map generation，不是通用 tactile calibration。
- 实验对象是 DIGIT 和 GelSight Mini，且测试物体只有 3 个 3D 打印形状。
- 使用 spherical probe 采集数据，对 pawn 这类带阴影或复杂几何的泛化仍有误差。
- 未来方向包括 force sensors、shear / normal force calibration，以及 capacitance / resistance 等非视觉触觉传感器。

## 我的阅读笔记


## 摘录
