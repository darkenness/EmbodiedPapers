# ITact: Response-Shaped External-Reflective Monochrome Tactile Sensing with Spatially Adaptive LUTs（中英混读）

> 来源：[[调整main]]
> 说明：本稿按当前 `ITact/调整main.md` 的 LaTeX 原文同步整理。只生成双语阅读稿，不生成表达与逻辑审查文件，也不插入审查标注。文中保留原文实际出现的章节、公式、图题、表格、引用键和 `TBD` 状态；实验数值仍以原文占位为准，不补造结果。

## 核心词汇速查

| English（中文） | 在当前原文中的含义 |
|---|---|
| Vision-based tactile sensing（基于视觉的触觉传感） | 把 contact-induced deformation（接触引起的形变）转换成可供 robotic manipulation（机器人操作）使用的图像。 |
| Direct monochrome tactile reconstruction（直接单色触觉重建） | 用 single-channel tactile images（单通道触觉图像）和 lookup-table calibration（查找表标定）恢复 contact geometry（接触几何）。 |
| Lookup table, LUT（查找表） | 本文希望保留的轻量 depth reconstruction（深度重建）形式，优点是 simple（简单）、interpretable（可解释）和 easy to deploy（易部署）。 |
| Response-shaped（响应塑形） | 通过 optical stack（光学堆叠）主动塑造 brightness-depth response（亮度-深度响应），而不是只在算法端被动拟合。 |
| External-reflective monochrome tactile structure（外反射式单色触觉结构） | ITact 的硬件结构，用 multilayer optical stack（多层光学堆叠）把压入转换为单通道亮度响应。 |
| Transmissive, scattering, and reflective components（透射、散射与反射部件） | 共同调节 baseline transmission（基线透射）、internal scattering（内部散射）和 indentation-dependent reflected return（压入相关反射返回）。 |
| Deep-is-bright（越深越亮） | 本文目标响应方向：indentation（压入）越深，响应图中的亮度越高。 |
| Monotonicity（单调性） | brightness-depth curve（亮度-深度曲线）应随压入稳定变化，避免 LUT 反演出现一对多歧义。 |
| Usable dynamic range（可用动态范围） | 响应需要覆盖足够强度范围，同时避免过早 saturation（饱和）。 |
| Brightness-depth sensitivity（亮度-深度敏感度） | 亮度变化对深度变化的可分辨程度，常对应 response slope（响应斜率）。 |
| Contact-patch separability（接触斑块可分离性） | 接触区域应能与 non-contact background（非接触背景）区分。 |
| Position-dependent gain and offset（位置相关增益与偏置） | 紧凑光学布局、涂层、光带距离、侧壁反射和相机视角等因素导致的空间响应差异。 |
| Spatially Adaptive LUT, SA-LUT（空间自适应查找表） | 用 global monotonic brightness-depth LUT（全局单调亮度-深度 LUT）加 low-dimensional spatial gain-bias field（低维空间增益-偏置场）进行深度重建。 |
| Isotonic LUT（保序/单调 LUT） | 强制 brightness-depth mapping（亮度-深度映射）保持单调的 LUT 形式。 |
| Response image（响应图） | 由 tactile image（触觉图像）和 no-contact reference image（无接触参考图）计算得到的差异或归一化差异图。 |
| Contact mask（接触掩膜） | 从响应图中分割出的二值接触区域，深度重建只在该区域内输出。 |
| Spherical-indenter calibration labels（球形压头标定标签） | 通过标注圆形接触边界和球冠几何，为每个接触像素生成 dense geometric depth labels（密集几何深度标签）。 |
| Boundary-band exclusion（边界带排除） | 排除接触圆边缘附近像素，因为这些像素易受模糊、圆拟合误差和非理想接触力学影响。 |
| Tile gain-bias field（tile 增益-偏置场） | SA-LUT 中用低分辨率网格表示的空间修正场，当前原文设为 $8\times8$ tile grid（tile 网格）。 |
| Radial baseline（径向基线） | 只让修正依赖距传感器中心的 radial distance（径向距离），用于检验误差是否主要是中心-边缘变化。 |

## 论文主线

当前 `调整main.md` 的核心问题是：direct monochrome lookup-table reconstruction（直接单色 LUT 重建）虽然轻量、可解释、易部署，但它的准确性同时依赖两件事。第一，optical response curve（光学响应曲线）本身要适合 inversion（反演），例如单调、敏感、有足够动态范围且不易早饱和。第二，这条响应在 sensing surface（传感面）上要足够一致，否则一个 global LUT（全局 LUT）会留下 structured residuals（结构化残差）。

ITact 的硬件侧贡献是 response-shaped external-reflective monochrome tactile sensing structure（响应塑形式外反射单色触觉结构）。它把 transmissive（透射）、scattering（散射）和 reflective（反射）部件组合成 multilayer optical stack（多层光学堆叠），目标是把 indentation（压入）塑造成 positive deep-is-bright response（正向越深越亮响应），从物理上支持 LUT-style depth reconstruction（查表式深度重建）。

