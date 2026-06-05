---
tags:
  - bilingual-reading
source_pdf: "[[papers/pdfs/yuan2017gelsight.pdf]]"
paper: "[[@yuan2017gelsight]]"
images: "papers/images/yuan2017gelsight/"
image_index: "[[papers/images/yuan2017gelsight/index.md]]"
created: 2026-06-05
---

# GelSight: High-Resolution Robot Tactile Sensors for Estimating Geometry and Force

## 核心词汇速查

- GelSight（凝胶视觉触觉传感器）：用相机观察软弹性体表面的形变，把 touch（触觉）转成 image（图像）来恢复几何、力和滑移信息。
- vision-based optical tactile sensor（视觉式光学触觉传感器）：核心传感器不是压力阵列，而是 deformable medium（可形变介质）+ camera（相机）+ illumination（照明）。
- elastomer（弹性体）：与物体接触的软材料。它需要透明、柔软、有足够拉伸性，并能把接触几何“复制”到表面。
- reflective membrane（反射膜）：覆盖在弹性体表面的薄涂层，使相机看到的是膜面的 shading（明暗）而不是物体自身外观。
- photometric stereo（光度立体）：从不同照明方向下的图像估计 surface normal（表面法向），再恢复 height map（高度图）。
- lookup table（查找表）：把 RGB intensity（颜色/亮度）映射到局部几何梯度的标定表。
- marker displacement field（标记点位移场）：黑色标记点随弹性体横向运动形成的向量场，用于估计 force（力）、torque（力矩）和 slip（滑移）。
- incipient slip（将要滑移）：整体滑移前的局部滑移状态，通常从接触边缘区域的位移不均匀性判断。
- viscoelasticity（粘弹性）：弹性体加载和卸载曲线不同，导致力-形变关系带有滞后。

## 摘要

这篇论文更像 GelSight 系列在 2017 年的 review + engineering report（综述式工程报告）：它不是只提出一个单点算法，而是系统说明 GelSight 为什么有用、怎么测 3D geometry、怎么推断 force / slip、传感器材料和硬件怎么选，以及机器人手指版本如何制造。

核心立场是：传统 tactile sensors 往往主要测 contact force（接触力）或 pressure distribution（压力分布），但机器人要做精细操作时，还需要 high-resolution geometry（高分辨率几何）、texture（纹理）、material properties（材料性质）和 slip cues（滑移线索）。GelSight 的路线是让软表面真实变形，然后用相机把这种变形读出来。

## 1. Introduction

作者把问题放在 “what kind of tactile signal is needed for robots”（机器人到底需要什么触觉信号）上。已有压力阵列能告诉机器人哪里被碰到、力大概多大，但它们通常无法像人手一样同时获得 shape（形状）、texture（纹理）、roughness（粗糙度）、friction（摩擦）和 compliance（柔顺性）。

GelSight 的答案是：geometry sensing（几何感知）和 force sensing（力感知）同等重要。机器人如果能看到接触表面的局部 3D 形状，就能更好地识别材料、定位物体、判断插入姿态和检测滑移。

这也是它和后续 DTact / 9DTact 的关系：GelSight 是高分辨率、强物理建模的经典路线；后续低成本传感器很多是在降低 GelSight-style hardware 的制造门槛。

## 2. Related Work

视觉触觉传感器的共同结构是 deformable body（可形变体）和 camera（相机）。物体压到软材料后，相机观察某种 visual cue（视觉线索），比如预印图案的变形、反光变化、内部液体反射变化等。

GelSight 的差异在于它把触觉问题转成 surface metrology（表面计量）问题：相机不是看物体表面本身，而是看弹性体上的 reflective membrane。这样可以在一定程度上摆脱被接触物体的颜色、材质、反光等外观差异，直接获得与接触几何有关的膜面形变。

## 3. Principle of GelSight

### 3.1 Overview

GelSight 的基本结构是 transparent elastomer（透明弹性体）+ reflective coating membrane（反射涂层膜）+ controlled illumination（受控照明）+ camera（相机）。当物体压入弹性体，反射膜会变形成物体表面的 relief replica（浮雕复制）。相机从背面拍摄这层“复制出来的表面”。

