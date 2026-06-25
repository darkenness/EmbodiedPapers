---
tags:
  - paper
status: unread
aliases:
  - Action Priors
  - "Learning Action Priors for Cross-embodiment Robot Manipulation"
year: 2026
title: "Learning Action Priors for Cross-embodiment Robot Manipulation"
doi: "10.48550/arXiv.2606.26095"
url: "https://arxiv.org/abs/2606.26095"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.26095v1"
arxiv_url: "https://arxiv.org/abs/2606.26095"
arxiv_doi: "10.48550/arXiv.2606.26095"
pdf_url: "https://arxiv.org/pdf/2606.26095v1"
published: 2026-06-24
updated: 2026-06-24
pdf: "[[papers/pdfs/2606.26095v1.pdf]]"
bilingual:
image_index: "[[papers/images/2606.26095v1/index.md]]"
authors:
  - "[[Dong Jing]]"
  - "[[Tianqi Zhang]]"
  - "[[Jiaqi Liu]]"
  - "[[Jinman Zhao]]"
  - "[[Zelong Sun]]"
  - "[[Li Erran Li]]"
  - "[[Zhiwu Lu]]"
  - "[[Mingyu Ding]]"
institutions:
  - "[[Renmin University of China]]"
  - "[[University of North Carolina at Chapel Hill]]"
  - "[[University of Toronto]]"
  - "[[Amazon]]"
topics:
  - vision-language-action
  - action prior
  - cross-embodiment
  - flow matching
  - robot manipulation
  - latent distillation
  - history compression
  - LIBERO
  - RoboCasa
  - imitation learning
  - StarVLA
---

# Learning Action Priors for Cross-embodiment Robot Manipulation

- [x] PDF:: [[papers/pdfs/2606.26095v1.pdf]]
- [x] 图片索引:: [[papers/images/2606.26095v1/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[action prior]], [[cross-embodiment]], [[flow matching]], [[latent distillation]], [[LIBERO]], [[RoboCasa]], [[@physicalintelligence2025pi05]], [[@wang2026covla]], [[@xu2026univiewvla]], [[@shi2026flowdpg]], [[@tang2026frs]]
affiliation:: [[Renmin University of China]], [[University of North Carolina at Chapel Hill]], [[University of Toronto]], [[Amazon]]

## 一句话问题

标准 VLA 从 VLM 继承强视觉-语言先验，但 action head 几乎从零学物理运动，跨 embodiment 时还要同时学动作分布与跨模态对齐。本文提出两阶段框架：Stage 1 仅用无条件的跨 embodiment 动作轨迹，通过 flow-matching encoder-decoder 学 motion prior；Stage 2 再接入 VLM，经 decoder 复用、早期 latent distillation 与 history token 压缩，把先验迁入 VLA 训练。

## 方法

- Stage 1 Action Prior：轻量 encoder-decoder（Qwen3-0.6B 初始化）只看 state-action chunk，flow matching 重建动作序列，学跨 embodiment 时序运动结构，不处理视觉/语言。
- Stage 2 VLA 迁移：Qwen3-VL-2B backbone + 复用 Stage 1 decoder 作 action head；encoder 输出作 early-stage latent distillation target，前 $N_{decay}=5000$ 步线性衰减对齐损失；encoder 同时把历史轨迹压成单 token $z_{hist}$ 注入 VLM。
- 统一表示：37D action / 74D state，跨 LIBERO、RoboCasa GR1、真机 Franka 零填充对齐；13 任务混合训练、无 per-env 微调。
- 训练：Stage 1 5k steps（8×H200，约 2h）；Stage 2 50k steps（约 20h）；chunk size 15；与 GR00T、$\pi_{0.5}$、No Action Prior（类 CogACT）同 StarVLA 代码与数据对比。

## 证据

- 13 任务总体成功率：No Action Prior **55.3%** → Action-State Prior **64.9%**（+9.6 pt）→ +History **68.0%**（+12.7 pt）；仿真 9 任务均值 **64.3% → 68.8%**。
- 超越强基线：GR00T **48.6%**，$\pi_{0.5}$ **53.8%**；$\pi_{0.5}$ 仿真尚可但真机 Stack Cups 全失败，本文真机仍保持较高成功率。
- 长尾真机增益最大（每任务仅 50 demos，占训练帧 7.6%）：Grasp Coke **5% → 35%**（+History **50%**）；Stack Cups **25% → 75%**（+History **80%**）；真机均值 **35.0% → 66.3%**。
- 定性：无 prior 时轨迹抖动、犹豫；有 prior 后运动更平滑、收敛更快；history token 缓解关键决策点反复对齐。
- Stage 1 动作数据扩规模可进一步提升下游 VLA，说明 action-only pretrain 具可扩展性。

## 局限

- 基于 StarVLA + Qwen3 族骨干，与 [[@physicalintelligence2025pi05]] 的 MoT action expert 或 [[@xu2026univiewvla]] 自回归 VQ 路线未直接同构对比。
- 真机仅 4 个 Franka 任务、每任务 50 条 demo，长时程双臂/人形覆盖有限。
- 统一 37D/74D padding 依赖手工槽位设计，新 embodiment 接入仍需协议维护。
- 代码与权重尚未随 arXiv 公开（截至入库时）。

## 我的阅读笔记

本文把 VLA 训练拆成「先学动、再学看与做」，与 [[@shi2026flowdpg]] 在 flow matching 动作空间上发力、[[@tang2026frs]] 在推理时 steering 不同，它解决的是 **action head 冷启动** 与跨 embodiment 数据稀缺。History compressor 用 Stage 1 encoder 当廉价记忆接口，思路与 [[@kim2026serf]] 显式状态表征、[[@xu2026univiewvla]] 世界模型补上下文互补——这里不生成观测，只压缩已发生的 state-action 轨迹。

对自己项目：若跨平台 VLA 在真机长尾任务上收敛慢、动作抖动，可优先试 **action-only Stage 1 pretrain + decoder reuse/distillation**，再考虑是否叠加 history token；与 PolicyTrim/FlowDPG 等 post-train 路线正交。

## 摘录