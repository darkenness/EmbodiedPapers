---
tags:
  - bilingual-reading
paper: "[[@agarwal2025pbr-design]]"
source_pdf: "[[papers/pdfs/s44172-025-00350-4.pdf]]"
images: "papers/images/agarwal2025-pbr-design/"
image_index: "[[papers/images/agarwal2025-pbr-design/index.md]]"
created: 2026-06-05
---

# Vision-based tactile sensor design using physically based rendering

paper:: [[@agarwal2025pbr-design]]
pdf:: [[papers/pdfs/s44172-025-00350-4.pdf]]
images:: [[papers/images/agarwal2025-pbr-design/index.md]]

## 核心词汇速查

| English | 中文 | 在本文中的作用 |
| --- | --- | --- |
| physically based rendering, PBR | 基于物理的渲染 | 用物理光传输仿真模拟 VBTS 内部光路，而不是靠 photorealistic rendering 或纯经验试错。 |
| vision-based tactile sensor, VBTS | 视觉触觉传感器 | 本文优化的对象，尤其是 curved fingertip GelSight 传感器。 |
| RGB2Normal score | RGB 到法线评分 | 本文提出的设计目标函数，衡量背景差分 RGB 是否能稳定线性映射到 surface normal。 |
| optical simulation framework | 光学仿真框架 | 输入 sensor meshes、refractive indices、coating material、illumination profile，输出 tactile RGB images。 |
| PBRT | Physically Based Rendering Toolkit | 本文构建仿真器的开源物理渲染基础。 |
| Langevin Monte Carlo rendering, LMC | Langevin 蒙特卡洛渲染 | 用于复杂曲面传感器中多次反射/折射的高效路径采样。 |
| bidirectional scattering distribution function, BSDF | 双向散射分布函数 | 描述材料如何反射/透射光，本文用来建模涂层和光学材料。 |
| real-to-sim calibration | 真实到仿真校准 | 通过低维物理模型校准光源和涂层，使仿真图像接近真实原型。 |
| low-dimensional shape parameterization | 低维形状参数化 | 用 ellipse arcs、straight lines 或 cubic B-splines 生成可优化曲面。 |
| CMA-ES | 协方差矩阵适应进化策略 | 本文用于 sensor shape inverse design 的 gradient-free optimization。 |
| specularity | 镜面性/高光性 | 涂层材料参数，影响 RGB2Normal 和几何恢复质量。 |
| area light / spot light / IES light | 面光源 / 聚光源 / IES 光源 | 论文比较的三类 illumination profiles。 |
| perspective Poisson integration | 透视泊松积分 | 将预测 surface normals 积分成 depth / point cloud 的方法。 |

## 论文主线

这篇论文把 vision-based tactile sensor design 从手工经验推进到 computational design（计算设计）。传统 GelSight / GelSlim / AllSight 等传感器的光路、涂层、几何形状和光源排布高度耦合，靠 trial and error（试错）很难知道某个改动为什么提升或降低精度。作者的核心主张是：VBTS 本质上是一个光学系统，所以应当用 physically accurate light simulator（物理准确光模拟器）在制造前评价设计。

![[papers/images/agarwal2025-pbr-design/image-001.jpg|700]]

Fig. 1 把全文流程画成闭环：从 curved fingertip GelSight 的光学组件出发，用 low-dimensional curve parameterization 生成 sensor shape，指定材料和 illumination，再用 optical simulation 生成 tactile images，最后用 RGB2Normal objective function 评分并优化。优化后的传感器被实际制造，并在 3D reconstruction、robotic grasping 和 embossed text detection 中验证。

论文最重要的转变是把“传感器好不好”转成可量化目标：如果背景差分 RGB image 能稳定、线性地预测 surface normal，那么这个设计更适合 photometric stereo 和 depth reconstruction。RGB2Normal 不是最终任务本身，而是一个可快速计算的 proxy（代理指标），让材料、厚度、光源和曲面形状都能进入同一个设计搜索。

对你的阅读线来说，这篇尤其适合连接前面几篇：Improved GelSight 靠硬件经验改善 Lambertian membrane 和 illumination，GelSlim 把光路参数化但仍人工设计，AllSight 通过多传感器训练处理曲面迁移，而 PBR Design 进一步问：能不能在制造前就用仿真选择光源、涂层和曲面。

## 贡献与结论对照

