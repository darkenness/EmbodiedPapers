---
tags:
  - bilingual-reading
paper: "[[@li2025r-tac0]]"
source_pdf: "[[papers/pdfs/li2025r-tac0.pdf]]"
image_index: "[[papers/images/li2025r-tac0/index.md]]"
created: 2026-06-05
---

# R-Tac0: A Rounded High-Frequency Transferable Monochrome Vision-based Tactile Sensor for Shape Reconstruction

paper:: [[@li2025r-tac0]]
pdf:: [[papers/pdfs/li2025r-tac0.pdf]]
images:: [[papers/images/li2025r-tac0/index.md]]

## 核心词汇速查

| English | 中文 | 在本文中的作用 |
| --- | --- | --- |
| vision-based tactile sensor, VBTS | 视觉触觉传感器 | 用相机观察弹性体形变，把接触信息转换成图像问题。 |
| rounded tactile finger | 圆弧形触觉手指 | 更贴近机械手指尖形状，比平面传感器更适合多角度接触。 |
| monochrome camera | 黑白相机 | 只输出单通道灰度图，降低数据量和计算复杂度。 |
| monochrome illumination | 单色/白光照明 | 配合黑白相机，不再依赖 RGB photometric stereo（光度立体）。 |
| darkness mapping | 暗度映射 | 接触变深后图像变暗，利用灰度变化估计深度。 |
| compound rounded elastomer | 复合圆弧弹性体 | 多层材料结构，同时承担接触、透光、扩散和遮光功能。 |
| differential image | 差分图像 | 当前接触图像减去参考图像，是网络的输入。 |
| differential depth | 差分深度 | 接触导致的深度变化，是网络预测目标。 |
| transferability | 可迁移性 | 一个标定模型能否迁移到新制造的传感器。 |
| slip detection | 滑移检测 | 高频触觉的应用验证之一，比较不同帧率下能否及时发现滑动。 |

## 论文主线

本文要解决的矛盾是：rounded VBTS（圆弧形视觉触觉传感器）适合机器人手指，但现有曲面方案常依赖 RGB 多通道图像或复杂光学结构，频率通常停留在 30-60 Hz，而且每个新传感器都要重新标定。R-Tac0 的路线是把成像和重建都简化：用黑白相机加白光照明，观察复合圆弧弹性体的灰度变化，再用轻量网络从 differential image（差分图像）恢复 depth map（深度图）。这样它同时追求四件事：低成本、圆弧接触面、120 Hz 高频感知、跨传感器迁移。

## 贡献与结论对照

| 论文声称的贡献 | 证据位置 | 结论强度 |
| --- | --- | --- |
| 单黑白相机和单通道照明实现 high-speed pixel-level sensing（高速像素级感知）。 | 传感器设计、Table I、120 Hz 实验。 | 比曲面 RGB VBTS 更快，证据较直接。 |
| 新的圆弧传感器结构和低成本制造流程。 | Fig. 2-Fig. 4，材料与成本拆解。 | 结构细节充分，复现性较好。 |
| 低成本标定流程支持 3D shape reconstruction（3D 形状重建）。 | Fig. 5-Fig. 7，公式 (1)-(3)。 | 标定流程清楚，依赖 3D 打印件和相机标定。 |
| 网络模型有跨传感器迁移能力。 | Fig. 9，新传感器与 fine-tuning 结果。 | 有初步证据，但新传感器误差仍高于训练传感器。 |
| 高频信号能改善动态任务，例如 slip detection（滑移检测）。 | Fig. 10，120/90/60/30 fps 对比。 | 结论明确，应用场景仍偏受控实验。 |

## 摘要与问题设定

论文开头指出，机器人灵巧操作需要可靠的 contact state（接触状态）、contact position（接触位置）和 surface geometry（表面几何）反馈。平面 VBTS 在贴合复杂接触时有局限，因此近年出现了圆弧或指尖形态的视觉触觉传感器。但曲面 VBTS 往往要在 RGB 通道中恢复表面法线或深度，数据量和计算量更高，传感频率较低；如果要把多个传感器装到多指手上，逐个标定也会成为部署成本。

