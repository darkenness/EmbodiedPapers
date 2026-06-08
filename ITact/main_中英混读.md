# ITact: Calibration-Efficient Spatially Adaptive Depth Mapping for External-Reflective Monochrome Vision-Based Tactile Sensing（中英混读）

> 来源：[[main]]
> 说明：本稿按当前 `ITact/main.md` 的 LaTeX 结构同步整理。原稿中的 `TBD`、`PLAN/REWRITE`、`UNVERIFIED/OPTIONAL` 与注释性占位会保留为状态提示；未给出的实验数值不补造。

## 核心词汇速查

| English（中文） | 在本文中的含义 |
|---|---|
| Vision-based tactile sensing（基于视觉的触觉传感） | 通过相机观察接触引起的软材料形变，把触觉接触状态转换为图像信号。 |
| Monochrome tactile image（单色触觉图像） | ITact 使用的单通道灰度图输入，目标是降低 RGB 光度立体和多通道标定复杂度。 |
| External-reflective stack（外反射式光学堆叠） | ITact 的硬件编码结构：反射界面靠近接触表面，使压入改变局部反射返回强度。 |
| Deep-is-bright（越深越亮） | ITact 目标响应：在标定有效范围内，压入越深，参考相减后的局部亮度越高。 |
| Lookup table, LUT（查找表） | 从亮度变化 $\Delta I$ 到深度 $d$ 的映射；优点是快速、可解释、部署简单。 |
| Global LUT（全局查找表） | 假设同样的亮度变化在传感面任何位置都对应相似深度的一维 LUT。 |
| Spatial-uniformity approximation（空间均匀近似） | 全局 LUT 的关键假设，也是本文要补偿的问题来源。 |
| Spatially Adaptive LUT, SA-LUT（空间自适应查找表） | 本文方法：用全局单调 LUT 表示主响应，再用空间 gain-bias field 修正位置相关残差。 |
| Spatial gain-bias field（空间增益-偏置场） | $a(x,y)$ 与 $b(x,y)$，用于表示不同位置响应斜率和偏置的低维平滑修正。 |
| Spherical indentation（球形压头压入） | 标定方式：用球形压头产生接触圆，并由球冠几何生成逐像素深度标签。 |
| Spherical-cap depth label（球冠深度标签） | $d_{\mathrm{geo}}(\rho)$，由压头半径、接触圆半径和径向距离计算得到。 |
| Boundary-aware sample filtering（边界感知样本过滤） | 排除接触圆边界附近样本，避免圆拟合误差、模糊和非理想接触力学污染 LUT 拟合。 |
| Base-depth span（基础深度跨度） | 某 tile 内全局 LUT 输出深度范围，用于判断局部 gain-bias 拟合是否可靠。 |
| Sample-wise validation split（按样本划分验证） | 同一张压入图的像素不拆分到训练和验证两边，避免共享圆标注造成泄漏。 |
| High-low differential imaging（高低光强差分成像） | 可选标注辅助，用于增强接触圆边缘；不属于在线 SA-LUT 推理路径。 |

## 论文主线

这版 `main.md` 的主线更集中：视觉触觉可以恢复高分辨率接触几何，但现有路线在 accuracy（精度）、calibration cost（标定成本）和 deployment simplicity（部署简洁性）之间有取舍。GelSight-style sensors（GelSight 风格传感器）能用反射弹性体和 calibrated optical shading（经标定光学阴影）恢复接触几何，但往往需要复杂照明、光度标定和材料制备；DTact / 9DTact 证明了 direct monochrome intensity mapping（直接单色强度映射）可以低成本地从灰度图恢复几何，但全局 LUT 依赖 spatial-uniformity approximation（空间均匀近似）。

ITact 的硬件想解决的是“如何把单通道图像变成可查表的深度信号”。它采用 external-reflective optical stack（外反射式光学堆叠），让压入改变局部反射返回路径，并在标定有效范围内产生 positive monotonic deep-is-bright response（正向单调越深越亮响应）。但这种硬件堆叠又会受到 light-band geometry（光带几何）、reflective coating（反射涂层）、elastomer deformation（弹性体形变）、viewing configuration（观察配置）和 boundary light-pipe conditions（边界导光条件）的影响，所以真实映射更像 $f(\Delta I,x,y)$，不是单纯的 $g(\Delta I)$。

SA-LUT 是论文提出的折中方案：保留全局 monotonic brightness-depth LUT（单调亮度-深度查找表）作为主响应，再用低维 $8\times8$ spatial gain-bias field（空间增益-偏置场）补偿结构化位置误差。标定部分用 spherical indentation（球形压入）生成几何深度标签，配合人工可核验圆标注、边界样本过滤和标定密度评估，验证这种轻量空间修正是否能在低标定成本下接近更密集的空间标定。

## 贡献与结论对照

| 贡献 / Contribution | 方法钩子 / Method hook | 需要的证据 / Evidence in manuscript | 当前结论状态 |
|---|---|---|---|
| External-reflective monochrome tactile encoding and characterization（外反射式单色触觉编码与表征） | 设计外反射单通道结构，使压入在标定范围内产生正向单调 deep-is-bright 响应。 | MVR、动态范围、饱和行为、多位置亮度-深度曲线、空间斜率热图、恢复时间。 | 设计逻辑已完整；响应表征表仍为 `[TBD]`。 |
| Calibration-efficient Spatially Adaptive LUT（低标定成本空间自适应 LUT） | 把 $f(\Delta I,x,y)$ 分解为全局单调 LUT 和低维空间 gain-bias field：$\hat d=a(x,y)g(\Delta I)+b(x,y)$。 | global LUT、radial SA-LUT、tile SA-LUT、dense per-pixel LUT 的 MAE/RMSE/edge MAE/runtime 对比。 | 方法与拟合目标已完整；主消融表仍待实验数值。 |
| Reproducible low-cost spherical-indentation calibration（可复现低成本球形压入标定） | 人工可核验 contact-circle annotation（接触圆标注）、boundary-aware filtering（边界过滤）、sample-wise split（按样本划分）和 calibration-density evaluation（标定密度评估）。 | 圆心/半径重复标注误差、传播深度不确定性、边界带消融、stage-depth discrepancy、标定密度曲线。 | 协议已描述；可靠性结果仍为 `[TBD]`。 |

