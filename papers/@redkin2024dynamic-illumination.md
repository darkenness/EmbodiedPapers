---
tags:
  - paper
status: unread
aliases:
  - dynamic illumination tactile sensors
  - "Enhance Vision-based Tactile Sensors via Dynamic Illumination and Image Fusion"
year: 2024
preprint_year: 2025
title: "Enhance Vision-based Tactile Sensors via Dynamic Illumination and Image Fusion"
doi: "10.48550/arXiv.2504.00017"
url: "https://arxiv.org/abs/2504.00017"
venue: "2nd Workshop on Touch Processing: From Data to Knowledge, NeurIPS 2024"
venue_short: "NeurIPS WTP 2024"
openreview: "https://openreview.net/forum?id=m22SWtocGx"
neurips: "https://neurips.cc/virtual/2024/105200"
dblp: "https://dblp.org/rec/journals/corr/abs-2504-00017"
arxiv: "2504.00017v1"
arxiv_url: "https://arxiv.org/abs/2504.00017"
arxiv_doi: "10.48550/arXiv.2504.00017"
pdf_url: "https://arxiv.org/pdf/2504.00017"
pdf: "[[papers/pdfs/redkin2024dynamic-illumination.pdf]]"
reading:
images: "papers/images/redkin2024dynamic-illumination/"
image_index: "[[papers/images/redkin2024dynamic-illumination/index.md]]"
authors:
  - "[[Artemii Redkin]]"
  - "[[Zdravko Dugonjic]]"
  - "[[Mike Lambeta]]"
  - "[[Roberto Calandra]]"
institutions:
  - "[[Technische Universität Dresden]]"
  - "[[LASR Lab]]"
  - "[[Meta AI]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - dynamic illumination
  - image fusion
  - DIGIT
  - touch processing
---

# Enhance Vision-based Tactile Sensors via Dynamic Illumination and Image Fusion

- [x] PDF:: [[papers/pdfs/redkin2024dynamic-illumination.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/redkin2024dynamic-illumination/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@kota2026-3dcal]], [[@li2025vbts-classification-review]], [[tactile sensing]], [[vision-based tactile sensor]]
affiliation:: [[Technische Universität Dresden]], [[LASR Lab]], [[Meta AI]]

## 一句话问题

这篇论文问的是：现有 vision-based tactile sensors（视觉触觉传感器）大多在固定的 static illumination（静态照明）下成像，能不能只通过动态改变 RGB LEDs 的照明模式并融合多帧图像，提高 tactile image 的 contrast、sharpness 和 background difference？

## 方法

- 传感器：使用标准 DIGIT vision-based tactile sensor，RGB 三个 LED 的强度可设置为 0-15，默认静态照明为 `(15,15,15)`。
- 采集方式：对同一接触状态拍摄多个 illumination patterns 下的 tactile images，再把这些图像融合成单个高质量 measurement。
- 融合方法：比较 Channelwise Sum、Brovey Fusion、Laplacian Pyramid 和 Discrete Wavelet Transform / Wavelet Fusion。
- 评价指标：使用 gradient-based sharpness、root mean squared contrast 和 difference with background 三个图像质量指标。
- 实验对象：包括 coin、plastic yarn、yarn ball、white material、yellow brush、grid、wooden sticks cut、Lego 等；coin 两面在后续分析中作为不同对象处理。

## 证据

- Fig. 4 显示把标准 `(15,15,15)` 图像与不同照明图像融合后，contrast / sharpness 可显著变化；文中报告 `(0,10,3)` 对 contrast 和 sharpness 提升最明显。
- Fig. 5 / Fig. 6 显示多种融合方法都能改善部分指标；Laplacian Pyramid 更偏向提升 background difference / contrast，Channelwise Sum 提升 background difference / sharpness，Wavelet 和 Brovey 能更同时地提升多指标。
- 作者最终认为 Wavelet / DWT Image Fusion 在多物体平均上整体最有效，尤其是 `(15,15,15)` 与 `(0,15,0)` 的组合表现突出。
- Fig. 7 显示 sharpness 通常由 2-4 张融合图达到最佳，contrast 在能找到最优照明时往往单张图已足够，继续增加图像可能反而变差。
- Fig. 8 显示动态照明需要考虑时间成本：小于 0.1 s 的帧间等待不稳定；约 0.3 s 后 contrast 进入平台期，3 个 illumination settings 时约 1.1 FPS。

## 局限

- 实验主要验证图像质量指标，而不是直接验证下游任务，如 force estimation、texture recognition、slip detection 或 manipulation success rate。
- 实验硬件集中在 DIGIT，作者把结论推广到可动态控制照明的 VBTS，但还需要在 Digit360、GelSight 类复杂照明硬件上验证。
- 动态照明通过多帧采集换质量，带来延迟；对高速闭环控制不一定可直接使用。
- 最优 illumination pattern 可能依赖对象和材料，作者在结论中也提出未来应把 problem formulation 扩展成 object dependent。

## 我的阅读笔记


## 摘录