算法侧贡献是 Spatially Adaptive LUT, SA-LUT（空间自适应查找表）。SA-LUT 先用 global monotonic brightness-depth LUT（全局单调亮度-深度 LUT）学习主导响应，再用 low-dimensional spatial gain and bias fields（低维空间增益与偏置场）补偿剩余的 position-dependent response variation（位置相关响应变化）。这使方法处在 dense per-pixel LUT（密集逐像素 LUT）和 high-capacity learning model（高容量学习模型）之间：比前者更省标定，比后者更轻量、更接近查表部署。

当前稿件已经补齐 Abstract（摘要）、Related Work（相关工作）和 Method（方法）正文，并给出响应模型、响应图、球形压头标签和 SA-LUT 拟合目标。Experimental Evaluation（实验评估）仍主要是框架和占位，最终定量结果还未填入。

## 贡献与结论对照

| 贡献 / Contribution | 方法钩子 / Method hook | 证据位置 / Evidence | 当前状态 |
|---|---|---|---|
| Multilayer external-reflective monochrome transduction（多层外反射单色换能） | 通过 transmissive、scattering 和 reflective components 调节基线透射、散射和压入相关反射返回，把压入转换成 positive single-channel response。 | `fig:overview`、`tab:prototype_setup`、`fig:response_spatial`。 | 结构和响应目标已写明；具体材料、厚度、反射率、相机参数仍为 `TBD`。 |
| LUT-friendly response shaping and characterization（适合 LUT 的响应塑形与表征） | 用 monotonicity、usable dynamic range、brightness-depth sensitivity、saturation behavior、contact-patch separability 和 repeatability 判断响应是否适合 LUT 反演。 | `fig:response_spatial`；实验小节 `Response Shaping and Spatial Diagnostics`。 | 评价维度明确，但图中仍是占位，没有真实曲线和热图。 |
| Calibration-efficient Spatially Adaptive LUT（低标定成本空间自适应 LUT） | 用 global monotonic LUT 加 $a(x,y)$、$b(x,y)$ 空间增益-偏置场，减少 global LUT 的空间结构化残差。 | `eq:sa_lut`、`eq:sa_lut_objective`、`tab:depth_ablation`、`fig:calib_density`。 | 方法公式已补齐；重建误差、标定密度曲线和最终结论仍为 `TBD`。 |

## Title（标题）

**ITact: Response-Shaped External-Reflective Monochrome Tactile Sensing with Spatially Adaptive LUTs**

中文含义：**ITact：带空间自适应 LUT 的响应塑形式外反射单色触觉传感**。

标题相较旧稿更强调 response-shaped（响应塑形）和 external-reflective monochrome tactile sensing（外反射单色触觉传感）本身，而不是只强调 calibration-efficient spatially adaptive depth mapping（低标定成本空间自适应深度映射）。这说明当前稿件的中心从“算法映射”扩展为“硬件响应塑形 + 空间自适应 LUT”的联合叙事。

## Author and Manuscript Status（作者与稿件状态）

作者、IEEE 会员身份、卷期、单位和资助信息仍由 `\tbd{...}` 或注释占位。当前导言区保留了若干写作标记宏：

- `\tbd{...}`：待填内容，例如作者、卷期、硬件参数和实验结果。
- `\dkrc{...}`：蓝色作者评论。
- `\hwedit{...}`：青色编辑内容。
- `\keyedit{...}`：紫色关键编辑内容。
- `\planmark{...}`：橙色计划或重写提示。
- `\weakclaim{...}`：紫色未验证或可选声明。

这些宏说明当前仍是研究稿或论文草稿状态，不是最终投稿版。

## Abstract（摘要）

摘要已经从旧稿的空占位变为完整版本。它先指出 direct monochrome lookup-table reconstruction（直接单色查找表重建）是一条轻量路线，但准确性取决于 optical response curve（光学响应曲线）和 spatial consistency（空间一致性）。这正是全文的两条主线：硬件要塑造响应，算法要补偿空间差异。

摘要提出 ITact 和 SA-LUT。ITact 是 response-shaped external-reflective monochrome tactile sensing structure（响应塑形式外反射单色触觉结构），SA-LUT 是 calibration-efficient depth-mapping method（低标定成本深度映射方法）。硬件 stack 用 transmissive、scattering 和 reflective components 把 indentation 塑造成 positive deep-is-bright response。论文将用 monotonicity、dynamic range、sensitivity、saturation、contact-patch separability 和 repeatability 来表征这个响应。

摘要还说明 calibration measurements（标定测量）会揭示 sensing surface 上 structured position-dependent gain and offset variation（结构化位置相关增益与偏置变化）。SA-LUT 对此的处理方式是：保留 global monotonic brightness-depth LUT，同时加入 low-dimensional spatial gain-bias field，避免 dense per-pixel calibration（密集逐像素标定）或 high-capacity learning（高容量学习）。

最后一句仍含有：

```latex
\tbd{Replace the final evaluation sentence with quantitative results once experiments are complete.}
```

因此摘要的实验结论目前还是路线描述，不是最终数据支撑的结论。

## IEEEkeywords（关键词）

当前关键词为：