## Title（标题）

**ITact: Calibration-Efficient Spatially Adaptive Depth Mapping for External-Reflective Monochrome Vision-Based Tactile Sensing**

中文含义：**ITact：用于外反射式单色视觉触觉传感的低标定成本空间自适应深度映射**。

标题中的三层含义是：硬件是 external-reflective monochrome tactile sensing（外反射式单色触觉传感），任务是 indentation-depth mapping（压入深度映射），方法是 calibration-efficient SA-LUT（低标定成本空间自适应查找表）。

## Author and Manuscript Status（作者与稿件状态）

作者、IEEE 会员身份、卷期信息仍是 `[TBD]`。LaTeX preamble 中定义了几类写作状态：

- `[TBD: ...]`：待填真实作者、设备参数或实验结果。
- `[PLAN/REWRITE: ...]`：实验计划或最终结果写作提示。
- `[UNVERIFIED/OPTIONAL: ...]`：尚未由实验支持的可选说法，最终稿应谨慎保留。

## Abstract（摘要）

Vision-based tactile sensors（基于视觉的触觉传感器）可以恢复 dense contact geometry（稠密接触几何），但现有方法经常在 reconstruction accuracy（重建精度）、calibration cost（标定成本）和 deployment simplicity（部署简洁性）之间取舍。RGB photometric tactile sensors（RGB 光度触觉传感器）需要 calibrated multi-channel illumination（经标定多通道照明），而 direct single-channel lookup-table methods（直接单通道查找表方法）更轻量，并依赖 spatially uniform intensity-depth response（空间均匀的亮度-深度响应）。

本文提出 ITact，一种 external-reflective monochrome tactile sensing structure（外反射式单色触觉传感结构），以及 Spatially Adaptive LUT, SA-LUT（空间自适应查找表），用于 calibration-efficient indentation reconstruction（低标定成本压入重建）。外反射光学堆叠把压入转换为标定工作范围内的 positive monotonic deep-is-bright response（正向单调越深越亮响应），为 single-channel depth reconstruction（单通道深度重建）提供物理基础。

标定数据用来表征由 light-band geometry（光带几何）、reflective coating（反射涂层）、elastomer deformation（弹性体形变）、viewing configuration（观察配置）和 boundary light-pipe conditions（边界导光条件）造成的 structured position-dependent variation（结构化位置相关变化）。SA-LUT 通过 global monotonic brightness-depth lookup table（全局单调亮度-深度查找表）和 low-dimensional spatial gain-bias field（低维空间增益-偏置场）补偿这种变化，在避免 dense per-pixel calibration（密集逐像素标定）和 large end-to-end networks（大型端到端网络）的同时保留 lookup-style inference（查表式推理）。

Spherical-indentation protocol（球形压入协议）结合 human-verifiable circle annotation（人工可核验圆标注）和 boundary-aware sample filtering（边界感知样本过滤），为拟合和评估提供几何标签。评估关注 response monotonicity（响应单调性）、structured spatial residuals（结构化空间残差）、global/radial/tile ablations（全局/径向/tile 消融）、calibration density（标定密度）和 label reliability（标签可靠性）。

原稿状态：`[TBD: Replace the final evaluation sentence with quantitative results once experiments are complete.]`。也就是说，最后一句评估概述应在实验完成后替换为定量结果。

## IEEEkeywords（关键词）

Vision-based tactile sensing（视觉触觉传感）、monochrome tactile sensor（单色触觉传感器）、external reflective layer（外反射层）、lookup table（查找表）、spatial calibration（空间标定）、low-cost calibration（低成本标定）。

## Introduction（引言）

Vision-based tactile sensing（基于视觉的触觉传感）把 contact-induced deformation（接触引起的形变）转成可用于 robotic manipulation（机器人操作）的图像。GelSight-style systems（GelSight 风格系统）这类高分辨率触觉传感器通过 reflective elastomers（反射弹性体）和 calibrated optical shading（经标定光学阴影）恢复接触几何 \cite{gelsight}。更轻量的路线是 direct monochrome intensity mapping（直接单色强度映射）：DTact 和 9DTact 表明，当光学响应足够结构化时，single-channel grayscale tactile images（单通道灰度触觉图像）可以用 low-cost lookup-table calibration（低成本查找表标定）映射到接触几何 \cite{dtact,ninedtact}。这些工作引出一个部署问题：能否把压入编码为简单单调单通道响应，并在避免密集逐像素标定和高容量学习的同时补偿剩余空间非均匀性？

Global single-channel lookup table（全局单通道 LUT）有吸引力，因为它 interpretable（可解释）、fast（快速）且 easy to deploy（易部署）。但它依赖 spatial-uniformity approximation（空间均匀近似）：同样的 intensity change（强度变化）应在整个 sensing surface（传感面）上对应相似 indentation depth（压入深度）。在 external-reflective tactile imaging（外反射触觉成像）中，这个近似会受到限制。ITact 把 reflective interface（反射界面）放在靠近可变形接触表面的位置，使压入改变局部 return path（返回路径）并产生 deep-is-bright response（越深越亮响应）。这种光学编码提供单通道深度重建的物理基础，但亮度-深度关系也同时受到 light-band position（光带位置）、incidence angle（入射角）、reflective-layer coating（反射层涂层）、elastomer deformation（弹性体形变）、lens vignetting（镜头暗角）、sidewall reflection（侧壁反射）和 camera viewing configuration（相机观察配置）的影响。因此理想逆模型更应写成空间变化响应 $f(\Delta I,x,y)$，而不是纯全局映射 $g(\Delta I)$。

-----