![[papers/images/li2025r-tac0/page1_fig1.jpeg|700]]

**Fig. 1: The R-Tac0 Sensor.** 图中展示了传感器安装在夹爪上的形态，以及螺钉快速滑过传感器表面时的三层信息：底部是接触过程，中间是黑白相机捕获的图像，顶部是重建的几何。这个图把全文目标压缩成一句话：不是只做静态触觉图像，而是要在动态接触中实时恢复曲面几何。

本文的核心回答是 R-Tac0：一个低成本 rounded VBTS，使用 black-and-white camera（黑白相机）在 white-light illumination（白光照明）下捕获 coated semitransparent elastomer（带涂层半透明弹性体）的反射变化。单通道输入减少了传输和网络计算负担，因此系统可以达到 120 Hz；同时，作者声称这种简单输入让 depth calibration model（深度标定模型）更容易迁移到新传感器。

## I. Introduction

Introduction 的逻辑分三层。

第一层是 tactile sensing（触觉感知）在 manipulation（操作）中的必要性。相比只有视觉或力矩反馈，触觉能直接感知局部接触，这对抓取、滑移修正、局部几何估计很关键。

第二层是现有 VBTS 的形态问题。许多 GelSight-style（GelSight 风格）传感器是平面的，适合压印和表面纹理重建，但不自然地贴合机械手指尖。圆弧形触觉面能在不同角度下获得更充分的接触，也更适合多指手末端。

第三层是曲面 VBTS 的速度和标定问题。论文把当前问题归因于 multi-channel captures（多通道采集）：RGB 相机和 photometric stereo 等方法需要更多数据、更复杂计算，也带来发热和实时性压力。大规模部署时，每个传感器还常常需要单独标定，而且标定可能依赖 CNC 等专用设备。

Table I 中，R-Tac0 被放在 TacTip、RainbowSight、Omnitact、GelTip、InSight、AllSight、DenseTact、DIGIT Pinki、GelStereo BioTip、DTact 等曲面或非平面视觉触觉传感器旁边比较。关键行是：

| Sensor | Working Principle | Camera | Dimension (mm) | Cost ($) | Frequency (Hz) | Configuration |
| --- | --- | --- | --- | ---: | ---: | --- |
| DenseTact | Learning-based | Monocular RGB | 32 x 32 x 43 | 80- | 30 | Bionic fingertip |
| DTact | Darkness Mapping | Monocular RGB | 32.5 x 25.5 x 25.5 | 15 | 90 | Non-planar |
| R-Tac0 | Darkness Mapping | Monochrome | 30 x 30 x 43 | 60 | 120 | Bionic fingertip |

这个表说明 R-Tac0 的定位不是单纯追求最低成本，而是在 bionic fingertip（仿生指尖配置）、120 Hz 和单通道输入之间寻找平衡。它与 [[@lin2022dtact]] 的关系很直接：都利用 darkness mapping，但 DTact 是 RGB 单目，R-Tac0 进一步把输入压到 monochrome（黑白）。

## II. Related Work

Related Work 主要围绕两类背景：vision-based tactile sensors 和 curved tactile sensors。

对 VBTS 而言，GelSight 系列代表了高分辨率几何和力估计路线。论文引用 [[@yuan2017gelsight]] 作为重要基础，但指出很多这类方案依赖内部彩色照明、镜面/半透明层设计和光度立体重建。它们的优势是细节丰富，问题是光学路径、标定和计算都复杂。

对曲面传感器而言，DenseTact、GelTip、AllSight、GelStereo BioTip 等都试图让传感器更接近手指末端。DenseTact 用半球弹性体和学习模型重建密集形状，优势是覆盖面大；代价是 RGB 图像、30 Hz 左右频率和每个传感器的学习式标定。R-Tac0 继承曲面形态，但把感知机制换成更简单的灰度暗度变化。