Vision-based tactile sensing（视觉触觉传感）、monochrome tactile sensor（单色触觉传感器）、external reflective layer（外反射层）、lookup table（查找表）、response shaping（响应塑形）、spatial calibration（空间标定）。

相较旧稿，新关键词补入了 external reflective layer 和 response shaping，进一步说明硬件响应设计已成为论文主题之一。

## Introduction（引言）

第一段建立领域背景。Vision-based tactile sensing（基于视觉的触觉传感）把 contact-induced deformation（接触引起的形变）转换成可处理图像，用于 robotic manipulation（机器人操作）。GelSight-style systems（GelSight 风格系统）通过 deformable optical media（可变形光学介质）和 calibrated shading（经标定阴影）恢复 detailed contact geometry（详细接触几何）\cite{gelsight}。但本文关注更轻量的 direct monochrome tactile reconstruction（直接单色触觉重建）：DTact 和 9DTact 说明，只要 optical response（光学响应）足够 structured（结构化），single-channel tactile images（单通道触觉图像）就可以通过 lookup-table calibration 映射到 contact geometry \cite{dtact,ninedtact}。

第二段提出单色 LUT 成立的响应条件。一个 useful response（有用响应）应该在工作范围内随 indentation 一致变化，提供足够 brightness-depth sensitivity，能够与 non-contact background 分离，避免 early saturation（早饱和），并且 repeated contacts（重复接触）下可重复。同时，这个响应还要在 sensing surface 上足够一致，否则 compact inverse map（紧凑逆映射）无法用有限标定数据拟合。原文明确列出影响因素：material stack、layer thickness、transmittance、scattering、reflective return、illumination geometry、coating process、camera viewpoint 和 boundary reflections。

第三段引入 ITact 的物理设计。ITact 研究 multilayer external-reflective monochrome tactile structure。Contact stack 的目标是调节 background transmission（背景透射）和 indentation-dependent reflective return（压入相关反射返回）之间的平衡。通过把 reflective interface（反射界面）放在 deformable contact surface（可变形接触面）附近，并控制透射层和散射层，压入被编码成 positive deep-is-bright single-channel response。这为 direct LUT-based reconstruction 提供物理基础。

同一段还指出 ITact 的困难：compact optical layout 会带来 position-dependent gain and offset。原因包括 light-band distance（光带距离）、local coating（局部涂层）、deformation geometry（形变几何）、sidewall reflection（侧壁反射）和 camera viewing angle（相机视角）在传感面不同位置不一致。因此 inverse mapping 更应被视为空间变化响应，而不是纯粹的 global intensity-depth curve。

第四段比较替代方案。Dense per-pixel lookup table 能在每个空间位置存储独立响应，但 calibration cost 会随 spatial bins 和 intensity bins 快速增长。Learning-based reconstruction 可表达更复杂响应，但引入额外 data collection、training、adaptation 和 deployment cost \cite{densetact,rtac0,touch_cal}。Coordinate-aware tactile calibration 说明 pixel position 有助于补偿 illumination propagation 和 sensor-specific spatial variation \cite{gelsight_wedge,large_scale_vbts}。这些观察共同导向本文的 lookup-compatible middle ground：通过 optical stack 塑造主导单色响应，再用 compact spatial correction 建模剩余位置依赖。

第五段给出论文方案。ITact 用 multilayer external-reflective optical stack 获得 LUT-friendly monochrome response，用于 indentation-depth reconstruction。SA-LUT 用 low-dimensional spatial gain and bias fields 增强 global monotonic lookup table，在保留 lookup-style inference 的同时补偿 structured position-dependent response variation。原文现在把 sensing model、calibration procedure 和 fitting method 指向 `Sec.~\ref{sec:method}`，且当前 Method 部分已经存在 `\label{sec:method}`。

### Main Contributions（主要贡献）

1. **Multilayer external-reflective monochrome transduction（多层外反射单色换能）**：设计 external-reflective tactile optical stack，把 transmissive、scattering 和 reflective components 组合起来，将 indentation 转换成 positive single-channel response。

2. **LUT-friendly response shaping and characterization（适合 LUT 的响应塑形与表征）**：表征 optical stack 如何塑造 depth-brightness response，并用 monotonicity、usable dynamic range、sensitivity、saturation behavior、contact-patch separability 和 repeatability 评估其 LUT 反演适用性。

3. **Calibration-efficient Spatially Adaptive LUT（低标定成本空间自适应 LUT）**：提出 SA-LUT，把 global monotonic brightness-depth LUT 与 low-dimensional spatial gain and bias fields 结合，在不需要 dense per-pixel calibration 或 high-capacity end-to-end model 的情况下完成空间修正。

## Figure `fig:overview`：Overview of ITact and SA-LUT（ITact 与 SA-LUT 概览）

原文在 Introduction 后放置双栏 overview figure placeholder。占位内容包括四个部分：

- (a) multilayer external-reflective stack（多层外反射堆叠）；
- (b) response-shaped deep-is-bright curve（响应塑形后的越深越亮曲线）；
- (c) global LUT residual caused by spatial variation（空间变化导致的全局 LUT 残差）；
- (d) SA-LUT spatial gain-bias correction（SA-LUT 空间增益-偏置修正）。