| 贡献 | 方法位置 | 证据 / 结论 |
| --- | --- | --- |
| 提出 VBTS 数字设计框架 | Methods: Overview | 设计流程包括 illumination design、optical simulation、RGB2Normal assessment、shape generation 和 optimization。 |
| 提出 RGB2Normal objective function | Design goals and evaluation | 通过背景/压入图像差分，检查 RGB 变化与法线角度是否有稳定线性关系。 |
| 构建物理光学仿真器 | Optical simulation framework | 使用 PBRT、BSDF 材料、LMC rendering 和 real-to-sim calibration，模拟多次反射/折射。 |
| 参数化曲面传感器形状 | Sensor shape design | 用 ellipse parameterization 和 cubic B-splines 生成三层 curved surfaces，并保证 3D printable。 |
| 分析材料、厚度和光源影响 | Results: forward design | 涂层 specularity 越高，曲面传感器 RGB2Normal 越好；area light 得分最高，RGB2Normal 为 0.973。 |
| 优化 curved sensor surface | Inverse sensor design | CMA-ES 得到 $r_{e1}=7.1$ mm、$r_{e2}=6.02$ mm；RGB2Normal 比 initial design 高 35%，比 human-expert design 高 15.6%。 |
| 仿真和真实几何重建验证 | 3D reconstruction sections | 仿真 projected depth error 从 initial design 的 44.01% 降至 optimized design 的 19.81%；真实法线 RMSE 也低于 human-expert。 |
| 机器人任务验证 | Robotic grasping / text detection | 曲面优化传感器能从 front/side/tip 三方向感知；embossed text detection 平均 Levenshtein distance 从 10.63 降至 2。 |

## Introduction：为什么 VBTS 设计需要仿真

论文开头先对比传统电子触觉 taxel arrays 和 camera-based tactile sensors。电阻、电容、光阻、铁电、摩擦电等 tactile technologies 通常需要密集 taxels 和线路，容易有 mechanical strain、electromagnetic noise、cross-talk 等问题。Vision-based tactile sensors 用小相机观察软 elastomer 和 opaque membrane 的变形，天然具备高空间分辨率。

但是 GelSight 类传感器的性能高度依赖内部 lightfield（光场）。光线在传感器内部会经过多次反射、折射、散射，材料表面还有各自复杂的 optical properties。机器人指尖空间又很紧凑，光源、相机、waveguide、shell 和 coating 的小改动都会改变最终图像。没有可靠 simulator 时，设计只能靠 human expert 的反复制造和试验。

作者还强调 curved tactile sensors（曲面触觉传感器）的必要性：

- 可覆盖机器人手的更多方向，接近 fully sensed robotic structures。
- 在 object pose / robot state 有不确定性时，曲面能增加接触面积和成功感知概率。
- 曲面指尖对 dexterous manipulation、in-hand localization 和 grasp stability prediction 更有用。

本文选择 Romero et al. 2020 的 round fingertip GelSight 作为初始设计，并尝试通过 PBR 设计更优的 curved sensor。

## Methods

### Overview of VBTS Sensor Design Framework

![[papers/images/agarwal2025-pbr-design/image-007.jpg|700]]

Fig. 2 展示 procedural sensor generation 和 RGB2Normal scoring。流程可以拆成两阶段：

1. **Illumination design**：选择 light source type 和 placement，送入 optical simulation，生成 tactile images，再用 RGB2Normal 评分。
2. **Shape design**：用低维曲线参数化生成新的 curved sensor shapes，继续仿真和评分，并通过优化算法寻找更优形状。

最终目标不是生成“好看的渲染图”，而是生成能用于评估 sensor performance 的 physically accurate tactile images。

### Design Goals and RGB2Normal Objective

GelSight 类传感器的关键任务是 surface normal recovery，因为 3D shape reconstruction 通常先从 RGB image 估计法线/梯度，再积分成 depth map。RGB2Normal score 的直觉是：一个好的传感器设计应该让接触区域的 RGB color change 与 surface normal change 存在稳定、可学习、近似线性的关系。

Algorithm 1 的流程可以概括为：

1. 生成 background RGB image $I$ 和 indented RGB image $\hat{I}$。
2. 计算背景差分：

$$
\Delta I=I-\hat{I}
$$

3. 生成 background normals $N$ 和 indented normals $\hat{N}$，并计算：

$$
\Delta N=N-\hat{N}
$$

4. 根据 $\Delta N>0$ 得到接触 mask $M$。
5. 找出 mask 中的 contours 和 bounding boxes。
6. 从接触中心沿八个方向抽取 RGB values 和 normal angles。
7. 对 RGB 做 PCA，找主颜色变化方向，再与 normal angle 做 line fit。
8. 将有效线性拟合的 correlation / r-value 平均，得到 RGB2Normal score。

