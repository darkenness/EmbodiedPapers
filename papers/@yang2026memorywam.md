---
tags:
  - paper
status: unread
aliases:
  - MemoryWAM
  - Memory WAM
  - "MemoryWAM: Efficient World Action Modeling with Persistent Memory"
year: 2026
title: "MemoryWAM: Efficient World Action Modeling with Persistent Memory"
doi: "10.48550/arXiv.2606.20562"
url: "https://arxiv.org/abs/2606.20562"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.20562v1"
arxiv_url: "https://arxiv.org/abs/2606.20562"
arxiv_doi: "10.48550/arXiv.2606.20562"
pdf_url: "https://arxiv.org/pdf/2606.20562v1"
openalex: "https://openalex.org/W7165399810"
project: "https://yangsizhe.github.io/MemoryWAM/"
published: 2026-06-18
updated: 2026-06-18
pdf: "[[papers/pdfs/2606.20562v1.pdf]]"
bilingual:
image_index: "[[papers/images/2606.20562v1/index.md]]"
authors:
  - "[[Sizhe Yang]]"
  - "[[Juncheng Mu]]"
  - "[[Tianming Wei]]"
  - "[[Chenhao Lu]]"
  - "[[Xiaofan Li]]"
  - "[[Linning Xu]]"
  - "[[Zhengrong Xue]]"
  - "[[Zhecheng Yuan]]"
  - "[[Dahua Lin]]"
  - "[[Jiangmiao Pang]]"
  - "[[Huazhe Xu]]"
institutions:
  - "[[The Chinese University of Hong Kong]]"
  - "[[Tsinghua University]]"
  - "[[Zhejiang University]]"
topics:
  - world action model
  - persistent memory
  - hybrid memory
  - gist tokens
  - anchor frames
  - non-Markovian manipulation
  - long-horizon manipulation
  - video DiT
  - action DiT
  - mixture-of-transformers
  - RMBench
  - vision-language-action
  - memory-dependent robotics
---

# MemoryWAM: Efficient World Action Modeling with Persistent Memory

- [x] PDF:: [[papers/pdfs/2606.20562v1.pdf]]
- [x] 项目页:: [MemoryWAM](https://yangsizhe.github.io/MemoryWAM/)
- [x] 图片索引:: [[papers/images/2606.20562v1/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[world action model]], [[persistent memory]], [[long-horizon manipulation]], [[RMBench]], [[@zhang2026contactworld]], [[@kim2026serf]], [[@physicalintelligence2025pi05]], [[@physicalintelligence2024pi0]], [[@niu2026trex]]
affiliation:: [[The Chinese University of Hong Kong]], [[Tsinghua University]], [[Zhejiang University]]

## 一句话问题

WAM 需要历史观测做非马尔可夫决策，但滑动窗口会遗忘、全历史 KV cache 又随轨迹长度线性涨延迟和显存；MemoryWAM 用 recent frames + event-boundary anchor frames + gist tokens 的 hybrid memory 和定制 attention，在训练期借 video DiT 学动力学、推理期不做视频生成，于 RMBench 与真实记忆依赖任务上超过强 VLA/WAM 基线且更高效。

## 方法

- 架构：MoT 式 video DiT $\Phi_v$ + action DiT $\Phi_a$；因果 video VAE 把观测压成 latent $z_t$；训练时用 video prediction 提供动力学监督，推理时只前向一次 video DiT 更新 KV cache，action DiT 去噪动作 chunk。
- Hybrid memory：$\mathcal{C}^v_{\leq t}=\mathcal{C}^v_{\text{short}}\cup\mathcal{C}^v_{\text{anchor}}\cup\mathcal{C}^v_{\text{gist}}$。
  - Short-term：最近 $N_{\text{recent}}$ 帧滑动窗口，保留高保真局部交互线索。
  - Event-boundary：任务起始等 anchor frames 保留完整 visual tokens，应对后续遮挡与窗口外信息。
  - Gist：用少量 gist tokens 压缩长程历史，把复杂度从 $O(N)$ 降到约 $O(N/d)$。
- Attention mask：让 action 与 video tokens 同时检索短期细节与压缩长期上下文；gist 由历史帧经压缩模块生成并随时间更新。
- 对比记忆机制：相对 full attention、RNN、TTT 等，在 Press Button 上 hybrid memory 与 full attention 同为 87% 成功率，但延迟/显存显著更低。

## 证据

- RMBench（9 项双臂记忆依赖任务，每任务 50 demos、100 rollouts）：平均成功率 **83.0%**；LingBot-VA **78.2%**；$\pi_{0.5}$ **10.4%**；FastWAM **5.9%**。相对仅当前/短窗观测方法平均高约 **70** 个百分点。
- 代表性任务：Rearrange/Put Back/Swap Blocks 等到 100%；Press Button 87%；Cover Blocks 98%。
- 真实任务（ARX 双臂 + RealSense D455）：Shell Game 18/20 vs LingBot-VA 13/20 vs $\pi_{0.5}$ 5/20；Look and Press 15/20 vs 14/20 vs 0/20。
- 消融（Cover Blocks / Press Button）：去 gist tokens 平均 40%；去 anchor 74%；去 sliding window 82.5%；full attention 91.5% vs hybrid 92.5%，说明压缩记忆不仅是效率折中。
- LingBot-VA 因高推理延迟在 Shell Game 中错过杯子交换；MemoryWAM 在更低延迟/显存下保持更好实时性。

## 局限

- 继承 video diffusion 模型的语义理解/推理局限；作者建议未来结合 dual-system 或统一模型补强。
- 评测集中在 RMBench 与两个真实记忆任务，对开放世界家庭泛化、触觉/力反馈场景覆盖有限。
- Anchor / gist 设计仍依赖任务起始与事件边界假设，自动边界检测与跨任务迁移未充分展开。
- 与 [[@zhang2026contactworld]] 的触觉世界模型、[[@kim2026serf]] 的显式 spatial map 是不同记忆路线，尚未统一比较。
- 项目页未在摘要中给出公开代码仓库链接，复现需回查项目页更新。

## 我的阅读笔记

MemoryWAM 把 WAM 的核心矛盾说得很清楚：**memory vs efficiency**。LingBot-VA / DreamZero 路线保留全历史有效但太贵；Cosmos Policy / FastWAM 只看短窗又做不了非马尔可夫任务。hybrid memory 借鉴人类记忆的 short-term + gist + event-boundary 分工，比单纯“拉长 context window”或“全 KV cache”更有结构。

对自己最有用的对照是 [[@kim2026serf]]：SERF 用 explicit neural-point map 给 $\pi_{0.5}$ 补空间记忆；MemoryWAM 在 WAM 框架里用 gist/anchor 补时序记忆，且训练期仍靠 video dynamics 监督。两者都指向 **image-only VLA 不够，但 full history attention 也不经济**。

若后续做触觉/接触丰富 WAM，可追问 gist 能否承载 [[@zhang2026contactworld]] 式 TacFF 摘要，或能否与 [[@guo2026fafm]] 的连续动作头拼接以降低长时程控制抖动。

## 摘录