图题说明：multilayer external-reflective stack 把 indentation 塑造成 LUT-friendly monochrome response，而 SA-LUT 用 low-dimensional spatial gain and bias fields 补偿 residual position-dependent response variation。当前没有真实图片文件，只有 LaTeX `\fbox` 占位。

## Related Work（相关工作）

### Direct Monochrome and LUT-Based Tactile Reconstruction（直接单色与基于 LUT 的触觉重建）

这一节说明本文与 DTact、9DTact、TacShade、R-Tac0 等单色或光影触觉系统的关系。Direct monochrome tactile reconstruction 能降低 RGB photometric tactile sensing（RGB 光度触觉传感）的光学和标定复杂度。DTact 证明在 structured deep-is-dark optical response（结构化越深越暗响应）下，single-channel tactile darkness（单通道触觉暗度）可以通过 low-cost LUT calibration 映射到 high-resolution contact geometry \cite{dtact}。9DTact 进一步发展成 compact tactile sensor，具备 shape reconstruction（形状重建）和 force-estimation（力估计）能力 \cite{ninedtact}。

TacShade 和 R-Tac0 也表明 grayscale tactile images（灰度触觉图像）能携带有用几何线索 \cite{tacshade,rtac0}。这些工作共同说明 response-curve quality（响应曲线质量）是 LUT reconstruction 的核心。ITact 的差异在于，它明确把 monochrome response curve 当作 optical stack 的设计目标，而不是只把单色图像当作已有输入。

### Optical Stack Design and Response Shaping（光学堆叠设计与响应塑形）

这一节强调 tactile optical stack 对 measurable image response（可测图像响应）的决定作用。既有系统说明 elastomer hardness（弹性体硬度）、layer thickness（层厚）、reflective coating（反射涂层）、light routing（光路）、housing geometry（外壳几何）和 illumination configuration（照明配置）都会影响 tactile contrast（触觉对比度）、accuracy（精度）、durability（耐久性）和 repeatability（可重复性）\cite{gelslim,improved_gelsight,pbr_design}。

DIGIT 和 GelSlim 等 compact tactile systems 进一步强调 packaging（封装）、illumination routing（照明布线）和 fabrication consistency（制造一致性）对可部署传感器的重要性 \cite{digit,gelslim}。ITact 在这条线上提出 external-reflective stack，把它作为 monochrome lookup-table reconstruction 的 response-shaping mechanism。其设计目标不是泛泛提高图像质量，而是调节 baseline transmission 和 indentation-dependent return intensity，得到具有 monotonicity、sensitivity、dynamic range 和 contact-patch separability 的响应曲线。

### Spatially Aware and Calibration-Efficient Mapping（空间感知与低标定成本映射）

这一节说明 spatial dependence（空间依赖）是 tactile image formation（触觉图像形成）中的常见问题。GelSight Wedge 使用 RGBXY mapping 补偿 illumination propagation 和 sensor-internal spatial variation \cite{gelsight_wedge}。Large-scale VBTS calibration work 说明 position information 和 differential inputs 能提高 multi-sensor calibration efficiency \cite{large_scale_vbts}。3D Cal 等 automated calibration frameworks 使用 probing hardware（探测硬件）和 coordinate-aware neural models（坐标感知神经模型）降低标定负担 \cite{touch_cal}。

这些方法展示了 explicit spatial information（显式空间信息）的价值，但通常依赖 RGB/RGB-difference learning pipelines、自动探测硬件或训练式神经模型。ITact 借用“空间信息有用”这一洞察，但采用 lookup-compatible form：global monotonic LUT 后接 low-dimensional spatial correction field。

相关工作最后还说明 evaluation label（评估标签）的可靠性问题。Lookup-table depth calibration 需要与 tactile image formation 一致的 geometric labels（几何标签）。Spherical indentation（球形压入）可通过 annotated contact circle（标注接触圆）提供 dense geometric labels，但 circle center（圆心）和 radius（半径）误差会传播到 spherical-cap depth map（球冠深度图）。因此 ITact 使用 verified circle annotation 和 boundary-aware sample filtering 控制标签噪声。这些程序用于支撑 response shaping 和 SA-LUT 的评估，而不是作为独立贡献。

## Method（方法）

当前 Method 已经从旧稿的空占位变为完整方法描述，包含硬件响应模型、原型设置、响应图预处理、球形压头几何标签和 SA-LUT 拟合。

### Sensor Design and Multilayer Stack（传感器设计与多层堆叠）

ITact 包含 multilayer external-reflective contact stack（多层外反射接触堆叠）、compact lightband（紧凑光带）、monochrome imaging module（单色成像模块）和 mechanical housing（机械外壳）。Contact stack 的作用是调节三类贡献：

- baseline transmission（基线透射）；
- internal scattering（内部散射）；
- indentation-dependent reflected return（压入相关反射返回）。

