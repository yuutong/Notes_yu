### 深度学习入门
**1.python**：安装Anaconda就够了，其他的需要jupyter notebook编程工具

**python工具包**：Numpy(矩阵计算), Pandas（数据处理）, Matplotlib（可视化）, Seaborn（更简单的可视化神器）

### 计算机视觉-OpenCV
**两件事**：一个是图像处理，另一个是图像建模

**opencv案例**：

|案例名称|内容概述|
| --------   |:----:  |
| Opencv简介与环境配置      |环境安装与配置| 
| 图像基本操作      |用opencv完成基本的图像处理操作，练手!|
| 阈值与平滑处理    |最常用的处理操作，几行代码就能搞定| 
| 图像形态学操作    |这几个形态学操作熟悉下即可| 
| 图像梯度计算  |图像梯度计算实例| 
| 边缘检测       |边缘检测的应用面非常广|
| 图像金字塔与轮廓检测 |轮廓检测实例，效果还是不错的| 
| 直方图与傅里叶变换    |熟悉下即可|
| 项目实战-信用卡数字识别   |动手做一个实战项目，对信用卡数字进行检测与识别| 
| 项目实战-文档扫描OCR识别  |扫描文档数据，进行ocr识别| 
| 图像特征-harris   |常用特征提取方法，算法简单熟悉就可以|
| 图像特征-sift   |最老牌的特征提取方法了，数学还是蛮多的| 
| 案例实战-全景图像拼接   |全景摄像大家肯定都玩过，怎么实现的呢？|
| 项目实战-停车场车位识别     |重型项目，从零开始构建停车场车位识别模型| 
| 项目实战-答题卡识别判卷     |咱们也整一个自动阅卷的玩玩|
| 背景建模  |常规处理方法| 
| 光流估计    |简单熟悉即可| 
| Opencv的DNN模块  |加载训练好的模型进行识别| 
| 项目实战-目标追踪       |追踪的效果还是蛮有意思的|
| 卷积原理与操作 |卷积到哪都是核心| 
| 项目实战-疲劳检测 |基于摄像头检测疲劳|

 **计算机视觉实战项目（基于深度学习）**

重点做Mask-rcnn实战项目，可以说是计算机视觉中的通用项目，检测，识别，分割一步全到位了！应用场景非常
广，也适合进行二次开发和改进，

|项目名称|内容概述|
| --------   |:----:  |
| 图像风格转换（style-transfer）      |主要来学习其思想，效果还是很有意思的| 
| 图像缺失自动补全      |GAN网络应用场景非常多，图像也能自己修复|
| 超分辨率重构    |近几年研究的重点领域之一，这篇论文的效果已经非常不错了| 
| 物体检测框架-MaskRcnn项目    |这个就是我重点强调的开源项目，必看！必看！必看！| 
| MaskRcnn网络框架源码详解  |源码非常重要，每一行都需要懂！| 
| 基于MASK-RCNN框架训练自己的数据       |如何标注图像数据并进行训练呢？这里给你答案|
| 人体姿态识别demo |MaskRcnn应用场景非常多| 
| 物体检测FasterRcnn系列    |物体检测的经典之作，可以当作学习资源|
| 基于CycleGan开源项目实战图像融合   |PyTorch版本的CYCLEGAN，这个开源项目写的相当棒| 
| OCR文字识别原理  |OCR其实原理很简单，需要多个模型协助完成| 
| OCR文字识别项目实战    |构建OCR网络模型|
| 基于3D卷积的视频分析与动作识别   |用3D卷积来处理视频数据并完成行为识别| 


**自然语言处理**

对于图像来说，数据都是固定的，拍了什么就是什么！但是文本数据就没那么固定了，人类
有时候理解起来都不容易，更何况计算机了。NLP发展前景还是非常不错的。

18年的时候谷歌一篇论文横空出世，BERT！相当于自然语言处理通用解决框架了，基本所有任务都能做！
这个需要重点来学习

|项目名称|内容概述|
| --------   |:----:  |
| 自然语言处理通用框架BERT原理   |这个就是上面说的BERT了，重点！重点！重点！| 
| 谷歌开源项目BERT源码解读      |源码非常重要，每一行都需要理解| 
| 基于BERT的中文情感分析      |基于开源项目进行模型开发|
| 基于BERT的中文命名实体识别   |基于开源项目进行命名实体识别| 

### 机器学习
**两件事**：

第一就是掌握经典算法原理，第二就是熟练应用Python工具包进行建模实战。

