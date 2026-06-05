---
tags:
  - bilingual-reading
source_pdf: "[[papers/pdfs/abad2020visuotactile-review.pdf]]"
paper: "[[@abad2020visuotactile-review]]"
images: "papers/images/abad2020visuotactile-review/"
image_index: "[[papers/images/abad2020visuotactile-review/index.md]]"
created: 2026-06-05
---

# Visuotactile Sensors With Emphasis on GelSight Sensor: A Review

## 核心词汇速查

- visuotactile sensor（视觉触觉传感器）：把 physical contact（物理接触）转换成 image（图像）的触觉传感器。
- tactile image（触觉图像）：包含接触形变、marker movement（标记点运动）或 optical-flow vectors（光流向量）的图像。
- retrographic image（逆向成像/反射形貌图像）：GelSight 中由 reflective coating（反射涂层）显示出来的接触表面 relief geometry（浮雕几何）。
- pedobarograph（足底压力记录仪）：早期通过光学方式记录人站立或行走时足底压力分布的设备，是本文追溯的 visuotactile ancestor（祖先设备）。
- Total Internal Reflection / TIR（全内反射）：很多早期光学触觉传感器利用压力改变透明板内光的传播条件，从而显示接触区域。
- GelSight（凝胶视觉触觉传感器）：高分辨率、类 pedobarograph 的小型 visuotactile sensor，能恢复微几何、纹理、形状，也可结合 markers 推断 force / slip。
- permanent markers（永久标记点）：印在反射膜或嵌入弹性体中的点/三角形，用于估计 shear force（剪切力）、normal force（法向力）和 slip（滑移）。
- switchable UV markers（可切换紫外标记）：只有 UV light（紫外光）打开时才可见的 markers，用来缓解“标记点有用但会遮挡纹理”的矛盾。

## 摘要

这篇 review paper（综述论文）关心 vision + touch（视觉 + 触觉）的交叉传感器，也就是作者称为 visuotactile 的传感器。它的基本定义是：物理接触会调制 sensor 内部可见光，进而产生可被相机记录和算法处理的 tactile image。

论文的主线有两层：

- 历史层：从 pedobarograph、optical touch sensor、finger-shaped optical tactile sensor、GelForce、TACTIP 等早期路线，过渡到 GelSight；
- 工程层：重点拆解 GelSight 的 architecture（架构）、hardware（硬件）、software（软件）和 applications（应用）。

对你读 GelSight / DTact / 9DTact 有用的地方在于：它把 GelSight 放进更长的 optical tactile sensing lineage（光学触觉传感谱系）里，不只是把 GelSight 当成一个孤立传感器。

## I. Introduction

作者先从 human sensation and perception（人类感觉与知觉）讲起：人通过感受器把外部刺激转成神经信号，再通过知觉和学习组织这些信号。机器人里的 sensors / algorithms / datasets 可以类比为 sensing / perception / learning / memory。

本文把 sight（视觉）和 touch（触觉）的组合称为 visuotactile。作者认为理想的 visuotactile sensor 像一个 flexible mirror（柔性镜子）：既有接近 human eye（人眼）的空间分辨率，又有接近 human skin（人类皮肤）的敏感性。

![[papers/images/abad2020visuotactile-review/page1_fig1.jpeg|700]]

Figure 1 是 optical pedobarograph（光学足底压力记录仪），用于记录足底压力分布。作者把它作为 visuotactile sensor 的早期源头，因为它同样是“接触压力改变光学图案，再记录为图像”。

## II. Visuotactile Sensors

### 早期 optical / pedobarograph-like sensors

1950s-1960s 的 pedobarograph 主要不是为机器人手指服务，而是用于记录站立或行走的人类足底压力。它通常用 elastic foil / plastic foam（弹性薄膜/塑料泡沫）覆盖透明板，侧边光在透明板中通过 Total Internal Reflection（全内反射）传播；脚压上去后，局部全内反射条件改变，形成压力图案。