Reflective interface 被放在靠近 deformable contact surface 的位置，使局部压入能改变 effective return intensity（有效返回强度）。Transmissive and scattering layers 则控制 background brightness（背景亮度）、contrast（对比度）和 saturation（饱和）。本文的 primary calibrated output（主要标定输出）是在 segmented contact mask（分割接触掩膜）内的 indentation-response depth map（压入响应深度图）。Contact centroid（接触质心）和 contact area（接触面积）可由 mask 派生，但 calibrated normal force（法向力）、shear force（剪切力）和 slip estimation（滑移估计）不在本文范围内。

原文给出的 compact response model 是：

$$
I(d,x,y)
=
I_{\mathrm{bg}}(x,y)
+
T(x,y)I_{\mathrm{in}}
+
R(d,x,y)I_{\mathrm{return}}
+
\epsilon_I,
$$

其中：

- $I(d,x,y)$ 表示深度 $d$ 和位置 $(x,y)$ 下的观测强度；
- $I_{\mathrm{bg}}(x,y)$ 是 background illumination（背景照明）；
- $T(x,y)$ 是 stack 的 effective transmission term（有效透射项）；
- $I_{\mathrm{in}}$ 是入射光贡献；
- $R(d,x,y)$ 是 indentation-dependent return term（压入相关返回项）；
- $I_{\mathrm{return}}$ 是反射返回光贡献；
- $\epsilon_I$ 是 imaging noise（成像噪声）和 unmodeled scattering（未建模散射）。

这个公式的直观含义是：ITact 的亮度不是深度的单一函数，而是由位置相关背景、位置相关透射、深度和位置共同决定的反射返回以及噪声共同组成。因此，即使主导深度响应已经通过堆叠塑形，$T$ 和 $R$ 的空间依赖仍会让 global intensity-depth map 留下 structured residuals。

### Prototype and Calibration Setup（原型与标定设置）

Table `tab:prototype_setup` 总结实验原型和标定设置。原文强调这张表报告 fixed hardware and acquisition parameters（固定硬件和采集参数），不是 performance metrics（性能指标）。

| Item | Setting |
|---|---|
| Optical principle（光学原理） | Multilayer external-reflective monochrome imaging（多层外反射单色成像） |
| Elastomer（弹性体） | `\tbd{material / hardness}` |
| Transmissive layer（透射层） | `\tbd{material / thickness / proxy transmittance}` |
| Reflective layer（反射层） | `\tbd{material / coating process / proxy reflectance}` |
| Scattering or support layer（散射或支撑层） | `\tbd{material / thickness}` |
| Illumination（照明） | Single lightband（单光带）, `\tbd{wavelength / voltage}` |
| Camera（相机） | `\tbd{model / resolution / frame rate}` |
| ROI resolution（ROI 分辨率） | `\tbd{--}` pixels |
| Calibration indenter（标定压头） | Sphere（球体）, radius `\tbd{--}` mm |
| Calibration samples（标定样本） | `\tbd{-- images / -- positions}` |
| Global LUT（全局 LUT） | Mean / isotonic |
| SA-LUT field（SA-LUT 场） | $8\times8$ tile gain-bias field |
| Radial baseline（径向基线） | `\tbd{--}` radial bins |

这张表是后续实验可复现性的入口。当前最关键的缺口是材料、层厚、光学 proxy 指标、相机参数、样本量和径向基线 bin 数仍未填。

### Response Image and Contact Mask（响应图与接触掩膜）

ITact 在解码前记录 no-contact reference image（无接触参考图）$\mathbf{I}_0$。给定 tactile image（触觉图像）$\mathbf{I}_t$，响应图定义为：

$$
\Delta \mathbf{I}_t = \mathcal{N}(\mathbf{I}_t,\mathbf{I}_0),
$$

其中 $\mathcal{N}(\cdot)$ 是在 calibration（标定）、validation（验证）和 runtime inference（运行时推理）中一致使用的 preprocessing function（预处理函数）。原文给出的简单实现是 reference subtraction（参考图相减）后做 thresholding（阈值化）、clipping（裁剪）和 smoothing（平滑）。

原文还给出 normalized alternative（归一化替代形式）：

$$
\Delta \mathbf{I}_t =
\frac{\mathbf{I}_t-\mathbf{I}_0}{\mathbf{I}_0+\epsilon}.
$$

这里 $\epsilon$ 用于避免除以过小背景值。这个归一化形式能部分抵消背景亮度差异，但也可能引入对暗区噪声的放大，因此论文需要在实验中固定并报告最终使用的 $\mathcal{N}$。

Binary contact mask（二值接触掩膜）$\Omega_t$ 从 response image 中提取，重建深度只限制在 contact region（接触区域）内。这一点很重要，因为 SA-LUT 的 bias field 被解释为接触区内的 local correction term，而不是非接触高度。

### Spherical-Indenter Calibration Labels（球形压头标定标签）

这一节给出深度标签来源。Controlled spherical indentation（受控球形压入）为 brightness-depth mapping 的拟合和评估提供 dense geometric labels。对每个 calibration frame（标定帧），先检测或人工验证 circular contact boundary（圆形接触边界）。给定 circle center $(c_x,c_y)$、接触圆半径 $a$、probe radius（探针半径）$R$ 和 pixel scale（像素尺度），径向距离 $\rho$ 处的几何深度标签为：

