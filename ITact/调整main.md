\documentclass[letterpaper,journal]{IEEEtran}

\usepackage{amsmath,amsfonts}
\usepackage{algorithmic}
\usepackage{algorithm}
\usepackage{array}
\usepackage[caption=false,font=normalsize,labelfont=sf,textfont=sf]{subfig}
\usepackage{textcomp}
\usepackage{stfloats}
\usepackage{url}
\usepackage{verbatim}
\usepackage{graphicx}
\usepackage{cite}
\usepackage{xcolor}
\usepackage[hidelinks]{hyperref}
\usepackage{booktabs}
\usepackage{tabularx}

\colorlet{RED}{red}
\colorlet{ORANGE}{orange}
\colorlet{PURPLE}{purple}

\newcolumntype{Y}{>{\raggedright\arraybackslash}X}

\hyphenation{op-tical net-works semi-conduc-tor vi-sion-based tac-tile marker-less ma-terial-structured ex-ter-nal-re-flec-tive}

\newcommand{\dkrc}[1]{\textcolor{blue}{\textbf{[DkrComment:} #1\textbf{]}}}
\newcommand{\hwedit}[1]{\textcolor{teal}{#1}}
\newcommand{\keyedit}[1]{\textcolor{purple}{#1}}
\newcommand{\tbd}[1]{\textcolor{red}{\textbf{[TBD:} #1\textbf{]}}}
\newcommand{\planmark}[1]{\textcolor{orange}{\textbf{[PLAN/REWRITE:} #1\textbf{]}}}
\newcommand{\weakclaim}[1]{\textcolor{purple}{\textbf{[UNVERIFIED/OPTIONAL:} #1\textbf{]}}}

\begin{document}

\title{ITact: Response-Shaped External-Reflective Monochrome Tactile Sensing with Spatially Adaptive LUTs}

\author{\tbd{First Author},~\IEEEmembership{Student Member,~IEEE,}
        \tbd{Second Author},~\IEEEmembership{Member,~IEEE,}
        and \tbd{Third Author},~\IEEEmembership{Senior Member,~IEEE}%
% Optional for final/non-anonymous version; keep commented until real funding and affiliation are available.
% \thanks{This work was supported in part by ...}%
% \thanks{The authors are with ... Corresponding author: ...}%
}

\markboth{IEEE Robotics and Automation Letters,~Vol.~\tbd{XX}, No.~\tbd{XX}, 2026}%
{\tbd{Author} \MakeLowercase{\textit{et al.}}: ITact}

\maketitle

\begin{abstract}
Direct monochrome lookup-table reconstruction provides a lightweight route for vision-based tactile depth sensing, but its accuracy depends on both the optical response curve and the spatial consistency of that response. This paper presents \emph{ITact}, a response-shaped external-reflective monochrome tactile sensing structure, together with Spatially Adaptive LUT (SA-LUT), a calibration-efficient depth-mapping method for indentation reconstruction. The proposed multilayer optical stack uses a controllable combination of transmissive, scattering, and reflective components to shape indentation into a positive \emph{deep-is-bright} response suitable for lookup-table inversion. We characterize this response by monotonicity, usable dynamic range, brightness--depth sensitivity, saturation behavior, contact-patch separability, and repeatability. Calibration measurements further reveal structured position-dependent gain and offset variation across the sensing surface. SA-LUT compensates for this residual variation using a global monotonic brightness--depth LUT and a low-dimensional spatial gain--bias field, preserving lookup-style inference while reducing the need for dense per-pixel calibration or high-capacity learning. The framework is evaluated through response-curve characterization, spatial residual analysis, LUT-based reconstruction ablations, calibration-density analysis, and supporting label-reliability checks. \tbd{Replace the final evaluation sentence with quantitative results once experiments are complete.}
\end{abstract}

\begin{IEEEkeywords}
Vision-based tactile sensing, monochrome tactile sensor, external reflective layer, lookup table, response shaping, spatial calibration.
\end{IEEEkeywords}

\section{Introduction}
\IEEEPARstart{V}{ision-based tactile} sensing converts contact-induced deformation into images that can be processed for robotic manipulation. High-resolution tactile sensors such as GelSight-style systems recover detailed contact geometry from deformable optical media and calibrated shading \cite{gelsight}. A lighter route is direct monochrome tactile reconstruction: DTact and 9DTact show that single-channel tactile images can be mapped to contact geometry through lookup-table calibration when the optical response is sufficiently structured \cite{dtact,ninedtact}. This route is attractive for compact tactile sensing because it keeps the reconstruction pipeline simple, interpretable, and easy to deploy.

For direct monochrome lookup-table reconstruction, the optical response curve is a central design target. A useful response should vary consistently with indentation over the operating range, provide sufficient brightness--depth sensitivity, remain separated from the non-contact background, avoid early saturation, and remain repeatable across repeated contacts. The response should also remain sufficiently consistent across the sensing surface so that a compact inverse map can be fitted with limited calibration data. In practical compact tactile sensors, these properties are affected by the material stack, layer thickness, transmittance, scattering, reflective return, illumination geometry, coating process, camera viewpoint, and boundary reflections. A weak or non-monotonic response makes the LUT difficult to fit, while a spatially varying response leaves structured residuals that a global LUT cannot remove.

ITact studies this problem through a multilayer external-reflective monochrome tactile structure. The contact stack is designed to regulate the balance between background transmission and indentation-dependent reflective return. By placing a reflective interface near the deformable contact surface and controlling the surrounding transmissive and scattering layers, indentation is encoded as a positive \emph{deep-is-bright} single-channel response. This response-shaping design provides a physical basis for direct LUT-based reconstruction. At the same time, the compact optical layout introduces position-dependent gain and offset because light-band distance, local coating, deformation geometry, sidewall reflection, and camera viewing angle vary across the sensing surface. The resulting inverse mapping is therefore better viewed as a spatially varying response than as a purely global intensity--depth curve.

Several alternatives can represent this spatial dependence. A dense per-pixel lookup table can store a separate response at each spatial location, but its calibration cost grows quickly with the number of spatial and intensity bins. Learning-based reconstruction can model more complex responses, but it introduces additional data collection, training, adaptation, and deployment cost \cite{densetact,rtac0,touch_cal}. Coordinate-aware tactile calibration methods further show that pixel position is useful for compensating illumination propagation and sensor-specific spatial variation \cite{gelsight_wedge,large_scale_vbts}. These observations motivate a lookup-compatible middle ground: shape the dominant monochrome response through the optical stack, and model the remaining position-dependent variation with a compact spatial correction.

This paper presents ITact and Spatially Adaptive LUT (SA-LUT). ITact uses a multilayer external-reflective optical stack to obtain a LUT-friendly monochrome response for indentation-depth reconstruction. SA-LUT augments a global monotonic lookup table with low-dimensional spatial gain and bias fields, preserving lookup-style inference while compensating structured position-dependent response variation. The detailed sensing model, calibration procedure, and fitting method are presented in Sec.~\ref{sec:method}.

The main contributions are:
\begin{itemize}
    \item \textbf{Multilayer external-reflective monochrome transduction.}
    We design an external-reflective tactile optical stack that combines transmissive, scattering, and reflective components to convert indentation into a positive single-channel response.

    \item \textbf{LUT-friendly response shaping and characterization.}
    We characterize how the optical stack shapes the depth--brightness response and evaluate its suitability for lookup-table inversion using monotonicity, usable dynamic range, sensitivity, saturation behavior, contact-patch separability, and repeatability.

    \item \textbf{Calibration-efficient Spatially Adaptive LUT.}
    We propose SA-LUT, a lightweight depth reconstruction method that combines a global monotonic brightness--depth LUT with low-dimensional spatial gain and bias fields, enabling spatial correction without dense per-pixel calibration or a high-capacity end-to-end model.
\end{itemize}

\begin{figure*}[!t]
\centering
\fbox{%
\begin{minipage}[c][0.25\textheight][c]{0.94\textwidth}
\centering
Placeholder for overview: \\
(a) multilayer external-reflective stack; \\
(b) response-shaped deep-is-bright curve; \\
(c) global LUT residual caused by spatial variation; \\
(d) SA-LUT spatial gain--bias correction.
\end{minipage}}
\caption{Overview of ITact and SA-LUT. The multilayer external-reflective stack shapes indentation into a LUT-friendly monochrome response, while SA-LUT compensates residual position-dependent response variation with low-dimensional spatial gain and bias fields.}
\label{fig:overview}
\end{figure*}

\section{Related Work}

\subsection{Direct Monochrome and LUT-Based Tactile Reconstruction}
Direct monochrome tactile reconstruction reduces the optical and calibration complexity of RGB photometric tactile sensing. DTact demonstrates that single-channel tactile darkness can be mapped to high-resolution contact geometry using low-cost lookup-table calibration under a structured deep-is-dark optical response \cite{dtact}. 9DTact further develops this family into a compact tactile sensor with shape reconstruction and force-estimation capabilities \cite{ninedtact}. Other monochrome or light/shadow-based systems, such as TacShade and R-Tac0, also show that grayscale tactile images can carry useful geometric cues \cite{tacshade,rtac0}. These works motivate single-channel tactile imaging and show that response-curve quality is central to lookup-table reconstruction. ITact extends this direction by explicitly treating the monochrome response curve as a design target of the optical stack.

\subsection{Optical Stack Design and Response Shaping}
The tactile optical stack strongly determines the measurable image response. Prior systems have shown that elastomer hardness, layer thickness, reflective coating, light routing, housing geometry, and illumination configuration affect tactile contrast, accuracy, durability, and repeatability \cite{gelslim,improved_gelsight,pbr_design}. Compact tactile systems such as DIGIT and GelSlim further highlight the importance of packaging, illumination routing, and fabrication consistency for deployable sensing \cite{digit,gelslim}. In ITact, the external-reflective stack serves as a response-shaping mechanism for monochrome lookup-table reconstruction. Its design goal is to regulate baseline transmission and indentation-dependent return intensity, producing a response curve with useful monotonicity, sensitivity, dynamic range, and contact-patch separability.

\subsection{Spatially Aware and Calibration-Efficient Mapping}
Spatial dependence is a recurring issue in tactile image formation. GelSight Wedge uses an RGBXY mapping to compensate for illumination propagation and sensor-internal spatial variation \cite{gelsight_wedge}. Large-scale VBTS calibration work shows that position information and differential inputs can improve multi-sensor calibration efficiency \cite{large_scale_vbts}. Automated calibration frameworks such as 3D Cal use probing hardware and coordinate-aware neural models to reduce calibration burden \cite{touch_cal}. These methods demonstrate the value of explicit spatial information, while typically relying on RGB/RGB-difference learning pipelines, automated probing, or trained neural models. ITact uses this spatial-dependence insight in a lookup-compatible form: a global monotonic LUT followed by a low-dimensional spatial correction field.

For evaluation, lookup-table depth calibration requires geometric labels that are consistent with tactile image formation. Spherical indentation provides dense geometric labels from an annotated contact circle, while circle-center and radius errors propagate directly into the spherical-cap depth map. ITact uses verified circle annotation and boundary-aware sample filtering to control label noise during calibration and validation. These procedures support the evaluation of response shaping and SA-LUT, and are treated as supporting validation rather than standalone contributions.

\section{Method}
\label{sec:method}

\subsection{Sensor Design and Multilayer Stack}
ITact uses a multilayer external-reflective contact stack, a compact lightband, a monochrome imaging module, and a mechanical housing. The contact stack is designed to regulate the relative contributions of baseline transmission, internal scattering, and indentation-dependent reflected return. The reflective interface is placed close to the deformable contact surface so that local indentation changes the effective return intensity. The transmissive and scattering layers regulate background brightness, contrast, and saturation. The primary calibrated output of this work is an indentation-response depth map within a segmented contact mask. Contact centroid and contact area can be derived from the mask as auxiliary quantities. Calibrated normal force, shear force, and slip estimation are outside the scope of this paper.

A compact response model is
\begin{equation}
I(d,x,y)
=
I_{\mathrm{bg}}(x,y)
+
T(x,y)I_{\mathrm{in}}
+
R(d,x,y)I_{\mathrm{return}}
+
\epsilon_I,
\label{eq:stack_response}
\end{equation}
where \(I_{\mathrm{bg}}\) denotes background illumination, \(T(x,y)\) is the effective transmission term of the stack, \(R(d,x,y)\) is the indentation-dependent return term, and \(\epsilon_I\) denotes imaging noise and unmodeled scattering. The design objective is to choose a stack configuration that produces a positive, sensitive, and repeatable response curve over the target indentation range. The spatial dependence of \(T\) and \(R\) explains why a global intensity--depth map can leave structured residuals after the response has been shaped.

\subsection{Prototype and Calibration Setup}
Table~\ref{tab:prototype_setup} summarizes the prototype and calibration setup used in the experiments. This table reports fixed hardware and acquisition parameters rather than performance metrics.

\begin{table}[t]
\caption{Prototype and Calibration Setup\label{tab:prototype_setup}}
\centering
\small
\setlength{\tabcolsep}{4pt}
\renewcommand{\arraystretch}{1.12}
\begin{tabularx}{\columnwidth}{p{0.40\columnwidth}Y}
\toprule
Item & Setting \\
\midrule
Optical principle & Multilayer external-reflective monochrome imaging \\
Elastomer & \tbd{material / hardness} \\
Transmissive layer & \tbd{material / thickness / proxy transmittance} \\
Reflective layer & \tbd{material / coating process / proxy reflectance} \\
Scattering or support layer & \tbd{material / thickness} \\
Illumination & Single lightband, \tbd{wavelength / voltage} \\
Camera & \tbd{model / resolution / frame rate} \\
ROI resolution & \tbd{--} pixels \\
Calibration indenter & Sphere, radius \tbd{--} mm \\
Calibration samples & \tbd{-- images / -- positions} \\
Global LUT & Mean / isotonic \\
SA-LUT field & $8\times8$ tile gain--bias field \\
Radial baseline & \tbd{--} radial bins \\
\bottomrule
\end{tabularx}
\end{table}

\subsection{Response Image and Contact Mask}
Before decoding, ITact records a no-contact reference image \(\mathbf{I}_0\). Given a tactile image \(\mathbf{I}_t\), the response image is computed as
\begin{equation}
    \Delta \mathbf{I}_t = \mathcal{N}(\mathbf{I}_t,\mathbf{I}_0),
\end{equation}
where \(\mathcal{N}(\cdot)\) denotes the preprocessing function used consistently during calibration, validation, and runtime inference. A simple implementation is reference subtraction followed by thresholding, clipping, and smoothing. A normalized alternative is
\begin{equation}
    \Delta \mathbf{I}_t =
    \frac{\mathbf{I}_t-\mathbf{I}_0}{\mathbf{I}_0+\epsilon}.
\end{equation}
A binary contact mask \(\Omega_t\) is extracted from the response image and used to restrict the reconstructed depth to the contact region.

\subsection{Spherical-Indenter Calibration Labels}
Controlled spherical indentation provides dense geometric labels for fitting and evaluating the brightness--depth mapping. For each calibration frame, the circular contact boundary is detected or verified. Given the circle center \((c_x,c_y)\), radius \(a\), probe radius \(R\), and pixel scale, the geometric depth label at radial distance \(\rho\) is
\begin{equation}
    d_{\mathrm{geo}}(\rho)
    =
    \sqrt{R^2-\rho^2}
    -
    \sqrt{R^2-a^2},
    \quad 0 \leq \rho \leq a .
\end{equation}
Boundary pixels within a narrow band around the contact circle are excluded from LUT fitting because they are sensitive to blur, circle-fitting error, and non-ideal contact mechanics. Calibration points store \(\Delta I\), \(d_{\mathrm{geo}}\), image coordinates, sample identity, and boundary distance, enabling sample-wise validation and calibration-density analysis.

\subsection{Spatially Adaptive LUT}
\label{sec:sa_lut_method}
A global monotonic LUT first captures the dominant brightness--depth relation. The LUT is anchored at the non-contact baseline:
\begin{equation}
    g(\Delta I_0)=0,
\end{equation}
where \(\Delta I_0\) denotes the preprocessed no-contact response. Given a calibration sample \(i\), the global base depth is
\begin{equation}
    z_i = g(\Delta I_i) - g(\Delta I_0).
\end{equation}
SA-LUT models the remaining spatial variation using gain and bias fields:
\begin{equation}
    \hat d_i = a(x_i,y_i)z_i + b(x_i,y_i).
    \label{eq:sa_lut}
\end{equation}
The spatial fields are fitted by minimizing
\begin{equation}
\min_{a,b}
\sum_i
\left(d_i-a(x_i,y_i)z_i-b(x_i,y_i)\right)^2
+
\lambda_a\|\nabla a\|_2^2
+
\lambda_b\|\nabla b\|_2^2 .
\label{eq:sa_lut_objective}
\end{equation}
In this work, \(a\) and \(b\) are represented by an \(8\times8\) tile grid with bilinear interpolation. Tiles with insufficient samples or insufficient base-depth span are filled using mask-aware smoothing from neighboring valid tiles. The bias field is applied only inside the segmented contact mask and is interpreted as a local correction term rather than a non-contact height.

A radial baseline constrains the correction to depend only on radial distance \(r\) from the sensor center:
\begin{equation}
    \hat d_i = a(r_i)z_i + b(r_i).
\end{equation}
This baseline tests whether spatial error is mainly center--edge variation. A dense-grid LUT baseline is used as a high-calibration-cost reference for the depth reconstruction ablation.

\section{Experimental Evaluation}

\subsection{Response Shaping and Spatial Diagnostics}
This experiment evaluates whether the multilayer external-reflective stack produces a LUT-friendly response and whether a global LUT leaves structured spatial residuals. Fig.~\ref{fig:response_spatial} will report stack structure, response curves, response sensitivity, global-LUT residuals, and SA-LUT correction maps.

\begin{figure*}[t]
\centering
\fbox{%
\begin{minipage}[c][0.31\textheight][c]{0.94\textwidth}
\centering
Placeholder: \\
(a) multilayer stack cross-section and layer functions; \\
(b) response curves for selected stack configurations or spatial regions; \\
(c) response sensitivity or slope map; \\
(d) global-LUT residual heatmap; \\
(e) learned SA-LUT gain/bias or correction map.
\end{minipage}}
\caption{Response shaping and spatial diagnostics. This figure characterizes whether the multilayer external-reflective stack produces a LUT-friendly deep-is-bright response and whether a global LUT leaves structured spatial residuals that motivate SA-LUT.}
\label{fig:response_spatial}
\end{figure*}

\subsection{Depth Reconstruction Ablation}
This experiment compares global, radial, tile, and dense-grid LUT-based reconstruction models under sample-wise validation splits. Pixels from the same indentation image are not shared between training and validation. Table~\ref{tab:depth_ablation} will report the main reconstruction results.

\begin{table*}[t]
\caption{Depth Reconstruction Ablation on Sample-Wise Validation Splits\label{tab:depth_ablation}}
\centering
\small
\setlength{\tabcolsep}{4pt}
\renewcommand{\arraystretch}{1.12}
\begin{tabularx}{\textwidth}{l l l c c c}
\toprule
Method & LUT & Spatial model & MAE $\downarrow$ & RMSE $\downarrow$ & 95th err. $\downarrow$ \\
\midrule
Global LUT & Mean & None & \tbd{--} & \tbd{--} & \tbd{--} \\
Global LUT & Isotonic & None & \tbd{--} & \tbd{--} & \tbd{--} \\
Radial SA-LUT & Isotonic & \(a(r),b(r)\) & \tbd{--} & \tbd{--} & \tbd{--} \\
Tile SA-LUT & Isotonic & \(a(x,y),b(x,y)\) & \tbd{--} & \tbd{--} & \tbd{--} \\
Dense-grid LUT & Isotonic & Fine-grid & \tbd{--} & \tbd{--} & \tbd{--} \\
\bottomrule
\end{tabularx}
\end{table*}

\subsection{Calibration-Density Analysis}
This experiment evaluates the tradeoff between spatial calibration density and reconstruction accuracy. Fig.~\ref{fig:calib_density} will report validation error as a function of calibration positions or grid density.

\begin{figure}[t]
\centering
\fbox{%
\begin{minipage}[c][0.21\textheight][c]{0.92\columnwidth}
\centering
Placeholder for calibration-density curves: \\
validation MAE/RMSE versus number of calibration positions for global, radial, and tile models.
\end{minipage}}
\caption{Calibration-density analysis. The plot quantifies how sparse spatial calibration approaches dense calibration performance.}
\label{fig:calib_density}
\end{figure}

\subsection{Supporting Validation}
We additionally report calibration-label repeatability and material stability to ensure that the main reconstruction errors are not dominated by annotation uncertainty or unstable material recovery. Repeated circle annotation gives center and radius standard deviations of \tbd{--} px and \tbd{--} px, corresponding to a propagated depth uncertainty of \tbd{--} mm. Boundary-band exclusion of \tbd{--} px gives the best validation error. The final prototype recovers to within \tbd{--}\% of the reference response in \tbd{--} s after release, with residual drift of \tbd{--}. Runtime is reported as a lightweight implementation statistic when available.

% Optional qualitative figure. Keep only if space permits and real examples are available.
% \subsection{Qualitative Object Reconstruction}
% \begin{figure*}[t]
% \centering
% \fbox{%
% \begin{minipage}[c][0.23\textheight][c]{0.94\textwidth}
% \centering
% Placeholder: raw tactile image / global LUT depth / SA-LUT depth / 3D surface / profile line.
% \end{minipage}}
% \caption{Qualitative object-level reconstruction examples comparing global LUT and SA-LUT on non-spherical contacts.}
% \label{fig:object_examples}
% \end{figure*}

\section{Conclusion}
This paper presented ITact, a response-shaped external-reflective monochrome vision-based tactile sensor with calibration-efficient spatially adaptive depth mapping. The multilayer optical stack shapes indentation into a LUT-friendly deep-is-bright response, while SA-LUT augments a global monotonic lookup table with low-dimensional spatial gain and bias fields. The evaluation is organized around response shaping, structured spatial residuals, depth reconstruction ablations, and calibration-density analysis. \tbd{Replace this paragraph with quantitative conclusions once experimental results are available.}

\bibliographystyle{IEEEtran}
\bibliography{references}

\end{document}