![[papers/images/abad2020visuotactile-review/page2_fig1.jpeg|700]]

Figure 2 展示 1960s 的三个方向：photoelastic transducer（光弹性换能器）、remote manipulator 的 visuotactile sensing system，以及 reflected grid pattern（反射网格图案）。这些早期方案已经出现了几个后来一直存在的元素：柔性材料、反射图案、相机/电视系统和图像分析。

![[papers/images/abad2020visuotactile-review/page2_fig2.jpeg|620]]
![[papers/images/abad2020visuotactile-review/page2_fig3.jpeg|620]]

Figure 3 和 Figure 4 是 1984 年左右的 optical touch sensor / planar optical touch sensor。阅读重点是：这些设备已经能把触觉变成高分辨率图像，但体积、结构和计算方式仍更接近实验装置。

### 平面传感器到手指形态

随着 CCD camera（电荷耦合器件相机）和 optical fiber（光纤）的使用，平面光学触觉传感器逐渐能捕捉 3D object profile（物体轮廓）。后来研究开始把这类传感器做成 fingertip-shaped（指尖形态），以便装到 robotic gripper（机器人夹爪）上。

![[papers/images/abad2020visuotactile-review/page3_fig1.jpeg|700]]
![[papers/images/abad2020visuotactile-review/page3_fig2.jpeg|700]]

Figure 5 和 Figure 6 分别对应 flat-plate sensor 和 Begej 的 planar / finger-shaped optical tactile sensors。它们仍然依赖 TIR 或灰度图像来反映接触力/压力分布。

![[papers/images/abad2020visuotactile-review/page4_fig1.jpeg|700]]

Figure 7 是 optical waveguide（光波导）路线的 finger-shaped sensor。这个阶段的关键变化是 form factor（外形尺寸）开始向真实手指靠拢，而不仅是平板台架。

### 三轴力、膜面 marker 和内嵌 marker

早期系统不只是看 normal pressure（法向压力），也逐渐尝试 three-axis force（3 轴力）和 surface deformation（表面形变）。Ohka 等人的三轴 visuotactile sensor 使用 feeler arrays（触杆阵列）和 pyramidal projections（金字塔突起）来推断 3D force。

![[papers/images/abad2020visuotactile-review/page4_fig2.jpeg|700]]

Figure 8 是典型的 force-aware optical tactile sensor：它不是直接恢复微几何，而是把局部接触区域变化映射到三轴力。

![[papers/images/abad2020visuotactile-review/page4_fig3.jpeg|620]]

Figure 9 是 human-fingertip-like visuotactile sensor，使用 deformable membrane（可形变膜）和 skin markers（皮肤标记点）。它已经非常接近后续 GelSight marker-flow 的思想：看 marker 怎么动，就能推断膜面和接触力的变化。

![[papers/images/abad2020visuotactile-review/page5_fig1.jpeg|700]]
![[papers/images/abad2020visuotactile-review/page5_fig2.jpeg|700]]

GelForce 的重点是把 red / blue markers（红/蓝标记）放入透明柔性体不同深度，通过 marker movement 推断 3D vector distribution（3D 向量分布）。Figure 10 / 11 展示了 GelForce 从实验装置到 finger-shaped sensor 的演化，以及后来加入 thermo-sensitive paint（热敏涂层）测温的方向。

![[papers/images/abad2020visuotactile-review/page5_fig3.jpeg|620]]

Figure 12 展示了 2019 年附近两类 internal marker（内嵌标记）策略：fluorescent green spherical markers（荧光绿色球形标记）和 semi-transparent dye markers（半透明染料标记）。这条路线和 GelSight 的反射膜路线不同：它把可见信息埋进材料内部，再用视觉算法推断力和形变。

![[papers/images/abad2020visuotactile-review/page5_fig4.jpeg|700]]
![[papers/images/abad2020visuotactile-review/page6_fig1.jpeg|620]]

