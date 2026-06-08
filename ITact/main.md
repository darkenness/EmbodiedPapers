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
\colorlet{RED}{red}
\colorlet{ORANGE}{orange}
\colorlet{PURPLE}{purple}

\hyphenation{op-tical net-works semi-conduc-tor vi-sion-based tac-tile marker-less ma-terial-structured ex-ter-nal-re-flec-tive}

\newcommand{\dkrc}[1]{\textcolor{blue}{\textbf{[DkrComment:} #1\textbf{]}}}
\newcommand{\hwedit}[1]{\textcolor{teal}{#1}}
\newcommand{\keyedit}[1]{\textcolor{purple}{#1}}
\newcommand{\tbd}[1]{\textcolor{red}{\textbf{[TBD:} #1\textbf{]}}}
\newcommand{\planmark}[1]{\textcolor{orange}{\textbf{[PLAN/REWRITE:} #1\textbf{]}}}
\newcommand{\weakclaim}[1]{\textcolor{purple}{\textbf{[UNVERIFIED/OPTIONAL:} #1\textbf{]}}}

\begin{document}

\title{ITact: Calibration-Efficient Spatially Adaptive Depth Mapping for External-Reflective Monochrome Vision-Based Tactile Sensing}

\author{\tbd{First Author},~\IEEEmembership{Student Member,~IEEE,}
        \tbd{Second Author},~\IEEEmembership{Member,~IEEE,}
        and \tbd{Third Author},~\IEEEmembership{Senior Member,~IEEE}%
% Optional for final/non-anonymous version; keep commented until real funding and affiliation are available.
% \thanks{This work was supported in part by the Example Robotics Laboratory and the Example Research Fund.}%
% \thanks{The authors are with the Department of Robotics, Example University, City, Country. Corresponding author: First Author (email: author@example.edu).}%
}

\markboth{IEEE Robotics and Automation Letters,~Vol.~\tbd{XX}, No.~\tbd{XX}, 2026}%
{\tbd{Author} \MakeLowercase{\textit{et al.}}: ITact}

\maketitle

\begin{abstract}
Vision-based tactile sensors can recover dense contact geometry, and existing approaches often trade off reconstruction accuracy, calibration cost, and deployment simplicity. RGB photometric tactile sensors require calibrated multi-channel illumination, while direct single-channel lookup-table methods are lightweight and rely on a spatially uniform intensity--depth response. This paper presents \emph{ITact}, an external-reflective monochrome tactile sensing structure, and Spatially Adaptive LUT (SA-LUT), a calibration-efficient depth-mapping method for indentation reconstruction. The external-reflective optical stack converts indentation into a positive monotonic \emph{deep-is-bright} intensity response within a calibrated operating range, providing a physical basis for single-channel depth reconstruction. Calibration data are used to characterize the structured position-dependent variation caused by light-band geometry, reflective coating, elastomer deformation, viewing configuration, and boundary light-pipe conditions. SA-LUT compensates for this variation by combining a global monotonic brightness--depth lookup table with a low-dimensional spatial gain--bias field, retaining lookup-style inference while avoiding dense per-pixel calibration and large end-to-end networks. A spherical-indentation protocol with human-verifiable circle annotation and boundary-aware sample filtering provides geometric labels for fitting and evaluation. The evaluation examines response monotonicity, structured spatial residuals, global/radial/tile ablations, calibration density, and label reliability. \tbd{Replace the final evaluation sentence with quantitative results once experiments are complete.}
\end{abstract}

\begin{IEEEkeywords}
Vision-based tactile sensing, monochrome tactile sensor, lookup table, spatial calibration, low-cost calibration.
\end{IEEEkeywords}

\section{Introduction}
\IEEEPARstart{V}{ision-based tactile} sensing converts contact-induced deformation into images that can be processed for robotic manipulation. High-resolution tactile sensors such as GelSight-style systems recover contact geometry from reflective elastomers and calibrated optical shading \cite{gelsight}. A lighter route is direct monochrome intensity mapping: DTact and 9DTact show that single-channel grayscale tactile images can be mapped to contact geometry with low-cost lookup-table calibration when the optical response is sufficiently structured \cite{dtact,ninedtact}. These works motivate a deployment-oriented question: can indentation be encoded into a simple monotonic single-channel response, and can the remaining spatial nonuniformity be compensated while avoiding dense per-pixel calibration and high-capacity learning?

A global single-channel lookup table is attractive because it is interpretable, fast, and easy to deploy. Its use relies on a spatial-uniformity approximation: an identical intensity change should correspond to a similar indentation depth over the entire sensing surface. This approximation becomes restrictive for external-reflective tactile imaging. In the ITact structure, the reflective interface is placed near the deformable contact surface so that indentation changes the local return path and produces a \emph{deep-is-bright} response. This optical encoding provides the physical basis for single-channel depth reconstruction, while the resulting intensity--depth relationship is also affected by light-band position, incidence angle, reflective-layer coating, elastomer deformation, lens vignetting, sidewall reflection, and camera viewing configuration. The desired inverse model is therefore better described as a spatially varying response $f(\Delta I,x,y)$ than as a purely global mapping $g(\Delta I)$.

Spatial dependence can be represented in several ways. A dense per-pixel lookup table can express the full response, with a calibration cost that grows with the number of spatial bins and intensity levels. Learning-based tactile reconstruction can model more complex nonlinear mappings, with additional data collection, training, and sensor-specific adaptation. Coordinate-aware tactile reconstruction methods, such as GelSight Wedge and large-scale VBTS calibration frameworks, show that explicit position information helps compensate for illumination propagation and sensor-specific spatial variation \cite{gelsight_wedge,large_scale_vbts}. ITact follows a lookup-compatible path: it preserves the global monotonic brightness--depth mapping as the main response and uses a low-dimensional spatial correction field to compensate the remaining position-dependent gain and offset.

The resulting method, Spatially Adaptive LUT (SA-LUT), is a calibration-efficient middle ground between a global LUT and dense per-pixel calibration. It retains a one-dimensional monotonic lookup table for the dominant brightness--depth relation and introduces smooth spatial gain--bias fields for structured residual variation. The detailed formulation and fitting procedure are presented in Sec.~\ref{sec:sa_lut_method}.

The main contributions of this paper are:
\begin{itemize}
    \item \textbf{External-reflective monochrome tactile encoding and characterization.} We design and characterize an external-reflective single-channel tactile structure that converts indentation depth into a positive monotonic intensity response within a calibrated operating range. We further characterize the structured spatial response variation introduced by the combined optical effects of the reflective layer, light-band geometry, coating process, elastomer deformation, and viewing configuration.

    \item \textbf{Calibration-efficient Spatially Adaptive LUT.} We propose SA-LUT, a lightweight depth reconstruction method that decomposes the spatially varying mapping $f(\Delta I,x,y)$ into a global monotonic LUT and a low-dimensional spatial gain--bias field. This design preserves lookup-style inference while compensating for position-dependent optical responses.

    \item \textbf{Reproducible low-cost spherical-indentation calibration.} We develop a calibration protocol with human-verifiable circle annotation, boundary-aware sample filtering, and calibration-density evaluation. This protocol provides geometric depth labels for SA-LUT and quantifies the tradeoff between spatial calibration density and reconstruction accuracy.
\end{itemize}

\section{Related Work}

\subsection{Direct Monochrome Tactile Reconstruction}
Direct intensity-based tactile reconstruction provides a lightweight alternative to RGB photometric tactile sensing. DTact demonstrates that single-channel tactile darkness can be mapped to high-resolution contact geometry using low-cost lookup-table calibration under a structured deep-is-dark optical response \cite{dtact}. 9DTact further develops this family into a compact tactile sensor with shape reconstruction and force-estimation capabilities \cite{ninedtact}. Other monochrome or light/shadow-based systems, such as TacShade and R-Tac0, also show that grayscale tactile images can carry useful geometric cues \cite{tacshade,rtac0}. These works motivate single-channel tactile imaging, while a global LUT relies on the spatial-uniformity approximation that the same intensity change corresponds to similar depth over the sensing surface. ITact studies an external-reflective deep-is-bright response and explicitly models the remaining spatial dependence with a low-dimensional gain--bias field.

\subsection{Learning-Based and Coordinate-Aware Tactile Calibration}
Learning-based tactile reconstruction can model complex image-to-geometry mappings, and coordinate-aware methods further show that tactile image formation often depends on pixel location. GelSight Wedge uses an RGBXY mapping to compensate for illumination propagation and sensor-internal spatial variation \cite{gelsight_wedge}. Large-scale VBTS calibration work shows that position information and differential inputs can improve multi-sensor calibration efficiency \cite{large_scale_vbts}. Automated calibration frameworks such as 3D Cal use probing hardware and coordinate-aware neural models to reduce calibration burden \cite{touch_cal}. These methods demonstrate the value of explicit spatial information, while typically relying on RGB/RGB-difference learning pipelines, automated probing, or trained neural models. ITact uses this spatial-dependence insight in a lookup-compatible form: a global monotonic LUT followed by a low-dimensional spatial correction field.

\subsection{Optical Stack Design and Fabrication Effects}
The tactile optical stack strongly determines the measurable image response. Prior systems have shown that elastomer hardness, layer thickness, reflective coating, light routing, housing geometry, and illumination configuration affect tactile contrast, accuracy, and durability \cite{gelslim,pbr_design}. Compact tactile systems such as DIGIT and GelSlim also highlight the importance of packaging, illumination routing, and fabrication repeatability for deployable sensing \cite{digit,gelslim}. ITact treats the external-reflective stack as a response-shaping mechanism: it produces a positive deep-is-bright response for single-channel depth reconstruction, while the same stack introduces position-dependent gain and offset through coating variation, light-band geometry, local deformation, viewing angle, and boundary light-pipe conditions. This hardware-induced variation motivates the spatial gain--bias correction used by SA-LUT.

\subsection{Spherical-Indentation Labels and Boundary Reliability}
Lookup-table depth calibration requires geometric labels that are consistent with the tactile image formation. Spherical indentation provides a convenient way to generate dense depth labels from the annotated contact circle, while circle-center and radius errors propagate directly into the spherical-cap depth map. Boundary pixels are also sensitive to blur, non-ideal contact mechanics, and contact-edge localization errors. Illumination-difference methods can make geometric boundaries more visible: dynamic illumination improves tactile image contrast and sharpness \cite{dynamic_illumination}, while multi-flash imaging shows that illumination changes can enhance depth boundaries \cite{multi_flash}. In ITact, such cues are used only as optional annotation aids; the main calibration protocol relies on human-verifiable circle annotation, boundary-aware sample filtering, and calibration-density analysis.

\section{Sensor Design and Image Formation}
\label{sec:sensor_design}

\subsection{Design Requirements}
ITact is designed around four requirements. First, the sensor uses a single optical imaging path and a monochrome tactile image to reduce synchronization, color calibration, and processing complexity. Second, the contact module is markerless and operates without printed dots, grids, or tracked visual features. Third, the external-reflective optical stack should produce a repeatable deep-is-bright response so that indentation can be inferred from a monotonic intensity trend over a calibrated operating range. Fourth, the decoding pipeline should remain lightweight, interpretable, and deployable as lookup tables and low-dimensional spatial fields.

\subsection{External-Reflective Response Shaping}
The external-reflective layer serves as a response-shaping interface in the monochrome optical stack. It increases the indentation-dependent return intensity and improves contact-patch separability within the calibrated operating range. This optical configuration also introduces position-dependent gain and offset due to light-band distance, coating variation, local deformation, viewing angle, and boundary light-pipe conditions. SA-LUT models these position-dependent terms with a low-dimensional spatial correction field.

The tactile image at time $t$ is represented as a grayscale image $\mathbf{I}_t \in \mathbb{R}^{H \times W}$. Given a no-contact reference image $\mathbf{I}_0$, the response image is
\begin{equation}
    \Delta \mathbf{I}_t = \mathcal{N}(\mathbf{I}_t,\mathbf{I}_0),
\end{equation}
where $\mathcal{N}$ denotes the same preprocessing function used in calibration and runtime inference. A simple implementation is reference subtraction followed by thresholding, clipping, and smoothing. A normalized alternative is
\begin{equation}
    \Delta \mathbf{I}_t =
    \frac{\mathbf{I}_t-\mathbf{I}_0}{\mathbf{I}_0+\epsilon}.
\end{equation}

ITact targets an empirical operating regime in which the reference-subtracted response increases with geometric indentation depth after excluding saturated and boundary pixels. This deep-is-bright property is characterized by monotonicity violation rate, dynamic range, and saturation behavior.

A compact image-formation view is
\begin{equation}
I(d,x,y) \approx
G(x,y)\rho_{\mathrm{eff}}(d,\theta,\phi)
\exp[-2\alpha L(d,x,y)] + c(x,y),
\end{equation}
where $G(x,y)$ is a spatial illumination gain, $\rho_{\mathrm{eff}}$ is an effective return factor determined by local geometry and material scattering, $L(d,x,y)$ is the effective optical path length, and $c(x,y)$ is a background term. The response-shaping objective is to make indentation-dependent return-efficiency changes measurable within the calibrated range. The spatial dependence of $G$, $L$, $\rho_{\mathrm{eff}}$, and $c$ explains why a global $\Delta I\mapsto d$ map can leave structured residuals.

\subsection{Hardware Design Choices}
Table~\ref{tab:design_tradeoff} summarizes how the hardware choices contribute to the response-shaping goal and what calibration-relevant effects they introduce. These effects determine the dominant spatial gain, offset, boundary, and repeatability terms characterized during calibration. \tbd{Add a cross-section schematic showing the contact surface, reflective layer, elastomer, lightband, camera path, sidewall or boundary path, and near-/far-lightband regions.}

\begin{table}[t]
\caption{Hardware Design Choices and Calibration-Relevant Effects}
\label{tab:design_tradeoff}
\centering
\footnotesize
\setlength{\tabcolsep}{4pt}
\renewcommand{\arraystretch}{1.15}
\begin{tabular}{p{0.30\columnwidth}p{0.62\columnwidth}}
\hline
Component & Design trade-off \\
\hline
External reflective layer
& Strengthens indentation-dependent return intensity for deep-is-bright encoding; may introduce coating nonuniformity, saturation, and spatial gain variation. \\
Single lightband
& Provides compact single-channel illumination; introduces near--far gain variation and directional falloff. \\
Monochrome camera
& Reduces color calibration and computation burden; removes color-direction cues available in RGB photometric tactile sensors. \\
Sidewall / optical masking
& Suppresses stray light and boundary reflections; residual boundary light-pipe artifacts may remain. \\
Blade / scrape coating
& Enables low-cost reflective-layer fabrication; coating thickness and roughness may vary across units. \\
Elastomer layer
& Provides compliant contact deformation; recovery delay, hysteresis, and residual drift must be evaluated. \\
\hline
\end{tabular}
\end{table}

\subsection{Calibrated Output Scope}
The primary calibrated output of this work is an indentation-response depth map within a segmented contact mask. Contact centroid and contact area are derived auxiliary quantities from the mask and are used only to summarize the reconstructed contact patch. A confidence score can be used as an implementation-level quality indicator based on saturation, calibrated intensity range, segmentation quality, and reference stability. ITact leaves calibrated normal force, shear force, and slip estimation outside the present output scope.

\section{Spherical-Indenter Calibration}
\label{sec:spherical_calibration}

\subsection{Contact Patch Segmentation}
The contact patch is extracted from the response image. A binary contact mask is defined as
\begin{equation}
\mathbf{B}_t(u,v)=
\begin{cases}
1, & \Delta \mathbf{I}_t(u,v)>\tau,\\
0, & \text{otherwise},
\end{cases}
\end{equation}
where $\tau$ is a non-contact baseline threshold selected from calibration data or adaptive image statistics. Connected-component filtering and small-region removal produce the contact region $\Omega_t$.

\subsection{Spherical-Cap Depth Labels}
Controlled spherical indentation provides dense geometric labels for the intensity--depth mapping. For each calibration frame, a reference-subtracted response image is generated and the circular contact boundary is detected or manually verified. Given the circle center $(c_x,c_y)$, contact radius $a$, probe radius $R$, and pixel-to-millimeter scale, the geometric depth label at a pixel with radial distance $\rho$ is
\begin{equation}
    d_{\mathrm{geo}}(\rho)
    =
    \sqrt{R^2-\rho^2}
    -
    \sqrt{R^2-a^2},
    \quad 0\leq \rho \leq a.
\end{equation}
A human-verifiable annotation interface stores circle centers, radii, accepted/rejected status, and quality information. Boundary pixels within a small band around the contact circle are excluded from LUT fitting because they are sensitive to circle-fitting error, blur, and non-ideal contact mechanics. Calibration points store $\Delta I$, $d_{\mathrm{geo}}$, image coordinates, sample identity, radial distance, and boundary distance, enabling sample-wise validation splits and calibration-density studies.

\subsection{Label Validity Checks}
The spherical-cap label assumes a calibrated pixel-to-millimeter scale, a rectified ROI, and an accurately annotated contact circle. Label validity is evaluated by repeat annotation on a subset of calibration frames and by boundary-band ablation. When stage displacement is available, the maximum geometric depth inferred from the annotated circle is compared with the commanded vertical displacement, and inconsistent frames are rejected. The annotation repeatability and propagated depth uncertainty define the label noise floor for interpreting reconstruction MAE. \tbd{Report center/radius repeatability, propagated depth uncertainty, boundary-band ablation, and stage-depth discrepancy when available.}

\section{Spatially Adaptive LUT}
\label{sec:sa_lut_method}

\subsection{Global Monotonic LUT}
A global monotonic lookup table first captures the dominant brightness--depth relation. For each validation split, $g$ is fitted using only the valid training calibration samples. The LUT is anchored at the non-contact baseline,
\begin{equation}
    g(\Delta I_0)=0,
\end{equation}
where $\Delta I_0$ denotes the non-contact response after preprocessing. Given a response value $\Delta I_i$, the global base depth is
\begin{equation}
    z_i=g(\Delta I_i)-g(\Delta I_0).
\end{equation}
In implementation, $g$ is represented as an isotonic one-dimensional LUT in metric depth units. This sequential fitting fixes the global scale before the spatial fields are estimated.

\subsection{Spatial Gain--Bias Field}
For an ideal spatially uniform sensor, the base depth $z_i$ would be sufficient. In the external-reflective ITact stack, local response curves can share a monotonic trend while differing in gain or offset. SA-LUT models this structured residual with spatial gain and bias fields:
\begin{equation}
    \hat d(x,y)=a(x,y)g(\Delta I)+b(x,y).
    \label{eq:sa_lut}
\end{equation}
Given training samples $(\Delta I_i,x_i,y_i,d_i)$, the fields are fitted by minimizing
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
In this work, $a$ and $b$ are represented by an $8\times8$ tile grid with bilinear interpolation. Each valid tile is fitted by least squares, while tiles with insufficient sample count or insufficient base-depth span are filled using mask-aware smoothing from neighboring valid tiles. The tiled representation is used for simplicity, reproducibility, and lookup-style deployment.

The bias field is a local correction term applied only inside the segmented contact mask. During runtime inference, the reconstructed height map is masked to the contact region, and the mask is reapplied after smoothing to avoid false positive depth outside contact.

\subsection{Radial Baseline}
A radial baseline constrains the correction field to depend only on $r=\sqrt{(u-u_c)^2+(v-v_c)^2}$:
\begin{equation}
    \hat d(u,v)=a(r)g\big(\Delta I(u,v)\big)+b(r).
\end{equation}
This baseline tests whether the spatial error is mainly center--edge variation. It is used only as an ablation against the proposed tiled SA-LUT field.

\subsection{Optional Annotation Aid}
High--low differential imaging is used only as an optional annotation aid. It is applied outside the online sensing pipeline and outside the required SA-LUT path. For difficult circular-contact annotations, the same camera can acquire high- and low-intensity frames under the same contact pose and construct
\begin{equation}
    E_{HL}
    =
    \frac{I_H-\alpha I_L}{I_H+\alpha I_L+\epsilon},
\end{equation}
where $I_H$ and $I_L$ are high- and low-intensity frames and $\alpha$ is estimated from a non-contact background region. This cue is retained in the final manuscript only when annotation or reconstruction improvements are reported.

\subsection{Runtime Decoding}
The online decoding path reuses the same preprocessing as calibration. After contact segmentation, the global LUT provides $g(\Delta I)$, the spatial field supplies $a(u,v)$ and $b(u,v)$, and the final height map is masked to the contact region. Mask-aware blur and final contact-mask reapplication prevent depth leakage outside the contact boundary. The contact-level depth can be summarized by the average or maximum of $\hat d(u,v)$ over $\Omega_t$.

\begin{algorithm}[t]
\caption{SA-LUT Calibration and Runtime Decoding}
\label{alg:itact}
\begin{algorithmic}[1]
\STATE \textbf{Offline calibration:}
\STATE Capture a no-contact reference image $\mathbf{I}_0$
\STATE Collect spherical-indentation images across positions and depths
\STATE Verify or correct contact-circle center and radius
\STATE Generate $d_{\mathrm{geo}}$ labels and remove boundary samples
\STATE Fit global monotonic LUT $g(\Delta I)$ on training samples
\STATE Fit radial baseline and tiled spatial fields $a(x,y),b(x,y)$
\STATE \textbf{Online inference:}
\FOR{each tactile image $\mathbf{I}_t$}
\STATE Compute $\Delta \mathbf{I}_t=\mathcal{N}(\mathbf{I}_t,\mathbf{I}_0)$
\STATE Segment contact patch $\Omega_t$
\STATE Reconstruct $\hat d_t=a(x,y)g(\Delta I_t)+b(x,y)$ inside $\Omega_t$
\STATE Apply contact mask and mask-aware smoothing
\STATE Output contact mask and depth map
\ENDFOR
\end{algorithmic}
\end{algorithm}

\section{Experimental Evaluation}
\subsection{Evaluation Protocol and Metrics}
The evaluation is organized around five questions that correspond directly to the proposed hardware--algorithm design. First, does the external-reflective contact module produce a positive \emph{deep-is-bright} response over a useful operating range? Second, do the remaining intensity--depth errors exhibit spatial structure? Third, does SA-LUT improve reconstruction over global and radial LUT baselines under sample-wise validation? Fourth, how many spatial calibration samples are needed before SA-LUT approaches dense calibration accuracy? Fifth, does the calibration protocol produce reliable spherical-indentation labels?

All reconstruction results are evaluated on sample-wise validation splits unless otherwise specified. Pixels from the same indentation image remain in the same training or validation partition, because neighboring pixels share the same circle annotation and deformation geometry. The main metrics are summarized in Table~\ref{tab:custom_metrics}.

\begin{table}[t]
\caption{Custom Diagnostic Metrics\label{tab:custom_metrics}}
\centering
\small
\resizebox{\columnwidth}{!}{%
\begin{tabular}{lp{0.65\columnwidth}}
\hline
Metric & Definition \\
\hline
MVR & Fraction of calibrated samples violating the expected monotonic deep-is-bright relation. \\
Slope CV & Coefficient of variation of local intensity--depth slopes across spatial tiles. \\
Base-depth span & Range of global-LUT base depth within each spatial tile, used to assess local fitting reliability. \\
Calibration density & Number or spatial grid density of indentation samples used to fit SA-LUT. \\
\hline
\end{tabular}%
}
\end{table}

\subsection{External-Reflective Response Characterization}
\planmark{This experiment verifies the physical basis of the sensor: indentation should increase the single-channel intensity within the calibrated operating range.} Controlled indentation scans are collected at representative spatial regions, including the center, near-lightband region, far-lightband region, and boundary region. \planmark{The expected visual evidence includes brightness--depth curves and a spatial slope heatmap.} \planmark{Table~\ref{tab:response_char} is reserved for quantitative response diagnostics.}

\begin{table}[t]
\caption{External-Reflective Response Characterization\label{tab:response_char}}
\centering
\small
\resizebox{\columnwidth}{!}{%
\begin{tabular}{lcccc}
\hline
Region & MVR (\%) $\downarrow$ & Dynamic range $\uparrow$ & Slope & Recovery time (s) $\downarrow$ \\
\hline
Center & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Near lightband & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Far lightband & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Boundary & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Overall & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
\hline
\end{tabular}%
}
\end{table}

\subsection{Spatial Nonuniformity Diagnosis}
This experiment tests whether the global intensity--depth mapping is sufficient. The primary plots are location-wise $\Delta I$--depth curves, a spatial slope heatmap, and the global-LUT residual heatmap. \planmark{If the curves share the same monotonic trend with different slope or offset, the observation motivates the spatial fields $a(x,y)$ and $b(x,y)$.} \planmark{The residual heatmap should be interpreted together with the calibration-point count map and the base-depth-span map, because unreliable tiles with limited depth variation can produce unstable local slope estimates.}

\subsection{SA-LUT Depth Mapping Ablation}
This experiment compares the proposed spatial correction with increasingly strong baselines. The evaluated models are: mean global LUT, isotonic global LUT, radial SA-LUT, and tile SA-LUT. \weakclaim{A gain-only tile variant should be retained only if implemented as an ablation.} Table~\ref{tab:depth_ablation} is the main quantitative table for the depth reconstruction claim.

\begin{table*}[t]
\caption{Depth Reconstruction Ablation on Sample-Wise Validation Splits\label{tab:depth_ablation}}
\centering
\small
\resizebox{\textwidth}{!}{%
\begin{tabular}{lcccccc}
\hline
Method & LUT type & Spatial model & MAE (mm) $\downarrow$ & RMSE (mm) $\downarrow$ & Edge MAE (mm) $\downarrow$ & Runtime (ms) $\downarrow$ \\
\hline
Global LUT & Mean & None & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Global LUT & Isotonic & None & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Radial SA-LUT & Isotonic & $a(r),b(r)$ & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Tile SA-LUT & Isotonic & $a(x,y),b(x,y)$ & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Tile SA-LUT & Isotonic & gain-only & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Dense per-pixel LUT & Isotonic & Per-pixel & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
\hline
\end{tabular}%
}
\end{table*}

\subsection{Calibration-Density Ablation}
The calibration-density experiment quantifies whether spatial correction requires dense calibration. SA-LUT is fitted using sparse spatial grids, such as $3\times3$, $5\times5$, $7\times7$, $9\times9$, and a dense reference set. \planmark{The expected plot is calibration density versus validation error.} Table~\ref{tab:calib_density} provides a compact numerical summary.

\begin{table}[t]
\caption{Calibration-Density Ablation of SA-LUT\label{tab:calib_density}}
\centering
\small
\resizebox{\columnwidth}{!}{%
\begin{tabular}{lccccc}
\hline
Method & $3{\times}3$ & $5{\times}5$ & $7{\times}7$ & $9{\times}9$ & Dense \\
\hline
Global LUT & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Radial SA-LUT & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Tile SA-LUT & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
\hline
\end{tabular}%
}
\end{table}

\subsection{Calibration Label Reliability}
The spherical-indentation label quality depends on accurate circle center and radius estimation. This experiment evaluates automatic detection, human verification, repeated annotation, and boundary-aware filtering. The optional high--low edge cue is included only when it is used to assist annotation. \planmark{Table~\ref{tab:circle_edge} is reserved for circle-annotation reliability results.}

\begin{table}[t]
\caption{Calibration Circle Annotation Reliability\label{tab:circle_edge}}
\centering
\small
\resizebox{\columnwidth}{!}{%
\begin{tabular}{lcccc}
\hline
Method & Success (\%) $\uparrow$ & Center err. (px) $\downarrow$ & Radius err. (px) $\downarrow$ & Manual corr. (\%) $\downarrow$ \\
\hline
Raw-difference contour & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Hough / RANSAC & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Human-verified & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Optional high--low cue & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
\hline
\end{tabular}%
}
\end{table}

\subsection{Material Stability and Cross-Unit Repeatability}
Because ITact is a hardware--algorithm co-design, the contact module must be evaluated for repeatability and manufacturability. Repeated contacts at the same position and depth are used to measure recovery time, residual drift, reference-image shift, and reconstruction degradation. \weakclaim{If multiple prototypes are fabricated, the same calibration protocol is applied to each unit and cross-unit performance is reported.} \planmark{Table~\ref{tab:repeatability} is reserved for these stability results.}

\begin{table}[t]
\caption{Material Stability and Repeatability\label{tab:repeatability}}
\centering
\small
\resizebox{\columnwidth}{!}{%
\begin{tabular}{lcccc}
\hline
Prototype / variant & Recovery time (s) $\downarrow$ & Drift (mm) $\downarrow$ & Repeat MAE (mm) $\downarrow$ & Notes \\
\hline
Unit 1 & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Unit 2 & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
Unit 3 & \tbd{--} & \tbd{--} & \tbd{--} & \tbd{--} \\
\hline
\end{tabular}%
}
\end{table}

\section{Results and Analysis}
\planmark{The final results should be reported in the same order as the evaluation protocol.} \planmark{The response characterization should first confirm the deep-is-bright operating range.} \planmark{The spatial diagnostics should then show that the global LUT residuals contain structured spatial patterns.} \planmark{The depth ablation should report whether radial and tile SA-LUT reduce validation error relative to the global baselines.} \planmark{The calibration-density analysis should show whether sparse spatial sampling approaches dense calibration performance.} \planmark{Finally, calibration-label and repeatability experiments should establish whether the model is fitted from reliable labels and from a mechanically usable contact module.}

The most important visual results are: (i) multi-location brightness--depth curves, (ii) global/radial/tile residual heatmaps, (iii) gain and bias grids with count and base-span maps, (iv) calibration-density curves, and (v) circle-annotation overlays. \weakclaim{Claims about calibrated normal force, shear force, or slip estimation require additional force labels and corresponding validation experiments.}

\section{Discussion}
ITact is designed for low-complexity markerless contact localization, contact-area estimation, and deep-is-bright indentation-response depth mapping. Its main contribution is the combination of external-reflective depth encoding, structured spatial response characterization, low-dimensional spatial correction, and reproducible low-cost calibration. This design choice reduces hardware and processing complexity and limits the sensor's applicability to tasks that require calibrated force feedback or shear-field reconstruction.

The main limitations include single-contact assumptions, possible loss of monotonicity under large deformation, saturation or hot spots caused by illumination geometry, dependence on material aging, sensitivity to reference-image drift, and fabrication consistency of the external-reflective layer. \weakclaim{A low-dimensional gain--bias field has limited capacity for arbitrary local defects; a residual MLP or CNN accuracy mode may be useful for those cases.} These limitations are measurable through the proposed $I(d)$ scans, residual heatmaps, durability tests, and cross-unit calibration experiments. \planmark{Future work should investigate adaptive recalibration, multi-contact interpretation, improved reflective-layer manufacturing repeatability, multi-intensity edge refinement, and integration with closed-loop manipulation controllers.}

\section{Conclusion}
This paper presented ITact, an external-reflective markerless monochrome vision-based tactile sensor with calibration-efficient spatially adaptive depth mapping. The external-reflective optical stack produces a deep-is-bright tactile response, while SA-LUT decodes depth through a global monotonic brightness--depth map corrected by smooth spatial gain and bias fields. A reproducible spherical-indentation calibration protocol with human-verifiable circle annotation and calibration-density evaluation supports reliable low-cost model fitting. \planmark{The planned characterization focuses on whether this framework recovers the spatial dependence of the tactile response with substantially lower calibration cost than dense per-pixel mapping or large unconstrained learning.}

% Optional for final/non-anonymous version; keep commented until real acknowledgments are available.
% \section*{Acknowledgments}
% The authors thank the members of the Example Robotics Laboratory for discussions on markerless vision-based tactile sensor design and robotic manipulation experiments.

\bibliographystyle{IEEEtran}
\bibliography{references}

\end{document}