这里需要注意一个隐含取舍：RGB photometric stereo（光度立体）可以携带更丰富的方向信息，黑白 darkness mapping 则更快、更简单。R-Tac0 的论证重点是，对于机器人动态任务，频率和部署成本有时比极端细节更重要。

## III. Sensor Design and Fabrication

R-Tac0 的硬件由四个主要部分组成：contact module（接触模块）、illumination system（照明系统）、camera（相机）和 sensor shell（外壳）。

![[papers/images/li2025r-tac0/page3_fig1.jpeg|700]]

**Fig. 2: R-Tac0 sensor design.** 这张图对应设计剖面。最重要的不是外壳，而是接触模块的层次结构：从内到外分别是 internal filling gel（内部填充胶）、rigid transparent shell（刚性透明壳）、transparent gel layer（透明凝胶层）、translucent gel layer（半透明凝胶层）和 black coating layer（黑色涂层）。每一层解决一个具体问题。

### A. Design Criteria

设计目标包括：

- 形状上要能集成到 robotic end effectors（机器人末端执行器）和 dexterous hands（灵巧手）。
- 成像上要减少通道数，支持 high-frequency perception（高频感知）。
- 材料上要能形成可重复的灰度变化，使深度和亮度之间有稳定关系。
- 标定上要尽量避免 CNC 等大型设备，转向 3D-printed setup（3D 打印装置）。

### B. Contact Module

contact module 是本文的核心硬件贡献。每一层的作用如下：

| 层 | 材料/构造 | 作用 |
| --- | --- | --- |
| internal filling gel | Smooth-on Solaris，1:1 配比，脱泡后固化 24 h | 扩散 LED 光斑，并把刚性透明壳粘到外壳上。 |
| rigid transparent shell | 现成透明试管 | 提供稳定圆弧几何和透明光路，减少后处理。 |
| transparent gel layer | PDMS Dow Corning Sylgard 184，10:1 配比 | 在刚性壳和半透明层之间提供结构支撑和光扩散。 |
| translucent gel layer | Smooth-on Ecoflex 00-30，厚度约 1.5 mm | 决定可测深度范围和细节分辨率之间的权衡。 |
| black coating layer | PTG-501 混合涂层 | 吸收内部和环境光，形成保护层，也是暗度变化的关键界面。 |

![[papers/images/li2025r-tac0/page3_fig2.png|650]]

**Fig. 3: Effect of the internal filling gel layer.** 这张图回答一个很实际的问题：为什么不是简单放一圈 LED 再拍弹性体？没有 internal filling gel 时，LED spot（光斑）会直接进入图像，破坏灰度到深度的稳定映射；加入填充胶后，照明更均匀，网络看到的灰度变化更像接触形变，而不是照明结构本身。

### C. Illumination, Camera, Shell

illumination system 使用简单的 white LED ring（白光 LED 环），包括 8 个均匀分布的 LUXEON 2835 4000K 白色贴片 LED、470 Ohm 电阻和环形 PCB。为了让照明更均匀，作者在 PCB 上方约 10 mm 处安装双面磨砂 diffuser（扩散片）。

camera 使用 OV9281 black-and-white CMOS global shutter camera（黑白 CMOS 全局快门相机），配 160 度 wide FOV lens（广角镜头），640 x 480 分辨率，120 fps，通过 USB 输出单通道 MJPG。global shutter 对快速滑移很重要，因为 rolling shutter 容易在动态接触中引入时序畸变。

sensor shell 使用黑色 PLA 3D 打印，两片式结构，作用是固定内部组件并吸收 stray light（杂散光）。最终尺寸约 30 mm x 30 mm x 43 mm，重量约 35 g，总成本约 60 美元，其中相机模组约 36 美元，接触模块和模具约 15 美元，LED 环和扩散片约 6 美元，外壳约 2 美元。制造周期少于 5 天，主要耗时来自硅胶固化。

![[papers/images/li2025r-tac0/page4_fig1.jpeg|700]]

**Fig. 4: Fabrication procedure.** 制造流程图的价值在于显示该方案的复现路径：它没有把精度完全压在昂贵加工设备上，而是利用现成透明试管、3D 打印模具、分层浇注和喷涂形成传感器结构。

