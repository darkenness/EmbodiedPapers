---
tags:
  - bilingual-reading
source_pdf: "[[papers/pdfs/redkin2024dynamic-illumination.pdf]]"
paper: "[[@redkin2024dynamic-illumination]]"
images: "papers/images/redkin2024dynamic-illumination/"
image_index: "[[papers/images/redkin2024dynamic-illumination/index.md]]"
created: 2026-06-05
---

# Enhance Vision-based Tactile Sensors via Dynamic Illumination and Image Fusion

## 核心词汇速查

- vision-based tactile sensor / VBTS（视觉触觉传感器）：通过相机观察 elastomeric interface（弹性体接触界面）的形变来获得触觉信息的传感器。
- structured light（结构光）：传感器内部主动投射的光，用来让 elastomer deformation（弹性体形变）在图像中可见。
- static illumination（静态照明）：每次测量都使用同一组固定 LED 颜色和强度。
- dynamic illumination（动态照明）：对同一接触状态依次使用多组 illumination patterns（照明模式）拍摄图像。
- illumination pattern（照明模式）：本文用 RGB tuple `(R,G,B)` 表示，每个通道强度范围是 0-15。
- image fusion（图像融合）：把同一场景或同一接触状态下的多张图融合成一张更高质量的图。
- DIGIT：本文使用的 compact vision-based tactile sensor，带 red、green、blue 三个 LED。
- gradient-based sharpness（基于梯度的清晰度）：通过图像强度在 x/y 方向的梯度衡量纹理边缘是否清楚。
- root mean squared contrast / RMS contrast（均方根对比度）：衡量像素强度围绕平均值的波动程度。
- difference with background（相对背景差异）：接触图像与无接触背景图之间的平均差异。
- Channelwise Sum（按通道求和融合）：把不同照明图像的 RGB 通道组合到一起。
- Brovey Fusion：常见图像融合方法，强调把多源图像的强度信息重新分配到颜色通道。
- Laplacian Pyramid（拉普拉斯金字塔）：多尺度图像融合方法，保留不同尺度上的细节。
- Discrete Wavelet Transform / DWT Fusion（离散小波变换融合）：先把图像分解成近似/细节系数，再融合系数并重建图像。

## 论文主线

这篇论文的核心想法非常直接：很多 vision-based tactile sensors（视觉触觉传感器），例如 DIGIT 和 GelSight 系列，都依赖 structured light（结构光）来把接触形变显示在相机图像里。但这些传感器通常在设计阶段确定一套 static illumination pattern（静态照明模式），之后每次测量都用同样的光。问题是，不同物体材料、颜色、反射特性和几何会让同一套照明并不总是最优。

作者提出 dynamic illumination + image fusion：对同一次接触，不是只拍一张标准照明图，而是用不同 RGB LED intensity settings（照明强度组合）拍多张 tactile images，然后用 image fusion methods（图像融合方法）合成一张更高质量的 measurement。这里的“高质量”不是主观好看，而是用 contrast、sharpness、difference with background 三个指标来衡量。

全文的证据链是：先说明 VBTS 依赖结构光且传统方法多在硬件设计时固定照明；再形式化“选择照明模式、图像数量和融合方法”的优化问题；然后用 DIGIT 在多种物体上比较不同 illumination patterns 和 fusion methods；最后得出 DWT / Wavelet Fusion 整体最有效，2-4 张图通常最有利于 sharpness，动态照明的帧间等待约 0.3 s 后图像质量趋稳。

![[papers/images/redkin2024dynamic-illumination/teaser_page1.png|700]]

Fig. 1 是全文主线图：take measurements with different illumination（不同照明下采多帧），apply image fusion method（应用融合方法），get better measurements（得到更好测量）。这篇论文的贡献不在新传感器硬件，而在利用已有可控 LED 的传感器能力。

## 贡献与结论对照

