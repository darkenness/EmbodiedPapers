---
tags:
  - paper
status: unread
aliases:
  - Large-scale Deployment of VBTSs
  - Large-scale VBTSs
  - "Large-scale Deployment of Vision-based Tactile Sensors on Multi-fingered Grippers"
year: 2024
title: "Large-scale Deployment of Vision-based Tactile Sensors on Multi-fingered Grippers"
doi: "10.1109/IROS58592.2024.10801566"
url: "https://arxiv.org/abs/2408.02206"
venue: "2024 IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)"
venue_short: "IROS 2024"
pages: "13946-13952"
published_url: "https://doi.org/10.1109/IROS58592.2024.10801566"
arxiv: "2408.02206v1"
paper_page: "https://eng.bigai.ai/paper/large-scale-deployment-of-vision-based-tactile-sensors-on-multi-fingered-grippers/"
pdf_url: "https://arxiv.org/pdf/2408.02206v1"
pdf: "[[papers/pdfs/2408.02206v1.pdf]]"
reading:
images: "papers/images/2408.02206v1/"
image_index: "[[papers/images/2408.02206v1/index.md]]"
authors:
  - "[[Meng Wang]]"
  - "[[Wanlin Li]]"
  - "[[Hao Liang]]"
  - "[[Boren Li]]"
  - "[[Kaspar Althoefer]]"
  - "[[Yao Su]]"
  - "[[Hangxin Liu]]"
institutions:
  - "[[Beijing Institute for General Artificial Intelligence]]"
  - "[[State Key Laboratory of General Artificial Intelligence]]"
  - "[[Queen Mary University of London]]"
  - "[[Centre for Advanced Robotics at Queen Mary]]"
topics:
  - tactile sensing
  - vision-based tactile sensor
  - large-scale tactile sensing
  - multi-fingered gripper
  - GelSight
  - sensor synchronization
  - modular tactile sensor
  - zero-shot calibration
  - robotics
---

# Large-scale Deployment of Vision-based Tactile Sensors on Multi-fingered Grippers

- [x] PDF:: [[papers/pdfs/2408.02206v1.pdf]]
- [ ] 精读稿:: 待整理
- [x] 图片索引:: [[papers/images/2408.02206v1/index.md]]
- [ ] 阅读状态:: unread

related:: [[@li2025r-tac0]], [[@yuan2017gelsight]], [[@wang2021gelsight-wedge]], [[@abad2020visuotactile-review]], [[@li2025vbts-classification-review]], [[tactile sensing]], [[robotics]]
affiliation:: [[Beijing Institute for General Artificial Intelligence]], [[State Key Laboratory of General Artificial Intelligence]], [[Queen Mary University of London]], [[Centre for Advanced Robotics at Queen Mary]]

## 一句话问题

Vision-based tactile sensors（视觉触觉传感器）通常只装在机械手指尖，但真实抓取和操作需要手指、指节和掌心上的多点接触；这篇论文提出一套可大规模部署的 VBTS 系统，用同步采集硬件、紧凑模块化传感器和 zero-shot calibration（零样本/少标定迁移）把 7 个 VBTS 同时集成到三指 GelGripper 上。

## 方法

- 同步采集：hub board（集线板）和多个 sensor boards（传感器板）用 FFC/FPC 级联，IIC 控制同步触发，SPI 采集图像，USB 上传主机。
- 模块化传感器：每个 VBTS 尺寸约 28 x 20 x 19 mm，重量约 20 g，包含 OV2640 广角相机、侧向照明、透明支撑结构、GelSight-style 接触模块和黑色外壳。
- 标定：用 MLP 学习 RGB intensity（颜色强度）、position（像素位置）到 surface gradients（表面梯度）的映射，再通过 Poisson solver 积分成 depth map。
- zero-shot calibration：对新模块只用少量差分输入做颜色通道 offset 对齐，直接复用参考传感器模型，降低多传感器逐个标定成本。
- 部署验证：把 7 个模块装到 cable-driven three-fingered GelGripper 的指尖、指节和掌心，展示抓取、同步控制和工具操作。

## 证据

- 既有 large-scale VBTS 系统最多同时运行 3-4 个传感器；本文 GelGripper 同时运行 7 个 VBTS。
- 同步触发的理论同步误差为 `30N microseconds`，7 个传感器时约 `210 microseconds`。
- 对常见 `320 x 240`、约 `20 KB` JPEG 帧，40 MHz SPI 下单图传输约 `4 ms`，理论帧率由 `1 / (N t_spi + t_buf)` 估计。
- Table II 中 zero-shot diff input 只需 50 份采集数据，Gx/Gy MAE 为 0.034/0.039，接近 individual raw input 的 0.034/0.043，并显著少于 individual calibration 的 150 份数据。
- GelGripper 演示了橡皮鸭柔性抓取、纸杯/网球/玩具玉米/鸡蛋抓取和电动螺丝刀操作。

## 局限

- 实验主要是系统演示和局部定量标定，缺少大规模任务成功率、长期耐久性和与其他 tactile hands 的严格任务对比。
- zero-shot calibration 对相似模块有效，但对材料、照明、尺寸变化更大的异构 VBTS，仍需要更多定量证据。
- 同步采集系统仍受 SPI 布线、EMI、电源、封包协议和传感器数量扩展影响。
- 未来工作提出扩展到 5 指仿人手并集成 15 个以上 VBTS，目前还未验证。

## 我的阅读笔记


## 摘录
