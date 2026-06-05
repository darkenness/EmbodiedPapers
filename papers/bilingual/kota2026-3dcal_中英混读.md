---
tags:
  - bilingual-reading
source_pdf: "[[papers/pdfs/kota2026-3dcal.pdf]]"
paper: "[[@kota2026-3dcal]]"
images: "papers/images/kota2026-3dcal/"
image_index: "[[papers/images/kota2026-3dcal/index.md]]"
created: 2026-06-05
---

# 3D Cal: An Open-Source Software Library for Calibrating Tactile Sensors

## 核心词汇速查

- 3D Cal / py3DCal（3D 打印机触觉校准库）：一个 open-source Python library（开源 Python 库），把低成本 FDM 3D printer（熔融沉积 3D 打印机）变成自动 probing device（探针设备）。
- tactile sensor calibration（触觉传感器校准）：把 raw sensor readings（原始传感器读数）转换成 physically meaningful quantities（有物理意义的量），如 depth map（深度图）、surface geometry（表面几何）或 force（力）。
- vision-based tactile sensor / VBTS（视觉触觉传感器）：通过 camera（相机）观察柔性接触表面的图像变化来读取触觉信息。
- DIGIT：Meta AI 推出的低成本视觉触觉传感器。
- GelSight Mini：商用小型 GelSight 类视觉触觉传感器。
- probing（探针按压）：用 probe tip（探针头）在传感器表面不同坐标和深度上重复按压，生成带标签数据。
- FDM 3D printer（熔融沉积 3D 打印机）：本文用作廉价、可编程的 XY gantry（二维龙门平台）和按压执行器。
- G-code（数控运动指令）：3D 打印机常用控制语言，3D Cal 用它控制打印头运动。
- TouchNet：本文提供的 fully convolutional neural network（全卷积神经网络），从 RGB tactile image + coordinate embedding 预测 surface gradient map。
- coordinate embedding（坐标嵌入）：给图像额外拼接 x,y 两个坐标通道，让网络知道每个像素在传感器平面上的空间位置。
- Fast Poisson Solver（快速泊松求解器）：把预测出的 x/y surface gradients（表面梯度）积分成 depth map。
- Type 1 error（无接触区误差）：ground-truth depth 为 0 的像素误差。
- Type 2 error（有接触区误差）：ground-truth depth 非 0 的像素误差。

## 论文主线

这篇论文的核心问题是：tactile sensing（触觉感知）越来越重要，但 tactile sensor calibration（触觉传感器校准）仍然很手工、很慢、很依赖专门设备。尤其是 vision-based tactile sensors（视觉触觉传感器），输出是高维图像，要映射到 depth map 或 force 这类物理量，通常需要大量带标签数据。

作者提出 3D Cal：不使用工业机械臂、CNC 或 motion-capture system，而是把常见低成本 FDM 3D printer 改造成自动探针系统。3D 打印机先打印 sensor base（传感器底座），传感器插入底座后位置天然处在打印机坐标系里；再把 spherical probe tip（球形探针头）装到打印头上，用 G-code 自动按压指定坐标和深度。

论文用 3D Cal 校准两个商用视觉触觉传感器：DIGIT 和 GelSight Mini。采集数据后，作者训练 TouchNet，把 RGB tactile image 加 x,y coordinate embedding 输入网络，预测 surface gradient map，再用 Fast Poisson Solver 得到 depth map。实验重点不是展示一个新传感器，而是证明“低成本自动采集 + 轻量模型”能让视觉触觉校准更可复现、更低门槛。

项目页和 IEEE 记录给出的正式 RA-L 题名是 `3D Cal: An Open-Source Software Library for Depth Reconstruction on Vision-Based Tactile Sensors`；本地 PDF / arXiv 版本题名仍是 `3D Cal: An Open-Source Software Library for Calibrating Tactile Sensors`。本笔记按本地 PDF 结构阅读，同时在文献页保留正式 DOI 和正式题名。

## 贡献与结论对照

