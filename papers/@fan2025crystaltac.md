---
tags:
  - paper
status: unread
aliases:
  - CrystalTac
  - "CrystalTac: Vision-Based Tactile Sensor Family Fabricated via Rapid Monolithic Manufacturing"
  - "CrystalTac: 3D-Printed Vision-Based Tactile Sensor Family through Rapid Monolithic Manufacturing Technique"
year: 2025
title: "CrystalTac: Vision-Based Tactile Sensor Family Fabricated via Rapid Monolithic Manufacturing"
doi: "10.34133/cbsystems.0231"
url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11982672/"
venue: "Cyborg and Bionic Systems"
venue_short: "Cyborg Bionic Syst. 2025"
pages: "Article 0231"
published_url: "https://doi.org/10.34133/cbsystems.0231"
arxiv: "2408.00638v1"
pdf_url: "https://arxiv.org/pdf/2408.00638v1"
pdf: "[[papers/pdfs/2408.00638v1.pdf]]"
bilingual: "[[papers/bilingual/2408.00638v1_中英混读.md]]"
images: "papers/images/2408.00638v1/"
image_index: "[[papers/images/2408.00638v1/index.md]]"
authors:
  - "[[Wen Fan]]"
  - "[[Haoran Li]]"
  - "[[Dandan Zhang]]"
institutions:
  - "[[Imperial College London]]"
  - "[[University of Bristol]]"
  - "[[Bristol Robotics Laboratory]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - CrystalTac
  - monolithic manufacturing
  - multimaterial 3D printing
  - sensor fabrication
  - design flexibility
  - robotics
---

# CrystalTac: Vision-Based Tactile Sensor Family Fabricated via Rapid Monolithic Manufacturing

- [x] PDF:: [[papers/pdfs/2408.00638v1.pdf]]
- [x] 双语阅读稿:: [[papers/bilingual/2408.00638v1_中英混读.md]]
- [x] 图片索引:: [[papers/images/2408.00638v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@li2025vbts-classification-review]], [[@donlon2018gelslim]], [[@azulay2024allsight]], [[@wang2024large-scale-vbts]], [[tactile sensing]], [[robotics]]
affiliation:: [[Imperial College London]], [[University of Bristol]], [[Bristol Robotics Laboratory]]

## 一句话问题

CrystalTac 关注 VBTS 的 fabrication consistency（制造一致性）和 design-to-creation gap（从设计到制造的鸿沟）：用 rapid monolithic manufacturing（快速一体化制造）一次性打印不同机制的视觉触觉传感器族，而不是把 base、lens、elastomer、marker、coating 等零件分开加工和组装。

## 方法

- 分类：把 VBTS 机制总结为 IMM、MDM、MFM 以及多机制融合。
- 制造：用多材料 3D printing 把 skin、marker、elastomer、lens、base 等结构尽量放进一个制造流程。
- 传感器族：提出 C-Tac、C-Sight、C-SighTac、Vi-C-Tac、Vi-C-Sight 五个分支，对应不同感知机制。
- 实验：用 C-Tac 做 object recognition，用 Vi-C-Tac 做 object + texture hybrid recognition，用 Vi-C-Sight 做 see-through-skin exploration，并评估制造成本和自定义灵活性。

## 证据

- Vi-C-Tac 在 1800 张训练图像设置下，对 object recognition 达到 100% (182/182)，texture recognition 达到 99.45% (181/182)。
- Table 2 给出不同 CrystalTac 传感器的尺寸、材料消耗、打印时间和成本；例如单个 C-Tac 为 74 min / 4.678 GBP。
- 批量打印时，C-Tac 在 48 个批量容量下平均时间和成本降至 9.08 min / 2.43 GBP，较单件分别下降 87.73% 和 48.05%。

## 局限

- 作者明确把 CrystalTac 视为 family/template（传感器族/模板），不是每个分支的最终最优设计。
- 对 GelSight 类需要反射涂层的 IMM 传感器，当前多材料打印材料库还不能直接打印金属粉末或可控反射涂层。
- 性能实验主要验证可制造性和机制有效性，不是和最强 VBTS 做统一任务 benchmark。

## 我的阅读笔记


## 摘录