|知识点   |  内容  |  概述  |
| --------   | -----:  | :----:  |
| 分类算法        | 逻辑回归，决策树，支持向量机，集成算法，贝叶斯算法|  准备面试的同学们必须掌握|
| 回归算法        |线性回归，决策树，集成算法| 有些算法既能做分类也能做回归|
| 聚类算法     |k-means，dbscan等| 无监督是实在没标签的时候才考虑的|
| 降维算法         |主成分分析，线性判别分析等|  重在理解降维的思想  |
| 进阶算法         |GBDT提升算法，lightgbm，，EM算法，隐马尔科夫模型| 进阶算法有时间精力的同学们可以挑战|

**机器学习算法实验分析**

通过对比实验分析经典算法建模方法及其参数对结果的影响，通过实验与可视化展示理解算法中的参数与应用实例。

|案例名称|内容概述|
| --------   | :----:  |
| 线性回归实验分析       |掌握一元与多元线性回归，非线性回归方法，正则化惩罚的作用| 
| 模型评估方法        |常用分类与回归算法评估方法对比，数据集切分实例|
| 逻辑回归实验分析    |经典分类模型构造方法，决策树边界绘制方法| 
| 聚类算法实验分析       |无监督建模实例，聚类算法评估方法，无监督的作用与应用实例| 
| 决策树实验分析      |树模型可视化实例与构造方法，树模型的分类与回归应用| 
| 集成算法实验分析       |集成方法应用实例与效果分析，常见集成策略对比|
| 支持向量机实验分析   |SVM涉及参数与建模对比实验| 
| 关联规则实战分析      |关联规则必备知识点与建模分析实例|

**机器学习算法代码复现**

|案例名称|内容概述|
| --------   | :----:  |
| 线性回归代码实现       |分模块构建算法常用函数| 
| 逻辑回归代码实现       |实例解读逻辑回归实现方法|
| Kmeans代码实现    |非常简单易懂的无监督算法| 
| 决策树代码实现      |树模型其实就是递归实现| 
| 神经网络代码实现      |代码量略大，建议debug模式学习| 
| 贝叶斯代码实现      |贝叶斯在文本任务中还是比较好解释|
| 关联规则代码实现   |常用的数据分析算法| 
| 打造音乐推荐系统    |从零开始构造推荐系统模型|

**机器学习经典案例实战**

在实战中可能把数学知识点都弱化了，因为更多时候我们都是使用现成的工具包来完成任务（调包侠）
熟练使用这些常用工具包，数据预处理，特征工程，调参，验证这些都是非常核心的步骤。

|案例名称|内容概述|
| --------   |:----:  |
| K近邻算法实战       |机器学习入门案例，掌握工具包应用于建模方法| 
| 交易数据异常检测      |十分重要，数据处理和建模策略的详细分析对比|
| 集成算法建模实战    |集成不用我多说了，必备核心策略| 
| 基于随机森林的气温预测      |随机森林是机器学习中最常用的算法，详细分析对比| 
| 新闻分类实战      |文本数据分析处理，基于贝叶斯算法展开建模实战| 
| 聚类实践分析       |无监督应用实例|
| 时间序列分析   |时间序列数据制作方法，基于序列数据进行建模| 
| 用户流失预警      |我经常说梦幻西游的用户流失，这个只是个DEMO|
| 使用lightgbm进行饭店流量预测       |又是一个大杀器，比xgboost还虎|
| 人口普查数据集项目实战-收入预测   |核心模板，数据分析，可视化啥的该有的都有| 
| 贝叶斯优化实战      |难度较大，贝叶斯优化工具包使用实例|
| 文本特征方法对比   |文本数据常用特征提取方法对比| 
| 制作自己常用工具包     |自己做个包玩玩|

**机器学习实战集锦**

|案例名称|内容概述|
| --------   |:----:  |
| Python实战关联规则       |用工具包来做关联规则实在太轻松了| 
| 爱彼迎数据集分析与建模     |房价数据集分析与建模实例|
| 基于相似度的酒店推荐系统    |来构建一个推荐系统完成酒店推荐| 
| 商品销售额回归分析      |销售额预测，很常规的任务，常规套路搞定| 
| 绝地求生数据集探索分析与建模      |绝地求生数据集，来看看你究竟被什么人干掉了| 
| 模型解释方法实战       |建模后如何来解释模型呢，这几个工具包帮你搞定|
| 自然语言处理必备工具包实战  |NLP常用工具包解读，实例演示| 
| 银行客户还款可能性预测      |银行客户数据来预测还款的可能性|
| 图像特征聚类分析实践       |图像数据如何进行聚类呢？|
| 人口普查数据集项目实战-收入预测   |核心模板，数据分析，可视化啥的该有的都有| 

### 数据分析与挖掘

从数据中获取有价值的信息，
这个方向不需要什么理论积累，直接上数据，干就得了！