| 贡献 | 方法位置 | 证据位置 | 结论 |
| --- | --- | --- | --- |
| 引入 dynamic lighting for VBTS | Sec. IV Task definition | Fig. 1、Fig. 4 | 对同一接触状态拍摄多照明图像可提升图像质量 |
| 证明 dynamic lighting + image fusion 可增强测量 | Sec. V-A/C | Fig. 4、Fig. 5 | 与标准 DIGIT illumination 相比，融合后 contrast / sharpness / background difference 可提升 |
| 比较融合方法 | Sec. III-C、Sec. V-D/E | Fig. 6 | Wavelet / DWT 整体最强；Laplacian、Channelwise Sum 各有偏向 |
| 分析融合图像数量 | Sec. V-F | Fig. 7 | sharpness 多数情况下 2-4 张图最佳；contrast 常由单个最优照明图达到 |
| 分析时间成本 | Sec. V-G | Fig. 8 | 低于 0.1 s 的帧间等待不稳定；约 0.3 s 后 contrast 进入平台期 |

## Abstract

摘要先指出 VBTS 使用 structured light 来测量 elastomeric interface 的形变。传统 DIGIT / GelSight 类传感器通常只使用一套 static pattern of structured light（固定结构光模式）。作者认为这限制了不同材料和不同表面条件下的成像质量。

论文提出的方法是：capture multiple measurements（采集多个测量），每个测量使用不同 illumination pattern，然后通过 image fusion 得到 single, higher-quality measurement（单个更高质量测量）。实验显示 dynamic illumination 能显著改善 contrast（对比度）、sharpness（清晰度）和 background difference（相对背景差异）。作者强调，这可能让已有传感器通过软件更新回溯式提升 sensing quality，也为新硬件设计提供动态照明方向。

## I. Introduction

引言从 robot haptic exploration（机器人触觉探索）讲起：触觉传感器帮助机器人检测接触、避免碰撞、精细操作和安全交互。VBTS 的优势是可以通过图像捕捉 surface deformation（表面形变），用于推断 force、texture、shape 等信息。

但 VBTS 的成像质量直接影响后续模型。很多 state-of-the-art 方法会把 tactile images 输入 deep neural networks（深度神经网络），如果输入图像本身 contrast 低、sharpness 差、背景变化不明显，下游任务自然受影响。作者把问题转成：能不能在不重新设计传感器主体的情况下，通过动态照明提升输入图像质量？

引言列出的贡献有五点：

- 提出 dynamic lighting for vision-based tactile sensors，并展示使用方法；
- 证明 dynamic lighting + image fusion 可以增强传感器测量；
- 找出与 dynamic lighting 配合最有效的 image fusion method；
- 确定 optimal output image quality 所需的图像数量；
- 分析有效应用 dynamic lighting 所需的时间。

## II. Related Work

### A. Illumination in Vision-Based Tactile Sensors

相关工作指出，以前 VBTS 研究也关心光源设计，但主要是在 design time（设计阶段）优化光源位置、颜色组合或结构。比如更多光源可以改善 elastomer 表面的光照分布；RGB 单色光组合会影响 3D reconstruction；去掉 structured light 的颜色信息会削弱 force prediction。

本文与这些工作的区别是：它不是只问“传感器应该装什么灯”，而是问“同一个传感器在测量时能否动态改变灯光，并把多次照明结果融合起来”。这让照明从静态硬件参数变成测量策略的一部分。

### B. Active Illumination for Photogrammetry

作者把 dynamic lighting 放到 active illumination（主动照明）和 photogrammetry（摄影测量）背景中。视觉领域中，多光源、time-multiplexed illumination（时间复用照明）和 LED array microscopy（LED 阵列显微）早就用于增强透明样本、边缘或反射信息。

这个类比很关键：触觉传感器内部相机看到的是“被接触改变的光学表面”，所以它也可以受益于多光源观测。只是以前这种思想没有系统应用到 vision-based tactile sensing 的图像质量增强上。

### C. Image Fusion

image fusion 被定义为一个 mapping：

$$
f: \{I_1, I_2, ..., I_n\} \to I^*
$$

其中 $I_1, I_2, ..., I_n$ 是同一接触状态下不同 illumination patterns 得到的图像，$I^*$ 是融合后的图像。本文讨论的融合方法包括：

- Channelwise Sum：把不同图像中的颜色通道相加或组合，简单但可能有效；
- Brovey Fusion：常用于多源图像融合，强调颜色/强度重分配；
- Laplacian Pyramid：把图像分解到多个尺度，在不同尺度上选择或组合细节；
- DWT Fusion：通过 wavelet decomposition（小波分解）融合 approximation/detail coefficients，再重建图像。