Spatial dependence（空间依赖）可以用多种方式表示。Dense per-pixel lookup table（密集逐像素查找表）可以表达完整响应，但标定成本会随空间 bin 和强度等级增长。Learning-based tactile reconstruction（学习式触觉重建）能建模更复杂的非线性映射，但需要额外数据采集、训练和传感器特定适配。Coordinate-aware tactile reconstruction methods（坐标感知触觉重建方法）如 GelSight Wedge 和 large-scale VBTS calibration frameworks 表明，显式 position information（位置信息）有助于补偿 illumination propagation（照明传播）和 sensor-specific spatial variation（传感器特定空间变化）\cite{gelsight_wedge,large_scale_vbts}。ITact 选择 lookup-compatible path（与查找表兼容的路径）：保留全局单调 brightness-depth mapping（亮度-深度映射）作为主响应，用低维空间修正场补偿剩余的位置相关增益和偏置。

因此，Spatially Adaptive LUT, SA-LUT（空间自适应查找表）被定位为 global LUT（全局 LUT）和 dense per-pixel calibration（密集逐像素标定）之间的低成本折中。它保留一维 monotonic LUT（单调查找表）来表示主导亮度-深度关系，并引入 smooth spatial gain-bias fields（平滑空间增益-偏置场）来修正结构化残差。详细形式和拟合过程在 `sec:sa_lut_method` 中展开。

### Main Contributions（主要贡献）

1. **External-reflective monochrome tactile encoding and characterization（外反射式单色触觉编码与表征）**：设计并表征外反射式单通道触觉结构，使压入深度在标定工作范围内转换为正向单调强度响应；进一步表征反射层、光带几何、涂层过程、弹性体形变和观察配置共同带来的结构化空间响应变化。
2. **Calibration-efficient Spatially Adaptive LUT（低标定成本空间自适应 LUT）**：提出 SA-LUT，把空间变化映射 $f(\Delta I,x,y)$ 分解为 global monotonic LUT（全局单调 LUT）和 low-dimensional spatial gain-bias field（低维空间增益-偏置场），在保持查表式推理的同时补偿位置相关光学响应。
3. **Reproducible low-cost spherical-indentation calibration（可复现低成本球形压入标定）**：建立包含人工可核验圆标注、边界感知样本过滤和标定密度评估的标定协议，为 SA-LUT 提供几何深度标签，并量化空间标定密度与重建精度的折中。

## Related Work（相关工作）

### Direct Monochrome Tactile Reconstruction（直接单色触觉重建）

Direct intensity-based tactile reconstruction（直接强度触觉重建）是 RGB photometric tactile sensing（RGB 光度触觉传感）的轻量替代。DTact 证明，在 structured deep-is-dark optical response（结构化越深越暗光学响应）下，single-channel tactile darkness（单通道触觉暗度）可以通过低成本 LUT 标定映射到 high-resolution contact geometry（高分辨率接触几何）\cite{dtact}。9DTact 进一步把这一家族发展为 compact tactile sensor（紧凑触觉传感器），同时具有 shape reconstruction（形状重建）和 force-estimation capabilities（力估计能力）\cite{ninedtact}。

TacShade 和 R-Tac0 等 monochrome or light/shadow-based systems（单色或光影系统）也表明 grayscale tactile images（灰度触觉图像）可以携带有用几何线索 \cite{tacshade,rtac0}。这些工作支持单通道触觉成像路线，但 global LUT 依赖 spatial-uniformity approximation（空间均匀近似）：同样强度变化在传感面不同位置对应相似深度。ITact 的不同点是研究 external-reflective deep-is-bright response（外反射越深越亮响应），并用低维 gain-bias field 显式建模剩余空间依赖。

### Learning-Based and Coordinate-Aware Tactile Calibration（学习式与坐标感知触觉标定）

Learning-based tactile reconstruction（学习式触觉重建）可以建模复杂的 image-to-geometry mappings（图像到几何映射）；coordinate-aware methods（坐标感知方法）进一步说明 tactile image formation（触觉图像形成）常依赖 pixel location（像素位置）。GelSight Wedge 使用 RGBXY mapping 补偿 illumination propagation（照明传播）和 sensor-internal spatial variation（传感器内部空间变化）\cite{gelsight_wedge}。Large-scale VBTS calibration work 说明 position information（位置信息）和 differential inputs（差分输入）可提高多传感器标定效率 \cite{large_scale_vbts}。3D Cal 等 automated calibration frameworks（自动标定框架）使用 probing hardware（探测硬件）和 coordinate-aware neural models（坐标感知神经模型）降低标定负担 \cite{touch_cal}。

这些方法证明显式空间信息有价值，但通常依赖 RGB/RGB-difference learning pipelines（RGB 或 RGB 差分学习流程）、自动探测或训练神经模型。ITact 借用“空间依赖需要显式建模”的洞见，但把它压缩成 lookup-compatible form（查找表兼容形式）：全局单调 LUT 后接低维空间修正场。

### Optical Stack Design and Fabrication Effects（光学堆叠设计与制造影响）

Tactile optical stack（触觉光学堆叠）强烈决定可测图像响应。已有系统表明，elastomer hardness（弹性体硬度）、layer thickness（层厚）、reflective coating（反射涂层）、light routing（光路）、housing geometry（外壳几何）和 illumination configuration（照明配置）会影响触觉对比度、精度与耐久性 \cite{gelslim,pbr_design}。DIGIT、GelSlim 等紧凑系统也强调 packaging（封装）、illumination routing（照明布置）和 fabrication repeatability（制造重复性）对可部署传感的重要性 \cite{digit,gelslim}。

ITact 把 external-reflective stack（外反射堆叠）视为 response-shaping mechanism（响应塑形机制）：它为单通道深度重建产生 positive deep-is-bright response，同时也通过 coating variation（涂层变化）、light-band geometry（光带几何）、local deformation（局部形变）、viewing angle（观察角度）和 boundary light-pipe conditions（边界导光条件）引入位置相关增益和偏置。这种硬件诱导的变化正是 SA-LUT 使用空间 gain-bias correction 的原因。

### Spherical-Indentation Labels and Boundary Reliability（球形压入标签与边界可靠性）

LUT depth calibration（查找表深度标定）需要与触觉图像形成一致的 geometric labels（几何标签）。Spherical indentation（球形压入）可以从标注接触圆生成 dense depth labels（稠密深度标签），但 circle-center and radius errors（圆心和半径误差）会直接传播到 spherical-cap depth map（球冠深度图）。Boundary pixels（边界像素）还容易受到 blur（模糊）、non-ideal contact mechanics（非理想接触力学）和 contact-edge localization errors（接触边缘定位误差）的影响。

