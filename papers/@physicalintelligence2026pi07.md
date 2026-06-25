---
tags:
  - paper
status: unread
aliases:
  - pi0.7
  - π0.7
  - "π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities"
year: 2026
title: "π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities"
doi: "10.48550/arXiv.2604.15483"
url: "https://arxiv.org/abs/2604.15483"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2604.15483v2"
arxiv_url: "https://arxiv.org/abs/2604.15483"
arxiv_doi: "10.48550/arXiv.2604.15483"
pdf_url: "https://arxiv.org/pdf/2604.15483v2"
openalex: "https://openalex.org/W7155019052"
project: "https://www.pi.website/blog/pi07"
code: "https://github.com/Physical-Intelligence/openpi"
published: 2026-04-16
updated: 2026-04-24
pdf: "[[papers/pdfs/2604.15483v2.pdf]]"
bilingual:
image_index: "[[papers/images/2604.15483v2/index.md]]"
authors:
  - "[[Physical Intelligence]]"
  - "[[Kevin Black]]"
  - "[[Chelsea Finn]]"
  - "[[Sergey Levine]]"
  - "[[Karl Pertsch]]"
  - "[[Brian Ichter]]"
  - "[[Danny Driess]]"
  - "[[Allen Z. Ren]]"
  - "[[Lucy Xiaoyang Shi]]"
  - "[[Jost Tobias Springenberg]]"
  - "[[Bo Ai]]"
  - "[[James Darpinian]]"
  - "[[Karan Dhabalia]]"
  - "[[Michael Equi]]"
  - "[[Adnan Esmail]]"
institutions:
  - "[[Physical Intelligence]]"
topics:
  - vision-language-action
  - robot foundation model
  - compositional generalization
  - diverse context conditioning
  - visual subgoals
  - episode metadata
  - cross-embodiment transfer
  - steerable policy
  - autonomous data
  - specialist distillation
  - language coaching
  - in-the-wild robotics
---

# π0.7: a Steerable Generalist Robotic Foundation Model with Emergent Capabilities

- [x] PDF:: [[papers/pdfs/2604.15483v2.pdf]]
- [x] 项目页:: [π0.7](https://www.pi.website/blog/pi07)
- [x] 代码:: [Physical-Intelligence/openpi](https://github.com/Physical-Intelligence/openpi)
- [x] 图片索引:: [[papers/images/2604.15483v2/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[vision-language-action]], [[compositional generalization]], [[cross-embodiment transfer]], [[visual subgoals]], [[@physicalintelligence2024pi0]], [[@physicalintelligence2025pi05]], [[@tang2026frs]], [[@kim2026serf]], [[@wang2026covla]], [[@tencent2026hy-embodied-05]]
affiliation:: [[Physical Intelligence]]

## 一句话问题

先前 VLA 往往要靠 per-task fine-tuning 才能做好灵巧任务，也难像 LLM 那样重组技能；$\pi_{0.7}$ 用 diverse context conditioning（多样上下文条件化）把语言、episode metadata、control modality labels、visual subgoal images 一起放进 prompt，从而吞进演示、次优自主数据、人类视频和 web 数据，并在未见任务/新机器人/新场景上展现 compositional generalization（组合式泛化）。

## 方法

- Steerable prompt 设计：不仅告诉模型做什么，还告诉它怎么做——包括任务/子任务语言、质量与速度 metadata、joint vs end-effector 控制模态标签、subgoal images。
- 数据统一：demonstrations、autonomous episodes（含失败）、RL specialist 生成数据、egocentric human videos、multimodal web data 可在同一框架下被选择性吸收，而不是被低质量样本平均掉。
- 训练时多模态 prompt 作为 context conditioning；推理时可只给标准语言，也可附加 desired metadata，或用 lightweight world model 生成 subgoal images。
- 高层接口：可与 high-level policy / language coaching 配合；语言分步指导后可蒸馏成自主子任务生成器。
- 与 $\pi_{0.5}$ 的差异：更强调“策略/质量/子目标”条件化，从而能吃下更脏、更杂、跨 embodiment 的数据并 out-of-the-box 执行。

## 证据

- 未见环境中可跟随多样语言指令完成多阶段厨房家电操作；zero-shot cross-embodiment：未见 UR5e 双臂叠衣数据，仍可在 UR5e 上叠衣，成功率接近专家 teleoperator 首次迁移到该平台的水平。
- 对 air fryer 等新任务，语言 coaching 可显著提升表现；再把 coaching 蒸馏到 high-level policy 后可完全自主执行。
- 与 Recap RL specialist（$\pi^{*}_{0.6}$）相比，单一 $\pi_{0.7}$ 在 laundry、espresso、box building 等任务上达到相同或更高成功率与 throughput，说明 specialist 经验可被 distillation 进 generalist。
- 在 speed、dexterity、language following、compositional task generalization 多条轴上做多机器人平台评测。

## 局限

- compositional generalization 仍属“早期迹象”，复杂新任务（如首次使用 air fryer）常需语言 coaching 或后续 high-level policy fine-tuning。
- diverse conditioning 依赖额外标注与推理时 world model 生成 subgoal，系统工程复杂度高于 $\pi_0$ / $\pi_{0.5}$。
- 数据规模与来源极度集中，外部团队难复现同等覆盖；论文未给出与公开 VLA 在标准 benchmark 上的全面对照表。
- LAC/双臂结构类改动（如 [[@wang2026covla]] 的 SAE）不在 $\pi_{0.7}$ 主线内，紧耦合 bimanual 任务未必是强项。
- 作者列表极长，机构信息以 Physical Intelligence 团队合作为主，细节需回查正文与 blog。

## 我的阅读笔记

$\pi_{0.7}$ 把 PI 系列从“更强泛化”推进到“可 steer 的 generalist”：关键不是再堆一个更大的 action head，而是让 prompt 能表达策略维度（快慢、好坏、子目标、控制模态），这样失败轨迹和 specialist 轨迹才不会把模型训钝。

与 [[@physicalintelligence2025pi05]] 的关系：$\pi_{0.5}$ 解决 open-world home generalization 的数据广度；$\pi_{0.7}$ 进一步解决 heterogeneous data 的“模式平均”问题，并追求 out-of-the-box specialist-level dexterity。与 [[@tang2026frs]] 的关系：FRS 在推理时 steer 已有 flow VLA；$\pi_{0.7}$ 在训练时就把 steer 信息写进 conditioning。

若自己做 VLA data mixture，最值得借鉴的是 metadata conditioning：把“这是一条失败/慢速/低质量轨迹”显式告诉模型，比单纯过滤脏数据更能保留数据规模。

## 摘录