---
tags:
  - paper
  - review
status: unread
aliases:
  - Visuotactile Sensors Review
  - "Visuotactile Sensors With Emphasis on GelSight Sensor: A Review"
year: 2020
title: "Visuotactile Sensors With Emphasis on GelSight Sensor: A Review"
doi: "10.1109/JSEN.2020.2979662"
url: "https://doi.org/10.1109/JSEN.2020.2979662"
venue: "IEEE Sensors Journal"
volume: 20
issue: 14
pages: "7628-7638"
published: 2020-07-15
ieee: "https://ieeexplore.ieee.org/document/9028163"
repository: "https://hira.hope.ac.uk/id/eprint/3041/"
pdf_url: "https://hira.hope.ac.uk/id/eprint/3041/1/Final_GelSightReview.pdf"
pdf: "[[papers/pdfs/abad2020visuotactile-review.pdf]]"
reading:
images: "papers/images/abad2020visuotactile-review/"
image_index: "[[papers/images/abad2020visuotactile-review/index.md]]"
authors:
  - "[[Alexander C. Abad]]"
  - "[[Anuradha Ranasinghe]]"
institutions:
  - "[[Liverpool Hope University]]"
  - "[[De La Salle University]]"
topics:
  - visuotactile sensing
  - tactile sensing
  - GelSight
  - haptics
  - robotics
  - computer vision
  - review
---

# Visuotactile Sensors With Emphasis on GelSight Sensor: A Review

- [x] PDF:: [[papers/pdfs/abad2020visuotactile-review.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/abad2020visuotactile-review/index.md]]
- [ ] 阅读状态:: unread

related:: [[@yuan2017gelsight]], [[@lin2022dtact]], [[@lin20239dtact]], [[tactile sensing]], [[haptics]], [[robotics]]
affiliation:: [[Liverpool Hope University]], [[De La Salle University]]

## 一句话问题

这篇综述把 visuotactile sensors（视觉-触觉传感器）的历史脉络从 pedobarograph（足底压力光学记录仪）梳理到 GelSight，并重点说明 GelSight 的 hardware / software / application 演化。

## 方法

- 历史路线：从 1950s-1960s 的 optical pedobarograph 和 remote manipulator optical touch sensing，梳理到 planar / fingertip optical tactile sensors。
- 技术路线：比较 external structure modification（反射膜、标记点、柔性镜面）和 internal structure modification（内嵌 beads / fluorescent markers / dye markers）。
- GelSight 重点：按 retrographic sensor、support plate、lighting、camera、image processing software、markers 等组件整理。
- 未来方向：强调 unified sensor（统一视觉/触觉传感器）、switchable UV markers、temperature / vibration / force 等多模态扩展。

## 证据

- 论文覆盖 Fig.1-Fig.21 的硬件演化图，从 pedobarograph 到 GelSight / GelSlim / UV-marker GelSight。
- 对 GelSight 的四个基本组件有明确归纳：clear elastomeric slab with reflective coating、transparent plate support、controlled lighting、camera。
- 对 marker 的取舍给出清晰讨论：永久 marker 有利于 force / shear / slip，但会干扰 microgeometry、2D texture features 和 height map。

## 局限

- 综述写作偏发展史与硬件脉络，缺少系统表格化 benchmark。
- 对算法部分主要列举 photometric stereo、LBP、SVM、BRISK/RANSAC、LK optical flow、CNN/RNN，没有深入比较指标和数据集。
- 文中作者对 GelSight “ideal visuotactile sensor” 的判断较强，读时需要和后续 DTact / 9DTact / DIGIT / GelSlim 等新版本对照。

## 我的阅读笔记

