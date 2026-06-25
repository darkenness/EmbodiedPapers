---
tags:
  - paper
status: unread
aliases:
  - EgoGuide
  - EgoGuide-UMI
  - GERP
  - Gated Egocentric Residual Policy
  - "EgoGuide: Egocentric Guidance for Efficient Robot-Free Demonstration Collection and Learning"
year: 2026
title: "EgoGuide: Egocentric Guidance for Efficient Robot-Free Demonstration Collection and Learning"
doi: "10.48550/arXiv.2606.14665"
url: "https://arxiv.org/abs/2606.14665"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.14665v1"
arxiv_url: "https://arxiv.org/abs/2606.14665"
arxiv_doi: "10.48550/arXiv.2606.14665"
pdf_url: "https://arxiv.org/pdf/2606.14665v1"
project: "https://silicx.github.io/EgoGuide/"
published: 2026-06-12
updated: 2026-06-12
pdf: "[[papers/pdfs/2606.14665v1.pdf]]"
reading:
images: "papers/images/2606.14665v1/"
image_index: "[[papers/images/2606.14665v1/index.md]]"
authors:
  - "[[Yue Xu]]"
  - "[[Mingtao Nie]]"
  - "[[Tianle Li]]"
  - "[[Hong Li]]"
  - "[[Yibo Luo]]"
  - "[[Siyuan Huang]]"
  - "[[Yong-Lu Li]]"
institutions:
  - "[[Shanghai Jiao Tong University]]"
  - "[[Shanghai Innovation Institute]]"
  - "[[Beijing Institute for General Artificial Intelligence]]"
topics:
  - robot-free demonstration
  - universal manipulation interface
  - UMI
  - egocentric vision
  - data curation
  - online data coverage guidance
  - gated residual policy
  - robot manipulation
  - imitation learning
  - visual-geometric guidance
---

# EgoGuide: Egocentric Guidance for Efficient Robot-Free Demonstration Collection and Learning

- [x] PDF:: [[papers/pdfs/2606.14665v1.pdf]]
- [x] 项目页:: [EgoGuide](https://silicx.github.io/EgoGuide/)
- [ ] 代码:: 项目页当前显示 Code Coming Later
- [ ] 装配指南:: 项目页当前显示 Assembly Guide Coming Later
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2606.14665v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[Universal Manipulation Interface]], [[robot-free demonstration]], [[egocentric vision]], [[data curation]], [[imitation learning]], [[@lin2026physbrain]], [[@tencent2026hy-embodied-05]], [[@tang2026frs]], [[@kim2026serf]]
affiliation:: [[Shanghai Jiao Tong University]], [[Shanghai Innovation Institute]], [[Beijing Institute for General Artificial Intelligence]]

## 一句话问题

UMI 让人可以用手持 gripper surrogate 收集 robot-free demonstrations，但容易反复录到冗余成功轨迹且缺少全局场景视角；EgoGuide 在采集时同步 wrist / head egocentric observations，并用在线 visual-geometric coverage score 在 AR 中引导采集者去录更有信息量的状态，再用 GERP 把 egocentric context 作为 gated residual cue 改善遮挡和局部视角不足。

## 方法

- EgoGuide-UMI：基于 exUMI 的手持 gripper，集成 wrist fisheye camera、gripper width、Meta Quest head image / head pose、Quest controller wrist pose，并通过 UDP 同步到工作站。
- Online data coverage guidance：采集前用 wrist image、head / egocentric image 和 wrist pose 三类信号计算 0-100 novelty / coverage gain，在 AR passthrough 中提示采集者调整初始手姿、物体布局、视角或工作区配置。
- Static data filtering：采集后过滤缺模态、过短、pose jump、严重 blur 或异常 brightness 的 episode，避免传感器失败进入训练集。
- Partial demonstration：允许从任务中间状态开始录制，把晚期/中间阶段也变成可控初始状态，补充普通完整轨迹中不足的后段覆盖。
- Gated Egocentric Residual Policy (GERP)：先训练 wrist-only base policy，再冻结它；egocentric residual branch 输入 head image 和 wrist pose w.r.t. head frame，预测同一 wrist-relative action space 中的动作候选，并通过 gate $\alpha$ 与 base action 融合。

## 证据

- Pepper Sorting 在 200 demos 下，unguided collection 为 10% / 12.5% SR / TPS，EgoGuide 为 50% / 60.0%；达到约 50% success 只需一半 demonstration。
- Pick Cube 在 300 demos 下，unguided 为 50% / 55.0%，EgoGuide 为 95% / 97.5%；400 demos 下达到 100% / 100.0%。
- Garlic Storage 更难，unguided 到 400 demos 仍为 0% / 16.3%，EgoGuide 到 400 demos 达到 50% / 61.3%。
- GERP 在 Rubik's Cube 300 demos 上从 Wrist Only 的 30% / 37.5% 提升到 80% / 82.5%；在 Pepper Sorting 400 demos 上从 75% / 77.5% 提升到 80% / 87.5%。
- Feature distribution 可视化显示 EgoGuide 覆盖更大特征空间；feature covariance trace 在两个 camera views 和两个 encoders 上提升约 5%、4%、3%、4%。

## 局限

- EgoGuide 有额外采集开销：约 2 秒 feature-memory computation，加约 3 秒场景和 UMI pose 调整；论文正文报告 real-time guidance 平均每 sample 增加 4.3 秒。
- AR headset 会导致志愿者疲劳；作者目前用短 session 和休息缓解，并期待未来用 AR glasses 替代。
- GERP 的 egocentric policy 实验使用固定 egocentric camera 近似 demonstrator view，不等同于真实移动头部控制或主动相机策略。
- 实验是单机器人平台 Flexiv Rizon 4 + Grav gripper，任务数量为四个 tabletop manipulation tasks；泛化到更多机器人、更多长时程和更复杂接触任务仍需验证。
- 项目页当前代码和装配指南未公开，硬件细节和完整复现还需要后续回查。

## 我的阅读笔记

EgoGuide 和 [[@lin2026physbrain]] 都围绕第一视角数据，但切入点不同：PhysBrain 关注从人类 egocentric videos 训练 embodied VLM brain；EgoGuide 关注 UMI-style robot-free demonstration collection 本身的质量控制。它不是只让数据更多，而是让采集者知道“现在这个初始状态是否已经被数据集覆盖”。

这篇对自己的 VLA / 触觉数据采集最有用的点是 coverage guidance 的设计：同时看视觉输入分布和 wrist pose 分布，用 CLIP / DINOv2 表征视觉 novelty，用位姿距离表征 action-side geometry，再把结果变成用户可理解的 AR 分数。它把“数据多样性”从离线分析变成了采集时反馈。

另一个重点是 GERP 的保守接口：egocentric view 不直接替代 wrist-view controller，而是作为 gated residual action cue。这个设计承认 head / ego view 更全局但更不稳定，wrist view 更局部但控制上可靠，适合作为多视角 VLA policy fusion 的参考。

## 摘录