Illumination-difference methods（照明差分方法）可以让几何边界更可见：dynamic illumination（动态照明）改善触觉图像对比度和清晰度 \cite{dynamic_illumination}；multi-flash imaging（多闪光成像）显示照明变化可增强深度边界 \cite{multi_flash}。在 ITact 中，这类线索只作为 optional annotation aid（可选标注辅助）；主标定协议依赖 human-verifiable circle annotation（人工可核验圆标注）、boundary-aware sample filtering（边界感知样本过滤）和 calibration-density analysis（标定密度分析）。

## Sensor Design and Image Formation（传感器设计与图像形成）

标签：`sec:sensor_design`。

### Design Requirements（设计要求）

ITact 围绕四个要求设计：

1. 使用 single optical imaging path（单一光学成像路径）和 monochrome tactile image（单色触觉图像），降低同步、颜色标定和处理复杂度。
2. 接触模块是 markerless（无标记）的，不需要 printed dots（印刷点）、grids（网格）或 tracked visual features（被追踪视觉特征）。
3. External-reflective optical stack（外反射光学堆叠）应产生可重复的 deep-is-bright response，使压入能从标定工作范围内的单调强度趋势推断。
4. Decoding pipeline（解码流程）应保持 lightweight（轻量）、interpretable（可解释），并可部署为 lookup tables（查找表）和 low-dimensional spatial fields（低维空间场）。

### External-Reflective Response Shaping（外反射响应塑形）

External-reflective layer（外反射层）是 monochrome optical stack（单色光学堆叠）中的 response-shaping interface（响应塑形界面）。它增强 indentation-dependent return intensity（压入相关返回强度），提高 contact-patch separability（接触斑块可分性）。同一光学配置也会因为 light-band distance（光带距离）、coating variation（涂层差异）、local deformation（局部形变）、viewing angle（观察角度）和 boundary light-pipe conditions（边界导光条件）引入 position-dependent gain and offset（位置相关增益与偏置）。SA-LUT 用低维空间修正场建模这些项。

时刻 $t$ 的触觉图像表示为：

$$
\mathbf{I}_t \in \mathbb{R}^{H \times W}
$$

给定 no-contact reference image（无接触参考图）$\mathbf{I}_0$，响应图为：

$$
\Delta \mathbf{I}_t = \mathcal{N}(\mathbf{I}_t,\mathbf{I}_0)
$$

其中 $\mathcal{N}$ 是 calibration（标定）和 runtime inference（运行时推理）中一致使用的 preprocessing function（预处理函数）。简单实现是 reference subtraction（参考图相减），再进行 thresholding（阈值化）、clipping（裁剪）和 smoothing（平滑）。归一化替代形式为：

$$
\Delta \mathbf{I}_t =
\frac{\mathbf{I}_t-\mathbf{I}_0}{\mathbf{I}_0+\epsilon}
$$

ITact 的目标是 empirical operating regime（经验工作区间）：排除 saturated pixels（饱和像素）和 boundary pixels（边界像素）后，reference-subtracted response（参考相减响应）随 geometric indentation depth（几何压入深度）增加。Deep-is-bright 不被当作全局物理定律，而是通过 monotonicity violation rate（单调性违例率）、dynamic range（动态范围）和 saturation behavior（饱和行为）来表征。

紧凑的 image-formation view（图像形成视角）为：

$$
I(d,x,y) \approx
G(x,y)\rho_{\mathrm{eff}}(d,\theta,\phi)
\exp[-2\alpha L(d,x,y)] + c(x,y)
$$

变量解释：

- $G(x,y)$：spatial illumination gain（空间照明增益）。
- $\rho_{\mathrm{eff}}$：effective return factor（有效返回因子），由局部几何和材料散射决定。
- $L(d,x,y)$：effective optical path length（有效光路长度）。
- $c(x,y)$：background term（背景项）。

响应塑形目标是让 indentation-dependent return-efficiency changes（压入相关返回效率变化）在标定范围内可测。$G$、$L$、$\rho_{\mathrm{eff}}$ 和 $c$ 的空间依赖解释了为什么全局 $\Delta I\mapsto d$ 映射会留下结构化残差。

### Hardware Design Choices（硬件设计选择）

Table `tab:design_tradeoff` 总结硬件选择如何服务 response-shaping goal（响应塑形目标），以及它们引入哪些 calibration-relevant effects（标定相关影响）。这些影响决定标定时需要表征的主要 spatial gain（空间增益）、offset（偏置）、boundary（边界）和 repeatability（重复性）项。

原稿状态：`[TBD: Add a cross-section schematic showing the contact surface, reflective layer, elastomer, lightband, camera path, sidewall or boundary path, and near-/far-lightband regions.]`

### Table 1. Hardware Design Choices and Calibration-Relevant Effects（硬件设计选择与标定相关影响，`tab:design_tradeoff`）

| Component | Design trade-off |
|---|---|
| External reflective layer | Strengthens indentation-dependent return intensity for deep-is-bright encoding（增强越深越亮编码所需的压入相关返回强度）；may introduce coating nonuniformity, saturation, and spatial gain variation（可能引入涂层非均匀、饱和和空间增益变化）。 |
| Single lightband | Provides compact single-channel illumination（提供紧凑单通道照明）；introduces near-far gain variation and directional falloff（引入近远增益差异和方向性衰减）。 |
| Monochrome camera | Reduces color calibration and computation burden（减少颜色标定和计算负担）；removes color-direction cues available in RGB photometric tactile sensors（去除了 RGB 光度触觉中可用的颜色方向线索）。 |
| Sidewall / optical masking | Suppresses stray light and boundary reflections（抑制杂散光和边界反射）；residual boundary light-pipe artifacts may remain（可能残留边界导光伪影）。 |
| Blade / scrape coating | Enables low-cost reflective-layer fabrication（支持低成本反射层制造）；coating thickness and roughness may vary across units（不同单元的涂层厚度和粗糙度可能变化）。 |
| Elastomer layer | Provides compliant contact deformation（提供柔顺接触形变）；recovery delay, hysteresis, and residual drift must be evaluated（需要评估恢复延迟、滞后和残余漂移）。 |