这部分的阅读重点是：作者不是提出新的融合算法，而是评估现有 fusion algorithms 在 tactile image enhancement 场景中是否有效。

## III. Background

### A. Vision-based Tactile Sensors

本文用 DIGIT 作为实验对象。DIGIT 是 compact and versatile（紧凑且通用）的视觉触觉传感器，内部有相机和 RGB LEDs。当物体接触 elastomer 时，表面形变改变相机看到的图像；模型或算法再从图像中推断接触信息。

由于 DIGIT 可以调节 red、green、blue LEDs，这使它天然适合验证 dynamic illumination。本文默认标准照明是 `(15,15,15)`，即三个 LED 都以最大强度工作。

### B. Active Illumination

active illumination 的核心是主动控制光照以提取更多信息。对触觉传感器来说，不同颜色和方向的光可以突出不同的表面形变、纹理和阴影。某些材料在白光或全 RGB 下可能细节不明显，但在偏绿、偏蓝或混合照明下可能更容易分离背景和接触区域。

### C. Image Fusion Methods

本文方法背后的直觉是：不同照明下的图像各自“看到”不同信息。一个照明可能让边缘更清晰，另一个照明可能让背景差异更大，第三个照明可能让纹理更可见。image fusion 的目标就是把这些互补信息合成到一张图里。

![[papers/images/redkin2024dynamic-illumination/coin_different_illumination_page1.png|700]]

Fig. 2 展示 coin 在不同 illumination settings 下的图像：同一物体接触状态没有变，但图像里的纹理、反射和颜色响应明显不同。这说明“只用一套静态照明”可能会浪费可用信息。

## IV. Dynamic Illumination for Vision-Based Tactile Sensors

### A. Task Definition

作者把问题形式化为一个优化任务：

$$
\arg\max_{\Theta,n,f} P(f(I_{\theta_1}, I_{\theta_2}, ..., I_{\theta_n}))
$$

其中：

- $\Theta = \{\theta_1,\theta_2,...,\theta_n\}$ 是选择的 illumination patterns；
- $\theta_i$ 是第 $i$ 张图的 RGB LED intensity setting；
- $n$ 是 image budget（用于融合的图像数量）；
- $f$ 是 image fusion method；
- $P$ 是 image quality metric，例如 sharpness、contrast 或 difference with background；
- $I_{\theta_i}$ 是在照明模式 $\theta_i$ 下拍到的 tactile image。

这个公式把三个设计选择绑在一起：选哪些灯光、拍几张图、用什么融合算法。它也说明本文不是只在调 LED，而是在探索一个“动态照明传感策略”。

### B. Metrics

作者承认“最好的图像质量指标”并没有唯一答案，因为下游任务可能不同。因此实验使用三个常见指标。

**1. Gradient-based Sharpness**

sharpness 用图像强度在 x/y 方向的梯度来衡量：

$$
S = \frac{1}{N}\sum_{i=1}^{N}\left[\left(\frac{\partial I}{\partial x_i}\right)^2 + \left(\frac{\partial I}{\partial y_i}\right)^2\right]
$$

直观上，如果接触边缘、纹理和局部变化更明显，梯度会更大，sharpness 更高。

**2. Root Mean Squared Contrast**

RMS contrast 定义为：

$$
C_{rms} = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(I_i-\mu)^2}
$$

其中 $I_i$ 是第 $i$ 个像素强度，$\mu$ 是平均像素强度，$N$ 是像素数量。它衡量图像像素围绕平均值的变化幅度。

**3. Difference with Background**

background difference 定义为：

$$
D = \frac{1}{N}\sum_{i=1}^{N}|I_i-B_i|
$$

其中 $B$ 是无接触时的 background image。这个指标衡量“接触图像相对无接触背景改变了多少”，对检测接触区域很重要。

## V. Experimental Results

实验部分围绕四个问题展开：

- 能否用 dynamic lighting + image fusion 增强 DIGIT 的 measurement quality？
- 能否同时改善多个指标？
- 哪种 fusion method 最适合 dynamic lighting？
- dynamic lighting 的时间成本是多少？

实验硬件是标准 DIGIT，带三个 LED：red、green、blue。每个 LED 强度范围是 0-15。作者把传感器固定在 frame 上，保证不同 illumination settings 下的多张图来自同一接触位置。

