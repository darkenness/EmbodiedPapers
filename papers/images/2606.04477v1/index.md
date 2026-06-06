# TransTac 图片索引

paper:: [[@yang2026transtac]]
source_pdf:: [[papers/pdfs/2606.04477v1.pdf]]

总计：6 张图片。正文双语稿只在对应段落嵌入精选图片；这里保留完整图片清单。

| 图号 | 文件 | 内容 | 嵌入 |
| --- | --- | --- | --- |
| Fig. 1 | `Motivations.jpg` | TransTac 的动机：RGB-D 近距离失效、coated VBTS 只能重建接触形变，TransTac 用透明 UV 编码触觉桥接两者。 | ![[papers/images/2606.04477v1/Motivations.jpg|220]] |
| Fig. 2 | `flowchart_2.jpg` | TransTac 框架总览：双目 RGB/UV 图像校正、marker 检测、双目对应、稀疏三角化和 RGB-D 融合。 | ![[papers/images/2606.04477v1/flowchart_2.jpg|220]] |
| Fig. 3(a) | `result_2_a.png` | 学习式深度方法在近接触场景中的尺度歧义与重建误差。 | ![[papers/images/2606.04477v1/result_2_a.png|220]] |
| Fig. 3(b) | `result_2_b.jpg` | coated VBTS 对凹陷/非接触几何的感知限制，以及边缘被弹性体平滑造成的伪深度。 | ![[papers/images/2606.04477v1/result_2_b.jpg|220]] |
| Fig. 4 | `depth_coverage_alignment.png` | Intel RealSense D405 近距离有效深度比例下降，以及 sparse-dense alignment error。 | ![[papers/images/2606.04477v1/depth_coverage_alignment.png|220]] |
| Fig. 5 | `result_3.jpg` | marker 检测与跟踪定性对比：传统 threshold/blob 与 optical flow 容易漏检、漂移和身份交换。 | ![[papers/images/2606.04477v1/result_3.jpg|220]] |