![[papers/images/yuan2017gelsight/page4_fig1.png|700]]

这张 Oreo 图是 GelSight 最直观的原理图：真实饼干压到弹性体上，膜面出现饼干纹理；相机看到的是膜面明暗，算法再把它恢复成 3D shape（3D 形状）。注意这里恢复的是接触区域的微小几何，而不是普通 RGB 相机看到的物体外观。

![[papers/images/yuan2017gelsight/page5_fig1.png|500]]
![[papers/images/yuan2017gelsight/page5_fig2.png|500]]
![[papers/images/yuan2017gelsight/page5_fig3.png|500]]

Figure 2 展示早期桌面版结构：LEDs 从不同方向照亮膜面，相机在下方拍摄。Photometric stereo（光度立体）要求每个像素的 shading 与 surface normal（表面法向）有关。高精度配置下空间分辨率可到 1-2 microns；机器人手指这种紧凑版本通常在 30-100 microns。

### 3.2 Geometry, Force and Slip

GelSight “直接测”的是 deformation（形变）。其中 vertical deformation（垂直形变）主要对应几何高度；lateral deformation（横向形变）可以通过 marker motion（标记点运动）来观察，进而推断 force（力）和 slip（滑移）。

![[papers/images/yuan2017gelsight/page6_fig1.png|700]]

Figure 3 解释 marker 的作用：在弹性体和反射膜之间印黑点，接触时这些点会随膜面横向移动。Normal force（法向力）会让 marker 从接触中心向外扩散；shear force（剪切力）会让 marker 大体沿剪切方向移动；in-plane torque（平面内转矩）会形成旋转式位移场。

这个位移场不是严格线性的全局传感器读数，但在接触几何不变时，marker motion magnitude（标记点运动幅值）大致与力/力矩大小相关。

### 3.3 Material

弹性体材料需要在几件事之间权衡：透明度、柔软度、拉伸性、耐久性和制造复杂度。作者提到常用 Shore A 5-20 左右的材料；对 moderate contact perception（中等接触感知）和 robotic manipulation（机器人操作），某些 fingertip GelSight 的最小可感知力多数小于 0.05 N。

| Contact Surface Type | Rigid 30 mm^2 | Rigid Flat (>2 cm^2) | Soft 30 mm^2 | Soft Flat (>2 cm^2) |
| --- | ---: | ---: | ---: | ---: |
| Shape measurement | <0.05 N | <0.05 N | <0.05 N | 0.08 N |
| Marker measurement | <0.05 N | <0.05 N | <0.05 N | <0.05 N |

Reflective coating（反射涂层）同样关键。半镜面涂层对小曲率变化很敏感，适合看细节；matte coating（哑光涂层）更适合准确测整体形状。涂层必须 thin / smooth / uniform（薄、平滑、均匀），否则 tactile image 会被膜面自身噪声污染。

![[papers/images/yuan2017gelsight/page7_fig1.png|700]]

Figure 4 显示不同涂层在球压入和侧向照明下的图像差异。读这张图时要关注两点：一是图像是否能清楚反映曲率变化；二是涂层本身是否带来颗粒、亮斑或非均匀反射。

### 3.4 Algorithm for Measuring Shape

作者把传感器表面建模为 height function（高度函数）：

$$
z = f(x,y)
$$

局部 surface normal 可以由梯度 $p=\partial f/\partial x$、$q=\partial f/\partial y$ 表示。单个光源下，像素强度可写成：

$$
I(x,y)=R(p,q)
$$

RGB 多方向照明下，$I_1,I_2,I_3$ 分别对应不同方向的 shading。实际的 $R$ 是非线性的，因此 GelSight 不是直接解析求解，而是通过 calibration（标定）建立 lookup table，把 observed intensity（观测亮度）反查为 geometry gradient（几何梯度）。

拿到 $p,q$ 后，再把法向积分成 height map。文中给出一种 Poisson equation（泊松方程）形式：