![[papers/images/redkin2024dynamic-illumination/materials_page1.png|700]]

Fig. 3 展示实验物体，包括 coin、plastic yarn、yarn ball、white material、yellow brush、grid、wooden sticks cut、Lego。论文后续还把 coin 两面当作不同对象，因此有些实验描述中会出现 9 objects。

### A. Proof-of-concept

第一个实验问的是：标准照明 `(15,15,15)` 下的图像，能不能与另一个不同 illumination setting 下的图像融合后变好？

作者对 coin 进行测试，改变 RGB LED 强度，得到不同照明图像；每张图都与标准 DIGIT illumination `(15,15,15)` 下的 reference image 用 DWT Fusion 融合。然后计算 contrast 和 sharpness。

![[papers/images/redkin2024dynamic-illumination/heatmap_contrast_page1.png|700]]

![[papers/images/redkin2024dynamic-illumination/heatmap_sharpness_page1.png|700]]

Fig. 4 的热力图显示，不同第二照明帧对融合结果影响很大。文中报告：加入 only green and blue LEDs on 的 `(0,10,3)` 图像时，contrast 提升最大；sharpness 也在 `(0,10,3)` 设置下提升最明显。这证明 dynamic illumination 不是噪声，而是确实能提供互补信息。

### B. Data Collection

更大规模实验对所有物体采集数据。流程分两步：

1. Background image collection：对每个 illumination tuple `(r,g,b)`，在无接触状态下采 100 张图并平均，作为该照明下的 background image。
2. Object image collection：让物体接触传感器，然后对每个 illumination tuple 采集 object image。

论文中提到后续实验使用 23 个 illumination settings；在图像数量实验中，又使用 $\theta=(r,g,b)$ 且 $r,g,b \in \{0,1,5,15\}$ 的组合，并扩展到 130 个对象。

### C. Enhancing Image Quality

作者先用 Channelwise Sum，把只开红灯 `(15,0,0)`、只开绿灯 `(0,15,0)`、只开蓝灯 `(0,0,15)` 的图像融合。然后扩展到更多照明组合，例如 `(15,15,0)`、`(0,15,15)`、`(15,10,5)`，并使用 Laplacian Pyramid 处理 2 张或 3 张图。

![[papers/images/redkin2024dynamic-illumination/methods_resulting_images_page1.png|700]]

Fig. 5 直观比较了 coin 和 Lego 在 static lighting、Channelwise Sum、Laplacian Pyramid、Brovey、Wavelet 下的结果。可以看到不同融合方法的风格不一样：有的更强调边缘，有的更强调颜色/纹理，有的背景差异更明显。

### D. Metrics and the Most Effective Method

这部分问两个问题：三个指标之间是否能同时提升？哪种 method 最可能同时优化所有指标？

作者对 1-5 个 illumination settings 的所有组合应用不同 fusion techniques，并计算融合结果的 metrics。综合方法、照明组合和对象之后，作者认为 DWT-based method 最有可能同时优化多个指标。

### E. Experimental Results

作者先分别找出每个 metric 下最好的 illumination + fusion pair，再取这些集合的交集，得到能跨指标表现好的组合。最终结论是：dynamic illumination + image fusion 能同时改善 contrast、sharpness、background difference 和 human perception。

![[papers/images/redkin2024dynamic-illumination/exp_res_all_page1.png|700]]

Fig. 6 是跨物体平均结果。图题说明：

- Laplacian Pyramid 提升 background difference 和 contrast；
- Channelwise Sum 提升 background difference 和 sharpness；
- Wavelet 和 Brovey 能同时增加所有 metrics；
- 整体上 Wavelet methods 提供最高的 image metrics increase。

尤其值得记的是 `(15,15,15)` 和 `(0,15,0)` 这组照明配合 Wavelet Transform Image Fusion 表现突出。这对实际使用很有价值：如果只想简单升级已有 DIGIT 工作流，可以优先尝试标准全亮图 + 绿光图 + Wavelet fusion。

### F. Number of Images

