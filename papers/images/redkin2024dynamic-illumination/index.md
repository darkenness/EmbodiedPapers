# Enhance Vision-based Tactile Sensors 图片索引

paper:: [[@redkin2024dynamic-illumination]]
pdf:: [[papers/pdfs/redkin2024dynamic-illumination.pdf]]
arxiv:: 2504.00017

总计：10 张图片

## 论文图

### Fig. 1 方法示意

![[papers/images/redkin2024dynamic-illumination/teaser_page1.png|700]]

说明：静态照明的 vision-based tactile sensor 改成动态照明采集多帧，再通过 image fusion 得到更高质量的单帧 tactile measurement。

### Fig. 2 不同照明下的 coin 观测

![[papers/images/redkin2024dynamic-illumination/coin_different_illumination_page1.png|700]]

说明：同一个 coin 在不同 RGB illumination settings 下呈现不同纹理、阴影和颜色响应，是后续融合的直观动机。

### Fig. 3 实验物体

![[papers/images/redkin2024dynamic-illumination/materials_page1.png|700]]

说明：实验覆盖 coin、plastic yarn、yarn ball、white material、yellow brush、grid、wooden sticks cut、Lego 等不同触觉/视觉属性的物体；正文中 coin 两面也被当作不同对象分析。

### Fig. 4 动态照明组合热力图

![[papers/images/redkin2024dynamic-illumination/heatmap_contrast_page1.png|700]]

![[papers/images/redkin2024dynamic-illumination/heatmap_sharpness_page1.png|700]]

说明：与标准 DIGIT illumination `(15,15,15)` 相比，加入其他照明帧后 contrast / sharpness 的变化；文中报告 `(0,10,3)` 对 contrast 和 sharpness 提升最明显。

### Fig. 5 不同融合方法的结果图

![[papers/images/redkin2024dynamic-illumination/methods_resulting_images_page1.png|700]]

说明：比较 static lighting、channelwise sum、Laplacian Pyramid、Brovey、Wavelet 等方法在 coin 和 Lego 上的输出效果。

### Fig. 6 全物体平均指标

![[papers/images/redkin2024dynamic-illumination/exp_res_all_page1.png|700]]

说明：Laplacian Pyramid 主要增强 background difference / contrast；Channelwise Sum 增强 background difference / sharpness；Wavelet 与 Brovey 可同时提升多个指标，其中 Wavelet 整体最好。

### Fig. 7 融合图像数量

![[papers/images/redkin2024dynamic-illumination/n_images_sharpness_page1.png|700]]

![[papers/images/redkin2024dynamic-illumination/n_images_contrast_page1.png|700]]

说明：多数对象的 sharpness 最优需要 2-4 张图；contrast 若能选到未知最优照明，单张图往往已经足够，继续加图可能降低融合质量。

### Fig. 8 帧间等待时间

![[papers/images/redkin2024dynamic-illumination/ci_contrast_and_sharpness_page1.png|700]]

说明：帧间等待小于 0.1 s 时质量波动大；约 0.3 s 后 contrast 基本进入平台期。文中给出 3 个 illumination settings 时约 0.29 s 间隔、1.1 FPS 的实用折中。

## 文件清单

| 文件 | 路径 | 大小 |
| --- | --- | ---: |
| teaser_page1.png | `papers/images/redkin2024dynamic-illumination/teaser_page1.png` | 1895.2 KB |
| coin_different_illumination_page1.png | `papers/images/redkin2024dynamic-illumination/coin_different_illumination_page1.png` | 6070.8 KB |
| materials_page1.png | `papers/images/redkin2024dynamic-illumination/materials_page1.png` | 3041.1 KB |
| heatmap_contrast_page1.png | `papers/images/redkin2024dynamic-illumination/heatmap_contrast_page1.png` | 694.5 KB |
| heatmap_sharpness_page1.png | `papers/images/redkin2024dynamic-illumination/heatmap_sharpness_page1.png` | 1412.7 KB |
| methods_resulting_images_page1.png | `papers/images/redkin2024dynamic-illumination/methods_resulting_images_page1.png` | 4831.8 KB |
| exp_res_all_page1.png | `papers/images/redkin2024dynamic-illumination/exp_res_all_page1.png` | 91.7 KB |
| n_images_sharpness_page1.png | `papers/images/redkin2024dynamic-illumination/n_images_sharpness_page1.png` | 480.0 KB |
| n_images_contrast_page1.png | `papers/images/redkin2024dynamic-illumination/n_images_contrast_page1.png` | 437.1 KB |
| ci_contrast_and_sharpness_page1.png | `papers/images/redkin2024dynamic-illumination/ci_contrast_and_sharpness_page1.png` | 85.2 KB |