## 数据挖掘实战

- [x] 数据挖掘是什么？和机器学习有什么区别？
简单来说数据挖掘就是对海量数据应用机器学习算法来得到想要的结果。在数据挖掘中重点并不是机器学习算法的选择，而是怎么样对数据进行处理才能得到更好的
预测结果，在这里特征工程与预处理将成为核心解决方案。

|案例名称|内容概述|
| --------   |:----:  |
| 泰坦尼克号获救预测       |经典的kaggle竞赛案例，入门数据挖掘的第一个实战项目| 
| 数据特征构建       |特征工程是数据挖掘的核心，基于sklearn讲解多种特征构建方法|
| 用户画像实战    |用户画像想必大家都听过了，如何应用数据来完成画像呢？| 
| 集成策略实例       |数据挖掘中选择通常都选择集成策略来更好的提升效果| 
| Xgboost实战    |集成中的典型代表，竞赛的大杀器| 
| 京东购买意向预测       |经典预测问题，基于用户历史行为数据完成预测任务|
| kaggle数据科学调查   |可视化展示kaggle竞赛中参赛人员情况| 
| 房价预测     |数据挖掘入门级别案例，快速掌握常规套路|
| 电力敏感用户分析   |竞赛实例，主要讲解特征工程的作用| 
| fbprophet时间序列预测     |时间序列预测非常实用的算法，用起来非常简单|

**数据挖掘竞赛优胜解决方案**

|案例名称|内容概述|
| --------   |:----:  |
| 快手短视频用户活跃度分析       |基于用户的行为数据来预测接下来的活跃程度| 
| 工业化工生产预测       |对化工数据进行分析，建模预测生产效率|
| 智慧城市-道路通行时间预测    |很接地气的竞赛，基于道路数据预测通行时间| 
| 特征工程建模可解释工具包      |数据挖掘中很难的一点就是进行特征解释，这些工具包非常实用| 
| 医学糖尿病数据命名实体识别    |命名实体识别算法讲解与应用实例分析| 
| 贷款平台风控模型-特征工程       |用图模型来构建特征工程，这套思路应用很广|
| 新闻关键词抽取模型  |关键词抽取可以说是NLP必备技能了| 
| 机器学习项目实战模板    |模板来了，以后有任务可以套用了，方法都差不多|
| 电力敏感用户分析   |竞赛实例，主要讲解特征工程的作用| 

**数据分析实战**

数据挖掘主要是建模来进行预测，数据分析则重在可视化展示，分析其中各项指标对结果的影响等。
|案例名称|内容概述|
| --------   |:----:  |
| 散点图绘制技巧       |都说了可视化是重点，画图肯定必须的了| 
| 纽约出租车运行情况分析建模       |用了好多工具包，可以熟悉下对地理数据如何进行分析与展示|
| 基于统计分析的电影推荐任务    |统计分析常用方法，还能做推荐| 
| 数据分析与机器学习模板      |这个模板真的非常全面了，分析，展示，建模，评估，简直一套龙了| 
| 数据降维    |几种常用的降维算法对比分析与展示| 
| 商品可视化展示与文本处理       |文本数据预处理与可视化展示|
| 多变量分析  |多变量分析也是数据分析中常见的方法| 
| 商品订单数据集分析    |订单数据集分析|
| KIVA贷款数据分析   |贷款数据集分析| 


### 深度学习

最核心的在计算机视觉和自然语言处理中，因为神经网络算法更适用于图像和文本数据。
主要需要掌握的就是算法和框架了，算法就是CNN,RNN这些经典网络模型，框架就是实战的工具了例如tenorflow,Pytorch等，

在机器学习中需要我们对不同的数据选择不同的预处理方法和特征工程构建方法。深度学习中的套路相对来说更固定一些，而且有这些开源框架
和各大经典网络架构，我们通常需要做的就是套用就可以了。

**深度学习必备算法**

|算法名称|内容概述|
| --------   |:----:  |
| 神经网络       |神经网络是最基础的，相当于为后面网络的学习打下基础| 
| 卷积神经网络       |这个大家听起来很熟悉吧，深度学习中的大哥大！计算机视觉的核心网络|
| 递归神经网络    |北乔峰，南慕容，它就是自然语言处理中的大哥大了！| 
| 对抗生成网络   |现在比较火的模型，玩起来很有趣，可以进行各种图像融合| 
| 序列网络模型   |NLP中常用架构，机器学习翻译模型，应用点比较多| 
| 各大经典网络架构    |刚才说的CNN和RNN都是比较基础的网络模型，在其基础上还有很多拓展需要大家掌握| 

**深度学习必备工具**

