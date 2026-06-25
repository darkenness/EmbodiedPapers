---
tags:
  - paper
status: unread
aliases:
  - T-Rex
  - T-Rex tactile-reactive
  - "T-Rex: Tactile-Reactive Dexterous Manipulation"
year: 2026
title: "T-Rex: Tactile-Reactive Dexterous Manipulation"
doi: "10.48550/arXiv.2606.17055"
url: "https://arxiv.org/abs/2606.17055"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.17055v1"
arxiv_url: "https://arxiv.org/abs/2606.17055"
arxiv_doi: "10.48550/arXiv.2606.17055"
pdf_url: "https://arxiv.org/pdf/2606.17055v1"
openalex: "https://openalex.org/W7164883918"
project: "https://tactile-rex.github.io/"
code: "https://github.com/ZhuoyangLiu2005/T-Rex"
dataset: "https://tactile-rex.github.io/dataset/"
published: 2026-06-15
updated: 2026-06-15
pdf: "[[papers/pdfs/2606.17055v1.pdf]]"
reading:
image_index: "[[papers/images/2606.17055v1/index.md]]"
authors:
  - "[[Dantong Niu]]"
  - "[[Zhuoyang Liu]]"
  - "[[Zekai Wang]]"
  - "[[Boning Shao]]"
  - "[[Zhao-Heng Yin]]"
  - "[[Anirudh Pai]]"
  - "[[Yuvan Sharma]]"
  - "[[Ruijie Zheng]]"
  - "[[Mengda Xu]]"
  - "[[Yuqi Xie]]"
  - "[[Yunfan Jiang]]"
  - "[[Letian Fu]]"
  - "[[Wei Zhan]]"
  - "[[David M. Chan]]"
  - "[[Yutong Bai]]"
  - "[[Ken Goldberg]]"
  - "[[Jitendra Malik]]"
  - "[[Pieter Abbeel]]"
  - "[[Yuke Zhu]]"
  - "[[Danfei Xu]]"
  - "[[Jim (Linxi) Fan]]"
  - "[[Trevor Darrell]]"
  - "[[Fei-Fei Li]]"
institutions:
  - "[[UC Berkeley]]"
  - "[[NVIDIA]]"
  - "[[Stanford University]]"
  - "[[Panasonic]]"
  - "[[La Sapienza University]]"
  - "[[ItalAI]]"
topics:
  - tactile-reactive manipulation
  - vision-language-action
  - dexterous manipulation
  - mixture-of-transformers
  - tactile VQ-VAE
  - contact-rich dataset
  - motor primitives
  - human egocentric pre-training
  - bimanual dexterous manipulation
  - deformable object manipulation
  - force-sensitive manipulation
---

# T-Rex: Tactile-Reactive Dexterous Manipulation

- [x] PDF:: [[papers/pdfs/2606.17055v1.pdf]]
- [x] 项目页:: [T-Rex](https://tactile-rex.github.io/)
- [x] 代码:: [ZhuoyangLiu2005/T-Rex](https://github.com/ZhuoyangLiu2005/T-Rex)
- [x] 数据集:: [T-Rex Dataset](https://tactile-rex.github.io/dataset/)
- [x] 图片索引:: [[papers/images/2606.17055v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[tactile sensing]], [[dexterous manipulation]], [[mixture-of-transformers]], [[@physicalintelligence2025pi05]], [[@zhang2026contactworld]], [[@lin2026physbrain]], [[@yuan2017gelsight]], [[@wang2024large-scale-vbts]]
affiliation:: [[UC Berkeley]], [[NVIDIA]], [[Stanford University]]

## 一句话问题

现有 VLA 多忽视触觉或只用静态触觉编码，难以做插入钥匙、翻页、挤牙膏等需要毫秒级力反馈的 contact-rich dexterity；T-Rex 用 100 小时 motor-primitive 触觉遥操作数据 + variable-rate MoT（约 5 Hz 视觉动作规划 + 约 20 Hz 触觉精炼）和 temporal tactile VQ-VAE，在 12 项真实灵巧任务上比最强基线平均成功率高约 30 个百分点。

## 方法

- 数据：T-Rex Dataset 含 100 h 双臂灵巧平台遥操作、22 种 elementary motor primitives、7700+ 轨迹、200+ 物体与同步触觉信号；另用 22,889 h human egocentric videos 做大规模预训练。
- 训练阶段：human egocentric pre-training → tactile-grounded robot mid-training → 12 个 contact-rich post-training tasks；强调 data-efficient recipe，优先覆盖 close/peel/fold/wrap/wipe/squeeze/insert/extract 等接触技能。
- 架构：Mixture-of-Transformer-Experts backbone，含 Latent Expert、Action Expert、Tactile Expert；低频 slow action denoising 与 future visual latent prediction，高频 fast tactile refinement 并行。
- 触觉编码：Spatial-Temporal Tactile Encoder + temporal tactile VQ-VAE，把高频率触觉序列压成可与 VLA 骨干对接的 token，而不牺牲既有视觉-语言-动作能力。
- 评测：12 项真实触觉反应任务（翻页、传蛋、擦盘、挤牙膏、分杯、麻将分拣、开锁、酸碱中和、抽牌、拧灯泡等），每任务 16 次 rollout。

## 证据

- 12 任务宏平均成功率：T-Rex **65%**；最强对比 EgoScale **35%**；ViTacFormer 3%、RDP 6%、Tactile-VLA 15%、$\pi_{0.5}$ 17%、$\pi_{0.5}$+tactile 6%。
- 相对最强基线 **+30 absolute success-rate points**；多项力敏/可形变任务从个位数成功率提升到 50–96%。
- 论文强调 zero-shot & data-efficient language following，以及 tactile-reactive closed-loop 对 micro-slip、局部形变和力变化的响应。
- 项目页提供 per-task 成功率表、失败案例与数据效率消融可视化。

## 局限

- 平台绑定双臂 dexterous hand + 特定触觉传感器栈，跨硬件迁移仍需验证。
- 100 h 机器人数据相对 human video 预训练仍小，motor-primitive 配方是否覆盖更广工业任务未充分证明。
- $\pi_{0.5}$+tactile 反而很差，说明“把触觉硬塞进现有 VLA”不等于 T-Rex 式 variable-rate MoT 设计。
- 数据集与代码刚发布，复现依赖 NVIDIA/BAIR 完整训练链路与触觉同步基础设施。
- 未与 [[@zhang2026contactworld]] 式 tactile world model 或纯 VBTS 几何重建路线做统一坐标比较。

## 我的阅读笔记

T-Rex 把“触觉进 VLA”从附加模态问题，拆成 **数据配方 + 时序架构** 两个问题：数据侧用 motor primitives 提高每小时接触信息密度；架构侧用快慢两路专家把 20 Hz 触觉精炼和 5 Hz 视觉-动作规划解耦。这和库里 VBTS 论文关注传感器几何/制造不同，重点在 **policy 如何利用高带宽触觉闭环**。

与 [[@physicalintelligence2025pi05]] 的对比很有启发：同一 $\pi_{0.5}$ 骨干在视觉任务很强，但在触觉反应任务上只有 17%，简单加 tactile 通道还会掉到 6%。说明 contact-rich dexterity 需要专门的数据和 temporal encoder，而不是多一个 CNN。

若后续做自己的触觉 VLA，应回看三件事：motor-primitive 数据采集是否比长 horizon 示教更省数据；tactile VQ-VAE 是否比逐帧 RGB-tactile concat 更适合高频信号；快慢 MoT 能否与 flow-matching action head（如 [[@physicalintelligence2024pi0]]）拼接。

## 摘录