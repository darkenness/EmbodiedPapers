---
tags:
  - paper
status: unread
aliases:
  - HY-Embodied-0.5
  - HY-Embodied-0.5 VLA
  - Hy-Embodied-0.5-VLA
  - "HY-Embodied-0.5: Embodied Foundation Models for Real-World Agents"
year: 2026
title: "HY-Embodied-0.5: Embodied Foundation Models for Real-World Agents"
doi: "10.48550/arXiv.2604.07430"
url: "https://arxiv.org/abs/2604.07430"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2604.07430v1"
arxiv_url: "https://arxiv.org/abs/2604.07430"
arxiv_doi: "10.48550/arXiv.2604.07430"
pdf_url: "https://arxiv.org/pdf/2604.07430v1"
code: "https://github.com/Tencent-Hunyuan/HY-Embodied"
model: "https://huggingface.co/tencent/HY-Embodied-0.5"
pdf: "[[papers/pdfs/2604.07430v1.pdf]]"
bilingual:
images: "papers/images/2604.07430v1/"
image_index: "[[papers/images/2604.07430v1/index.md]]"
authors:
  - "[[Tencent Robotics X]]"
  - "[[HY Vision Team]]"
  - "[[Xumin Yu]]"
  - "[[Zuyan Liu]]"
  - "[[Ziyi Wang]]"
  - "[[He Zhang]]"
  - "[[Yongming Rao]]"
  - "[[Fangfu Liu]]"
  - "[[Yani Zhang]]"
  - "[[Ruowen Zhao]]"
  - "[[Oran Wang]]"
  - "[[Yves Liang]]"
  - "[[Haitao Lin]]"
  - "[[Minghui Wang]]"
  - "[[Yubo Dong]]"
  - "[[Kevin Cheng]]"
  - "[[Bolin Ni]]"
  - "[[Rui Huang]]"
  - "[[Han Hu]]"
  - "[[Zhengyou Zhang]]"
  - "[[Linus]]"
  - "[[Shunyu Yao]]"
institutions:
  - "[[Tencent Robotics X]]"
  - "[[HY Vision Team]]"
topics:
  - embodied foundation models
  - vision-language-action
  - vision-language models
  - embodied reasoning
  - spatial reasoning
  - mixture-of-transformers
  - visual latent tokens
  - reinforcement learning
  - on-policy distillation
  - real-world robot control
  - UMI
---

# HY-Embodied-0.5: Embodied Foundation Models for Real-World Agents

