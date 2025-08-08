

## 训练中的参数


| 名称               | 大白话解释                                                  | 专业术语                                                                                                         |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Epoch**        | 模型“看完”全部训练数据一次的次数。<br>53/250 表示已经跑完 53 次，总共要跑 250 次。   | 一次完整遍历（iteration）所有训练样本集合的过程称为一个 epoch。这里 `53/250` 表示当前是第 53 个 epoch，共计划训练 250 个 epoch。                      |
| **GPU\_mem**     | 显卡（或这里是 CPU）占用了多少显存。<br>0G 说明没用 GPU，而是跑在 CPU 上。        | 训练时模型、激活值等在 GPU 上占用的显存（GB）。`0G` 意味着当前没有使用 CUDA 设备，而是在 CPU 上执行（所以显存占用为零）。                                     |
| **box\_loss**    | 模型画的“框”有多不准——框的位置越偏，值越大。                               | 边界框回归损失，通常是 L1 或 IoU-based 损失（例如 GIoU、CIoU），度量预测框与真实框的差异。值越小，定位越精确。                                          |
| **cls\_loss**    | 模型分辨物体类型（A 类、B 类）错得有多严重。                               | 分类损失，通常用交叉熵（Cross‐Entropy Loss）来衡量预测的类别分布与真实类别的差距。值越小，分类越准确。                                                 |
| **dfl\_loss**    | 模型在调整框“宽窄”上的不准程度。                                      | Distribution Focal Loss，用于定位时对边界框尺寸预测误差的度量，结合了分布式回归和焦点损失（Focal Loss）思想，改进传统回归损失的稳定性与精度。                      |
| **Instances**    | 这一轮（一个 batch）里一共检测到多少个“物体”数据点，用于统计 loss。               | 在当前 mini‑batch 中参与损失计算的目标（ground‐truth boxes）数量。                                                             |
| **Size**         | 输入模型的图片尺寸，这里是 640×640。                                 | 网络输入分辨率（像素大小），格式通常是 `imgsz×imgsz`。                                                                           |
| **P（Precision）** | 检出的“框”里，有多少是真正命中了目标（不算错报）。                             | 精确率：\$\displaystyle P=\frac{\text{TP}}{\text{TP}+\text{FP}}\$，衡量预测为正的样本中有多少是正确的。                             |
| **R（Recall）**    | 应该被检测到的目标中，有多少被成功“找”到了（不算漏检）。                          | 召回率：\$\displaystyle R=\frac{\text{TP}}{\text{TP}+\text{FN}}\$，衡量真实正样本中有多少被预测模型捕捉到。                           |
| **mAP50**        | 按 50% IoU 交并比算出来的平均准确度，越高越好。                           | mean Average Precision @ IoU=0.50：在 IoU ≥ 0.50 阈值下，对每个类别计算 AP 后取平均。                                          |
| **mAP50-95**     | 按 0.50 到 0.95 的多个 IoU 阈值（步长 0.05）算出来的平均准确度，更全面地评估模型性能。 | mean Average Precision @ IoU=0.50:0.95：在一系列 IoU 阈值（0.50, 0.55, …, 0.95）下分别计算 AP，再对所有类别和所有阈值求平均，反映定位与分类的整体表现。 |


---

*举例*：

> Epoch 53/250, box\_loss=3.515, cls\_loss=2.027, dfl\_loss=1.790, Instances=95, Size=640
> 验证：Precision=0.772, Recall=0.733, mAP50=0.779, mAP50-95=0.350

* 大白话：

  * 这是第 53 轮训练，每张 640×640 大小的图平均检测 95 个物体。画框误差 3.515、分类误差 2.027、尺寸误差 1.790。验证集上预测命中率 77.2%，找到率 73.3%，在半重叠（IoU≥50%）下平均准确度 77.9%，在更严格阈值下平均才 35.0%。

