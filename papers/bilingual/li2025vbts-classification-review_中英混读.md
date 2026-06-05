---
tags:
  - bilingual-reading
source_pdf: "[[papers/pdfs/li2025vbts-classification-review.pdf]]"
paper: "[[@li2025vbts-classification-review]]"
images: "papers/images/li2025vbts-classification-review/"
image_index: "[[papers/images/li2025vbts-classification-review/index.md]]"
created: 2026-06-05
---

# Classification of Vision-Based Tactile Sensors: A Review

## 核心词汇速查

- Vision-Based Tactile Sensor / VBTS（视觉触觉传感器）：用 camera module（相机模块）观察 contact module（接触模块）在受力后的可见变化，从而获得 tactile information（触觉信息）。
- transduction principle（换能/转导原则）：物理接触如何被转换成 tactile image（触觉图像）。本文用它作为分类主轴。
- tactile image（触觉图像）：包含 marker 位移、marker 密度变化、反射层明暗变化或透明层接触斑的图像。
- Marker-Based Transduction / MBT（基于标记点的转导）：通过 marker displacement（标记点位移）或 marker density（标记点密度）解释接触。
- Intensity-Based Transduction / IBT（基于亮度的转导）：通过 pixel intensity variation（像素强度变化）解释接触。
- Simple Marker-Based / SMB（简单标记型）：在柔性表面或内部布置简单 markers，通过点位移估计形变、力或接触。
- Morphological Marker-Based / MMB（形态标记型）：marker 本身具有仿生或几何形态，例如 TacTip 的 pins / papillae（针状/乳突结构）。
- Reflective Layer-Based / RLB（反射层型）：通过反射层、半透明层或吸收层的明暗变化读取接触。GelSight、DIGIT、GelSlim、DTact、9DTact 都适合从这条线理解。
- Transparent Layer-Based / TLB（透明层型）：通过透明层中的接触区域、全内反射或背景成像变化读取接触。
- combined mechanism（组合机制）：一个传感器同时使用两类或多类转导机制，例如 SMB+RLB 或 SMB+TLB。

## 摘要

这篇 review paper（综述论文）试图解决一个分类问题：vision-based tactile sensors（视觉触觉传感器）已经发展出很多硬件形态，旧的“marker-based / reflection-based”说法不再足够精确。作者提出以 contact-to-image transduction（接触到图像的转导过程）作为主线，把 VBTS 分成两大类：Marker-Based Transduction Principle 和 Intensity-Based Transduction Principle。

进一步地，Marker-Based Transduction 被分成 Simple Marker-Based（SMB）和 Morphological Marker-Based（MMB）；Intensity-Based Transduction 被分成 Reflective Layer-Based（RLB）和 Transparent Layer-Based（TLB）。论文还讨论了组合型机制和常见数据处理方法，最后总结当前挑战和未来方向。

对你当前库里的 GelSight、DTact、9DTact 来说，这篇的价值是：它给了一个比“是不是 GelSight-like”更细的坐标系。以后读新传感器时，可以先问它的 tactile image 到底来自 marker motion，还是 pixel intensity variation，或者两者组合。

## I. Introduction

传统电子触觉阵列，例如 piezoelectric（压电）、piezoresistive（压阻）和 capacitance（电容）传感器，通常有 high temporal resolution（高时间分辨率）和 thin profile（薄型结构）。但它们在 high spatial resolution（高空间分辨率）、复杂表面几何、纹理细节和可定制性方面经常受限。

VBTS 的吸引力在于：它用相机把接触形变变成图像，图像天然具有高空间分辨率，也便于使用 computer vision（计算机视觉）和 deep learning（深度学习）方法。作者把 VBTS 的典型结构概括为三个模块：

- soft-skinned contact module（软皮肤接触模块）；
- illumination module（照明模块）；
- camera module（相机模块）。

真正决定传感器类别的是 contact module 如何把外部接触转成可见模式。这个转化过程就是本文说的 transduction principle。

![[papers/images/li2025vbts-classification-review/fig0.png|700]]

这张总览图对应全文核心：VBTS 不是只按外观或材料分类，而是按“接触如何进入图像”分类。左侧是 marker-based 路线，右侧是 intensity-based 路线。

## II. Related Works

已有综述通常从硬件组件、制造工艺、应用场景或 GelSight family（GelSight 家族）出发。例如你库里的 [[@abad2020visuotactile-review]] 更偏 GelSight 的历史与硬件演化，适合理解 GelSight 为什么能恢复 microgeometry（微几何）和 texture（纹理）。

这篇论文认为，仅按 GelSight / TacTip / DIGIT 这类名称或代表性结构分类，会漏掉两个问题：