$$
d_{\mathrm{geo}}(\rho)
=
\sqrt{R^2-\rho^2}
-
\sqrt{R^2-a^2},
\quad 0 \leq \rho \leq a .
$$

这个公式来自 spherical cap（球冠）几何。$\sqrt{R^2-\rho^2}$ 表示球面在径向位置 $\rho$ 的高度项，$\sqrt{R^2-a^2}$ 是接触边界处的高度项，两者相减得到相对接触边界的压入深度。中心处 $\rho=0$ 深度最大，边界处 $\rho=a$ 深度为 0。

原文强调 boundary pixels（边界像素）要在接触圆附近 narrow band（窄带）内排除，因为它们对 blur（模糊）、circle-fitting error（圆拟合误差）和 non-ideal contact mechanics（非理想接触力学）敏感。每个 calibration point 会存储 $\Delta I$、$d_{\mathrm{geo}}$、image coordinates（图像坐标）、sample identity（样本身份）和 boundary distance（到边界距离），用于 sample-wise validation 和 calibration-density analysis。

### Spatially Adaptive LUT（空间自适应 LUT）

SA-LUT 的第一步是用 global monotonic LUT 捕获主导 brightness-depth relation。LUT 被锚定在 non-contact baseline（非接触基线）：

$$
g(\Delta I_0)=0,
$$

其中 $\Delta I_0$ 是预处理后的无接触响应。对标定样本 $i$，global base depth（全局基础深度）为：

$$
z_i = g(\Delta I_i) - g(\Delta I_0).
$$

因为 $g(\Delta I_0)=0$，这里本质上是把样本亮度响应映射为全局 LUT 估计的基础深度，并显式以无接触响应作为零点。

SA-LUT 用 gain and bias fields（增益和偏置场）建模剩余空间变化：

$$
\hat d_i = a(x_i,y_i)z_i + b(x_i,y_i).
$$

其中 $a(x_i,y_i)$ 是位置相关增益，控制 global LUT 深度在该位置应被放大或缩小；$b(x_i,y_i)$ 是位置相关偏置，补偿局部系统性偏移。这个式子保留了 LUT 风格的主映射 $z_i$，再用低维空间场做线性修正。

拟合目标为：

$$
\min_{a,b}
\sum_i
\left(d_i-a(x_i,y_i)z_i-b(x_i,y_i)\right)^2
+
\lambda_a\|\nabla a\|_2^2
+
\lambda_b\|\nabla b\|_2^2 .
$$

第一项是重建深度 $\hat d_i$ 与真实标签 $d_i$ 的平方误差。后两项是对增益场和偏置场梯度的平滑正则化，避免空间修正过度拟合局部噪声。$\lambda_a$ 和 $\lambda_b$ 控制平滑强度。

当前原文设定 $a$ 和 $b$ 用 $8\times8$ tile grid 表示，并通过 bilinear interpolation（双线性插值）得到像素级修正。对 samples insufficient（样本不足）或 base-depth span insufficient（基础深度跨度不足）的 tile，使用 mask-aware smoothing（掩膜感知平滑）从邻近有效 tile 填补。Bias field 只在 segmented contact mask 内应用，并被解释为 local correction term，而不是 non-contact height。

原文还给出 radial baseline（径向基线）：

$$
\hat d_i = a(r_i)z_i + b(r_i).
$$

这里 $r_i$ 是像素到 sensor center（传感器中心）的径向距离。这个 baseline 用来测试空间误差是否主要是 center-edge variation（中心-边缘变化）。如果 radial baseline 已经接近 tile SA-LUT，说明主要问题可能是径向光照或视角变化；如果 tile SA-LUT 明显更好，说明误差具有更复杂的二维空间结构。Dense-grid LUT baseline 则作为 high-calibration-cost reference（高标定成本参考）用于深度重建消融。

## Experimental Evaluation（实验评估）

当前实验部分围绕 response shaping（响应塑形）、spatial residuals（空间残差）、depth reconstruction ablation（深度重建消融）、calibration-density analysis（标定密度分析）和 supporting validation（支撑验证）组织。与旧稿相比，原文不再包含 `tab:evaluation_roadmap`、`fig:residual_heatmaps` 或 `tab:supporting_validation` 这类单独占位表/图；相关内容被压缩到三个主实验小节和一个支撑验证段落中。

### Response Shaping and Spatial Diagnostics（响应塑形与空间诊断）

这一实验评估两个问题。第一，multilayer external-reflective stack 是否产生 LUT-friendly response。第二，global LUT 是否留下 structured spatial residuals，从而为 SA-LUT 提供动机。

Figure `fig:response_spatial` 将报告：

- (a) multilayer stack cross-section and layer functions（多层堆叠截面和各层功能）；
- (b) response curves for selected stack configurations or spatial regions（选定堆叠配置或空间区域的响应曲线）；
- (c) response sensitivity or slope map（响应敏感度或斜率图）；
- (d) global-LUT residual heatmap（全局 LUT 残差热图）；
- (e) learned SA-LUT gain/bias or correction map（学习到的 SA-LUT 增益/偏置或修正图）。