TACTIP 使用 biologically inspired artificial papillae（仿生人工乳突）来追踪内部 pin / marker 的运动；event-based hemispherical sensor 则用 event-based camera（事件相机）捕捉快速接触现象。这些系统说明 visuotactile 并不等于 GelSight，而是一整类“用图像读触觉”的传感器族。

## III. The GelSight Sensor

作者把 GelSight 定义为 miniature high-resolution pedobarograph-like visuotactile sensor（小型高分辨率类足底压力图像触觉传感器）。Johnson and Adelson 在 2009 年最初把它称为 retrographic sensor / 2.5D scanner，而不是传统 tactile sensor。

GelSight 的核心机制是：clear elastomeric slab（透明弹性体）一侧有 reflective coating（反射涂层）；物体压到涂层上，涂层表面形成物体的 relief geometry（浮雕几何）；相机从背面拍摄这个 relief image，再通过 photometric stereo（光度立体）等算法恢复 microgeometry（微几何）和 surface texture（表面纹理）。

![[papers/images/abad2020visuotactile-review/page6_fig2.jpeg|620]]
![[papers/images/abad2020visuotactile-review/page6_fig3.jpeg|620]]

Figure 15 是 GelSight 总结构，Figure 16 是 retrographic sensor 的直观例子。读图时要注意：GelSight 不是拍被接触物体本身，而是拍被物体“压出来”的反射膜形状。因此它能过滤掉物体颜色、光泽等外观因素，保留 tactile texture / shape。

## IV. GelSight Sensor Hardware

论文把 GelSight 硬件归纳成四个基本组件：

1. clear elastomeric slab with reflective coating（一侧带反射涂层的透明弹性体）；
2. transparent glass or acrylic plate support（透明玻璃/亚克力支撑板）；
3. uniform and controlled lighting（均匀可控照明，通常是 LEDs）；
4. camera / webcam（背面相机）。

![[papers/images/abad2020visuotactile-review/page7_fig1.jpeg|700]]

Figure 17 是全文最有用的一张综述图：它按时间列出 GelSight family（GelSight 家族）从 bulky cubic box（大型立方盒）、bench / portable / desktop configuration，到 finger / fingertip GelSight，再到 GelSlim 和 GelSlim 2.0 的演化。对后续读 DTact / 9DTact 来说，这张图可以当作 GelSight-style sensor 发展基线。

### A. Retrographic sensor

Retrographic sensor 是 GelSight 的第一组件，本质是 clear elastomer + reflective coating。材料选择要考虑 transparency（透明度）、robustness（耐用性）、hardness（硬度）、stretchability（可拉伸性）和 fabrication complexity（制造复杂度）。

作者提到实验室制备 elastomer 可能需要长时间 curing（固化）、质量一致性控制和 vacuum degassing（真空脱泡）。这也是 GelSight-style sensors 做起来比 DTact / 9DTact 更麻烦的原因之一。

![[papers/images/abad2020visuotactile-review/page8_fig1.jpeg|620]]

Figure 18 展示低成本复现路线：commercial silicone cosmetic sponge（商业硅胶化妆海绵）可以作为 GelSight-like sensor 的 elastomer base。这个思路和你前面关注的“低成本视觉触觉传感器”是一条线：牺牲部分可控性，换取可获得性和易制造性。

Reflective coating（反射涂层）像 flexible mirror（柔性镜子）。它要能贴在硅胶上、薄而均匀、受压不裂。作者提醒普通 COTS spray paint 不适合，因为容易在硅胶上开裂或附着不好。

![[papers/images/abad2020visuotactile-review/page8_fig2.jpeg|700]]

Figure 19 对比 semi-specular coating（半镜面涂层）和 matte coating（哑光涂层）：前者更能捕捉 surface normal 的 microgeometry，后者更适合 general shape measurement（整体形状测量）。这和 GelSight 原论文里关于涂层 trade-off 的说法一致。

### Markers: 有用但会干扰

Permanent markers 可以用来估计 normal force、shear force 和 slip。问题是 markers 也可能成为 image noise（图像噪声）：在 texture recognition（纹理识别）、object classification（物体分类）或 height map reconstruction（高度图重建）中，过密或过大的 marker 会遮挡细节。