| 贡献 | 方法位置 | 证据位置 | 结论 |
| --- | --- | --- | --- |
| 3D Cal 开源校准库 | Sec. II-A Data Collection | Fig. 1 | 低成本 3D 打印机可作为自动 probing device，生成坐标标签数据 |
| TouchNet 深度重建模型 | Sec. II-B Model Training | Fig. 1E-F、Fig. 4 | RGB 图像 + 坐标通道可预测梯度，再积分成 depth map |
| DIGIT / GelSight Mini 数据量指南 | Sec. III | Fig. 2、Fig. 3 | P = 1% 明显不足；约 20% 空间坐标能稳定空间误差 |
| 未见物体泛化验证 | Sec. IV | Fig. 4、Fig. 5、Table I | hemispheres / pill 表现好，pawn 的阴影和复杂几何更难 |
| 开源数据与模型 | Discussion / project page | 项目页与 Zenodo | 发布 70,000+ probe images 和预训练权重，支持复现与迁移 |

## Abstract

摘要强调 tactile sensing 对 dexterous and reliable robotic manipulation（灵巧可靠的机器人操作）很关键，但部署触觉传感器之前通常要做大量 calibration。这个步骤普遍存在，却经常是 ad hoc（临时拼凑的）和 labor-intensive（劳动密集型）的。

作者提出 3D Cal，用低成本 3D printer 采集大量 labeled training data（带标签训练数据）。它被用于 DIGIT 和 GelSight Mini 两个商用视觉触觉传感器，并训练 custom convolutional neural network（自定义卷积网络）生成高质量 depth maps。论文还做 data ablation study（数据消融），回答“校准时到底需要多少点”的实际问题。

## I. Introduction

触觉传感器能捕捉 contact forces（接触力）和 surface deformations（表面形变），可用于 robot control、teleoperation、medical diagnostics、fruit ripeness assessment 等任务。问题是触觉传感器没有像 vision / audition 那样成熟标准化，传感机制非常多样：capacitive、resistive、magnetic、acoustic、vision-based 等。

开放硬件和商用设备降低了硬件门槛，例如 DIGIT 和 GelSight Mini 让高分辨率触觉更容易获得；开源软件也开始提供统一接口和仿真环境。但 calibration 仍是薄弱环节。对低维电压信号，一些传感器可用 linear / quadratic function（线性/二次函数）做近似；对视觉触觉这类高维图像输出，通常需要学习从图像到 force 或 depth map 的复杂映射。

现有自动化校准方案经常依赖 expensive hardware（昂贵硬件），如 industrial 6-DoF robot arms、CNC machines 或 motion-capture systems，而且还要做 probing device 与 sensor coordinate frame 的空间对齐。3D Cal 的核心切入点就是把这件事变便宜、变标准、变可复现。

![[papers/images/kota2026-3dcal/Calibration_page1.png|700]]

Fig. 1 展示全文主线：先 3D print sensor base，把 sensor 固定在打印机工作空间中；再 attach probe to printhead；然后 collect data；最后训练或微调 TouchNet，并生成 depth maps。图下半部分是 TouchNet 的 9-layer convolutional architecture。

## II. 3D Cal

3D Cal 提供两个主要功能：

- data collection and annotation（数据采集与标注）：自动按压指定位置和深度，生成坐标标签数据；
- model training（模型训练）：尤其支持 vision-based tactile sensing 的 depth map generation。

当前版本的模型训练和推理主要面向 RGB image inputs（RGB 图像输入）和 sensor depth maps（传感器深度图），不是所有触觉传感器的通用校准终点。作者也明确说未来会扩展到更广泛传感器和 inference targets。

### A. Data Collection

数据采集流程很工程化：

1. 用户设计并 3D 打印 sensor base，使传感器以 slide fit（滑入配合）的方式插入。
2. 由于 base 是在打印床上打印出来的，传感器位置自然定义在 3D printer coordinate system（打印机坐标系）里。
3. 将 rigid spherical probe tip（刚性球形探针头）安装到 printhead（打印头）上。论文使用半径 2 mm 的球形探针。
4. 用户在 CSV 中指定 probing coordinates `(x, y)` 和 depths `(z)`。
5. 3D Cal 解析 CSV，用 G-code 控制打印机逐点按压，并同步采集传感器读数。

3D Printer Abstraction（3D 打印机抽象）使库理论上可支持任何 G-code compatible FDM printer。作者当前实现支持 Ender 3，但认为其它打印机只需少量代码适配，因为基础 G-code 指令是相对 printer-agnostic（打印机无关）的。

