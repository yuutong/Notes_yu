#### 初学者的机器学习面试问题

1. **机器学习与普通编程的区别**：
   - 普通编程中，程序接收数据和逻辑，通过这两者生成输出。
   - 在机器学习中，程序接收数据和输出，并从中学习逻辑。

2. **聚类算法的实际应用**：
   - 图像分类
   - 客户细分
   - 推荐引擎

3. **选择最佳聚类数量的方法**：
   - 使用肘部法则（Elbow Method）。

4. **特征工程及其影响**：
   - 通过现有特征开发新特征，可以显著提高模型性能。

5. **机器学习中的假设**：
   - 在监督学习中，尝试找到特征空间到目标变量的映射，这个近似的映射称为假设。

6. **衡量聚类效果的指标**：
   - 惯性（Inertia）或平方误差和（Sum of Squared Errors，SSE）
   - 轮廓系数（Silhouette Score）

7. **使用较小学习率的原因**：
   - 较小的学习率可以帮助训练过程更稳定地收敛到全局最优。

8. **过拟合及其避免方法**：
   - 使用早停（Early Stopping）
   - L1或L2正则化

9. **线性回归无法用于分类任务的原因**：
   - 因为线性回归输出是连续且无界的，而分类任务需要离散且有界的输出。

10. **归一化的必要性**：
   - 在模型训练中，归一化可以保证梯度收敛到全局最优或局部最优。

11. **精确度与召回率的区别**：
   - 精确度（Precision）衡量正确预测的正例占比。
   - 召回率（Recall）衡量正确识别的正例占比。

12. **上采样和下采样的区别**：
   - 上采样增加少数类样本数量，平衡数据分布。
   - 下采样减少多数类样本数量，平衡数据分布。

13. **数据泄漏及其识别方法**：
   - 数据泄漏指的是在训练数据中包含未来数据，使模型在实际预测时表现不佳。
   - 识别方法包括检查特征是否与目标变量过度相关。

14. **分类报告及其指标**：
   - 分类报告包括指标如精确度（Precision）、召回率（Recall）、F1分数等，用于评估分类模型的性能。

15. **随机森林回归器的超参数**：
   - 最大深度（max_depth）
   - 决策树数量（n_estimators）
   - 最小样本分裂数（min_samples_split）
   - 最大叶节点数（max_leaf_nodes）

16. **偏差-方差权衡**：
   - 在模型中平衡偏差和方差，以避免过拟合和欠拟合。

17. **训练测试集划分比例**：
   - 没有固定比例，通常训练集占比70%-80%，验证集占比20%-30%。

18. **主成分分析（PCA）**：
   - 一种降维技术，通过保留大部分数据方差来显著减小数据尺寸。

19. **一对学习（One-shot Learning）**：
   - 通过单个样本进行学习，用于相似性检测任务。

20. **曼哈顿距离与欧几里德距离的区别**：
   - 曼哈顿距离（Manhattan Distance）是绝对差值之和。
   - 欧几里德距离（Euclidean Distance）是平方差值之和的平方根。

21. **协方差与相关性的区别**：
   - 协方差（Covariance）衡量两个变量的共同变化程度。
   - 相关性（Correlation）衡量两个变量之间的线性关系。

22. **One-hot编码与序数编码的区别**：
   - One-hot编码（One-hot Encoding）将类别转换为二进制矩阵。
   - 序数编码（Ordinal Encoding）将类别转换为有序的数字。

23. **模型过拟合的识别**：
   - 通过训练数据和验证数据的性能比较来判断。

24. **混淆矩阵及其用途**：
   - 用于总结分类模型的性能，计算准确率、精确度、召回率、F1分数等指标。

25. **小提琴图的用途**：
   - 用于显示连续数据变量的分布，结合了核密度图和箱线图的特点。

26. **盒须图的五个统计量**：
   - 左须（Lower Whisker）
   - Q1（25百分位数）
   - 中位数（Median，Q2）
   - Q3（75百分位数）
   - 右须（Upper Whisker）

27. **随机梯度下降（SGD）与梯度下降（GD）的区别**：
   - 随机梯度下降（SGD）使用小批量数据进行训练，训练误差会有波动，但最终收敛速度快。

28. **中心极限定理**：
   - 随着样本量增加，样本均值的分布趋向正态分布，无论总体分布形状如何。


   ```python
!pip install -q opencv-python


pip install D:\Project\Python\moviepy-1.0.3\whl_file\numpy-1.24.4-pp38-pypy38_pp73-win_amd64.whl
pip install D:\Project\Python\moviepy-1.0.3\whl_file\decorator-5.1.1-py3-none-any.whl
pip install D:\Project\Python\moviepy-1.0.3\whl_file\iimageio-2.34.1-py3-none-any.whl




pip install "D:\Project\Python\moviepy-1.0.3\whl_file\matplotlib-3.4.3-cp38-cp38-win_amd64.whl"
pip install "D:\Project\Python\moviepy-1.0.3\whl_file\decorator-5.1.1-py3-none-any.whl"
pip install "D:\Project\Python\moviepy-1.0.3\whl_file\imageio-2.22.2-py3-none-any.whl"
pip install "D:\Project\Python\moviepy-1.0.3\whl_file\imageio_ffmpeg-0.5.0-py3-none-win_amd64.whl"
pip install "D:\Project\Python\moviepy-1.0.3\whl_file\moviepy-1.0.3-py3-none-any.whl"




D:\Project\Python\ImageProcessing\segmentation_models.pytorch
python D:\Project\Python\ImageProcessing\segmentation_models.pytorch\CarLoad_Detection.py