图题说明该图要证明两件事：external-reflective stack 产生适合 LUT 的 deep-is-bright response；global LUT 残差具有结构化空间模式，因此需要 SA-LUT。当前仍是占位图，没有真实曲线或热图。

### Depth Reconstruction Ablation（深度重建消融）

这一实验在 sample-wise validation splits（按样本验证划分）下比较 global、radial、tile 和 dense-grid LUT-based reconstruction models。原文明确要求：同一 indentation image（压入图像）中的像素不能同时出现在 training（训练）和 validation（验证）中。这是为了避免 pixel-level leakage（像素级泄漏）导致误差虚低。

Table `tab:depth_ablation` 的当前结构如下：

| Method | LUT | Spatial model | MAE ↓ | RMSE ↓ | 95th err. ↓ |
|---|---|---|---|---|---|
| Global LUT | Mean | None | `\tbd{--}` | `\tbd{--}` | `\tbd{--}` |
| Global LUT | Isotonic | None | `\tbd{--}` | `\tbd{--}` | `\tbd{--}` |
| Radial SA-LUT | Isotonic | $a(r),b(r)$ | `\tbd{--}` | `\tbd{--}` | `\tbd{--}` |
| Tile SA-LUT | Isotonic | $a(x,y),b(x,y)$ | `\tbd{--}` | `\tbd{--}` | `\tbd{--}` |
| Dense-grid LUT | Isotonic | Fine-grid | `\tbd{--}` | `\tbd{--}` | `\tbd{--}` |

这张表的逻辑是逐步增加模型能力：Mean global LUT 是最简单基线，Isotonic global LUT 控制单调性，Radial SA-LUT 只补偿中心-边缘变化，Tile SA-LUT 补偿二维低维空间变化，Dense-grid LUT 作为高标定成本参考。指标包含 MAE、RMSE 和 95th percentile error（95 分位误差），但当前所有数值仍是 `TBD`。

### Calibration-Density Analysis（标定密度分析）

这一实验评估 spatial calibration density（空间标定密度）与 reconstruction accuracy（重建精度）的 tradeoff。Figure `fig:calib_density` 将报告 validation MAE/RMSE 随 calibration positions（标定位置数量）或 grid density（网格密度）变化的曲线，并比较 global、radial 和 tile models。

这部分用于支撑 calibration-efficient（低标定成本）主张。只有当 sparse spatial calibration（稀疏空间标定）能接近 dense calibration performance（密集标定性能），SA-LUT 的低标定成本优势才成立。当前图仍是占位，未给出横轴取值、样本选择方式或误差数值。

### Supporting Validation（支撑验证）

原文没有再用表格列出支撑验证，而是用一个段落概述。支撑验证的目的，是确认主要重建误差没有被 annotation uncertainty（标注不确定性）或 unstable material recovery（不稳定材料恢复）主导。

当前需要报告的支撑指标包括：

- repeated circle annotation 的 center standard deviation（圆心标准差）和 radius standard deviation（半径标准差），当前为 `\tbd{--} px` 和 `\tbd{--} px`；
- 由圆心和半径误差传播得到的 depth uncertainty（深度不确定性），当前为 `\tbd{--} mm`；
- boundary-band exclusion（边界带排除）的最佳宽度，当前为 `\tbd{--} px`；
- prototype release 后恢复到 reference response 的比例和时间，当前为 `\tbd{--}\%`、`\tbd{--} s`；
- residual drift（残余漂移），当前为 `\tbd{--}`；
- runtime（运行时）作为 lightweight implementation statistic（轻量实现统计），可用时再报告。

原文还保留了一个被注释掉的 qualitative object reconstruction（定性物体重建）可选图。只有当版面允许且真实样例可用时，才考虑加入 raw tactile image、global LUT depth、SA-LUT depth、3D surface 和 profile line 等对比。

## Conclusion（结论）

结论段目前是框架性总结。它重申：ITact 是 response-shaped external-reflective monochrome vision-based tactile sensor，配合 calibration-efficient spatially adaptive depth mapping。Multilayer optical stack 把 indentation 塑造成 LUT-friendly deep-is-bright response；SA-LUT 用 low-dimensional spatial gain and bias fields 增强 global monotonic lookup table。实验组织围绕 response shaping、structured spatial residuals、depth reconstruction ablations 和 calibration-density analysis。

结论最后仍有：

```latex
\tbd{Replace this paragraph with quantitative conclusions once experimental results are available.}
```

因此当前结论还不能写成“已经证明误差降低多少”或“达到某个精度”。这些结论必须等真实实验数据填入后再同步。

## 公式索引与直观含义