这个指标的优点是快、不需要真实标定步骤，并且可以作为 3D reconstruction 的 proxy。它的局限也很清楚：它主要评价 color-to-normal mapping，对 force、shear、slip、classification 等目标需要改写 objective function。

### Optical Simulation Framework

论文比较了常见渲染方式：rasterization（如 Blender EEVEE）不能生成有效物理触觉图像，unidirectional path tracing（如 Blender Cycles）也难以匹配真实原型。因此作者用 PBRT 构建 optical simulator，并使用 Langevin Monte Carlo rendering (LMC) 处理曲面传感器中的多次反射/折射和复杂路径采样。

仿真器输入包括：

- sensor surface meshes（传感器表面网格）
- refractive indices（折射率）
- sensing surface coating material（感知表面涂层材料）
- illumination profile of light sources（光源照明分布）
- BSDF material properties（材料散射/反射分布）

real-to-sim calibration 的作用是校准 individual components（单个组件）的低维物理模型，例如真实 LED profile 和 coating material。作者强调这些校准不需要 sensor-specific tactile data，也就是说不是先采触觉数据再拟合整个传感器，而是测量光源和材料本身。

### Sensor Design Parameterization

传感器由三层 curved surfaces 组成，记为 $S_1(x)$、$S_2(x)$、$S_3(x)$。每个曲面来自对应 2D curve $C_1(x)$、$C_2(x)$、$C_3(x)$，再通过 extrusion（挤出）和 rotation（旋转）生成 3D 曲面。

论文使用两类低维曲线：

- **Ellipse parameterization**：半椭圆加直线段，适合少量参数的曲面搜索。
- **Cubic B-splines**：通过 7 个控制点生成更灵活的曲线。

所有设计中 camera 放在 origin，light sources 放在 shell periphery，extrusion length 固定为 $e=28$ mm。这个参数化保证曲面 $C^1$ continuous（切向连续）且 3D printable。

### Illumination, Material and Thickness Design Spaces

作者分别探索：

- illumination type：calibrated IES light、spot light、area light。
- hard epoxy shell thickness $t_1$ 和 soft elastomer / PDMS thickness $t_2$。
- coating material specularity / shininess（涂层镜面性）。
- inner curved epoxy surface shape。

这些变量正是 VBTS 设计里最常靠经验调的部分。本文的贡献是让它们能被统一放进仿真和评分流程。

### Fabrication of the Curved Sensor

![[papers/images/agarwal2025-pbr-design/image-008.png|700]]

Fig. 4A 展示三阶段制造：

1. 用 Formlabs Form3 SLA printer 打印 hard shell 和 two-piece mold。打印件先用 1200 grit sandpaper 手工抛光，再涂 Krylon Triple Thick Clear Glaze 0500 达到 optical finish。
2. 将 hard shell 固定到 two-part mold，倒入 XPS-565 soft elastomer，室温固化 24 h。固化后刷 metal flake powder，再加一层 thin protective elastomer coating。
3. 装配 sensor、illumination system 和 Raspberry Pi v1 camera，camera 有 160 度 field-of-view。

初始传感器和 human-expert design 使用 OSRAM RGB LEDs；optimized design 为了复现 area light，使用 Chanzon 5730 SMD LEDs。Fig. 4B 比较 Chanzon LED 和仿真 area light 的 reflected radiance profiles，水平和垂直方向都较接近，说明 real-to-sim 光源校准不是纯概念。

## Results

### Forward Design for Thickness and Material Choice

![[papers/images/agarwal2025-pbr-design/image-011.png|700]]

Fig. 5 探索 hard shell thickness $t_1$、soft elastomer thickness $t_2$ 和 coating specularity。$t_1,t_2$ 在 $[1,3]$ mm 范围内以 0.5 mm 步长采样，涂层材料分 6 类 specularity。sensing surface profile 固定为类似人手指的 ellipse 参数，$r_1=r_2=14.5$ mm，extrusion length $e=28$ mm。

主要结论是：对曲面 tactile sensors，较高 specularity 通常带来更高 RGB2Normal performance。这个结论和 Improved GelSight 的 Lambertian 选择形成有趣对比：Improved GelSight 的目标是让 photometric stereo 在小型平面/指尖结构中更线性，而 PBR Design 的曲面/光路设置发现更高镜面性在特定设计空间里能产生更有区分度的 normal signal。不能简单说 Lambertian 或 specular 绝对更好，材料选择要和光路、曲面、目标函数一起看。

### Forward Sensor Design for Illumination

