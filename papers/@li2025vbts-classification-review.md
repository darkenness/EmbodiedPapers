---
tags:
  - paper
  - review
status: unread
aliases:
  - VBTS Classification Review
  - "Classification of Vision-Based Tactile Sensors: A Review"
year: 2025
title: "Classification of Vision-Based Tactile Sensors: A Review"
doi: "10.1109/JSEN.2025.3599236"
url: "https://doi.org/10.1109/JSEN.2025.3599236"
venue: "IEEE Sensors Journal"
volume: 25
issue: 19
pages: "35672-35686"
published: 2025-10-01
arxiv: "2509.02478v2"
arxiv_url: "https://arxiv.org/abs/2509.02478"
pdf_url: "https://arxiv.org/pdf/2509.02478"
pdf: "[[papers/pdfs/li2025vbts-classification-review.pdf]]"
bilingual:
images: "papers/images/li2025vbts-classification-review/"
image_index: "[[papers/images/li2025vbts-classification-review/index.md]]"
authors:
  - "[[Haoran Li]]"
  - "[[Yijiong Lin]]"
  - "[[Chenghua Lu]]"
  - "[[Max Yang]]"
  - "[[Efi Psomopoulou]]"
  - "[[Nathan F. Lepora]]"
institutions:
  - "[[Xi'an Jiaotong-Liverpool University]]"
  - "[[University of Bristol]]"
  - "[[Bristol Robotics Laboratory]]"
topics:
  - vision-based tactile sensor
  - tactile sensing
  - optical tactile sensor
  - sensor classification
  - robot touch
  - robotics
  - review
---

# Classification of Vision-Based Tactile Sensors: A Review

- [x] PDF:: [[papers/pdfs/li2025vbts-classification-review.pdf]]
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/li2025vbts-classification-review/index.md]]
- [ ] 阅读状态:: unread

related:: [[@abad2020visuotactile-review]], [[@yuan2017gelsight]], [[@lin2022dtact]], [[@lin20239dtact]], [[tactile sensing]], [[robotics]]
affiliation:: [[Xi'an Jiaotong-Liverpool University]], [[University of Bristol]], [[Bristol Robotics Laboratory]]

## 一句话问题

这篇 review 认为旧的 marker / reflection 等分类方式已经不足以覆盖当代 vision-based tactile sensors，因此按 contact 到 tactile image 的 transduction principle（换能/转导原则）重建了一套分类：Marker-Based Transduction 与 Intensity-Based Transduction 两大类，再细分为 SMB、MMB、RLB、TLB。

## 方法

- 定义：VBTS 通常由 soft-skinned contact module、illumination module 和 camera module 构成，核心是把接触转成 tactile image。
- 两大主线：Marker-Based Transduction 读取 marker displacement / marker density；Intensity-Based Transduction 读取 pixel intensity variation。
- 四个基础类型：Simple Marker-Based、Morphological Marker-Based、Reflective Layer-Based、Transparent Layer-Based。
- 组合机制：用 SMB+RLB、MMB+TLB、SMB+TLB、RLB+TLB 等方式解释新型复合传感器。
- 对照维度：硬件结构、输入数据、常用处理方法、优势、限制和设计需求。

## 证据

- Fig. 1 把 ChromaTouch、GelForce、TacTip、GelSight、DIGIT、GelSlim、DTact、9DTact、ViTac 等代表性传感器放入统一分类图。
- Table I 汇总四类基础机制及组合机制的硬件特征。
- Table II 对比 sensing principle、input data、data processing methods、requirements、advantages 和 disadvantages。
- 对你现有库里的 DTact / 9DTact：两者都可放在 RLB 路线中理解，因为它们主要利用接触引起的 intensity variation 来推断形状或力。

## 局限

- 这套分类强依赖硬件和图像形成机制，对 foundation model / multimodal representation 这类算法层进展只是外围讨论。
- 对各传感器的定量性能没有统一 benchmark，更多是 taxonomy 和工程比较。
- 组合型机制会越来越多，分类表本身后续可能还要随着新材料、新成像方式和跨模态传感更新。

## 我的阅读笔记


## 摘录