* 专业术语：

  * 当前在第 53 个 epoch，使用输入尺寸 640×640，共有 95 个标注实例参与训练。训练损失由边界框回归损失（3.515）、分类交叉熵损失（2.027）和 Distribution Focal Loss（1.790）组成。验证集上 Precision\@0.5=0.772，Recall\@0.5=0.733，mAP\@0.50=0.779，mAP\@0.50–0.95=0.350。




```shell

Epoch    GPU_mem   box_loss   cls_loss   dfl_loss  Instances       Size
    250/250         0G      2.139     0.9307      1.645         64        640: 100%|██████████| 20/20 [04:22<00:00, 13.12s/it]
                 Class     Images  Instances      Box(P          R      mAP50  mAP50-95): 100%|██████████| 2/2 [00:14<00:00,  7.03s/it]
                   all         70        302       0.94      0.909      0.948      0.521

250 epochs completed in 19.589 hours.
Optimizer stripped from runs\detect\train14\weights\last.pt, 5.8MB
Optimizer stripped from runs\detect\train14\weights\best.pt, 5.8MB

Validating runs\detect\train14\weights\best.pt...
Ultralytics 8.3.168  Python-3.11.0 torch-2.5.1+cpu CPU (12th Gen Intel Core(TM) i5-12400F)
YOLOv10n summary (fused): 102 layers, 2,266,338 parameters, 0 gradients, 6.5 GFLOPs
                 Class     Images  Instances      Box(P          R      mAP50  mAP50-95): 100%|██████████| 2/2 [00:10<00:00,  5.42s/it]
                   all         70        302      0.958      0.885      0.949       0.54
          missing_hole         17         70      0.971       0.97      0.992      0.631
            mouse_bite          5         26      0.952      0.769      0.916      0.535
          open_circuit         10         40      0.975      0.968      0.992      0.512
                 short         11         50      0.904      0.944      0.967      0.541
                  spur         11         46      0.989      0.804      0.909      0.515
       spurious_copper         16         70      0.957      0.857       0.92      0.504
Speed: 3.8ms preprocess, 94.3ms inference, 0.0ms loss, 0.0ms postprocess per image
Results saved to runs\detect\train14

```


## 训练后的参数


按行解释：

1. *`all` 行*

   * Precision=0.958：302 个检测框里有 95.8% 是正确的（误报率 4.2%）
   * Recall=0.885：302 个真实目标中模型找到了 88.5%（漏检率 11.5%）
   * mAP50=0.949：在 IoU≥0.5 时，平均精准度 94.9%
   * mAP50-95=0.54：综合多个 IoU 阈值的平均 AP 为 54.0%

2. *各类别指标*
   每一行展示单个类别在验证集上的表现：

   * `missing_hole`（17 张图、70 实例） Precision 97.1%, Recall 97.0%, mAP50 99.2%, mAP50-95 63.1%
   * `mouse_bite`（5 张图、26 实例）指标稍低，Recall 76.9%，说明这类漏检偏多；
   * 其余类别如 `open_circuit`、`short`、`spur`、`spurious_copper` 都有各自的 P/R/mAP 表现，可用于定位哪些类别还需更多数据或更大迭代

3. *速度分布*

   * *Preprocess 3.8 ms*：图像预处理（缩放、归一化、转 tensor）平均每张 3.8 毫秒
   * *Inference 94.3 ms*：模型前向推理耗时 ≈ 94 ms
   * *Loss & Postprocess 0 ms*：在验证时不计算训练损失；推理后 NMS、框绘制等时间可忽略

---

### 小结

* *训练收敛情况*：box/cls/dfl 损失在最后一轮都大幅下降，说明模型已基本收敛
* *整体性能*：最终 mAP50≈94.9%，mAP50-95≈54.0%，说明在常规阈值下表现优秀，但对更严格的定位要求（高 IoU）还有提升空间
* *类别差异*：`mouse_bite` 相对 Recall 较低，可能需要更多样本或数据增强；`missing_hole`、`open_circuit` 表现突出
* *实时性*：单张推理≈100 ms，可支撑 \~10 FPS 的在线检测（CPU-only），若部署到 GPU，速度可大幅提升


