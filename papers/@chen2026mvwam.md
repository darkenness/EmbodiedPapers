---
tags:
  - paper
status: unread
aliases:
  - MV-WAM
  - "MV-WAM: Manifold-Aware World Action Model with Value Augmentation"
year: 2026
title: "MV-WAM: Manifold-Aware World Action Model with Value Augmentation"
doi: "10.48550/arXiv.2606.21088"
url: "https://arxiv.org/abs/2606.21088"
venue: "arXiv preprint"
venue_short: "arXiv"
arxiv: "2606.21088v1"
arxiv_url: "https://arxiv.org/abs/2606.21088"
arxiv_doi: "10.48550/arXiv.2606.21088"
pdf_url: "https://arxiv.org/pdf/2606.21088v1"
published: 2026-06-19
updated: 2026-06-19
pdf: "[[papers/pdfs/2606.21088v1.pdf]]"
bilingual:
image_index: "[[papers/images/2606.21088v1/index.md]]"
authors:
  - "[[Jintao Chen]]"
  - "[[Peidong Jia]]"
  - "[[Qingpo Wuwu]]"
  - "[[Jiaming Liu]]"
  - "[[Mengfei Du]]"
  - "[[Chun-Kai Fan]]"
  - "[[Xiaowei Chi]]"
  - "[[Hao Chen]]"
  - "[[Chengyu Bai]]"
  - "[[Zezhong Qian]]"
  - "[[Hao Wang]]"
  - "[[Jiajun Cao]]"
  - "[[Weishi Mi]]"
  - "[[Xiaozhu Ju]]"
  - "[[Jian Tang]]"
  - "[[Shanghang Zhang]]"
institutions:
  - "[[Peking University]]"
  - "[[Beijing Innovation Center of Humanoid Robotics]]"
topics:
  - world action model
  - manifold-aware optimization
  - value augmentation
  - mixture-of-transformers
  - flow matching
  - visual generalization
  - out-of-distribution robustness
  - progress-value regulation
  - RoboTwin
  - dual-arm manipulation
  - vision-language-action
  - cross-modality causal mask
---

# MV-WAM: Manifold-Aware World Action Model with Value Augmentation

- [x] PDF:: [[papers/pdfs/2606.21088v1.pdf]]
- [x] 图片索引:: [[papers/images/2606.21088v1/index.md]]
- [ ] 双语阅读稿:: 待整理
- [ ] 阅读状态:: unread

related:: [[world action model]], [[flow matching]], [[mixture-of-transformers]], [[RoboTwin]], [[@yang2026memorywam]], [[@zhang2026contactworld]], [[@physicalintelligence2024pi0]], [[@tencent2026hy-embodied-05]], [[@kim2026serf]]
affiliation:: [[Peking University]], [[Beijing Innovation Center of Humanoid Robotics]]

## 一句话问题

现有 WAM 在域内很强，但 OOD 视觉泛化收益难传导到动作鲁棒性——根因是视觉与动作处于异构流形，联合优化让高曲率视觉目标主导梯度、动作表征在分布偏移下更脆弱。MV-WAM 用 MoT 统一建模视频预测、动作生成与 value 估计，配合流形感知多目标优化、跨模态因果 mask 与 progress-value 回滚，在 RoboTwin random 达 55.7%（+29.3 pt）且真机双臂 77.5%。

## 方法

- 骨干：Mixture-of-Transformers——video expert（大尺度预训练视频生成初始化）+ action-value expert；共享全局 attention、分模态参数。
- 跨模态因果 mask：动作 token 层级锚定在对应预测视频帧，value token 同时看视觉与动作上下文。
- 流形感知优化：视频分支用标准 flow matching；动作分支用 bounded x0-prediction（避免 1/t² 权重在联合训练中与视频 loss 失衡）；value token 作为低维流形变量估计任务进度。
- Progress-value regulation：value 用 Monte Carlo return 训练；在线执行时预测 value 低于阈值则触发 value-guided rollback，检测视觉-动作失配并恢复。
- 动作空间：RDT-1B 统一 128 维表示（双臂关节 + 夹爪等）。

## 证据

- RoboTwin 2.0（50 任务，clean + random 光照/背景/物体扰动）：平均 random SR **55.7%**，最强 baseline +29.3 pt；clean **84.0%**，与最强 in-domain 方法相当；无 randomized action 监督。
- 真机双臂四任务（难度递进）：平均成功率 **77.5%**，基线难以物理部署泛化。
- 对比：DP、RDT、$\pi_0$、UP-VLA、BagelVLA、HALO、Fast-WAM 等；参数量少于部分竞争 WAM。
- 分析：t-SNE 显示动作 expert 对分布偏移更敏感；流形曲率 $\kappa_v \gg \kappa_a$；消融验证因果 mask、流形感知 loss、value regulation 对 OOD 均有贡献。

## 局限

- 失败模式：video expert 语义/左右手分配错误；接触精细任务（窄 affordance）动作精度不足。
- 真机仅 4 任务，仿真到真实与长时程任务覆盖有限。
- 未公开项目页/代码（截至 arXiv）。
- 与 [[@yang2026memorywam]] 记忆机制、[[@zhang2026contactworld]] 触觉世界模型正交，联合架构未探索。

## 我的阅读笔记

MV-WAM 把 WAM 泛化 gap 明确归因于 **模态流形不匹配**，而不是“视频 prior 不够大”——这对读 [[@yang2026memorywam]]（记忆补非马尔可夫）和 [[@kim2026serf]]（显式空间记忆）是互补视角：一个改历史表征，一个改跨模态优化几何。value-guided rollback 类似执行期自检，与 [[@wang2026policytrim]] 压步数、[[@shi2026flowdpg]] RL 后训练不同层。

对自己项目：若 VLA/WAM 在 random 场景掉点远大于 clean，可先查 action expert 表征是否比 visual expert 更“散”，再考虑分模态 loss 而非继续堆视频数据。

## 摘录