论文比较 PointLight、AreaLight、IESLight。Area light 在接触图像中没有明显 bright streaks，并取得最高 RGB2Normal score：**0.973**。因此后续仿真和最终 prototype 都采用 area-light-like illumination。

![[papers/images/agarwal2025-pbr-design/image-009.png|700]]

Fig. 3 同时展示 illumination design 和 shape optimization 结果。读图重点是：光源 profile 不只影响亮度均匀性，还直接影响颜色变化是否能区分法线。

### Inverse Sensor Design for Curved Surface Shape

作者用 CMA-ES 做 gradient-free optimization，优化 innermost epoxy surface。对比两类 baseline：

- initial design：使用 flat plane surface，受早期 flat GelSight 启发；
- human-expert design：Romero et al. 的设计，参数 $r_{e1}=8$ mm、$r_{e2}=8$ mm。

搜索半径范围设为 $(6,10)$ mm。最小值受 camera dimensions 限制，最大值受 soft PDMS volume 限制。优化得到：

$$
r_{e1}=7.1\ \text{mm},\quad r_{e2}=6.02\ \text{mm}
$$

该 optimized design 在 RGB2Normal objective 上比 initial design 高 **35%**，比 human-expert design 高 **15.6%**。这说明人类专家设计已经不错，但低维可制造形状空间里仍有可自动搜索的提升。

### 3D Surface Reconstruction in Simulation

![[papers/images/agarwal2025-pbr-design/image-012.jpg|700]]

Fig. 6 比较 simulation 中 initial design 和 optimized design 的 3D reconstruction。重建流程包括两步：

1. 用 5 mm spheres 压入传感器渲染 calibration image，训练一个 tiny neural network 从 color 预测 surface normal。
2. 用 perspective Poisson integration 将 predicted normals 积分为 surface depth。

测试时用 sphere indenter 和 net texture，在多个 contact locations 以 0.7 mm indentation depth 压入。结果显示两种设计都能恢复 normals，但 optimized design 的 normal error distribution 更好，因此 depth reconstruction 明显更准确。Projected depth error 为：

| Design | Projected depth error |
| --- | ---: |
| initial design | 44.01% |
| optimized design | 19.81% |

这说明 RGB2Normal score 确实能作为 depth reconstruction 的有效 proxy。

### Real-world 3D Reconstruction with Manufactured Prototypes

![[papers/images/agarwal2025-pbr-design/image-013.jpg|700]]

Fig. 7 用真实制造传感器比较 human-expert design 和 optimized design。定性对象包括 icosahedron、cloth texture 和 US quarter coin。Human-expert design 在某些区域有 saturation 或 uneven background，导致 cloth fine normals 和 coin text 难恢复；optimized design 能更稳定地恢复细微 normal changes。

定量评估用半径 2.5 mm 的 metal ball，在多个 sensing surface locations 以 0.75 mm depth 压入。作者手动选择 sphere center，将 predicted normals 与 ideal sphere normals 比较，并用 polar coordinate representation $(\theta,\phi)$ 分别计算 RMSE。

| Design | Average RMSE $\theta$ | Average RMSE $\phi$ |
| --- | ---: | ---: |
| human-expert design | 11.57 deg | 15.08 deg |
| optimized design | 9.82 deg | 14.03 deg |

提升不是数量级变化，但在真实硬件上与仿真趋势一致，说明优化设计不是只在 simulator 里有效。

## Robotic Applications

### Robotic Grasping

![[papers/images/agarwal2025-pbr-design/image-014.jpg|700]]

Fig. 8 比较 flat GelSight Mini 和 optimized curved sensor 对 YCB Yellow Mustard bottle 的接触感知。机器人从 front、side、tip 三个方向接近物体。GelSight Mini 的 flat sensing surface 只有正面接触时能得到有效信号；optimized curved sensor 在三个方向都能产生高分辨率 tactile images 和 3D reconstruction。

这个实验的意义不是展示抓取策略最强，而是展示曲面 tactile surface 扩大了 perception space（感知空间）。在 robot joint angle space 有限、物体姿态不确定时，这种多方向感知很重要。

### Robotic Embossed Text Detection

![[papers/images/agarwal2025-pbr-design/image-016.png|700]]

Fig. 9 是全文最有说服力的真实任务。机器人把传感器压到 3D-printed surface 上，表面有 0.1 mm depth 的 embossed text。作者用 Google Image Recognition 识别 tactile images 中的文字，再用 Levenshtein distance 比较识别文本和 ground truth，距离越小越好。