Sensor Abstraction（传感器抽象）要求传感器实现通信和采集函数。对自定义视觉触觉传感器，只要能用 OpenCV 采图，就能接入基本流程。库内置支持 DIGIT 和 GelSight Mini，包括 sensor base designs、0.5 mm x 0.5 mm probing CSV 和图像采集支持。

### B. Model Training

不同 tactile sensors 的 transduction principles（换能原则）和 calibration targets（校准目标）差异很大，所以完全通用的模型训练接口很难。3D Cal 先选择一个高价值目标：为 vision-based tactile sensors 训练 depth map reconstruction（深度图重建）模型。

TouchNet 的输入是 5-channel image：

- 3-channel RGB tactile image；
- 2-channel positional / coordinate embedding，编码每个像素的 x,y 位置。

网络输出是 2-channel surface gradient map：

- $G_x$：x 方向表面梯度；
- $G_y$：y 方向表面梯度。

然后用 Fast Poisson Solver 把梯度场积分成 depth map。这个设计的直觉是：传感器图像中的局部颜色/亮度变化与局部表面斜率相关；先预测梯度，再积分成高度，比直接输出完整深度图更贴合几何结构。

作者还说明 TouchNet inference 在 modest laptop-grade hardware（普通笔记本级硬件）上低于 30 ms，可支持约 30 fps 实时 depth map generation。3D Cal 发布 TouchNet architecture、DIGIT / GelSight Mini 预训练权重和训练数据集。

## III. Calibrating Commercial Sensors with 3D Cal

这一节把 3D Cal 用到两个商用视觉触觉传感器：DIGIT 和 GelSight Mini。它们都可购买、用户群较大、且 markerless variants（无标记点版本）主要用于 surface geometry（表面几何）捕捉，因此 depth prediction 是合理校准目标。

实验设置：

- probing grid：0.5 mm x 0.5 mm；
- DIGIT：33 x 37 grid，共 1,221 distinct probe locations；
- GelSight Mini：31 x 39 grid，共 1,209 distinct probe locations；
- 每个位置采集 30 images during indentation；
- 每个传感器采集时间约 2 hours；
- TouchNet 训练使用 MSE loss、AdamW optimizer、learning rate 1e-4、weight decay 1e-4、batch size 64；
- 训练在 RTX 6000 GPU 上用 PyTorch mixed precision 完成。

![[papers/images/kota2026-3dcal/Subsets_page1.png|700]]

Fig. 2 是数据比例消融。作者保留 20% 坐标做 validation，然后用 P = 80%、40%、20%、10%、5%、1% 的空间坐标训练。为了让不同 P 的训练步数可比，训练 epoch 数按 $N = 60 \times (80\% / P)$ 调整。

结果要点：

- P = 1% 时模型明显退化，大约只使用 12 个空间位置；
- P >= 5% 时，单看 pill-shaped test object 的重建图，视觉效果已经相对稳定；
- 但这不代表空间上均匀可靠，因为局部区域仍可能缺少足够采样。

### A. Spatial Sampling Analysis

由于视觉触觉传感器存在 non-uniform illumination（非均匀照明）和非均匀材料响应，模型不能只在少数点校准后假设全表面都一样。作者进一步计算 validation set 中每个 probe coordinate 的 gradient prediction MSE，并画出空间分布。

![[papers/images/kota2026-3dcal/MSE_page1.png|700]]

Fig. 3 显示：训练坐标稀疏的区域，MSE 明显更高。随着 P 增大，MSE 分布的均值和标准差下降，说明更密的空间采样主要改善的是 reconstruction variability（重建稳定性），而不仅是平均误差。

作者用 t-test 和 Mann-Whitney U test 比较不同 P 与 P = 80% 的 MSE 分布，结论是：当 P 达到 20% 后，继续增加数据带来的改善很小。实际建议是至少 probing 20% 的总坐标，也就是在 0.5 mm x 0.5 mm grid 上约 240 个随机空间位置。

## IV. Performance on Unseen Objects

为了测试泛化，作者设计了 3 个 CAD test objects：

- hemispheres；
- pill；
- pawn。

这三个对象都为 10 mm x 10 mm，先转成 ground-truth depth maps，再 3D 打印并手动按入 DIGIT / GelSight Mini。模型使用 P = 80% 训练得到的 TouchNet。由于按压是手动完成，作者用 2D cross-correlation（二维互相关）做 xy 平面对齐，并微调 ground-truth 的 indentation depth 来最小化 MSE。

