---
tags:
  - paper
  - dataset
  - benchmark
status: unread
aliases:
  - RoboProcessBench
  - ProcessBench-2026/RoboProcessBench
year: 2026
title: "RoboProcessBench"
url: "https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench"
dataset: "https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench"
catalog: "https://claru.ai/datasets/processbench-2026-roboprocessbench"
venue: "Hugging Face dataset"
venue_short: "HF Dataset"
bilingual:
images: "papers/images/roboprocessbench/"
image_index: "[[papers/images/roboprocessbench/index.md]]"
maintainers:
  - "[[ProcessBench-2026]]"
topics:
  - robotic manipulation
  - vision-language models
  - visual question answering
  - process understanding
  - benchmark
  - bimanual manipulation
  - temporal reasoning
  - contact reasoning
  - primitive recognition
---

# RoboProcessBench

- [ ] PDF:: 未发现公开论文 PDF / arXiv 条目
- [x] 数据集:: [ProcessBench-2026/RoboProcessBench](https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench)
- [ ] 双语阅读稿:: 待整理
- [x] 图片索引:: [[papers/images/roboprocessbench/index.md]]
- [ ] 阅读状态:: unread

related:: [[robotic manipulation]], [[vision-language-models]], [[visual-question-answering]], [[process-understanding]], [[bimanual manipulation]], [[@kim2026serf]]

## 一句话问题

现有机器人视觉问答常问“这是什么”或“该做什么”，但对 manipulation execution 如何随时间展开评测不足；RoboProcessBench 把 phase、contact、motion、bimanual coordination、primitive progress、temporal order、outcome 和 primitive transitions 拆成 12 类诊断问题，用 57,892 条 QA 评估 VLM 是否真的理解机器人操作过程。

## 方法

- 数据来源：从 GM-100、RH20T、REASSEMBLE、AIST-Bimanual 四个上游机器人数据集中派生。
- 数据规模：57,892 QA rows，其中 48,841 SFT rows、9,051 evaluation rows。
- 任务族：T1-T12 覆盖阶段识别、接触检测、运动方向、双臂协调、局部进度、运动状态、结果预测、时间排序、时间优先、当前 primitive、下一 primitive、primitive chain restoration。
- 切分协议：评测比例 15%，按 episode 或 recording 做 isolation，避免同一源单位泄漏到训练和评测。
- 发布形式：公开 JSONL/Parquet QA 表、manifest、task distribution、prompt templates、reconstruction notes、示例 task cards、ProcessData-SFT-Qwen LoRA adapter 和预测摘要。

## 证据

- Eval split 共 9,051 items：GM-100 2,643、RH20T 2,422、REASSEMBLE 2,562、AIST-Bimanual 1,424。
- Task distribution 显示 T1-T12 都有 eval items；最多的是 T1 1,274、T5 1,222、T3 1,207、T8 964，最少的是 T12 46。
- 公开的 ProcessData-SFT-Qwen 在 9,051 eval items 上 overall accuracy 为 64.68%，但任务间差异很大：T10/T11/T12 超过 92%，T8 只有 17.01%，T9 约 51.11%，显示时间排序/二选一时间优先仍很难。
- Release 明确不重新分发完整上游视频和完整 frame dumps，只提供稳定引用字段和 reconstruction_key_json，要求用户按上游数据集条款重建视觉输入。

## 局限

- 当前入库对象是数据集/benchmark release，不是正式论文；没有 arXiv、DOI 或 PDF。
- 公开 release 的 `task_meta_public` 为 false，结构化 task metadata 被有意保留，限制了对任务语义上下文的复现。
- 完整视觉输入未重新分发，复现实验需要另行获取 GM-100、RH20T、REASSEMBLE、AIST-Bimanual。
- T12 eval 只有 46 个样本，任务族间样本量不均衡，宏平均和微平均解释要分开。
- 数据来源许可混合，尤其 RH20T 含 CC BY-SA 4.0 与 CC BY-NC 4.0，使用时需要按上游条款判断商业/再分发边界。

## 我的阅读笔记

RoboProcessBench 和 SERF/FRS 的关系是“评测视角互补”：SERF 关心 VLA 是否有显式时空状态记忆，FRS 关心如何调用动作先验，而 RoboProcessBench 更像一个 VLM 过程理解探针，专门拆解机器人操作中的阶段、接触、运动、时间顺序和 primitive chain。它不直接评测闭环控制成功率，但适合检查视觉语言模型是否能读懂机器人执行轨迹中的过程线索。

后续回看时重点看 T8/T9：公开 SFT-Qwen 结果在这两类时间推理上接近随机或多数类基线，说明“看几帧判断先后顺序”仍是视频/多帧机器人理解的短板。

## 摘录