### Calibrated Output Scope（标定输出范围）

本文主要标定输出是 segmented contact mask（分割接触掩膜）内的 indentation-response depth map（压入响应深度图）。Contact centroid（接触质心）和 contact area（接触面积）是从掩膜派生的辅助量，只用于总结 reconstructed contact patch（重建接触斑块）。Confidence score（置信分数）可以作为实现层面的质量指标，基于 saturation（饱和）、calibrated intensity range（标定强度范围）、segmentation quality（分割质量）和 reference stability（参考图稳定性）。ITact 将 calibrated normal force（标定法向力）、shear force（剪切力）和 slip estimation（滑移估计）留在当前输出范围之外。

## Spherical-Indenter Calibration（球形压头标定）

标签：`sec:spherical_calibration`。

### Contact Patch Segmentation（接触斑块分割）

Contact patch（接触斑块）从响应图中提取。二值 contact mask（接触掩膜）定义为：

$$
\mathbf{B}_t(u,v)=
\begin{cases}
1, & \Delta \mathbf{I}_t(u,v)>\tau,\\
0, & \text{otherwise},
\end{cases}
$$

其中 $\tau$ 是 non-contact baseline threshold（无接触基线阈值），可从标定数据或 adaptive image statistics（自适应图像统计）中选择。Connected-component filtering（连通域过滤）和 small-region removal（小区域移除）产生接触区域 $\Omega_t$。

### Spherical-Cap Depth Labels（球冠深度标签）

Controlled spherical indentation（受控球形压入）为 intensity-depth mapping（强度-深度映射）提供稠密几何标签。对每个 calibration frame（标定帧），生成 reference-subtracted response image（参考相减响应图），并检测或人工核验 circular contact boundary（圆形接触边界）。给定圆心 $(c_x,c_y)$、接触半径 $a$、探针半径 $R$ 和 pixel-to-millimeter scale（像素到毫米尺度），径向距离为 $\rho$ 的像素几何深度为：

$$
d_{\mathrm{geo}}(\rho)
=
\sqrt{R^2-\rho^2}
-
\sqrt{R^2-a^2},
\quad 0\leq \rho \leq a.
$$

这个式子来自 spherical cap（球冠）几何：同一接触圆内部，离圆心越近，几何压入深度越大；边界 $\rho=a$ 处深度为零。Human-verifiable annotation interface（人工可核验标注界面）存储圆心、半径、accepted/rejected status（接受/拒绝状态）和质量信息。接触圆附近的小 band（边界带）样本从 LUT fitting 中排除，因为它们对 circle-fitting error（圆拟合误差）、blur（模糊）和 non-ideal contact mechanics（非理想接触力学）敏感。Calibration points 存储 $\Delta I$、$d_{\mathrm{geo}}$、image coordinates（图像坐标）、sample identity（样本身份）、radial distance（径向距离）和 boundary distance（边界距离），支持 sample-wise validation splits（按样本划分验证）和 calibration-density studies（标定密度研究）。

### Label Validity Checks（标签有效性检查）

球冠标签假设 pixel-to-millimeter scale（像素到毫米尺度）已标定、ROI 已 rectified（校正），并且接触圆准确标注。标签有效性通过 subset repeat annotation（子集重复标注）和 boundary-band ablation（边界带消融）评估。如果 stage displacement（平台位移）可用，还应比较由标注圆推断的最大几何深度与 commanded vertical displacement（命令垂直位移），并拒绝不一致帧。Annotation repeatability（标注重复性）和 propagated depth uncertainty（传播深度不确定性）定义了理解 reconstruction MAE（重建平均绝对误差）时的标签噪声下限。

原稿状态：`[TBD: Report center/radius repeatability, propagated depth uncertainty, boundary-band ablation, and stage-depth discrepancy when available.]`

## Spatially Adaptive LUT（空间自适应 LUT）

标签：`sec:sa_lut_method`。

### Global Monotonic LUT（全局单调 LUT）

Global monotonic lookup table（全局单调查找表）先捕获主导 brightness-depth relation（亮度-深度关系）。对每个 validation split（验证划分），$g$ 只用有效训练标定样本拟合。LUT 锚定于 non-contact baseline（无接触基线）：

$$
g(\Delta I_0)=0
$$

其中 $\Delta I_0$ 表示 preprocessing（预处理）后的 non-contact response（无接触响应）。给定响应值 $\Delta I_i$，全局基础深度为：

$$
z_i=g(\Delta I_i)-g(\Delta I_0)
$$

实现中，$g$ 表示为 metric depth units（公制深度单位）下的 isotonic one-dimensional LUT（保序一维 LUT）。这种 sequential fitting（顺序拟合）先固定全局尺度，再估计空间场。

### Spatial Gain-Bias Field（空间增益-偏置场）

对于理想 spatially uniform sensor（空间均匀传感器），base depth（基础深度）$z_i$ 就足够。但在 external-reflective ITact stack（外反射 ITact 堆叠）中，local response curves（局部响应曲线）可能共享单调趋势，却在 gain（增益）或 offset（偏置）上不同。SA-LUT 用空间增益和偏置场建模这种结构化残差：

$$
\hat d(x,y)=a(x,y)g(\Delta I)+b(x,y)
$$

公式标签：`eq:sa_lut`。

给定训练样本 $(\Delta I_i,x_i,y_i,d_i)$，空间场通过最小化下式拟合：

$$
\min_{a,b}
\sum_i
\left(d_i-a(x_i,y_i)z_i-b(x_i,y_i)\right)^2
+
\lambda_a\|\nabla a\|_2^2
+
\lambda_b\|\nabla b\|_2^2 .
$$

公式标签：`eq:sa_lut_objective`。

变量解释：

- $d_i$：球形压入几何深度标签。
- $z_i$：全局 LUT 给出的基础深度。
- $a(x_i,y_i)$：该位置的空间增益。
- $b(x_i,y_i)$：该位置的空间偏置。
- $\lambda_a,\lambda_b$：平滑正则权重。
- $\nabla a,\nabla b$：空间场梯度，用于惩罚过度局部波动。