- [x] PDF:: [[papers/pdfs/2604.07430v1.pdf]]
- [x] 代码:: [Tencent-Hunyuan/HY-Embodied](https://github.com/Tencent-Hunyuan/HY-Embodied)
- [x] 模型:: [tencent/HY-Embodied-0.5](https://huggingface.co/tencent/HY-Embodied-0.5)
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/2604.07430v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[embodied foundation models]], [[spatial reasoning]], [[robot control]], [[@tang2026frs]], [[@kim2026serf]], [[@processbench2026roboprocessbench]]
affiliation:: [[Tencent Robotics X]], [[HY Vision Team]]

## 一句话问题

通用 VLM 有开放世界知识，但缺少机器人所需的 fine-grained visual perception、spatial-temporal perception 和 embodied reasoning；HY-Embodied-0.5 把 MoT 架构、visual latent tokens、超过 100M 具身/空间/感知样本、多阶段 SFT/RL/RFT 和 large-to-small on-policy distillation 组合起来，做成可作为 VLA “brain”的具身基础模型。

## 方法

- 模型族：HY-Embodied-0.5-MoT-2B 是 4B total / 2B activated 的边缘部署模型；HY-Embodied-0.5-MoE-A32B 是 407B total / 32B activated 的复杂推理模型。
- 架构：HY-ViT 2.0 400M 原生分辨率视觉编码器；Mixture-of-Transformers 为 vision tokens 和 text tokens 分配不同 QKV/FFN 与 attention mask；visual latent tokens 用 global feature supervision 连接视觉和语言。
- 预训练：超过 600B tokens，其中 389B general understanding，236B embodied/perception；视觉数据包括 62M Omni-Detection、36M depth estimation、5M segmentation、11M pointing/counting。
- 具身/空间中训练：约 30M instances，按 general:embodied:spatial = 12:5:3 混合，统一 prompt 与坐标格式。
- 后训练：约 100k cold-start CoT SFT；每轮 RL 用当前模型筛出 50K frontier samples；GRPO 训练配合任务结构化 reward；RL 和 RFT 交替 self-evolve；最后用 on-policy distillation 把 A32B 的推理行为转给 MoT-2B。
- VLA 机器人控制：基于 HY-Embodied-0.5-MoT-2B 扩展 Action Expert，参照 $\pi_0/\pi_{0.5}$，先用 5K 小时 UMI 数据训练，再用每任务 300-700 条真实机器人 demonstrations 做 SFT。

## 证据

- MoT-2B 在 22 个 embodied-relevant benchmarks 中 16 个第一、4 个第二，平均 58.0%，高于 Qwen3-VL-4B 的 47.8% 和 RoboBrain 2.5-4B 的 49.4%。
- MoT-2B 在空间任务上优势明显，例如 MindCube 66.3 vs Qwen3-VL-4B 31.0，MMSI-Bench 33.2 vs 25.1，VSIBench 60.5 vs 55.2。
- MoE-A32B 在同一 22 个 benchmarks 上平均 67.0，超过 Gemini 3.0 Pro 63.6、Seed 2.0 66.2、Qwen 3.5 A17B 66.1 和 Kimi K2.5 61.1。
- 通用视觉任务中，MoT-2B 仍与同规模通用 VLM 相近：DocVQA 92.9、OCRBench 76.5、TextVQA 72.3，没有完全牺牲 general visual understanding。
- 真实双臂机器人实验中，HY-Embodied-0.5 VLA 在 Precision Plug-in Packing、Tableware Stacking、Mug Hanging 上分别达到 85%、80%、75% 成功率；Mug Hanging 相比 $\pi_0$ 45% 和 $\pi_{0.5}$ 50% 提升最大。

## 局限

- VLA 实验只覆盖三项真实任务，每项 20 trials；机器人控制证据更像初步 transfer validation，不是大规模 VLA benchmark。
- 训练数据、筛选流程、in-house VLM teacher 和部分真实机器人数据没有完整公开，复现难度高。
- 基准集中在 perception、spatial reasoning、embodied QA/planning，和闭环控制成功率之间仍有 gap。
- 论文强调 CoT/deep thinking，但很多具身任务的真实物理交互未必需要长文本推理；推理 trace 质量和行动质量之间的因果关系还需要更多消融。
- MoT-2B 虽然 activated params 小，但总参数 4B、模型权重约 7.6GB，对低端边缘硬件仍不算轻。

## 我的阅读笔记

这篇适合作为“VLA 之前的具身 VLM brain”入口：它并不直接提出一个像 SERF 那样的状态记忆模块，也不像 FRS 那样提出 policy steering 方法，而是从 foundation model 层面补齐 VLA 需要的空间感知、轨迹理解、affordance、规划和推理能力。

对后续 VLA 阅读最有用的线索是第 6 节：作者把 HY-Embodied-0.5-MoT-2B 接上 Action Expert 后，先用 UMI 做跨 embodiment 预训练，再用少量真实任务 demonstrations SFT。这说明它的定位不是替代 $\pi_0/\pi_{0.5}$，而是把具身 VLM 作为更强视觉-语言-空间 backbone，服务于 downstream action expert。

后续回看时重点看三处：MoT 如何避免 heavy visual training 伤害语言能力；RL/RFT/OPD 如何把大模型推理能力压到 2B activated 模型；真实机器人结果是否足以支撑“VLM foundation -> VLA control”这条链。

## 摘录