前面的实验融合了 2-4 张图，但实际系统需要知道“拍几张最合适”。作者因此做了额外实验：使用 130 个 objects，每个对象在所有 $\theta=(r,g,b)$ 且 $r,g,b \in \{0,1,5,15\}$ 的照明组合下拍摄图像，并使用 WDT / DWT Image Fusion。

作者用 greedy strategy（贪心策略）构造长度从 1 到 12 的 illumination sequence。长度为 1 时，选择让 metric $P$ 最大的单张图：

$$
\theta_1^* = \arg\max_{\theta_1} P(I_{\theta_1})
$$

长度为 $m+1$ 时，在已有最优序列上再加一个 illumination setting，使融合后的指标最大。最终每个对象的最优图像数量定义为：

$$
n^* = \arg\max_{n \in N} P(F(I_{\theta_i^*}))
$$

![[papers/images/redkin2024dynamic-illumination/n_images_sharpness_page1.png|700]]

![[papers/images/redkin2024dynamic-illumination/n_images_contrast_page1.png|700]]

Fig. 7 的结论很实用：多数对象的 sharpness 最优图像数量在 2-4 张；contrast 则常常一张最优照明图就足够。继续增加图像并不总是更好，甚至可能降低融合质量。这提醒我们 dynamic illumination 不是“拍越多越好”，而是需要针对指标和对象选择。

### G. Time and Image Quality

动态照明的成本是 latency（延迟）：同一次接触要换灯、拍多帧、再融合。作者用一个对象、三种 lighting settings 和 Wavelet fusion 测试帧间等待时间，从 0 到 0.6 s，并对每个 waiting time 采 100 次测量。

![[papers/images/redkin2024dynamic-illumination/ci_contrast_and_sharpness_page1.png|700]]

Fig. 8 显示，小于 0.1 s 的帧间等待会导致 metrics 高方差，图像质量不稳定；随着等待时间增加，contrast 和 sharpness 更稳定并超过 static illumination。约 0.3 s 后 contrast 基本不再继续明显增长。作者给出的实用结论是：对 3 个 illumination settings，约 0.29 s between frames 会得到约 1.1 FPS。

这也是本文最大的工程 tradeoff：dynamic illumination 能提升图像质量，但如果机器人任务需要高频闭环控制，必须权衡 frame rate、融合图像数量和下游任务容忍的延迟。

## VI. Conclusion

结论重申：传统 VBTS 使用 design-time optimized static illumination，而本文提出用 dynamic illumination and image fusion 来增强传感图像。实验显示动态照明能显著改善 contrast、sharpness 和 background differentiation；在比较的多种融合方法中，Discrete Wavelet Transform Image Fusion 是最有效的。

未来工作有两条：一是把 dynamic illumination 用到更复杂的传感器，例如 Digit360，它有 8 个 fully controllable RGB LEDs；二是把问题形式化扩展成 object dependent，即最优照明和融合策略可能随物体而变化。

## 局限与可追问点

- 下游任务缺失：论文评估的是 image quality metrics，没有直接报告 force estimation、texture recognition、slip detection 或 manipulation success 的提升。
- 硬件范围有限：主要实验在 DIGIT 上，虽然结论指向所有可动态控制照明的 VBTS，但还需要在 GelSight、Digit360 或其他多光源传感器上验证。
- 延迟问题明显：3 个 illumination settings 已经约 1.1 FPS；若要闭环控制，需要更快 LED switching、并行采集或更少图像的策略。
- 指标与任务关系待验证：contrast / sharpness 更高不必然等于下游模型表现更好，需要用具体任务模型进一步确认。
- 最优策略可能对象相关：不同材料、颜色、反射性和纹理可能需要不同 illumination sequence，通用固定策略可能不是最优。

## 与库内文献的连接

- 与 [[@kota2026-3dcal]] 的关系：3D Cal 关注 VBTS 的 calibration data collection 和 depth reconstruction；本文关注同类传感器的 illumination / image acquisition quality。前者解决“如何标定”，后者解决“如何拍得更好”。
- 与 [[@yuan2017gelsight]] 的关系：GelSight 依赖光学成像和结构光/表面反射；本文可作为理解 GelSight 类传感器照明设计的补充。
- 与 [[@li2025vbts-classification-review]] 的关系：分类综述提供 VBTS 设计空间；本文是 optical illumination and sensing pipeline 方向的具体增强方法。