本文中 $a$ 和 $b$ 用 $8\times8$ tile grid（tile 网格）表示，并通过 bilinear interpolation（双线性插值）在运行时取值。每个有效 tile 用 least squares（最小二乘）拟合；样本数不足或 base-depth span（基础深度跨度）不足的 tile，用邻近有效 tile 的 mask-aware smoothing（掩膜感知平滑）填充。Tiled representation（tile 表示）服务于 simplicity（简单性）、reproducibility（可复现性）和 lookup-style deployment（查表式部署）。

Bias field（偏置场）不被解释为 non-contact height（无接触高度）。它是只在 segmented contact mask（分割接触掩膜）内部应用的局部修正项。运行时 reconstructed height map（重建高度图）限制在 contact region（接触区域）内，平滑后再次应用 mask，避免非接触区域出现 false positive depth（假阳性深度）。

### Radial Baseline（径向基线）

Radial baseline（径向基线）把修正场限制为只依赖：

$$
r=\sqrt{(u-u_c)^2+(v-v_c)^2}
$$

其估计为：

$$
\hat d(u,v)=a(r)g\big(\Delta I(u,v)\big)+b(r).
$$

这个 baseline 用来测试空间误差是否主要是 center-edge variation（中心-边缘变化）。它只作为 tiled SA-LUT field（tile SA-LUT 场）的消融对比。

### Optional Annotation Aid（可选标注辅助）

High-low differential imaging（高低光强差分成像）只作为 optional annotation aid（可选标注辅助），不是在线 sensing pipeline（传感流程）的一部分，也不是 SA-LUT 的必需输入。对困难的圆形接触标注，同一相机可以在相同 contact pose（接触姿态）下采集 high-intensity frame（高强度帧）和 low-intensity frame（低强度帧），构造：

$$
E_{HL}
=
\frac{I_H-\alpha I_L}{I_H+\alpha I_L+\epsilon}
$$

其中 $I_H$ 和 $I_L$ 是高、低强度帧，$\alpha$ 从 non-contact background region（无接触背景区域）估计。只有当 annotation or reconstruction improvements（标注或重建改进）被报告时，这个 cue 才应保留在最终稿中。

### Runtime Decoding（运行时解码）

Online decoding path（在线解码路径）复用与标定相同的 preprocessing（预处理）。接触分割后，全局 LUT 提供 $g(\Delta I)$，空间场提供 $a(u,v)$ 和 $b(u,v)$，最终 height map（高度图）被 mask 到接触区域。Mask-aware blur（掩膜感知模糊）和 final contact-mask reapplication（最终接触掩膜重应用）防止深度泄漏到接触边界外。Contact-level depth（接触级深度）可由 $\Omega_t$ 内 $\hat d(u,v)$ 的 average（平均值）或 maximum（最大值）概括。

### Algorithm 1. SA-LUT Calibration and Runtime Decoding（SA-LUT 标定与运行时解码，`alg:itact`）

**Offline calibration（离线标定）**

1. Capture a no-contact reference image $\mathbf{I}_0$：采集无接触参考图。
2. Collect spherical-indentation images across positions and depths：在不同位置和深度采集球形压入图像。
3. Verify or correct contact-circle center and radius：核验或修正接触圆心和半径。
4. Generate $d_{\mathrm{geo}}$ labels and remove boundary samples：生成几何深度标签并移除边界样本。
5. Fit global monotonic LUT $g(\Delta I)$ on training samples：用训练样本拟合全局单调 LUT。
6. Fit radial baseline and tiled spatial fields $a(x,y),b(x,y)$：拟合径向基线和 tile 空间场。

**Online inference（在线推理）**

1. For each tactile image $\mathbf{I}_t$：对每张触觉图像。
2. Compute $\Delta \mathbf{I}_t=\mathcal{N}(\mathbf{I}_t,\mathbf{I}_0)$：计算响应图。
3. Segment contact patch $\Omega_t$：分割接触斑块。
4. Reconstruct $\hat d_t=a(x,y)g(\Delta I_t)+b(x,y)$ inside $\Omega_t$：在接触区域内重建深度。
5. Apply contact mask and mask-aware smoothing：应用接触掩膜和掩膜感知平滑。
6. Output contact mask and depth map：输出接触掩膜和深度图。

## Experimental Evaluation（实验评估）

### Evaluation Protocol and Metrics（评估协议与指标）

评估围绕五个问题：

1. External-reflective contact module（外反射接触模块）是否在有效工作范围内产生正向 deep-is-bright response？
2. 剩余 intensity-depth errors（强度-深度误差）是否呈现 spatial structure（空间结构）？
3. 在 sample-wise validation（按样本验证）下，SA-LUT 是否优于 global LUT 和 radial LUT baseline？
4. SA-LUT 接近 dense calibration accuracy（密集标定精度）之前需要多少 spatial calibration samples（空间标定样本）？
5. 标定协议是否产生 reliable spherical-indentation labels（可靠球形压入标签）？

所有 reconstruction results（重建结果）默认在 sample-wise validation splits（按样本划分验证集）上评估。同一 indentation image（压入图）中的像素留在同一训练或验证分区，因为相邻像素共享同一个 circle annotation（圆标注）和 deformation geometry（形变几何）。主要指标见 Table `tab:custom_metrics`。

### Table 2. Custom Diagnostic Metrics（自定义诊断指标，`tab:custom_metrics`）

| Metric | Definition |
|---|---|
| MVR | Fraction of calibrated samples violating the expected monotonic deep-is-bright relation（违反预期越深越亮单调关系的标定样本比例）。 |
| Slope CV | Coefficient of variation of local intensity-depth slopes across spatial tiles（空间 tile 间局部强度-深度斜率的变异系数）。 |
| Base-depth span | Range of global-LUT base depth within each spatial tile, used to assess local fitting reliability（每个空间 tile 内全局 LUT 基础深度范围，用于评估局部拟合可靠性）。 |
| Calibration density | Number or spatial grid density of indentation samples used to fit SA-LUT（用于拟合 SA-LUT 的压入样本数量或空间网格密度）。 |