$$
\nabla^2 f = g,\quad g=\frac{\partial p}{\partial x}+\frac{\partial q}{\partial y}
$$

这里的阅读重点是：GelSight 把“相机图像”转换成“局部法向”，再转换成“高度图”。后续 DTact / 9DTact 则尝试用更简单的光学现象绕开复杂 RGB 光度立体。

### 3.5 Marker Motion, Calibration and Slip

Marker detection 的流程是：先记录无接触的 initial frame（初始帧），低通滤波得到背景；接触时用当前帧减去背景，分割出黑色 marker 区域并计算 centroid（质心）。前后帧质心的位移就是 marker motion。

![[papers/images/yuan2017gelsight/page9_fig1.png|300]]
![[papers/images/yuan2017gelsight/page9_fig3.png|300]]
![[papers/images/yuan2017gelsight/page9_fig5.png|300]]

上面三张分别对应 Figure 5 里的 initial marker image、contact image 和 threshold mask。完整的中间过程在图片索引里。

![[papers/images/yuan2017gelsight/page9_fig6.png|700]]

Shape calibration 使用已知直径的小球或球阵列压到传感器上。球面几何已知，所以每个像素位置对应的 surface normal 也可推算出来。这样就能把 RGB intensity 和 local gradient 的关系填入 lookup table。作者也强调，每个 GelSight 传感器装配略有差异，因此测形状前必须做 calibration。

![[papers/images/yuan2017gelsight/page10_fig1.png|700]]

Figure 7 展示 force-deformation curves。法向加载时，力与压入深度近似线性，但加载/卸载曲线不同，这是 viscoelasticity（粘弹性）导致的滞后。剪切加载时，shear force 初期随位移增长，随后进入 partial slip / slip 后增长变慢或趋于稳定。marker displacement 与整体 shear force 仍有较清楚的相关性。

![[papers/images/yuan2017gelsight/page11_fig1.png|700]]

Translational slip（平移滑移）通常从接触边缘先开始。Figure 8 里 marker displacement field 随剪切力增大而越来越不均匀，作者用 entropy（熵）来描述这种不均匀性。直觉上，中心区域仍“粘住”，边缘先滑，位移场就会变得不均匀。

![[papers/images/yuan2017gelsight/page12_fig1.png|700]]

Rotational slip（旋转滑移）也有类似逻辑。平面内转矩变大时，边缘 marker 的 rotation angle 与中心区域不一致，形成 partial rotational slip 的线索。

## 4. Design and Fabrication of GelSight

### 4.1 Desktop GelSight Sensor

早期 desktop GelSight 是一个较大的盒式结构，目标更接近 high-resolution surface measurement（高分辨率表面测量）而不是机器人手指。后来侧向照明设计让光在玻璃板中传播，再以近似平行的方式进入弹性体，以提升 surface normal measurement（表面法向测量）的精度。

![[papers/images/yuan2017gelsight/page13_fig1.png|360]]
![[papers/images/yuan2017gelsight/page13_fig3.png|360]]
![[papers/images/yuan2017gelsight/page13_fig4.png|360]]

Figure 10 可以看作“高分辨率但不够实时/不够紧凑”的路线：它能把 human skin（人类皮肤）这种细纹理恢复成几何，但多 LED 异步采集会拉长一次测量时间，不适合实时动态触觉。

### 4.2 Fingertip GelSight Sensors

机器人手指版本的核心挑战是 form factor（形态尺寸）：传感器必须小到能装到 gripper / fingertip（夹爪/指尖），同时还要保持足够好的照明质量。作者提到指尖版本的 sensing field 大约是 18 mm x 14 mm，空间分辨率约 20-30 microns。

![[papers/images/yuan2017gelsight/page14_fig1.png|700]]

Figure 11 是第一代 fingertip GelSight：它通过透明 acrylic guiding plates（亚克力导光板）把四种颜色 LED 的光引入弹性体。优点是能装进 Baxter gripper；缺点是装配复杂、手工精度要求高，非平行照明和半镜面涂层也限制了几何精度。

![[papers/images/yuan2017gelsight/page14_fig2.png|700]]