![[papers/images/kota2026-3dcal/Depthmaps_page1.png|700]]

Fig. 4 展示重建效果和横截面对比。对 hemispheres 和 pill 这类简单几何，DIGIT 更准确；对 pawn，GelSight Mini 表现更好。但两种传感器都难以重建 pawn neck，因为该区域受几何和照明配置影响产生 dark shadow（暗阴影）。

Table I 的关键数值：

| Test Object | DIGIT Overall Error (um) | GelSight Mini Overall Error (um) | DIGIT Type 1 (um) | GelSight Mini Type 1 (um) | DIGIT Type 2 (um) | GelSight Mini Type 2 (um) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Hemispheres | 16.984 | 22.413 | 5.641 | 5.143 | 107.127 | 171.605 |
| Pill | 16.274 | 23.641 | 8.807 | 7.557 | 65.274 | 152.846 |
| Pawn | 52.211 | 48.821 | 18.788 | 17.360 | 296.381 | 290.014 |

![[papers/images/kota2026-3dcal/DepthErrors_page1.png|700]]

Fig. 5 把 pixelwise depth errors 分成两类。Type 1 error 是无接触区域误差，两个传感器都低于 20 um，说明模型很擅长识别“哪里没有接触”。Type 2 error 是真实深度非零区域的误差，明显更大，DIGIT 为 65.274-296.381 um，GelSight Mini 为 152.846-290.014 um。作者认为这些 Type 2 errors 大约是 maximum measured indentation depth 的 5-15%，对很多真实机器人操作任务可能足够。

## V. Discussion and Future Work

3D Cal 的定位不是替代所有校准方法，而是把高门槛、手工化、难复现的触觉校准流程变成可复用的软件/硬件工作流。它的价值在三点：

- 降低门槛：用常见 3D printer 替代昂贵工业机械臂或 CNC。
- 标准化数据：用坐标网格和 CSV probing plan 收集可复现训练数据。
- 支持开源生态：发布代码、预训练模型和 70,000+ probe images，促进 transfer learning（迁移学习）和 sensor-agnostic models（传感器无关模型）。

局限也比较明确：

- 当前模型目标主要是 depth map generation，不是 force / shear / slip 的完整校准。
- 目前展示集中在 DIGIT 和 GelSight Mini 两种商用视觉触觉传感器。
- 用 spherical probe 训练，在 pawn neck 这类复杂阴影/几何区域仍会出错。
- 手动按压未见物体时需要后处理对齐 ground-truth，这说明评估流程还不是完全自动化。

作者未来计划把 3D Cal 扩展到 force sensors，并支持 shear and normal forces（剪切力和法向力）等新校准目标，也计划支持 capacitance-based、resistance-based 和其它 emerging tactile sensing technologies。

## 局限与可追问点

- 如果要把 3D Cal 用在 DTact / 9DTact 上，关键问题是 probe geometry 和 optical response 是否覆盖它们的 darkness / intensity mechanism。
- 论文建议约 240 个空间点，但这是针对 DIGIT / GelSight Mini、0.5 mm grid 和 TouchNet；不同传感器尺寸、FOV、照明均匀性下这个数可能变化。
- TouchNet 使用 coordinate embedding，说明模型依赖传感器空间位置先验；跨传感器泛化可能需要 transfer learning 或更强的归一化。
- 当前评估对象少，真实机器人操作中的复杂接触、多点接触和动态滑动还没有充分覆盖。
- 对有 marker 的传感器，depth map 之外还可能需要 force / shear / slip calibration，3D Cal 目前只是打基础。

## 与当前库的连接

- [[@li2025vbts-classification-review]]：3D Cal 主要服务 RLB / vision-based tactile sensors 的 depth reconstruction，可放在“数据解释与校准工具”层理解。
- [[@yuan2017gelsight]]：GelSight 类传感器依赖几何/深度恢复，3D Cal 提供更低门槛的数据采集和模型训练路线。
- [[@lin20239dtact]]：9DTact 做紧凑视觉触觉与 6D force estimation，3D Cal 的自动 probing 思路可用于思考这类传感器的标定数据采集。