| Label / 位置 | 公式 | 作用 |
|---|---|---|
| `eq:stack_response` | $I(d,x,y)=I_{\mathrm{bg}}(x,y)+T(x,y)I_{\mathrm{in}}+R(d,x,y)I_{\mathrm{return}}+\epsilon_I$ | 说明观测强度由背景、透射、压入相关反射返回和噪声共同组成，并天然带有空间依赖。 |
| Response image | $\Delta \mathbf{I}_t=\mathcal{N}(\mathbf{I}_t,\mathbf{I}_0)$ | 定义运行时和标定时一致使用的响应图。 |
| Normalized response | $\Delta \mathbf{I}_t=(\mathbf{I}_t-\mathbf{I}_0)/(\mathbf{I}_0+\epsilon)$ | 给出可选归一化响应图，用背景归一化差异。 |
| Spherical label | $d_{\mathrm{geo}}(\rho)=\sqrt{R^2-\rho^2}-\sqrt{R^2-a^2}$ | 用球冠几何从接触圆生成像素级深度标签。 |
| LUT anchor | $g(\Delta I_0)=0$ | 把全局 LUT 的非接触响应锚定为零深度。 |
| Base depth | $z_i=g(\Delta I_i)-g(\Delta I_0)$ | 由全局 LUT 得到样本的基础深度估计。 |
| `eq:sa_lut` | $\hat d_i=a(x_i,y_i)z_i+b(x_i,y_i)$ | 用位置相关增益和偏置修正全局 LUT 深度。 |
| `eq:sa_lut_objective` | $\min_{a,b}\sum_i(d_i-a(x_i,y_i)z_i-b(x_i,y_i))^2+\lambda_a\|\nabla a\|_2^2+\lambda_b\|\nabla b\|_2^2$ | 拟合 SA-LUT 空间场，同时用平滑正则避免过拟合。 |
| Radial baseline | $\hat d_i=a(r_i)z_i+b(r_i)$ | 只按径向距离修正，用于检验中心-边缘空间变化是否足够解释残差。 |

## 图表与实验状态

| Label | 内容状态 |
|---|---|
| `fig:overview` | ITact 和 SA-LUT 系统概览，占位图，包含堆叠、响应曲线、global LUT 残差和 SA-LUT 修正。 |
| `tab:prototype_setup` | 原型与标定设置表，字段完整，但材料、相机、样本量和径向基线数仍为 `TBD`。 |
| `fig:response_spatial` | 响应塑形与空间诊断图，占位，计划展示堆叠截面、响应曲线、斜率图、global LUT 残差和 SA-LUT 修正图。 |
| `tab:depth_ablation` | 深度重建消融表，模型和指标已定，所有结果仍为 `TBD`。 |
| `fig:calib_density` | 标定密度曲线，占位，计划展示验证误差随标定位置数量或网格密度变化。 |
| Optional `fig:object_examples` | 已注释的定性物体重建图，是否保留取决于空间和真实样例。 |

## 局限与可追问点

1. **硬件参数仍未实填**：elastomer、transmissive layer、reflective layer、scattering/support layer、camera 和 ROI 等关键参数仍是 `TBD`，会影响可复现性。
2. **摘要和结论的定量句仍未完成**：Abstract 与 Conclusion 都明确等待真实实验结果替换。
3. **响应塑形证据仍是占位**：还需要真实 response curves、slope map 和 saturation/dynamic range 分析来支撑 C1。
4. **空间残差动机需要图证**：SA-LUT 的必要性依赖 global-LUT residual heatmap 是否确实呈现 structured spatial residuals。
5. **SA-LUT 正则参数未给出**：$\lambda_a$、$\lambda_b$、tile 有效性阈值和 mask-aware smoothing 细节仍需补充，才能复现拟合。
6. **标定密度实验设计仍需明确**：需要说明 calibration positions 如何采样，sparse/dense grids 如何定义，训练/验证样本是否严格 sample-wise 分离。
7. **标签可靠性仍待数据支撑**：circle annotation repeatability、boundary-band exclusion 和 propagated depth uncertainty 目前均为 `TBD`。
8. **任务范围边界较清楚但需保持一致**：原文声明 normal force、shear force 和 slip estimation 不在范围内，后续结果和标题不应暗示这些能力已经被标定。

## 审稿时可重点检查的问题

- `fig:response_spatial` 是否同时证明 monotonicity、usable dynamic range、sensitivity、saturation behavior、contact-patch separability 和 repeatability，而不只是展示一条好看的曲线。
- `sample-wise validation splits` 是否严格避免同一压入图像内的像素泄漏到训练和验证两边。
- Global LUT、Radial SA-LUT、Tile SA-LUT 和 Dense-grid LUT 是否使用公平的标定数据量和一致的预处理。
- Dense-grid LUT 被称为高标定成本参考时，是否报告了它相对 SA-LUT 的 calibration burden（标定负担）。
- $8\times8$ tile grid 的选择是否有依据，是否做过网格尺寸敏感性分析。
- Boundary-band exclusion 是否会人为移除最难重建的边缘区域，从而让误差过于乐观。
- Label uncertainty 是否显著小于 reconstruction MAE，否则误差解释会受到标注噪声限制。
- Calibration-density curve 是否真正支持“低标定成本”，而不只是说明 dense calibration 最好。

## Bibliography（参考文献入口）

当前原文结尾为：

```latex
\bibliographystyle{IEEEtran}
\bibliography{references}
```

当前正文出现的 cite keys 包括：

`gelsight`、`dtact`、`ninedtact`、`densetact`、`rtac0`、`touch_cal`、`gelsight_wedge`、`large_scale_vbts`、`tacshade`、`gelslim`、`improved_gelsight`、`pbr_design`、`digit`。
