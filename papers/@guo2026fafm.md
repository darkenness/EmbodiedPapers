---
tags:
  - paper
status: unread
aliases:
  - FAFM
  - Frequency-Aware Flow Matching
  - "Frequency-Aware Flow Matching for Continuous and Consistent Robotic Action Generation"
year: 2026
title: "Frequency-Aware Flow Matching for Continuous and Consistent Robotic Action Generation"
doi: "10.48550/arXiv.2606.20135"
url: "https://arxiv.org/abs/2606.20135"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.20135v1"
arxiv_url: "https://arxiv.org/abs/2606.20135"
arxiv_doi: "10.48550/arXiv.2606.20135"
pdf_url: "https://arxiv.org/pdf/2606.20135v1"
openalex: "https://openalex.org/W7165355953"
code: "https://anonymous.4open.science/r/FAFM"
published: 2026-06-18
updated: 2026-06-18
pdf: "[[papers/pdfs/2606.20135v1.pdf]]"
reading:
image_index: "[[papers/images/2606.20135v1/index.md]]"
authors:
  - "[[Jianing Guo]]"
  - "[[Fangzheng Chen]]"
  - "[[Zihao Mao]]"
  - "[[Wong Lik Hang Kenny]]"
  - "[[Zhenhong Wu]]"
  - "[[Yu Li]]"
  - "[[Yishuai Cai]]"
  - "[[Yuanpei Chen]]"
  - "[[Yikun Ban]]"
  - "[[Kai Chen]]"
  - "[[Qi Dou]]"
  - "[[Yaodong Yang]]"
  - "[[Xianglong Liu]]"
  - "[[Huijie Zhao]]"
  - "[[Simin Li]]"
institutions:
  - "[[Beihang University]]"
  - "[[Peking University]]"
  - "[[The Chinese University of Hong Kong]]"
  - "[[PKU-Psibot Lab]]"
  - "[[Zhongguancun Laboratory]]"
  - "[[Hefei Comprehensive National Science Center]]"
topics:
  - flow matching
  - vision-language-action
  - continuous action generation
  - discrete cosine transform
  - action chunking
  - heterogeneous control frequency
  - temporal consistency
  - Sobolev regularization
  - diffusion policy
  - LIBERO
  - robotic manipulation
---

# Frequency-Aware Flow Matching for Continuous and Consistent Robotic Action Generation

- [x] PDF:: [[papers/pdfs/2606.20135v1.pdf]]
- [x] 代码:: [FAFM (anonymous)](https://anonymous.4open.science/r/FAFM)
- [x] 图片索引:: [[papers/images/2606.20135v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[flow matching]], [[vision-language-action]], [[action chunking]], [[LIBERO]], [[Open X-Embodiment]], [[@physicalintelligence2024pi0]], [[@tang2026frs]], [[@physicalintelligence2025pi05]], [[@niu2026trex]]
affiliation:: [[Beihang University]], [[Peking University]], [[The Chinese University of Hong Kong]], [[PKU-Psibot Lab]]

## 一句话问题

Flow-matching / diffusion 策略普遍输出离散 action chunk，在混合控制频率数据上会发生 identifiability failure（同一物理轨迹因采样频率不同变成不同监督），推理时相邻时刻动作还可能方向冲突导致 jitter；FAFM 用 DCT 频域 flow matching + 一阶时间导数正则，在不增加网络参数的前提下生成连续、时序一致的动作，并可接到独立 FM 策略与 VLA。

## 方法

- 异构频率处理：把离散动作序列经 discrete cosine transform（DCT）变到频域，对 DCT 系数做 flow matching，再用 cosine basis expansion 重建连续动作轨迹。
- 时序一致性：对动作一阶时间导数加正则，相当于 Sobolev-type constraint，抑制高频误差并惩罚突变。
- 插件式设计：不新增网络参数；可替换 standalone flow-matching policy 或 VLA 的 action head 训练目标。
- 问题动机：OXE 等数据控制频率从 3 Hz 到 50 Hz 不等，但策略常被要求固定频率输出 chunk，训练时频率信息被丢弃；推理时逐步独立采样会造成 high-frequency jitter，对软体/液体/手术等任务风险更大。

## 证据

- 仿真：synthetic toy benchmark、obstacle avoidance、LapGym、LIBERO 上提升成功率、多模态表达能力、运动平滑性、收敛速度，以及对 mechanical bias 和 mixed-frequency 输入的鲁棒性。
- 真实：Franka 机器人部署增益与仿真一致；obstacle avoidance 等表中 FAFM 成功率高于 FM / FreqPolicy 等基线（论文报告 ours 61% vs FM 48% 等设置）。
- 方法强调对 **heterogeneous demonstration frequencies** 和 **inter-timestep consistency** 同时有效，而不只追求平均 task success。

## 局限

- 代码当前为 anonymous 链接，公开仓库与 VLA 集成细节需后续跟踪。
- 频域建模假设可通过 DCT + 平滑正则近似连续控制，对强接触不连续、碰撞式离散事件的表达力未充分讨论。
- 与 [[@tang2026frs]] 等推理时 steering 正交：FAFM 改训练/动作表示，不解决 test-time 语义引导。
- 在刚性桌面任务上 jitter 对成功率影响可能有限，论文也承认 rigid-body 场景收益不如软体任务显著。
- 是否直接并入 $\pi_0$ / $\pi_{0.5}$ 官方实现、对 50 Hz 灵巧任务的延迟影响，还需工程验证。

## 我的阅读笔记

FAFM 抓住的是 flow VLA 家族（[[@physicalintelligence2024pi0]]、[[@tang2026frs]]）里一个常被默认接受、但其实有物理含义的设定：**动作本质连续，却用离散 chunk 监督**。把动作变到 DCT 系数空间做 flow matching，相当于让模型学“轨迹形状”而不是“固定采样栅格上的点”，这对 OXE 混合频率数据尤其合理。

对自己项目的价值在于：如果数据采集频率不稳定（UMI、不同机器人、不同控制栈），不必强行重采样到单一 Hz；可以在损失层面统一。Sobolev 导数正则则给软体/触觉任务（如 [[@niu2026trex]] 的高频精炼）提供更稳定的低层动作输出。

后续可追问：FAFM 与 Co-VLA / FRS 能否叠加——一个改 action 连续性，一个改双臂结构或 noise steering。

## 摘录