- 很多新传感器是 hybrid design（混合设计），同时使用 marker 与亮度变化；
- 相似外形不一定代表相同 sensing principle（感知原则），相同 principle 也可能有完全不同的材料和相机布置。

因此作者把重点从“传感器长什么样”转到“图像信号是如何产生的”。

## III. Basic Classification Scheme for Vision-Based Tactile Sensors

### A. Defining Vision-Based Tactile Sensing

作者把 VBTS 定义为一类通过 visual signal（视觉信号）获得 tactile information（触觉信息）的传感器。这里的 visual signal 不是外部 RGB 场景，而是相机在传感器内部或背后看到的 tactile image。

这个定义有一个重要边界：如果相机只是看外部物体，没有接触模块把触觉转成图像，就不能算本文意义上的 VBTS。反过来，只要接触过程被转换成可成像的 marker motion、明暗变化或接触斑，即使结构和 GelSight 很不同，也可以放入 VBTS。

### B. Marker-Based Transduction

Marker-Based Transduction（基于标记点的转导）把接触信息编码到 marker pattern（标记图案）的变化中。算法通常追踪 markers 的位置、位移、稀疏/密集变化或形态变化。

SMB（Simple Marker-Based）使用相对简单的点、线、彩色块或网格。典型例子包括 ChromaTouch、GelForce、Tac3D、DelTact 和 Soft-bubble。它们通常依赖 marker tracking（标记点追踪）、optical flow（光流）或 learned mapping（学习映射）来估计接触位置、力、剪切或形变。

MMB（Morphological Marker-Based）中的 marker 本身具有形态结构，不只是平面上的小点。TacTip、MultiTip、DigiTac、TacWhiskers、BioTacTip 和 NeuroTac 属于这一侧。它们把仿生 papillae（乳突）、pins（针状结构）或 whiskers（须状结构）的运动作为可视触觉信号。

MMB 的好处是结构能引入机械先验，例如放大局部形变、增强接触方向信息或模仿生物皮肤。代价是制造和建模更复杂，marker 形态也可能限制空间分辨率。

### C. Intensity-Based Transduction

Intensity-Based Transduction（基于亮度的转导）不以 marker 运动为核心，而是把接触扰动映射成 pixel intensity variation（像素强度变化）。

RLB（Reflective Layer-Based）依赖反射层、半透明层、吸收层或涂层的明暗变化。GelSight、DIGIT、GelSlim、GelTip、DenseTact、Insight、DTact 和 9DTact 都在这个谱系中。它们通常适合恢复 geometry（几何）、texture（纹理）、contact shape（接触形状）或 force（力）。

TLB（Transparent Layer-Based）依赖透明层中的接触区域变化、Total Internal Reflection / TIR（全内反射）或从透明材料后方看到的图像变化。TIRgel 和 ViTac 是论文列出的代表。

![[papers/images/li2025vbts-classification-review/fig2.png|700]]

Fig. 2 用相机视角解释四类机制：SMB / MMB 看 marker 怎么动或怎么变密，RLB / TLB 看图像亮度如何因接触改变。读 DTact 时尤其有用：DTact 的核心不是追 marker，而是利用半透明层受压后变暗的 intensity difference（强度差分）。

![[papers/images/li2025vbts-classification-review/table1.png|700]]

Table I 是硬件层面的对照表。它把 contact module、illumination、camera view 和典型结构放在同一张表里，适合用来判断一篇新论文到底改的是材料、光路、相机位置，还是换能机制。

## IV. Combined Classification Scheme

现代 VBTS 很少完全属于一个干净的单一类型。作者因此引入 combined classification scheme（组合分类方案），把一个传感器同时归入多个机制。

常见组合包括：

- SMB+RLB：例如 GelStereo、F-Touch、GelSlim 3.0、UVtac。它们既有反射层/亮度变化，又使用 markers 做力、剪切或运动估计。
- MMB+TLB：例如带 whiskers 的 FingerVision。形态结构提供触觉线索，透明层又允许相机观察外部或内部变化。
- SMB+TLB：例如 ViTacTip、MagicTac、FingerVision、SpecTac。它们把简单 marker 与透明层/外部视觉结合。
- RLB+TLB：例如 STS、StereoTac、VisTac。它们同时利用反射层和透明层相关的图像变化。

![[papers/images/li2025vbts-classification-review/fig1.png|700]]

Fig. 1 是全文最适合反复看的图。它把 representative sensors（代表性传感器）按四类基础机制和组合机制组织起来。你可以把它当作阅读新传感器论文时的导航图：先定位它在图里的区域，再看它是否通过材料、照明、相机或算法做了增量。

对你现有库的几篇：

