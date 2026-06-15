---
tags:
  - bilingual-reading
paper: "[[@processbench2026roboprocessbench]]"
source_url: "https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench"
catalog_url: "https://claru.ai/datasets/processbench-2026-roboprocessbench"
images: "papers/images/roboprocessbench/"
image_index: "[[papers/images/roboprocessbench/index.md]]"
created: 2026-06-12
source_type: "benchmark dataset card"
---

# RoboProcessBench

paper:: [[@processbench2026roboprocessbench]]
dataset:: [ProcessBench-2026/RoboProcessBench](https://huggingface.co/datasets/ProcessBench-2026/RoboProcessBench)
images:: [[papers/images/roboprocessbench/index.md]]

> [!note]
> 当前公开材料是 Hugging Face dataset / benchmark release，不是论文 PDF；未发现 arXiv、DOI 或正式论文 PDF。本阅读稿基于 dataset README、benchmark card、metadata/reconstruction、prompt templates、task distribution、split manifests 和 ProcessData-SFT-Qwen 结果摘要整理。

## 核心词汇速查

| English | 中文 | 在本文/数据集中的作用 |
| --- | --- | --- |
| RoboProcessBench | 机器人过程理解基准 | 面向 VLM 的机器人操作过程理解 VQA benchmark。 |
| process-aware benchmark | 过程感知基准 | 不只识别静态物体，而是评估 phase、contact、motion、progress、temporal order 等执行过程线索。 |
| vision-language robotic manipulation understanding | 视觉语言机器人操作理解 | 给模型图像/多帧和自然语言问题，评估其是否理解机器人操作正在怎样展开。 |
| QA rows | 问答样本行 | 每行包含 question、choices、answer、source references、frame indices 等字段。 |
| SFT rows | 监督微调样本 | 用于 instruction/SFT 的训练 split，共 48,841 行。 |
| evaluation rows | 评测样本 | 用于 benchmark eval 的 split，共 9,051 行。 |
| task family | 任务族 | T1-T12 十二类诊断问题，每类测一种过程理解能力。 |
| phase recognition | 阶段识别 | 判断当前粗粒度操作阶段，例如 pre-approach、approach、transfer、release。 |
| contact detection | 接触检测 | 判断是否发生 task-relevant contact（任务相关接触）。 |
| bimanual coordination | 双臂协调 | 判断两臂在双臂任务中的协调状态。 |
| primitive | 低层操作原语 | 机器人操作中的基本动作单元，例如当前 primitive、下一 primitive、primitive chain。 |
| temporal ordering | 时间排序 | 给乱序帧，恢复真实时间顺序。 |
| temporal priority prediction | 时间优先判断 | 给两帧/两面板，判断哪一帧更早发生。 |
| split isolation | 切分隔离 | 按 episode 或 recording 隔离 train/eval，降低数据泄漏。 |
| reconstruction_key_json | 重建键 | 公开行中用于回到上游 episode/recording 和 frame indices 的稳定 JSON 引用。 |
| visual_inputs_redistributed | 是否重新分发视觉输入 | 当前为 false，完整视频和完整帧不随 release 分发。 |

## 论文主线

RoboProcessBench 的核心问题是：VLM 能不能理解机器人 manipulation execution（操作执行过程）本身，而不只是从静态图像里识别物体或回答常规视觉问答？机器人操作过程包含许多动态线索：机械臂处于哪个 phase（阶段）、是否已经发生 contact（接触）、主要 motion direction（运动方向）是什么、双臂是否协调、当前 primitive 进度到哪一步、几帧的真实时间顺序是什么、操作最终会不会成功。这些能力对后续做 robot monitoring、VLA state understanding、failure diagnosis 和 task progress tracking 都很关键。

RoboProcessBench 把这个问题做成 12 个 diagnostic question families（诊断任务族），并从四个上游数据源派生 57,892 条 QA rows：GM-100、RH20T、REASSEMBLE、AIST-Bimanual。公开 release 包含 48,841 条 SFT rows 和 9,051 条 evaluation rows，支持 JSONL/Parquet 格式，任务切分按 episode 或 recording 隔离。

![[papers/images/roboprocessbench/T1_Phase_Recognition_GM100.jpg|700]]

**T1 Phase Recognition 示例。** 这类问题要求模型根据当前帧判断 coarse process phase（粗过程阶段）。它是最基础的过程理解探针：模型是否知道机器人是在 pre-approach、approach、transfer 还是 release。

这个 release 的一个重要边界是：完整上游 videos 和 full frame dumps 没有重新分发。公开表格中提供 `visual_ref`、`source_episode_ref`、`reconstruction_key_json` 等稳定引用字段，用户需要按上游数据集许可获取源数据，再重建视觉输入。因此它是一个 compact, reviewable benchmark package（紧凑、可审查的基准包），而不是完整视频数据集镜像。

## 贡献与结论对照

| Release 声称/实现 | 具体位置 | 证据/数字 | 结论强度 |
| --- | --- | --- | --- |
| 提供 process-aware robotic manipulation understanding benchmark。 | README Dataset Summary；Benchmark Card Positioning。 | 12 个任务族覆盖 phase、contact、motion、coordination、progress、temporal、outcome、primitive。 | 定位清楚，适合作为 VLM 过程理解评测入口。 |
| 汇总多个机器人操作数据源。 | Benchmark Card Source roles；split manifests。 | GM-100、RH20T、REASSEMBLE、AIST-Bimanual 四源，总 57,892 QA rows。 | 覆盖面比单一数据集更广，但上游数据许可和视觉重建增加复现成本。 |
| 提供 SFT 和 evaluation 两类 split。 | README Dataset Summary；SFT/eval manifests。 | 48,841 SFT rows、9,051 eval rows；eval ratio 15%。 | 对训练和评测都有直接用途；需要注意 split isolation unit 不同源不同。 |
| 使用 episode / recording / scene isolation。 | Benchmark Card Split protocol；manifest。 | isolation unit 为 episode 或 recording，按源数据集组织。 | 有助于减少同源单位泄漏，但仍需检查不同任务/场景层面的近邻性。 |
| 发布标准 prompt serialization。 | metadata/prompt_templates.md。 | 标准 MCQ、T8 temporal ordering、T9 temporal priority 都要求 `<ANSWER>X</ANSWER>` 格式。 | 便于模型评测统一输出，但也把任务形式固定为选择题。 |
| 提供 ProcessData-SFT-Qwen LoRA 和结果摘要。 | ProcessData-SFT-Qwen_results summary。 | overall_acc 64.68%；T8 17.01%、T9 51.11%，T10-T12 超过 92%。 | 显示后训练模型能做部分 primitive 类任务，但时间排序类仍是短板。 |

## 数据集摘要 / Dataset Summary

RoboProcessBench is a process-aware benchmark for vision-language robotic manipulation understanding。它评估 VLM 是否能推断 manipulation execution 如何展开，覆盖：

- phase（阶段）；
- contact（接触）；
- motion（运动）；
- bimanual coordination（双臂协调）；
- primitive-local progress（局部 primitive 进度）；
- temporal order（时间顺序）；
- operation outcome（操作结果）；
- primitive-level transitions（primitive 层级转换）。

公开规模：

| Split | Rows |
| --- | ---: |
| SFT | 48,841 |
| Eval | 9,051 |
| Total | 57,892 |

任务覆盖：

| 维度 | 数字 |
| --- | ---: |
| task families | 12 |
| manipulation tasks | 260 |
| upstream sources | 4 |
| public file size | 约 206 MB |

Claru 数据集页也给出相同定位：这是一个 process-aware benchmark，用来评估 VLM 是否能从 phases、contact、motion、coordination 和 primitives 等维度推断机器人操作执行过程。

## Source Roles / 四个上游数据源的角色

| Source | Role | Supported tasks | Frozen size |
| --- | --- | --- | ---: |
| GM-100 | Main goal-conditioned source | T1, T2, T3, T4, T5, T6, T8, T9 | 15,500 |
| RH20T | Force/torque and contact source | T1, T2, T3, T5, T6, T7, T8, T9 | 15,800 |
| REASSEMBLE | Action-chain and primitive source | T1, T2, T5, T6, T7, T8, T9, T10, T11, T12 | 17,165 |
| AIST-Bimanual | Bimanual kinematics source | T3, T4, T6, T8, T9 | 9,427 |

这张表说明每个源不是简单拼接，而是各自承担特定过程信号：

- GM-100 主要提供 goal-conditioned manipulation 的阶段、运动、进度和时间任务。
- RH20T 有 force/torque/contact 相关信号，因此适合 contact/outcome 任务。
- REASSEMBLE 提供 action-chain 和 primitive labels，是 T10-T12 的核心来源。
- AIST-Bimanual 提供双臂运动学，支撑 bimanual coordination 和 temporal/motion 类任务。

## Task Families / 十二类诊断问题

### T1 Phase Recognition / 阶段识别

目标：identify the current coarse process phase（识别当前粗粒度过程阶段）。例如判断机器人处于 pre-approach、approach、transfer、release 等阶段。

输入通常是 single frame（单帧），考察模型是否能从机器人位置、末端执行器、物体状态中判断动作阶段。

### T2 Contact Detection / 接触检测

![[papers/images/roboprocessbench/T2_Contact_Detection_RH20T.jpg|700]]

目标：determine whether task-relevant contact has occurred（判断任务相关接触是否发生）。这类问题对机器人尤其关键，因为接触往往不是静态语义，而是由 gripper-object、tool-object 或 object-object 的空间关系定义。

RH20T 在这里重要，因为它是 force/torque and contact source。

### T3 Motion Direction Prediction / 运动方向预测

![[papers/images/roboprocessbench/T3_Motion_Direction_Prediction_AIST-Bimanual.jpg|700]]

目标：从 short temporal context（短时序上下文）推断 dominant motion direction（主要运动方向）。这通常需要多帧，而不是单帧识别。

这个任务能检测模型是否真正比较了相邻帧位置变化，而不是凭对象类别猜答案。

### T4 Bimanual Coordination State / 双臂协调状态

![[papers/images/roboprocessbench/T4_Bimanual_Coordination_State_AIST-Bimanual.jpg|700]]

目标：identify the current coordination state of two arms（识别双臂当前协调状态）。这类任务对 bimanual manipulation（双臂操作）很重要，因为两臂可能处于同步、互补、等待、单臂主导等状态。

### T5 Primitive-local Progress / 局部 primitive 进度

![[papers/images/roboprocessbench/T5_Primitive-Local_Progress_GM100.jpg|700]]

目标：estimate progress within the current local manipulation step（估计当前低层操作步骤内部进度）。它问的不是整个 task 是否完成，而是某个 primitive 内已经做到前、中、后哪个阶段。

公开 reconstruction notes 说明 T5 等价于 legacy 的 `T_progress`。

### T6 Motion State Recognition / 运动状态识别

![[papers/images/roboprocessbench/T6_Motion_State_Recognition_GM100.jpg|700]]

目标：distinguish actively moving from stationary states（区分机械臂正在运动还是基本静止）。这看似简单，但需要模型识别跨帧位移和动作连续性。

### T7 Operation Outcome Prediction / 操作结果预测

![[papers/images/roboprocessbench/T7_Operation_Outcome_Prediction_RH20T.jpg|700]]

目标：predict eventual success or failure from partial execution evidence（从部分执行证据预测最终成功或失败）。这类问题很接近 failure anticipation（失败预判）：模型要从早期或中途状态判断后续结果。

### T8 Temporal Ordering / 时间排序

![[papers/images/roboprocessbench/T8_Temporal_Ordering_GM100.jpg|700]]

目标：reconstruct chronological order of shuffled observations（恢复乱序帧的真实时间顺序）。公开 prompt 中，三帧标为 X/Y/Z，标签是 arbitrary identifiers，不代表位置或时间；模型需要输出 3-letter permutation，例如 `YXZ`。

reconstruction notes 说明 T8 被标准化成 6 个显式 permutation choices，以保持 public table flat and Parquet-friendly。

### T9 Temporal Priority Prediction / 时间优先判断

![[papers/images/roboprocessbench/T9_Temporal_Priority_Prediction_RH20T.jpg|700]]

目标：decide which of two observations occurred earlier（判断两张/两个面板哪一个更早发生）。公开 prompt 里强调 left-right placement 和 X/Y labels 都是 arbitrary，不代表时间顺序。

T9 等价于 legacy 的 `T_binary`，被标准化成 A/B choices，即使源数据原本用 X/Y。

### T10 Current Primitive Recognition / 当前 primitive 识别

![[papers/images/roboprocessbench/T10_Current_Primitve_Recognition_REASSEMBLE.jpg|700]]

目标：identify the current low-level primitive（识别当前低层操作原语）。这类任务依赖 REASSEMBLE 的 action-chain / primitive 信息。

注意：上游示例文件名中 `Primitve` 拼写少了一个 `i`，本地图片保留原始文件名，避免链接失效。

### T11 Next Primitive Prediction / 下一 primitive 预测

![[papers/images/roboprocessbench/T11_Next_Primitive_Prediction_REASSEMBLE.jpg|700]]

目标：infer the next primitive from local process context（从局部过程上下文推断下一操作原语）。这比当前 primitive 识别更接近 action anticipation（动作预判）。

### T12 Primitive Chain Restoration / primitive 链恢复

![[papers/images/roboprocessbench/T12_Primitive_Chain_Restoration_REASSEMBLE.jpg|700]]

目标：restore a masked primitive in a local primitive chain（在局部 primitive chain 中恢复被遮蔽的 primitive）。这类似过程级 cloze task，要求模型理解 primitive 序列结构。

## Repository Contents / 仓库内容

README 描述的 release 组织方式是 compact, reviewable benchmark package。实际仓库包含：

| 路径 | 内容 |
| --- | --- |
| `splits/processdata_sft.jsonl` / `.parquet` | SFT QA entries。 |
| `splits/processdata_eval.jsonl` / `.parquet` | Eval QA entries。 |
| `splits/sft_manifest.json` / `eval_manifest.json` | split manifests 和 source-level split counts。 |
| `metadata/task_distribution.csv` | 每个任务族 eval 样本数、随机基线、多数类基线。 |
| `metadata/asset_licenses.csv` | 上游数据源许可和再分发策略。 |
| `metadata/prompt_templates.md` | 公开 prompt serialization。 |
| `metadata/reconstruction.md` | 如何从公开行重建上游视觉输入。 |
| `examples/task_cards/` | 12 个代表性 task card 图片。 |
| `ProcessData-SFT-Qwen/` | LoRA adapter weights 和训练配置。 |
| `ProcessData-SFT-Qwen_results/` | predictions 和 summary。 |
| `benchmark_card.md` | benchmark-level documentation。 |
| `croissant.json` | Croissant + Responsible AI metadata。 |

README 中提到的 `schema.md` 和 `split_summary.json` 在当前文件树中未找到；实际可用的是 `metadata/reconstruction.md`、`metadata/task_distribution.csv` 和 `splits/*_manifest.json`。

## Split Protocol / 切分协议

Benchmark card 给出的 split protocol：

- eval ratio: 15%；
- isolation unit: episode or recording depending on source；
- totals: 48,841 SFT and 9,051 eval。

按 source 的 eval split：

| Source | Eval items | Eval groups |
| --- | ---: | ---: |
| GM-100 | 2,643 | 628 |
| RH20T | 2,422 | 89 |
| REASSEMBLE | 2,562 | 6 |
| AIST-Bimanual | 1,424 | 30 |
| Total | 9,051 | 753 |

按 source 的 SFT split：

| Source | SFT items | SFT groups |
| --- | ---: | ---: |
| GM-100 | 12,857 | 3,558 |
| RH20T | 13,378 | 507 |
| REASSEMBLE | 14,603 | 31 |
| AIST-Bimanual | 8,003 | 170 |
| Total | 48,841 | 4,266 |

这里的 group 对 GM-100 是 `(task_id, episode_id)`，对 RH20T/REASSEMBLE/AIST-Bimanual 是 `recording_id`。这个设计的目的是防止同一 episode/recording 同时出现在 SFT 和 eval 中。

## QA Row Schema / QA 行字段

`metadata/reconstruction.md` 给出公共 QA 行字段。核心字段可以分成几组：

| 字段组 | 字段 | 作用 |
| --- | --- | --- |
| 标识 | `item_id`, `split`, `split_version`, `split_group_id` | 稳定样本 ID 和切分信息。 |
| 来源 | `source`, `source_slug`, `source_task_id`, `source_unit_type`, `source_unit_id` | 指向上游数据源和 episode/recording。 |
| 任务 | `task_id`, `task_name`, `task_type_legacy` | T1-T12 任务族和 legacy 名称。 |
| 输入 | `input_type`, `num_frames`, `frame_indices_json`, `display_labels_json`, `camera`, `arm_type` | 视觉输入形式、帧索引、面板标签、相机和机械臂配置。 |
| 问答 | `question`, `choice_A` ... `choice_F`, `answer`, `answer_text`, `num_choices` | 多选题文本、答案和选项数量。 |
| 重建 | `visual_ref`, `source_episode_ref`, `reconstruction_key_json` | 从 public row 回到上游视觉输入的稳定引用。 |
| 元数据 | `task_meta_in_source`, `task_meta_public`, `builder_version`, `prompt_version` | 任务元信息是否存在/公开，以及构建版本。 |
| SFT | `sft_target` | SFT-only supervised target，例如 `<ANSWER>D</ANSWER>`。 |

关键限制：`task_meta_public` 在当前 release 中总是 `false`，说明结构化 task metadata 被有意 withheld。

## Prompt Templates / 评测输出协议

标准 multiple-choice template：

```text
{question}

A: {choice_A}
B: {choice_B}
...

Choose exactly one option label.

Output protocol:
- You may include brief reasoning before the final answer.
- The final line must be exactly: <ANSWER>A</ANSWER>
- Do not output anything after </ANSWER>.
```

T8 temporal ordering template 特别要求输出三字母排列，例如 `YXZ` 表示 Y first, then X, then Z。

T9 temporal priority template 则强调：左/右位置和 X/Y 标签都是 arbitrary，不代表时间；模型只能根据画面过程判断哪一个更早。

这个输出协议对自动评测友好，但也意味着模型可能被格式约束影响。评测时要同时关注 invalid rate。公开 Qwen summary 中 `n_invalid` 为 0。

## Task Distribution / 任务分布和基线

| Task | Eval n | Choices | Random acc | Majority acc |
| --- | ---: | ---: | ---: | ---: |
| T1 Phase Recognition | 1,274 | 4 | 25.00% | 26.14% |
| T2 Contact Detection | 747 | 2 | 50.00% | 51.14% |
| T3 Motion Direction Prediction | 1,207 | 4 | 25.00% | 26.59% |
| T4 Bimanual Coordination State | 533 | 4 | 25.00% | 27.77% |
| T5 Primitive-local Progress | 1,222 | 3 | 33.33% | 34.29% |
| T6 Motion State Recognition | 896 | 2 | 50.00% | 50.45% |
| T7 Operation Outcome Prediction | 793 | 2 | 50.00% | 50.19% |
| T8 Temporal Ordering | 964 | 6 | 16.67% | 17.43% |
| T9 Temporal Priority Prediction | 810 | 2 | 50.00% | 50.62% |
| T10 Current Primitive Recognition | 359 | 4 | 25.00% | 27.58% |
| T11 Next Primitive Prediction | 200 | 4 | 25.00% | 28.50% |
| T12 Primitive Chain Restoration | 46 | 4 | 25.00% | 32.61% |

样本量明显不均衡。T12 只有 46 个 eval items，因此单独任务准确率波动会很大；T1/T3/T5/T8 是主要大样本任务族。

## ProcessData-SFT-Qwen Results / 公开后训练模型结果

公开 summary 显示 ProcessData-SFT-Qwen 在 9,051 eval items 上：

- overall accuracy: 64.68%；
- invalid outputs: 0；
- n_items: 9,051。

按任务族：

| Task | Acc | n | 解释 |
| --- | ---: | ---: | --- |
| T1 Phase Recognition | 58.48% | 1,274 | 比随机/多数类高，但仍有较大错误空间。 |
| T2 Contact Detection | 82.73% | 747 | 接触检测相对较好。 |
| T3 Motion Direction Prediction | 87.66% | 1,207 | 短时运动方向预测较强。 |
| T4 Bimanual Coordination State | 75.05% | 533 | 双臂协调状态有一定可学性。 |
| T5 Primitive-local Progress | 45.42% | 1,222 | 只比多数类基线高约 11 个百分点，局部进度仍难。 |
| T6 Motion State Recognition | 92.41% | 896 | 运动/静止判断较强。 |
| T7 Operation Outcome Prediction | 63.43% | 793 | 从部分证据预测成败仍不稳定。 |
| T8 Temporal Ordering | 17.01% | 964 | 接近随机/多数类，三帧时间排序很难。 |
| T9 Temporal Priority Prediction | 51.11% | 810 | 接近随机，二帧早晚判断也很难。 |
| T10 Current Primitive Recognition | 92.48% | 359 | 当前 primitive 识别很高。 |
| T11 Next Primitive Prediction | 96.50% | 200 | 下一 primitive 预测很高，但样本量较小。 |
| T12 Primitive Chain Restoration | 97.83% | 46 | 最高，但 eval n 很小。 |

最值得注意的是 T8/T9：即使经过 SFT，时间排序和时间优先判断仍接近随机。这说明当前 VLM/SFT 模型可能能识别局部动作和 primitive 标签，但不一定真正掌握跨帧时间关系。

## Reconstruction / 复现和视觉输入重建

公开 release 不重新分发 full upstream videos 和 full frame dumps。每行提供：

- `visual_ref`；
- `source_episode_ref`；
- `reconstruction_key_json`。

预期复现流程：

1. Obtain upstream datasets under their original terms（按上游条款获得原始数据集）。
2. 使用 public row 中的 `source`、`source_task_id`、`source_unit_id`、`camera`、`frame_indices_json`。
3. 用 main codebase 中的 source-specific evaluation scripts 重建所需 visual inputs。

这使 release 足够 compact，但也意味着用户无法只下载 Hugging Face 表格就完整复现视觉评测。它更像一个 benchmark index + QA metadata package。

## License and Terms / 许可和再分发

| Asset | Role | License / terms | Redistribution policy |
| --- | --- | --- | --- |
| ProcessBench-Anom release metadata | derived benchmark metadata and manifests | other | redistributed in this release |
| GM-100 | upstream source dataset | MIT | raw videos and full frame caches are not redistributed here |
| RH20T | upstream source dataset | CC BY-SA 4.0 & CC BY-NC 4.0 | raw videos and full frame caches are not redistributed here |
| REASSEMBLE | upstream source dataset | CC BY 4.0 | raw videos and full frame caches are not redistributed here |
| AIST-Bimanual | upstream source dataset | CC BY 4.0 | raw videos and full frame caches are not redistributed here |

使用时要特别注意 RH20T 的 CC BY-NC 4.0 成分，以及 release 本身 `license: other`。如果要做商业用途或再分发重建后的视觉输入，需要逐个上游数据源核对条款。

## 和已有入库论文的关系

RoboProcessBench 可以放在 VLA/VLM 评测基准线索中：

- 和 [[@kim2026serf|SERF]] 的关系：SERF 研究 VLA 如何获得 explicit spatiotemporal memory；RoboProcessBench 可以评估 VLM 是否能从多帧视觉里理解 phase、progress、temporal order 等过程状态。
- 和 [[@tang2026frs|FRS]] 的关系：FRS 用 VLM/human 提供 semantic guidance；RoboProcessBench 可作为测试 VLM 是否能读懂机器人执行过程、给出可靠过程判断的探针。
- 和触觉/接触方向的关系：T2 Contact Detection 与接触事件理解相关，虽然它不是触觉数据集，但可作为视觉接触推理基准。

## 局限与可追问点

### 1. 不是正式论文，缺少完整方法论细节

当前公开材料是 dataset card + metadata，不是论文。它说明了数据规模、任务族、字段和 release 结构，但没有完整论文式的 annotation protocol、质量控制、模型对比表、人工一致性分析或误差分析。

可追问：未来是否会有 paper 版本？标注是规则生成、人工审核还是混合流程？每类任务的质量控制如何做？

### 2. 完整视觉输入不随 release 分发

`visual_inputs_redistributed=false`，`reconstruction_required=true`。用户要先获取上游数据集，再按 reconstruction key 重建视觉输入。

可追问：不同用户重建帧、相机、图像拼接是否完全一致？source-specific evaluation scripts 是否公开并版本锁定？

### 3. task_meta_public=false 限制上下文复现

公开 QA rows 不包含结构化 task metadata。这样可以减少上游语义泄漏或授权风险，但也限制了模型使用任务上下文进行推理。

可追问：评测是否应分成 no-task-meta 和 task-meta 两个版本？真实机器人监控系统通常能看到任务目标，这会改变难度。

### 4. 任务族样本量不均衡

T12 只有 46 个 eval items，而 T1/T3/T5/T8 超过 900。整体 accuracy 更受大任务族影响，T12 这种高准确率小样本任务不能过度解释。

可追问：应报告 macro average、source-wise average、task-family balanced score，而不只看 overall micro accuracy。

### 5. 选择题形式可能弱化开放式过程理解

所有公开任务都是 multiple-choice QA。选择题便于评测，但模型可能通过选项排除、类别先验或模板偏差获得较高分，而不一定能生成过程解释。

可追问：是否有 open-ended rationale 或 localization grounding？模型答对 phase/contact 时是否能指出视觉依据？

### 6. T8/T9 时间推理明显困难

ProcessData-SFT-Qwen 在 T8/T9 上接近随机或多数类基线。这个结果非常有价值，但也需要进一步分析：是模型时序能力不足，还是输入帧太稀疏/视觉差异太小/标签构造过难？

可追问：T8/T9 是否需要 video-native 模型、光流/运动特征或更明确的 frame deltas？

## 为什么需要回看这篇

RoboProcessBench 值得回看，不是因为它提出控制算法，而是因为它给机器人视觉语言理解提供了一个过程维度的评测坐标系。以后读以下主题时可以回来查它：

- VLM for robotics：模型是否理解机器人执行过程，而不是只识别物体。
- VLA state understanding：VLA 是否能判断当前 phase、progress、下一 primitive。
- Failure prediction：T7 operation outcome prediction 可作为 failure anticipation 入口。
- Temporal reasoning：T8/T9 是多帧时间顺序理解的硬任务。
- Bimanual manipulation：T4 和 AIST-Bimanual 源可用于双臂协调状态评测。
- Contact reasoning：T2 是纯视觉接触判断的基准入口。

## 精读路线

1. 先看 Dataset Summary，记住 57,892 QA rows、12 task families、4 upstream sources。
2. 看 Task Families，理解 T1-T12 分别测哪种过程能力。
3. 看 Reconstruction，确认 public release 不含完整视频和帧，需要上游数据重建。
4. 看 Task Distribution，不要被 overall accuracy 掩盖任务族样本不均衡。
5. 看 ProcessData-SFT-Qwen summary，重点关注 T8/T9 的失败，因为这暴露了机器人时序理解短板。

