# 3D Cal 图片索引

source:: [[@kota2026-3dcal]]
pdf:: [[papers/pdfs/kota2026-3dcal.pdf]]

总计：5 张正文图表

## 正文图表

### Fig. 1 - 3D Cal workflow and TouchNet

![[papers/images/kota2026-3dcal/Calibration_page1.png|700]]

3D Cal 的端到端流程：3D 打印 sensor base、插入传感器、安装 probe、自动采集数据、训练/微调 TouchNet，再生成 depth maps。

### Fig. 2 - Training data ablation

![[papers/images/kota2026-3dcal/Subsets_page1.png|700]]

不同空间采样比例 P 下的训练损失和 pill 测试物体重建效果。

### Fig. 3 - Spatial MSE distribution

![[papers/images/kota2026-3dcal/MSE_page1.png|700]]

DIGIT 和 GelSight Mini 在不同采样比例下的空间 MSE 分布；稀疏区域误差更高。

### Fig. 4 - Depth reconstruction on unseen objects

![[papers/images/kota2026-3dcal/Depthmaps_page1.png|700]]

对 hemispheres、pill、pawn 三个未见 3D 打印物体的深度图重建及横截面对比。

### Fig. 5 - Pixelwise depth errors

![[papers/images/kota2026-3dcal/DepthErrors_page1.png|700]]

Type 1 error（无接触区域）和 Type 2 error（有接触区域）的像素级深度误差分布。

## 文件清单

| 文件 | 路径 | 说明 |
| --- | --- | --- |
| Calibration_page1.png | `papers/images/kota2026-3dcal/Calibration_page1.png` | Fig. 1：3D Cal 与 TouchNet 总流程 |
| Subsets_page1.png | `papers/images/kota2026-3dcal/Subsets_page1.png` | Fig. 2：训练数据比例消融 |
| MSE_page1.png | `papers/images/kota2026-3dcal/MSE_page1.png` | Fig. 3：空间误差分布 |
| Depthmaps_page1.png | `papers/images/kota2026-3dcal/Depthmaps_page1.png` | Fig. 4：未见物体深度重建 |
| DepthErrors_page1.png | `papers/images/kota2026-3dcal/DepthErrors_page1.png` | Fig. 5：像素级误差分布 |
