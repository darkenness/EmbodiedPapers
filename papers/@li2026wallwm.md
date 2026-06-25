---
tags:
  - paper
status: unread
aliases:
  - WALL-WM
  - Wall-WM
  - "WALL-WM: Carving World Action Modeling at the Event Joints"
year: 2026
title: "WALL-WM: Carving World Action Modeling at the Event Joints"
doi: "10.48550/arXiv.2606.01955"
url: "https://arxiv.org/abs/2606.01955"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.01955v1"
arxiv_url: "https://arxiv.org/abs/2606.01955"
arxiv_doi: "10.48550/arXiv.2606.01955"
pdf_url: "https://arxiv.org/pdf/2606.01955v1"
code: "https://github.com/X-Square-Robot/wall-x"
published: 2026-06-01
updated: 2026-06-01
pdf: "[[papers/pdfs/2606.01955v1.pdf]]"
reading:
images: "papers/images/2606.01955v1/"
image_index: "[[papers/images/2606.01955v1/index.md]]"
authors:
  - "[[Shalfun Li]]"
  - "[[Victor Yao]]"
  - "[[Charles Yang]]"
  - "[[Truth Qu]]"
  - "[[Regis Cheng]]"
  - "[[Ryan Yu]]"
  - "[[Howard Lu]]"
  - "[[Newton Von]]"
  - "[[Vincent Chen]]"
  - "[[Yohann Tang]]"
  - "[[Maeve Zhang]]"
  - "[[Ellie Ma]]"
  - "[[Gody Li]]"
  - "[[Sage Yang]]"
  - "[[Lorien Shu]]"
  - "[[J.W. Gao]]"
  - "[[Ethan Chen]]"
  - "[[Colin Ye]]"
  - "[[Yu Sun]]"
  - "[[Elise Mon]]"
  - "[[PS Zhang]]"
  - "[[Neo Li]]"
  - "[[Lily Li]]"
  - "[[James Wang]]"
  - "[[Ping Yang]]"
  - "[[Chris Pan]]"
  - "[[Lucy Liang]]"
  - "[[Hang Su]]"
  - "[[Roy Gan]]"
  - "[[Hao Wang]]"
  - "[[Qian Wang]]"
institutions:
  - "[[X Square Robot]]"
topics:
  - world action model
  - event-grounded pretraining
  - vision-language-action
  - video-action alignment
  - semantic events
  - variable-length action chunks
  - staircase decoding
  - world model
  - large-scale robot learning
  - Muon optimizer
  - real-world generalization
---

# WALL-WM: Carving World Action Modeling at the Event Joints

- [x] PDF:: [[papers/pdfs/2606.01955v1.pdf]]
- [x] 代码:: [wall-x](https://github.com/X-Square-Robot/wall-x)
- [x] 图片索引:: [[papers/images/2606.01955v1/index.md]]
- [ ] 精读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[world action model]], [[vision-language-action]], [[event-grounded learning]], [[@yang2026memorywam]], [[@chen2026mvwam]], [[@xu2026univiewvla]], [[@physicalintelligence2024pi0]], [[@tencent2026hy-embodied-05]], [[@kim2026serf]]
affiliation:: [[X Square Robot]]

## 一句话问题

固定长度 action chunk 把语言（事件/目标）、视觉（连续场景动力学）与控制（毫秒级接触）硬塞进同一预测窗，造成粒度错配，VLA/WAM 训练退化成短视距相关拟合。WALL-WM 以 **action-grounded semantic event** 为原子学习单元，做 event-grounded WAM 预训练 + 事件级数据生态，同一骨干支持 event 模式（可变长执行段）与 unified 模式（Staircase Decoding 引导的等长 chunk），在大规模真机泛化评测达 SOTA。

## 方法

- 核心单元：语义连贯的可执行事件（reach / grasp / lift / move / place 等），由行为变化而非外部时钟切分；event caption + 对齐 video/action 段联合监督。
- Event-grounded WAM 预训练：在事件对齐区间上对 future video 与 action 做 denoise，保留 caption-to-video 先验同时学到可执行因果。
- 双推理模式：**Event mode**——VLM/人/agent 给出 next-event 描述，执行可变长 video-action 段；**Unified mode**——保留固定 chunk 部署，用 VLM Staircase Decoding 产生事件结构 latent 推理再条件化下一局部 chunk。
- 数据与规模：event-level captions、cluster-balanced sampling、大规模多样化行为/场景；Muon optimizer 预训练基础设施。
- 设计原则：geometry preservation（不压扁模态流形）、prior preservation（兼容视频基础模型）、executable causality（清晰时间支撑、时长随任务变）。

## 证据

- 视频生成（WorldArena / 具身相关维度）：相对 Wan2.1/Wan2.2，Motion Quality、Semantic Consistency、Physical Plausibility 更高；CO3Dv2 3D awareness（point/depth error、AUC）优于或接近 Wan2.1-14B 等基线。
- 真机：大规模 real-world generalization evaluation 报 SOTA（reasoning、dexterity、多样任务）；报告含 real_bench 推理/灵巧/泛化等定性定量结果。
- 主张：event 对齐训练缓解固定 chunk 的 temporal confusion，更好利用 web-scale caption-video 与具身数据的语义结构。

## 局限

- 技术报告体例（X Square Robot Team），非标准 peer-review 会议论文；评测协议与 baseline 以内部 real bench + WorldArena 为主，与 LIBERO/CALVIN 等公开榜横向对比有限。
- Event 标注与 cluster-balanced 数据管线成本高，开源程度依赖 wall-x 仓库完整度。
- 与 [[@yang2026memorywam]]（记忆）、[[@chen2026mvwam]]（流形对齐）解决不同瓶颈，联合架构未展开。
- Unified / Event 两模式部署与延迟、VLM rollouts 工程复杂度需个案验证。

## 我的阅读笔记

WALL-WM 把 WAM 争论从「怎么接 action head」推进到「**学习原子单位是什么**」：固定 chunk 是部署便利，不是语言-视频-动作共享的自然对象。与 [[@chen2026mvwam]] 的模态流形异构、[[@xu2026univiewvla]] 的生成多视角补遮挡不同，这里强调 **事件边界** 对齐 caption-video-action，并保留两条推理路径兼顾研究与部署。

对自己项目：若长时程任务里 chunk 经常切在半途中，可回看 event caption 是否比拉长 H 更根本；Staircase Decoding 给全局指令 + 历史窗口的 chunk 模式也适合现有 $\pi_0$ 类接口做渐进改造。

## 摘录