Figure 12 是改进版 fingertip GelSight：使用 RGB LED arrays 和 matte coating，LED 以约 71 度倾斜照明，结构更标准化，3D 打印和激光切割部件减少手工制造难度。这一版更接近后续机器人触觉研究中常见的 GelSight fingertip。

### 4.3 Fabrication of the Sensor Elastomer

Sensing elastomer（感知弹性体）一般包括透明基底和 reflective membrane。典型制造流程是：

1. 做透明 elastomer base；
2. 在膜面下转印 markers；
3. 在上方涂 reflective coating。

论文中特别强调 reflective membrane 的质量，因为它直接决定 tactile image 的信噪比。膜要 fine（细）、uniform（均匀）、thin（薄）、smooth（平滑）、firm（牢固）且 light-blocking（遮光）。这也是 GelSight-style sensors 制造门槛较高的根源之一。

## 5. Evaluation

### 5.1 Evaluation of Shape Measurement

几何评估用的是直径 $d=3.96$ mm 的小球。因为球面几何已知，可以计算 ground-truth surface normal，再和 lookup table 估出的 pitch / yaw angle 对比。论文结论是：测量值和真实值相关性较好，尤其在 low / medium gradient（低/中等梯度）区域；yaw angle（梯度方向）更准一些。

![[papers/images/yuan2017gelsight/page16_fig1.png|700]]

Figure 13 的右半部分给出常见物体的重建结果。虽然没有完整 ground truth，但 GelSight 能保留整体形状和局部纹理，比如螺纹、硬币、织物等细节。

### 5.2 Evaluation of Force Measurement

Force measurement 的难点是 marker motion 与 contact force / contact geometry 的关系在未知物体上是非线性的。作者因此用 CNN 来学习从 GelSight image 到 $F_x,F_y,F_z,T_z$ 的映射。模型基于 VGG-16 改造，输入是 current GelSight image 与 initial image 的 three-channel difference image。

实验设置中，fingertip GelSight 固定在 ATI Nano-17 force/torque sensor 上，后者提供 ground truth。训练集包含 spheres（球）、cylinders（圆柱）和 flat plane（平面）等基本形状，训练样本约 28,815；测试使用未见过的 ball、cylinder 和 flat plane，共 6705 张 GelSight images。

![[papers/images/yuan2017gelsight/page17_fig1.png|700]]

Figure 14 显示预测值与 force/torque sensor ground truth 的相关性。作者报告 force measurements 的 $R^2$ 高于 0.9，说明 GelSight 图像中确实含有可学习的力信息。但他们也指出 CNN 的泛化仍受训练数据覆盖影响：若接触几何或接触条件超出训练分布，误差会变大。

## 6. Application

GelSight 的高分辨率几何让它不仅能测力，还能支持 material recognition（材料识别）、hardness estimation（硬度估计）、slip detection（滑移检测）、in-hand localization（手内定位）和 USB insertion（USB 插入）等任务。

![[papers/images/yuan2017gelsight/page18_fig1.png|700]]

Figure 15 把这些应用放在一起：一类是通过纹理区分 fabric / material（织物/材料），一类是用形状和力随时间变化估计 hardness（硬度），还有一类是把 USB 插头在手中的局部几何恢复出来，帮助机器人校正插入姿态。

## 7. Conclusions

这篇论文对 GelSight 的总结可以压成一句话：把软触觉表面的变形用视觉读出来，就能把传统触觉传感器难以获取的 geometry（几何）、force（力）、shear（剪切）、slip（滑移）和 material cues（材料线索）统一到一个高分辨率图像信号里。

对你现在读 DTact / 9DTact 这一条线，GelSight 是一个很好的基准：

- GelSight 的强项是物理含义清楚、几何分辨率极高、能解释 texture / slip / force；
- GelSight 的成本是光路、材料、涂层、标定和制造复杂；
- DTact / 9DTact 的意义是：在保留“视觉触觉”基本范式的同时，降低 photometric stereo 和精细反射膜带来的硬件门槛。

## 我的阅读笔记