### External-Reflective Response Characterization（外反射响应表征）

`[PLAN/REWRITE]` 该实验验证传感器物理基础：压入应在标定工作范围内增加单通道强度。Controlled indentation scans（受控压入扫描）将在代表性空间区域采集，包括 center（中心）、near-lightband region（近光带区域）、far-lightband region（远光带区域）和 boundary region（边界区域）。

`[PLAN/REWRITE]` 预期视觉证据包括 brightness-depth curves（亮度-深度曲线）和 spatial slope heatmap（空间斜率热图）。Table `tab:response_char` 预留给定量响应诊断。

### Table 3. External-Reflective Response Characterization（外反射响应表征，`tab:response_char`）

| Region | MVR (%) $\downarrow$ | Dynamic range $\uparrow$ | Slope | Recovery time (s) $\downarrow$ |
|---|---:|---:|---|---:|
| Center | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Near lightband | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Far lightband | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Boundary | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Overall | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |

### Spatial Nonuniformity Diagnosis（空间非均匀性诊断）

该实验测试 global intensity-depth mapping（全局强度-深度映射）是否足够。主要图包括 location-wise $\Delta I$-depth curves（按位置的 $\Delta I$-深度曲线）、spatial slope heatmap（空间斜率热图）和 global-LUT residual heatmap（全局 LUT 残差热图）。

`[PLAN/REWRITE]` 如果不同位置的曲线共享同一个单调趋势但斜率或偏置不同，就能说明空间场 $a(x,y)$ 和 $b(x,y)$ 的必要性。残差热图应和 calibration-point count map（标定点计数图）以及 base-depth-span map（基础深度跨度图）一起解释，因为深度变化有限的 tile 可能导致局部斜率估计不稳定。

### SA-LUT Depth Mapping Ablation（SA-LUT 深度映射消融）

该实验比较 proposed spatial correction（本文空间修正）和逐渐增强的基线。评估模型包括 mean global LUT（均值全局 LUT）、isotonic global LUT（保序全局 LUT）、radial SA-LUT（径向 SA-LUT）和 tile SA-LUT。

原稿状态：`[UNVERIFIED/OPTIONAL: A gain-only tile variant should be retained only if implemented as an ablation.]`

Table `tab:depth_ablation` 是支撑 depth reconstruction claim（深度重建主张）的主要定量表。

### Table 4. Depth Reconstruction Ablation on Sample-Wise Validation Splits（按样本验证划分的深度重建消融，`tab:depth_ablation`）

| Method | LUT type | Spatial model | MAE (mm) $\downarrow$ | RMSE (mm) $\downarrow$ | Edge MAE (mm) $\downarrow$ | Runtime (ms) $\downarrow$ |
|---|---|---|---:|---:|---:|---:|
| Global LUT | Mean | None | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Global LUT | Isotonic | None | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Radial SA-LUT | Isotonic | $a(r),b(r)$ | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Tile SA-LUT | Isotonic | $a(x,y),b(x,y)$ | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Tile SA-LUT | Isotonic | gain-only | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Dense per-pixel LUT | Isotonic | Per-pixel | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |

### Calibration-Density Ablation（标定密度消融）

Calibration-density experiment（标定密度实验）量化 spatial correction（空间修正）是否需要密集标定。SA-LUT 使用稀疏空间网格拟合，例如 $3\times3$、$5\times5$、$7\times7$、$9\times9$ 和 dense reference set（密集参考集）。

`[PLAN/REWRITE]` 预期图是 calibration density versus validation error（标定密度对验证误差）。Table `tab:calib_density` 提供紧凑数值总结。

### Table 5. Calibration-Density Ablation of SA-LUT（SA-LUT 标定密度消融，`tab:calib_density`）

| Method | $3{\times}3$ | $5{\times}5$ | $7{\times}7$ | $9{\times}9$ | Dense |
|---|---:|---:|---:|---:|---:|
| Global LUT | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Radial SA-LUT | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Tile SA-LUT | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |

### Calibration Label Reliability（标定标签可靠性）

Spherical-indentation label quality（球形压入标签质量）取决于准确的 circle center（圆心）和 radius（半径）估计。该实验评估 automatic detection（自动检测）、human verification（人工核验）、repeated annotation（重复标注）和 boundary-aware filtering（边界感知过滤）。Optional high-low edge cue（可选高低光强边缘线索）只在实际用于辅助标注时纳入。

`[PLAN/REWRITE]` Table `tab:circle_edge` 预留给接触圆标注可靠性结果。

### Table 6. Calibration Circle Annotation Reliability（标定圆标注可靠性，`tab:circle_edge`）

| Method | Success (%) $\uparrow$ | Center err. (px) $\downarrow$ | Radius err. (px) $\downarrow$ | Manual corr. (%) $\downarrow$ |
|---|---:|---:|---:|---:|
| Raw-difference contour | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Hough / RANSAC | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Human-verified | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Optional high-low cue | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |

### Material Stability and Cross-Unit Repeatability（材料稳定性与跨单元重复性）

因为 ITact 是 hardware-algorithm co-design（硬件-算法协同设计），接触模块必须评估 repeatability（重复性）和 manufacturability（可制造性）。在同一位置和深度进行 repeated contacts（重复接触），用于测量 recovery time（恢复时间）、residual drift（残余漂移）、reference-image shift（参考图偏移）和 reconstruction degradation（重建退化）。

原稿状态：`[UNVERIFIED/OPTIONAL: If multiple prototypes are fabricated, the same calibration protocol is applied to each unit and cross-unit performance is reported.]`

`[PLAN/REWRITE]` Table `tab:repeatability` 预留给稳定性结果。

### Table 7. Material Stability and Repeatability（材料稳定性与重复性，`tab:repeatability`）