因此作者把 GelSight 看成两类使用模式：

- without markers：更适合 microgeometry、shape、texture、object recognition；
- with markers：更适合 force、shear、slip、hardness estimation。

![[papers/images/abad2020visuotactile-review/page9_fig1.jpeg|620]]

Figure 20 是作者自己提出的 switchable UV markers：UV light on 时 marker 可见，UV light off 时 marker 隐去。这个设计试图解决上面的矛盾：需要测力/运动时打开 marker；需要看纹理/形状时关闭 marker。

### B-D. Support plate, Lighting, Camera

Transparent support plate（透明支撑板）既支撑 elastomer，又常常作为 light waveguide（导光板）。早期 GelSight 用 glass plate，后来的 fingertip GelSight / GelSlim 常用 acrylic plate。

Lighting 是 GelSight 的关键硬件约束。Photometric stereo 需要不同方向的照明。常见做法有两种：

- 依次打开不同位置 LED，多次拍摄同一接触场景；
- 同时打开多色 LED，用 RGB channels 分离不同方向的照明。

Camera 则从 DSLR / macro lens 逐渐发展到 Logitech webcam、Raspberry Pi Spy Camera 等紧凑低成本设备。硬件演化的总体方向是从 metrology setup（计量级台架）走向 compact robotic fingertip（紧凑机器人指尖）。

## V. GelSight Sensor Software

作者把 GelSight 图像分成 retrographic image 和 tactile image。前者主要用于 microgeometry、shape measurement、3D reconstruction、object recognition；后者是在 retrographic image 上加入 markers，用于 shear / normal force / slip。

软件路线包括：

- photometric stereo：从反射膜明暗恢复 3D geometry；
- Local Binary Patterns / LBP：用于 surface texture recognition；
- SVM：用于 lump detection 等分类任务；
- BRISK + RANSAC：用于 tactile mapping / localization；
- Lucas-Kanade optical flow：用于 marker motion analysis；
- CNN / RNN：用于 object recognition、classification、cross-modal analysis 等深度学习任务。

![[papers/images/abad2020visuotactile-review/page10_fig1.jpeg|700]]

Figure 21 展示 UV markers 的 optical flow tracking。这里 marker direction 被用于判断 fingertip twisting（指尖扭转）的逆时针/顺时针方向。它对应本文的未来方向：marker 可以按需显隐，软件则根据任务在 texture/geometry 和 force/slip 之间切换。

## VI. Discussion, Application, and Future Development

作者认为 GelSight 是接近理想的 visuotactile sensor：它既有高空间分辨率，又有较高触觉敏感性，在 haptics、robotics 和 computer vision 中都有应用价值。

但从阅读角度更重要的是作者提出的冲突：

- GelSight without markers 能保留更干净的 texture / microgeometry；
- GelSight with markers 能更好做 force / shear / slip；
- UV switchable markers 可能把两者统一起来；
- 加 thermo-sensitive paint（热敏涂层）后，还有可能加入 temperature（温度）维度。

因此这篇综述最后的方向是 multi-modal / unified visuotactile sensor（多模态统一视觉触觉传感器）：在一个小型传感器里同时读取 force、vibration、temperature、geometry 和 visual texture。

## 和 GelSight / DTact / 9DTact 的阅读关系

- 读 [[@yuan2017gelsight]] 时，这篇综述能帮助你定位 GelSight 不是孤例，而是 optical tactile sensor 发展到高分辨率几何测量后的代表。
- 读 [[@lin2022dtact]] 时，这篇综述能解释为什么 DTact 要降低 photometric stereo 和复杂涂层/光路的门槛。
- 读 [[@lin20239dtact]] 时，这篇综述中的 marker trade-off 很有帮助：9DTact 不用 marker 做 6D force，而是依赖 gel flow / dense deformation representation，正是在回应 GelSight-style marker 的遮挡问题。

## 我的阅读笔记