## IV. Sensor Calibration and Shape Reconstruction

这一节从“图像为什么能变成深度”转向“怎样让模型学到这个映射”。

### A. Camera Parameters

首先需要相机内参 `M`、畸变系数 `D`、外参 `R, T`。内参和畸变用 OpenCV checkerboard（棋盘格）标定，外参用一个带孔的 3D 打印 dome structure（圆顶结构）完成。作者把 pin（针）插入已知空间坐标的孔中，记录它们在图像中的像素位置，然后用 `solvePnP` 求解相机和传感器几何之间的关系。

论文公式 (1) 写作：

$$
(u, v) = M D [R \mid T] (x, y, z)
$$

这里 `(x, y, z)` 是传感器表面的三维点，`(u, v)` 是图像坐标。直观地说，这个公式把真实曲面上的点投影到相机图像上，是后续把 depth ground truth（深度真值）对齐到像素位置的前提。

![[papers/images/li2025r-tac0/page4_fig2.jpeg|700]]

**Fig. 5: Camera calibration.** 左侧是内参与畸变标定，右侧是用带孔圆顶和 pin 做外参估计。这个设计对应论文的低成本立场：标定装置可以 3D 打印，而不是使用 CNC 逐点压入。

### B. Ground Truth Capture

训练数据来自 3D 打印的 semi-dome-shaped components（半圆顶组件），内部带不同 protrusions（凸起）。作者把一个带凸起的半圆顶和一个空半圆顶组合起来，压在传感器上采集图像，同时利用 CAD/已知几何生成深度真值。再把组合件旋转 180 度，得到镜像样本。

![[papers/images/li2025r-tac0/page5_fig1.jpeg|700]]

**Fig. 6: Capturing ground truth depths.** 这里有一个很 clever（巧妙）的数据扩增点：因为输入是灰度图，左右半边的观察可以任意拼接。假设有 100 个半圆顶图案，理论上可以组合出 `100 x 100 = 10,000` 个训练样本。这降低了制作大量实体压头的需求。

### C. Depth Reconstruction Model

网络输入是当前接触图像和参考图像的差分：

$$
I_{\text{capture}} - I_{\text{ref}}
$$

模型结构是 two-layer CNN（两层卷积网络）加 two-layer MLP（两层多层感知机）。论文公式 (2)：

$$
\Delta_{\text{pred}} = MLP(CNN(I_{\text{capture}} - I_{\text{ref}}))
$$

损失函数是每个像素 differential depth（差分深度）的均方误差，公式 (3)：

$$
L = \frac{1}{n}\sum_i(\Delta_{\text{pred}, i} - \Delta_{\text{gt}, i})^2
$$

其中 `n` 是像素数量，`\Delta_{\text{gt}}` 是标定数据中的差分深度真值。最后，完整 depth map（深度图）不是单独由网络输出，而是把 predicted differential depth（预测差分深度）加到 reference surface depth（参考曲面深度）上。这样做符合物理结构：未接触时圆弧表面已经有一个已知几何基底，接触只是在这个基底上产生局部形变。

![[papers/images/li2025r-tac0/page5_fig2.jpeg|700]]

**Fig. 7: Depth reconstruction pipeline.** 图中展示了从 sensor image 到 differential image，再到 depth prediction 和 point cloud 的过程。网络第一层卷积 64 channels，kernel size 7；第二层卷积 128 channels，同样 kernel size 7；MLP 先把每像素特征降到 64，再输出 1 个深度值。训练在 NVIDIA RTX4090 上进行 10 epochs，约 2 小时；单帧推理约 3.5 ms，支撑 120 Hz 运行。

## V. Experiments

实验部分不只是展示重建好看，而是围绕三个问题组织：

1. 能不能准确做 curved surface shape reconstruction（曲面形状重建）？
2. 高频率是否真的改善 dynamic tactile task（动态触觉任务）？
3. 圆弧形态是否比平面传感器更适合多角度接触？