- [x] 什么是框架？能帮我们做什么呢？

框架好比说你设计了一个网络模型，但是如果把其中具体的计算过程全部自己完成就太麻烦了。框架提供了高效的计算方法并且不需要咱们来完成，一套全自动的计算。
相当于我们只需要设计好结构，具体的施工就交给它了。要玩深度学习必备的就是框架了。

- [x] 深度学习框架哪家强？

tensorflow,Pytorch,keras,caffe等，有这么多框架，我该选哪一个呢？是不是不同框架差异很大呢？
现在最主流的就是tensorflow和PyTorch了，相当于肯德基和麦当劳吧。都很强，至于具体选择哪一个还是参考大家各自的项目组和任务需求吧。如果非要我推荐一个
我会给大家推荐PyTorch，因为更简洁通俗。

- [x] 框架该怎么学呢？
直接用就得了！其实就是一个工具包，边用边学，案例当模板来总结就可以了！

- [x] 针对不同框架，分别给大家准备了丰富的实战项目和学习内容。

|框架名称|内容概述|
| --------   |:----:  |
| Caffe框架       |远古时代的神级框架，现在有点跌落神坛了，我学习的第一个框架| 
| Tensorflow2版本       |2版本做了很多改进，终于更人性化了，用起来比1版本舒服多了|
| Keras   |一句话概述就是简单！简单！简单！都不用学，看代码非常容易理解| 
| PyTorch   |现阶段最火的框架，我估计也是今年（2020）最流行的框架了，推荐！| 


**深度学习框架-Tensorflow2**

>谷歌出品

|案例名称|内容概述|
| --------   |:----:  |
| tensorflow安装与简介       |2版本的介绍于安装方法，简单过一下就好| 
| 神经网络原理解读与整体架构       |复习下神经网络架构|
| 搭建神经网络进行分类与回归任务    |用TF完成基本的分类于回归任务，掌握其应用方法| 
| 卷积神经网络原理与参数解读     |CNN的架构于其中每一个参数详解| 
| 猫狗识别实战    |经典的图像分类任务，这里要讲很多内容，非常重要| 
| 图像数据增强实例       |数据增强可以说了现在必备技能了|
| 训练策略-迁移学习实战  |迁移学习带来的效果还是相当可以的| 
| 递归神经网络与词向量原理解读    |RNN模型解读|
| 基于TensorFlow实现word2vec   |词向量模型解读，并基于TF来实现| 
| 基于RNN模型进行文本分类任务  |基于TF完成文本分类任务| 
| tfrecord制作数据源    |数据源制作实例|
| 将CNN网络应用于文本分类实战   |CNN也能玩文本分类| 
| 时间序列预测    |时间序列数据处理与建模实例|
| 对抗生成网络实战   |GAN来啦，这个可好玩了| 
| 基于CycleGan开源项目实战图像融合  |我最喜欢玩的GAN，效果相当逗了！| 
| 经典网络架构Resnet实战    |必须懂的网络架构，学就得了！|

**深度学习框架-Pytorch**

19年底Pytorch框架使用人数已经超越tensorflow成为当下最火的框架，原因其实很简单，大家都喜欢用更简单易懂的框架。整体的感觉确实比tensorflow好上手而且
调试起来十分方便，也是建议初学的同学们优先选择Pytorch框架。

|案例名称|内容概述|
| --------   |:----:  |
| PyTorch框架基本处理操作       |PyTorch简单熟悉一下就好，上手非常简单| 
| 神经网络实战分类与回归任务      |用PyTorch构建神经网络模型，确实比TF用的顺手|
| 卷积神经网络原理与参数解读    |CNN模型架构与参数书解读| 
| 图像识别核心模块实战解读    |非常重要，PyTorch中的图像处理核心模块| 
| 迁移学习的作用与应用实例  |PyTorch中加载模型来进行迁移学习| 
| 递归神经网络与词向量原理解读       |RNN模型架构解读|
| 新闻数据集文本分类实战 |基于PyTorch来构建文本分类模型| 
| 对抗生成网络架构原理与实战解析    |GAN模型通俗解读|
| 基于CycleGan开源项目实战图像融合   |PyTorch版本的CYCLEGAN，这个开源项目写的相当棒| 
| OCR文字识别原理  |OCR其实原理很简单，需要多个模型协助完成| 
| OCR文字识别项目实战    |构建OCR网络模型|
| 基于3D卷积的视频分析与动作识别   |用3D卷积来处理视频数据并完成行为识别| 
| 基于PyTorch实战BERT模型    |BERT这个架构太火了，必备模型之一|
| PyTorch框架实战模板解读   |提供一个模板，以后有任务可以基于模板来进行改进| 