第一个实验使用文本 **Tactile Sensing**，比较 1.0 mm、1.25 mm、1.5 mm 三种 text sizes：

| Text size | Design A / human-expert distance | Optimized design distance |
| --- | ---: | ---: |
| 1.0 mm | 15 | 3 |
| 1.25 mm | 9 | 2 |
| 1.5 mm | 7 | 2 |

第二个实验使用 1.0 mm 文本 **Feeling of Touch**，在 curved sensing surface 的不同位置和方向压入，每个传感器收集 11 张图。Design A 在 vertical text 或非中心位置时经常识别失败；optimized design 在各位置都能识别多数文本。平均 Levenshtein distance 为：

| Design | Average Levenshtein distance |
| --- | ---: |
| Design A / human-expert | 10.63 |
| optimized design | 2 |

摘要中“约 5 倍更好”的结论主要来自这个表面文本检测任务。它说明优化后的光学设计能更好保留 high-frequency surface micro-geometry（高频表面微几何），这对 defect inspection、surface inspection、friction property estimation 等任务有意义。

## Conclusion and Discussion

论文结论是：PBR + low-dimensional shape parameterization + RGB2Normal objective 可以把 VBTS 设计变成可量化优化问题。它不仅能改进一个 curved GelSight fingertip，也可能推广到其他 optical devices 和 sensorized soft robots。

作者也明确讨论了适用边界：

- 仿真依赖准确 light model 和 coating material model。复杂 illumination settings 可能需要更高级的测量与建模。
- 当前 objective function 主要面向 surface normal recovery。若目标是 normal force、shear force、slip、classification 或特定 robotic task，需要设计新的 objective function。
- RGB2Normal 不假设具体图像生成过程，因此可用于其它输出 tactile image 和 target geometry 的 VBTS，但评分目标仍要按任务调整。

## Generalizability：框架为什么可能推广

作者认为框架有三部分可复用：

1. **General optical simulation framework**：开源、可加入新光学元件，可模拟 embedded illumination、measured coating materials 和其它 VBTS。
2. **Low-dimensional curve parameterization**：让 sensor shape 可控、可制造、可优化。
3. **Design evaluation procedure**：输入 tactile images 和 target geometry，输出设计分数。它不假设具体传感器如何产生图像，因此可替换目标函数。

换句话说，PBR Design 不是只为一个 GelSight fingertip 服务，而是把 graphics、optics 和 robotics 连接起来，形成“先仿真、再制造、再验证”的传感器设计流程。

## 与其它文献的关系

- 与 Improved GelSight 相比，本文把照明和材料选择从经验改良推进到仿真评分。
- 与 GelSlim 相比，本文继承了光路参数化思路，但进一步优化曲面和材料，并用 PBR 处理复杂反射/折射。
- 与 AllSight 相比，AllSight 关注低成本圆形传感器和 zero-shot transfer；PBR Design 关注制造前的光学设计优化。
- 与 CrystalTac 相比，CrystalTac 解决一体化制造平台问题；PBR Design 解决 sensor geometry / illumination / material 的数字设计问题。
- 与 DenseTact / R-Tac0 相比，本文不主要提出新的学习模型，而是改善图像生成机制本身。

## 局限与可追问点

1. **仿真准确性依赖材料和光源模型。** 涂层老化、制造误差、气泡、表面粗糙度、LED 批次差异都会造成 sim-to-real gap。

2. **RGB2Normal 只覆盖法线目标。** 如果你的任务是 force、slip、contact classification 或 manipulation policy，必须重新定义 objective function。

3. **低维形状空间可能错过更优复杂形状。** Ellipse / B-spline 参数化保证可制造和易优化，但也限制了搜索空间。

4. **真实提升幅度在法线 RMSE 上不算巨大。** 真实硬件 RMSE 从 11.57/15.08 deg 降到 9.82/14.03 deg，说明制造和标定仍限制最终收益。

5. **机器人实验依赖外部文字识别系统。** Embossed text detection 用 Google Image Recognition 和 Levenshtein distance 评估，适合展示高频微几何，但不是一个标准 tactile benchmark。

6. **制造仍需要手工后处理。** 1200 grit sanding、Krylon clear glaze、metal flake brushing 等步骤仍可能引入人为差异。

## 一句话定位

PBR Design 是把视觉触觉传感器设计从“做一个原型再试”推进到“在数字空间中仿真、评分、优化再制造”的论文。它的核心贡献是 RGB2Normal objective 和物理光学仿真框架，让光源、曲面、层厚和涂层材料都能成为可搜索的设计变量。