### A. Shape Reconstruction and Generalizability

![[papers/images/li2025r-tac0/page6_fig1.jpeg|700]]

**Fig. 8: Shape reconstruction results.** 作者把不同文字/图案压入未见过的传感器，展示相机图像、预测深度、法线和点云。这个图的重点是 qualitative correspondence（定性对应）：输入图案中的边缘、文字和局部形状能在深度与点云中出现。

定量部分使用 mean L1 error（平均 L1 误差）和误差低于 0.1 mm 的比例来衡量：

| 设置 | Mean L1 error | Error < 0.1 mm |
| --- | ---: | ---: |
| 训练传感器 | 0.169 mm | 75.78% |
| 新传感器，直接迁移 | 0.328 mm | 47.76% |
| 新传感器，100 samples fine-tuning | 0.271 mm | 71.32% |

![[papers/images/li2025r-tac0/page6_fig2.jpeg|700]]

**Fig. 9: Quantitative depth error.** 这个结果支持两个结论：第一，R-Tac0 在训练传感器上可以达到亚毫米级深度重建；第二，直接跨传感器迁移可用但有明显误差上升，少量 fine-tuning 能把误差分布拉回不少。作者还指出最大误差常来自制造中微小表面缺陷的位置偏移，这说明跨传感器问题不只是网络泛化，也包括材料和制造一致性。

### B. Slip Detection

滑移实验用来证明 120 Hz 不是参数炫耀，而是动态任务需要。实验中，R-Tac0 安装在 Franka Research 3 robot arm 上；一个带重量的物体从固定高度释放，使 ruler（尺子）以约 2 m/s 初速度滑动。传感器检测到初始接触后的可见变化，就触发机器人施加向下力。作者比较 120、90、60、30 fps，每个帧率 50 次实验。

![[papers/images/li2025r-tac0/page7_fig1.jpeg|700]]

**Fig. 10: Slip detection experiment.** 这个图展示装置和接触过程。评价指标不是分类准确率，而是检测和响应前物体已经滑走多远。平均滑移位移如下：

| Frame rate | Average ruler displacement |
| ---: | ---: |
| 120 fps | 3.1 ± 1.2 cm |
| 90 fps | 3.8 ± 1.3 cm |
| 60 fps | 5.1 ± 2.3 cm |
| 30 fps | 8.2 ± 3.2 cm |

结论很直观：帧率越低，传感器越晚发现滑移，机器人介入前物体已经滑得更远。这个实验支撑了 Introduction 中对 30-60 Hz VBTS 的批评。

### C. Curved Sensor Versus Flat Sensor

为了验证圆弧形态的必要性，作者比较 R-Tac0 和一个 flat tactile sensor（平面触觉传感器）。接触角设置为 -40、-20、0、20、40 度，压入深度为 1 mm 和 2 mm，每个条件 20 次。

![[papers/images/li2025r-tac0/page7_fig2.jpeg|700]]

**Fig. 11: Curved versus flat sensor.** 平面传感器在 ±40 度下因为接触面积不足无法稳定测量；即使在较小角度下，平面结构也更容易受到整体表面变形影响。论文 Table II 的关键数值如下：

| Sensor/depth | -40 deg | -20 deg | 0 deg | 20 deg | 40 deg |
| --- | ---: | ---: | ---: | ---: | ---: |
| Curved, 1 mm | 1.13 ± 0.12 | 1.08 ± 0.10 | 1.07 ± 0.11 | 1.10 ± 0.12 | 1.09 ± 0.09 |
| Flat, 1 mm | N/A | 1.41 ± 0.39 | 0.93 ± 0.32 | 1.36 ± 0.29 | N/A |
| Curved, 2 mm | 2.21 ± 0.14 | 2.08 ± 0.10 | 2.14 ± 0.13 | 2.05 ± 0.07 | 2.12 ± 0.11 |
| Flat, 2 mm | N/A | 3.26 ± 0.45 | 2.16 ± 0.31 | 3.02 ± 0.47 | N/A |

