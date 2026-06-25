---
tags:
  - paper
status: unread
aliases:
  - PARCEL
  - Elastic Queries
  - Conditioned Elastic Queries
  - Pool-Anchored Resampling with Conditioned Elastic Queries
  - "PARCEL: Pool-Anchored Resampling with Conditioned Elastic Queries for Efficient Vision-Language Understanding"
year: 2026
title: "PARCEL: Pool-Anchored Resampling with Conditioned Elastic Queries for Efficient Vision-Language Understanding"
doi: "10.48550/arXiv.2605.30126"
url: "https://arxiv.org/abs/2605.30126"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2605.30126v1"
arxiv_url: "https://arxiv.org/abs/2605.30126"
arxiv_doi: "10.48550/arXiv.2605.30126"
pdf_url: "https://arxiv.org/pdf/2605.30126v1"
project: "https://parcel-elastic-inference.github.io/"
pdf: "[[papers/pdfs/2605.30126v1.pdf]]"
bilingual:
images: "papers/images/2605.30126v1/"
image_index: "[[papers/images/2605.30126v1/index.md]]"
authors:
  - "[[Selim Kuzucu]]"
  - "[[Alessio Tonioni]]"
  - "[[Vasile Lup]]"
  - "[[Bernt Schiele]]"
  - "[[Federico Tombari]]"
  - "[[Muhammad Ferjad Naeem]]"
institutions:
  - "[[Google]]"
  - "[[Max Planck Institute for Informatics]]"
  - "[[Technical University of Munich]]"
topics:
  - large vision-language models
  - visual token compression
  - elastic inference
  - efficient multimodal models
  - visual tokenization
  - spatial grounding
  - matryoshka models
  - query resampling
  - pool-conditioned query resampling
  - spectral aliasing
---

# PARCEL: Pool-Anchored Resampling with Conditioned Elastic Queries for Efficient Vision-Language Understanding

- [x] PDF:: [[papers/pdfs/2605.30126v1.pdf]]
- [x] 项目页:: [PARCEL project page](https://parcel-elastic-inference.github.io/)
- [ ] 代码:: 未发现公开代码仓库
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/2605.30126v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[large vision-language models]], [[visual token compression]], [[elastic inference]], [[efficient multimodal models]], [[matryoshka models]], [[spatial grounding]], [[@tencent2026hy-embodied-05]]
affiliation:: [[Google]], [[Max Planck Institute for Informatics]], [[Technical University of Munich]]

## 入库对象确认

用户给出的关键词是 `Elastic Queries Reinforcement Learning`；本次检索到的正式相关论文是 PARCEL。它不是 reinforcement learning 论文，而是 large vision-language models（LVLMs）的 elastic visual-token compression / efficient inference 论文。标题中的 `Conditioned Elastic Queries` 指的是视觉 token 压缩中的弹性 query tokens，而不是 RL 查询策略。

## 一句话问题

LVLM 把图像/视频映射成大量 visual tokens，导致 language decoder prefill、self-attention 和 KV-cache 成本随 token 数上升；PARCEL 试图训练一个可以在 16/64/256 等不同 visual-token budgets 下运行的模型，同时避免 M3 式 spatial pooling 丢细节和 MQT 式 query resampling 丢空间 grounding。

## 方法

- 任务设定：elastic visual-token compression，即一次训练后按部署预算选择 visual-token 数量，保留 `train once, deploy anywhere`。
- 问题诊断：M3 / nested pooling 保留显式网格但像不完美低通滤波，激进压缩时产生 spectral aliasing，损伤图表、文档、OCR 等高频细节；MQT / nested query resampling 用非局部 summaries 取代 grid-aligned tokens，空间定位和 RefCOCO grounding 变弱。
- 核心结构：PARCEL 把视觉特征提取分成两路。spatial pool tokens 作为 low-frequency 2D layout anchors；elastic query tokens 先通过 Pool-Conditioned Query Resampling（PCQR）读取这些 anchors，再 cross-attend 到原始 ViT features，补回 pooling 没有覆盖的 complementary high-frequency / semantic features。
- 路由规则：总预算为 $B$。当 $16 \le B < 64$，使用 $4 \times 4$ anchor grid，$N_p=16$，$N_q=B-16$；当 $64 \le B \le 256$，使用 $8 \times 8$ anchor grid，$N_p=64$，$N_q=B-64$。
- 训练与 backbone：基于 PaliGemma-2 3B，SigLIP-SO-400M vision encoder + Gemma-2 2B language decoder；压缩模型额外做 100M-sample intermediary pretraining，connector、vision encoder、language decoder 和 projection 都可训练。

## 证据

- 27 个 vision-centric benchmarks 上，PARCEL 在 256/64/16 visual tokens 下均形成更好的 performance-efficiency Pareto frontier。
- Table 1：image aggregate retention 在 256/64/16 tokens 分别为 95.1%、94.7%、86.8%，均高于 M3 和 MQT；video aggregate retention 为 98.0%、97.9%、95.0%。
- Table 2：RefCOCO suite 中，PARCEL 在 256/64/16 tokens 的 mean retention 为 90.6%、90.8%、80.5%，明显高于 query-only MQT，支持 explicit spatial anchors 对 grounding 的作用。
- ChartQA / DocVQA 等 resolution-sensitive tasks 中，PARCEL 在 64 和 256 tokens 上提升明显；Figure 3 的 spectral diagnostics 显示 pool tokens 更集中于低频，query pathway 保留更高频的特征 footprint。
- Table 3：完整 PARCEL 在 27 benchmark mean retention 上达到 95.6% / 95.3% / 88.3%；只加 self-attention 的 MQT/M3 仍低于 PARCEL，说明提升不是单纯参数量或 connector 深度带来的。
- Figure 1：降低 visual-token budget 能显著减少 image/video prefill FLOPs 和 KV-cache，例如 video KV-cache 从 256 tokens 的 423MB 降到 64 tokens 的 111MB、16 tokens 的 33MB。

## 局限

- 方法继承 PaliGemma-2 backbone 和 web-scale pretraining data 的偏差；论文没有声称消除 demographic、cultural、geographic、linguistic imbalance。
- 预算列表由 practitioner 指定，不是 input-adaptive budget predictor；动态按图像/视频难度分配 token 是未来工作。
- 训练和评估仍需大量算力；压缩主要降低 inference cost，不等于训练低成本。
- 高分辨率 448x448 实验因计算成本只报告 single seed；主结论更稳的是 224x224 三随机种子设置。
- 当前证据集中在 PaliGemma-2 / SigLIP / Gemma-2 组合；更广泛 backbone、任务和真实部署验证仍需后续工作。

## 我的阅读笔记

这篇对 VLA/具身模型的间接价值在于：很多 VLA 和 embodied VLM 都受视觉 token 数量、视频帧数、延迟和 KV-cache 限制。PARCEL 不直接做 robot control，也不做 reinforcement learning，但它给了一个可迁移的视觉接口思路：把稳定空间布局和细节探索拆开，让同一个模型能按设备/延迟预算切换 visual-token 数量。

后续回看重点是三处：第一，看 PCQR 是否能作为 VLA 视觉前端的可插拔 connector；第二，看 explicit 2D anchors 是否能缓解 query-only VLM 在 spatial grounding 上的问题；第三，看 fixed budget list 和未来 adaptive budget predictor 如何接到实时机器人或长视频推理。

## 摘录