| Prototype / variant | Recovery time (s) $\downarrow$ | Drift (mm) $\downarrow$ | Repeat MAE (mm) $\downarrow$ | Notes |
|---|---:|---:|---:|---|
| Unit 1 | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Unit 2 | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |
| Unit 3 | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` | `[TBD: --]` |

## Results and Analysis（结果与分析）

原稿这一节目前仍是结果组织计划。

`[PLAN/REWRITE]` 最终结果应按 evaluation protocol（评估协议）顺序报告。Response characterization（响应表征）应首先确认 deep-is-bright operating range（越深越亮工作范围）。Spatial diagnostics（空间诊断）应显示 global LUT residuals（全局 LUT 残差）中存在 structured spatial patterns（结构化空间模式）。Depth ablation（深度消融）应报告 radial SA-LUT 和 tile SA-LUT 是否相对 global baselines（全局基线）降低验证误差。Calibration-density analysis（标定密度分析）应说明稀疏空间采样是否接近密集标定性能。Calibration-label and repeatability experiments（标定标签与重复性实验）应证明模型来自可靠标签和机械上可用的接触模块。

最重要的 visual results（视觉结果）包括：

1. Multi-location brightness-depth curves（多位置亮度-深度曲线）。
2. Global/radial/tile residual heatmaps（全局/径向/tile 残差热图）。
3. Gain and bias grids with count and base-span maps（带计数图和基础跨度图的增益/偏置网格）。
4. Calibration-density curves（标定密度曲线）。
5. Circle-annotation overlays（圆标注叠加图）。

原稿状态：`[UNVERIFIED/OPTIONAL: Claims about calibrated normal force, shear force, or slip estimation require additional force labels and corresponding validation experiments.]`

## Discussion（讨论）

ITact 的定位是 low-complexity markerless contact localization（低复杂度无标记接触定位）、contact-area estimation（接触面积估计）和 deep-is-bright indentation-response depth mapping（越深越亮压入响应深度映射）。它的主要贡献是 external-reflective depth encoding（外反射深度编码）、structured spatial response characterization（结构化空间响应表征）、low-dimensional spatial correction（低维空间修正）和 reproducible low-cost calibration（可复现低成本标定）的组合。这个设计降低了硬件与处理复杂度，但也限制了传感器在需要 calibrated force feedback（标定力反馈）或 shear-field reconstruction（剪切场重建）任务中的适用性。

主要限制包括 single-contact assumptions（单接触假设）、large deformation（大形变）下可能丢失单调性、illumination geometry（照明几何）造成的 saturation or hot spots（饱和或热点）、对 material aging（材料老化）的依赖、对 reference-image drift（参考图漂移）的敏感性，以及 external-reflective layer（外反射层）制造一致性。

原稿状态：`[UNVERIFIED/OPTIONAL: A low-dimensional gain-bias field has limited capacity for arbitrary local defects; a residual MLP or CNN accuracy mode may be useful for those cases.]`

这些限制可通过 proposed $I(d)$ scans（亮度-深度扫描）、residual heatmaps（残差热图）、durability tests（耐久性测试）和 cross-unit calibration experiments（跨单元标定实验）测量。

原稿状态：`[PLAN/REWRITE: Future work should investigate adaptive recalibration, multi-contact interpretation, improved reflective-layer manufacturing repeatability, multi-intensity edge refinement, and integration with closed-loop manipulation controllers.]`

### 局限与可追问点

- 当前主输出是 contact-mask depth map（接触掩膜内深度图），不包含标定法向力、剪切力或滑移。
- Deep-is-bright 是标定有效范围内的经验工作条件，需要用 MVR、动态范围、饱和行为和边界排除策略限定。
- $8\times8$ tile gain-bias field 是低维近似，可能无法覆盖任意局部涂层缺陷或高度非仿射响应。
- 球形压入标签的可信度取决于圆心、半径、像素尺度、ROI 校正和边界过滤；重复标注与边界带消融必须报告。
- 标定密度消融是“低成本空间修正”主张的关键证据，需要展示稀疏采样与 dense reference 的差距。
- High-low differential imaging 只能被写作 annotation aid，不能混入在线推理主流程，除非后续实验明确改变方法定义。

### 审稿时可重点检查的问题

- Sample-wise validation split 是否严格执行，避免同一压入帧像素泄漏到训练和验证两边。
- Global LUT、radial SA-LUT、tile SA-LUT、dense per-pixel LUT 的标定数据量和验证协议是否公平。
- 每个 tile 的 sample count 和 base-depth span 是否足以支持局部最小二乘拟合。
- Near-lightband、far-lightband、boundary 区域是否分别验证 deep-is-bright 单调性和饱和行为。
- `[UNVERIFIED/OPTIONAL]` 中的 residual MLP/CNN accuracy mode 或跨单元性能是否有实验支持。

## Conclusion（结论）

本文提出 ITact，一种 external-reflective markerless monochrome vision-based tactile sensor（外反射式无标记单色视觉触觉传感器），并配套 calibration-efficient spatially adaptive depth mapping（低标定成本空间自适应深度映射）。External-reflective optical stack（外反射光学堆叠）产生 deep-is-bright tactile response（越深越亮触觉响应）；SA-LUT 通过 global monotonic brightness-depth map（全局单调亮度-深度图）加 smooth spatial gain and bias fields（平滑空间增益与偏置场）解码深度。

可复现的 spherical-indentation calibration protocol（球形压入标定协议）结合 human-verifiable circle annotation（人工可核验圆标注）和 calibration-density evaluation（标定密度评估），支持可靠的低成本模型拟合。

原稿状态：`[PLAN/REWRITE: The planned characterization focuses on whether this framework recovers the spatial dependence of the tactile response with substantially lower calibration cost than dense per-pixel mapping or large unconstrained learning.]`

中文收束：当前稿件把贡献从“给 LUT 加坐标修正”重构为“外反射硬件编码 + 空间非均匀性表征 + 低维查表式修正 + 可复现球压标定”的闭环。最终说服力取决于响应表征、空间残差诊断、SA-LUT 消融、标定密度和标签可靠性这些实验是否补齐。

## Bibliography（参考文献入口）

原 LaTeX 结尾保留：

```latex
\bibliographystyle{IEEEtran}
\bibliography{references}
```

本文正文中保留的 cite keys 包括：`gelsight`、`dtact`、`ninedtact`、`gelsight_wedge`、`large_scale_vbts`、`tacshade`、`rtac0`、`touch_cal`、`gelslim`、`pbr_design`、`digit`、`dynamic_illumination`、`multi_flash`。