这里 R-Tac0 的优势不是绝对深度误差最小，而是 across contact angles（跨接触角）稳定。对于手指末端传感器，这一点比只在正面压入时准确更重要。

### D. Dynamic Pose Tracking

最后一个实验展示 dynamic pose tracking（动态位姿跟踪）。作者把一个测试球压在传感器曲面上，利用重建出的点云和 Open3D 的 ICP（Iterative Closest Point，迭代最近点）来估计球的位置。

![[papers/images/li2025r-tac0/page7_fig3.jpeg|700]]

**Fig. 12: Dynamic pose tracking.** 这张图证明 R-Tac0 的输出不是只能看作图像分类输入，而是可以转成几何点云，接入常见 3D registration（3D 配准）流程。需要注意的是，论文这里偏演示，没有给出完整位姿误差统计。

## 数据集、基线与指标

| 项目 | 本文做法 |
| --- | --- |
| 训练数据 | 3D 打印半圆顶凸起组件生成接触图像和 depth ground truth；左右组合可扩增样本。 |
| 基线/对比 | Table I 对比曲面 VBTS；实验中对比 flat tactile sensor；跨传感器对比 trained/new/fine-tuned 设置。 |
| 重建指标 | mean L1 depth error、误差低于 0.1 mm 的比例。 |
| 动态任务指标 | slip detection 中机器人响应前 ruler displacement（尺子滑移距离）。 |
| 实时性指标 | 单帧推理约 3.5 ms，传感器运行 120 Hz。 |

## 消融或对比

本文没有严格意义上逐模块 ablation study（消融实验），但有几组功能性对比：

- Fig. 3 对比有无 internal filling gel，说明均匀照明对灰度映射重要。
- Fig. 9 对比训练传感器、新传感器直接迁移和新传感器少量 fine-tuning。
- slip detection 对比不同 frame rate，证明高频采样能减少滑移距离。
- contact-angle 实验对比 curved sensor 和 flat sensor，证明圆弧结构对多角度接触更稳。

## 局限与可追问点

1. 新传感器直接迁移时 mean L1 error 从 0.169 mm 升到 0.328 mm，说明制造差异仍然影响重建。后续可以追问：误差主要来自材料硬度、涂层厚度、相机位置还是光照一致性？
2. 动态位姿跟踪没有系统给出 pose error（位姿误差）和失败案例。对于真实抓取任务，ICP 初始化、接触面积和遮挡都会影响稳定性。
3. R-Tac0 当前主要证明 geometry reconstruction（几何重建）和 slip detection（滑移检测），force perception（力感知）仍是未来工作。
4. 120 Hz 依赖外部计算和 RTX4090 上的训练/推理报告；如果部署到机械手板载计算，需要重新评估延迟、功耗和模型压缩。

## 与库内文献的关系

- [[@yuan2017gelsight]] 是高分辨率视觉触觉的基础路线，R-Tac0 延续“相机看弹性体”的范式，但减少对彩色光照和复杂光度模型的依赖。
- [[@lin2022dtact]] 直接相关：DTact 用 darkness mapping 从变暗程度恢复 3D geometry，R-Tac0 把该思路迁移到圆弧指尖，并使用单通道黑白输入提高频率。
- [[@do2022densetact]] 和 [[@do2023densetact-2]] 是圆弧/半球学习式触觉重建的重要参照；R-Tac0 在 Table I 中主要用频率、成本和 monochrome camera 与它们区分。
- [[@wang2021gelsight-wedge]] 同样关注特殊几何形态的 GelSight 类传感器，可与 R-Tac0 的 rounded fingertip 设计一起比较。

## 阅读时可以重点盯的地方

- 如果关注硬件复现，先读 Fig. 2-Fig. 4，对照材料、层厚、相机、LED 和外壳。
- 如果关注算法，先读公式 (1)-(3) 和 Fig. 5-Fig. 7，理解相机几何、训练数据和差分深度网络。
- 如果关注机器人任务价值，先读 Fig. 10-Fig. 12，看高频、曲面和几何点云分别服务什么下游任务。