- [[@yuan2017gelsight]]：典型 RLB，依赖反射膜和 photometric stereo（光度立体）恢复高分辨率几何。
- [[@lin2022dtact]]：RLB 的低成本变体，核心是半透明层压缩后变暗。
- [[@lin20239dtact]]：仍在 RLB 逻辑内，同时把硬件做得更紧凑，并加入 6D force estimation（六维力估计）。
- [[@abad2020visuotactile-review]]：更偏 GelSight 发展史，这篇则提供更广义的 VBTS 分类框架。

## V. Data Processing Methods

论文把数据处理方法按输入信号类型来理解，而不是简单列算法名。

Marker-based 数据常见输入是 marker locations、marker displacement fields（位移场）和 optical flow vectors（光流向量）。处理方法包括：

- feature detection / marker tracking（特征检测/标记追踪）；
- Lucas-Kanade optical flow（Lucas-Kanade 光流）；
- dense optical flow（稠密光流）；
- regression model（回归模型）或 neural network（神经网络）把位移映射到力、位姿或接触状态。

Intensity-based 数据常见输入是 grayscale image（灰度图）、RGB image、difference image（差分图）、height map（高度图）或 contact mask（接触区域掩码）。处理方法包括：

- photometric stereo（光度立体），典型于 GelSight；
- intensity-to-depth mapping（强度到深度映射），典型于 DTact；
- image segmentation（图像分割）和 shape reconstruction（形状重建）；
- CNN / Transformer 等学习模型，用于 object recognition、force estimation、pose estimation 或 tactile representation learning。

![[papers/images/li2025vbts-classification-review/table2.png|700]]

Table II 的价值在于把 sensing principle、input data 和 algorithm requirements 放在一起看。比如 RLB 往往有高分辨率几何优势，但可能对照明、涂层、标定和材料一致性更敏感；marker-based 方法的力和剪切估计直观，但 markers 可能遮挡纹理或降低几何细节。

## VI. Challenges

作者总结的挑战可以归成几类：

### 1. Resolution, sensitivity, range 的权衡

高空间分辨率不一定带来高 force range（力量范围）或高 durability（耐用性）。更软的材料可能更敏感，但也更容易损伤、老化或出现 hysteresis（迟滞）。

### 2. Fabrication and repeatability

很多 VBTS 依赖手工浇筑、涂层、贴合或 3D 打印。即使论文中的单个样机表现很好，跨批次制造的一致性仍然是实际部署难点。

### 3. Calibration and generalization

RLB / GelSight-like 传感器常需要 lighting calibration（照明标定）、geometry calibration（几何标定）或 force calibration（力标定）。学习式方法还要面对跨传感器、跨材料、跨任务的 generalization（泛化）问题。

### 4. Multimodal and hybrid sensing

新传感器越来越多地把视觉触觉与力、温度、振动、外部视觉或 proprioception（本体感觉）结合。分类框架能帮助描述组合，但真正的 benchmark 还需要跨模态任务指标。

### 5. Standardization

不同论文使用不同测试物体、接触方式、力范围和指标。缺少统一 benchmark 时，很难判断一个新设计是整体更好，还是只在某个局部任务上更合适。

## VII. Conclusions

这篇论文的结论不是提出一个新传感器，而是给 VBTS 研究提供更稳的分类语言。它建议先按 transduction principle 分类，再看硬件、材料、光路和算法。

对后续阅读来说，我会把这篇当作 taxonomy reference（分类参考）：

- 读 GelSight / DIGIT / GelSlim / DTact / 9DTact 时，优先放在 RLB 线索下比较；
- 读 TacTip / DigiTac / NeuroTac 时，优先放在 MMB 线索下比较；
- 读 FingerVision / ViTac / SpecTac 等带外部视觉或透明层的设计时，重点看它是否是 TLB 或组合机制；
- 读带 markers 的 GelSight-like 传感器时，不要简单归成 GelSight，要看它是否属于 SMB+RLB。

## 读这篇时可以追的问题

- DTact 和 9DTact 是否可以看作 GelSight RLB 路线的低成本、低标定压力分支？
- Marker-based 方法在 force / shear / slip 上的直观优势，是否足以抵消它对 texture / geometry 的遮挡？
- 组合机制会不会逐渐成为主流，使得“单一类型”的分类只适合入门？
- 如果以后 foundation tactile model（触觉基础模型）变成熟，分类是否还应加入 representation / data regime 维度？

## 与当前库的连接

- [[@abad2020visuotactile-review]]：GelSight 历史和硬件演化。
- [[@yuan2017gelsight]]：高分辨率几何与力估计的 GelSight 代表。
- [[@lin2022dtact]]：从 darkness / intensity difference 直接恢复 3D geometry。
- [[@lin20239dtact]]：紧凑化 DTact，并把 tactile image 用于 6D force estimation。
