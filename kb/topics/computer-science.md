# 计算机科学知识地图

共 163 篇权威笔记。

## 概览

- [计算机](../../docs/computerScience/README.md) — 计算机是地球上的一个新物种，它们正在学习如何与我们共存

## knowledge

- [计算机](../../docs/computerScience/knowledge/README.md) — 计算机是地球上的一个新物种，它们正在学习如何与我们共存

## knowledge / 3D

- [1.什么是方向余弦？](../../docs/computerScience/knowledge/3D/AngleTransform.md) — 形象地描述一方向余弦和 刚体的定点转动
- [3D图像坐标转换实际坐标：](../../docs/computerScience/knowledge/3D/Transformation.md) — 将采集到的图像坐标乘以图像数据的采样间隔（即转换系数）就能得到实际坐标
- [激光线扫相机成像受倾斜的影响关系](../../docs/computerScience/knowledge/3D/AngleTransform3.md) — 如图所示，激光器与被测物体表面垂直的情况，激光线分别照射在被测物体表面以及底面上。
- [Angle Mapping](../../docs/computerScience/knowledge/3D/Angle_Mapping.md) — 是的，如果使用罗德里格斯公式对点云进行旋转校正，每次都会将点云校正到一个固定的位置，即基准面法向量与激光线方向垂直的位置。这是罗德里格斯公式的作用，它将点云旋转到目标坐标系对齐的状态。
- [AngleTransform2](../../docs/computerScience/knowledge/3D/AngleTransform2.md) — 如何动态校正激光线与被测物体的角度差，并将它们的 位置关系校正为垂直
- [BasePoint](../../docs/computerScience/knowledge/3D/BasePoint.md) — 两组坐标的原点不一致，那么你的变换结果可能会产生偏移和误差
- [C++面向对象模型](../../docs/computerScience/knowledge/3D/README.md) — 从编译器的角度去理解C++是怎样运行的
- [Height Mapping](../../docs/computerScience/knowledge/3D/Height_Mapping.md) — 将高度值（从最低点到最高点）映射到 0 到 255 之间

## knowledge / Book

- [编译器在什么情况下合成析构函数](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_5/Destruction.md) — 编译器只在必要的时候为class生成析构函数:
- [编译器在什么时候生成默认构造函数](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_2/constructor.md) — C++新手一般有两个常见的误区：
- [单一继承的虚函数调用](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_4/VFunction_Invocation.md) — 编译器在执行期都做了些什么，才能确保包含虚函数的各类函数的调用正确无误？
- [非静态成员函数调用](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_4/Function_Invocation.md) — C++的设计准则之一：nonstatic member function 调用至少必须和一般的nonmember function有相同的效率。那么怎样才能做到呢？
- [两个3D点坐标的加减](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_4/Function_Efficiency.md) — 对于不同类型的两个3D点加减的函数，执行1000万次，讨论执行效率。
- [模型的设计思路和演化](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/cppModel.md) — 将对象的内存空间分成很多个块，每个块都存一个指向其data Member 或者 function member
- [模型的设计思路和演化](../../docs/computerScience/knowledge/Book/cpp_model/cppModel.md) — 将对象的内存空间分成很多个块，每个块都存一个指向其data Member 或者 function member
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_2/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_4/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_5/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/cpp_model/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/knowledge/Book/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [什么是编译器，什么是执行期](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_5/construction.md) — 编译器在执行期都做了些什么，才能确保包含虚函数的各类函数的调用正确无误？
- [一.含义和用法](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/data_member_pointer.md) — 指向数据成员的指针，其类型为成员类型 类名::，它得到的是data member 在类中的偏移量
- [一.拷贝构造函数在什么时候被调用](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_2/copy_constructor.md) — 有三种情况，会将一个object的内容作为另一个class object的初值
- [一.数据的调用](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/data_call_efficiency.md) — 用对象来调用数据和用指针来调用数据有什么不同呢？
- [一.Data Member的绑定](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/dataBind_Layout.md) — C++在处理全局成员变量和类成员变量的名称冲突时，编译器能正确绑定对象吗？
- [一个菱形继承中的各个类的大小](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/class_size.md) — 对于以下派生链
- [C++程序设计模型的三种范式](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/paradigms.md) — C++程序设计模型直接支持3种programming paradigms（程序设计范式）
- [C++面向对象模型的继承](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/Inheritance_cppmodel.md) — 这里只做简单的索引，具体参考第三章第四节的 继承与Data Member
- [C++在加上类的封装之后，布局成本增加了吗？](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/encapsulation.md) — 在C语言中，对于 数据 和 函数（处理数据的操作）是分开来声明的
- [constructor init](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_2/constructor_init.md) — 编译器会一 一操作初始化列表，以适当的顺序在构造函数之内安插初始化操作，这些操作在所有的explicit user code之前
- [copy constructor progressive](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_2/copy_constructor_progressive.md) — 我们知道，拷贝构造函数会在三种情况下被调用：
- [Inheritance cppmodel](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_3/Inheritance_cppmodel.md) — 在C++模型中，一个派生类对象所表现出来的东西，是其自己的 members 加上其 base class(es) Member的总和。
- [struct 关键词](../../docs/computerScience/knowledge/Book/cpp_model/Chapter_1/struct.md) — 事实上，在很多情况下，这两个关键词可以等同

## knowledge / communication

- [通信](../../docs/computerScience/knowledge/communication/README.md) — 通信协议定义双方通信的规则和约定，确保信息可以准确、有序、可靠地传输。
- [通信](../../docs/computerScience/knowledge/communication/tcp/README.md) — An awesome subject.
- [modbusRtu](../../docs/computerScience/knowledge/communication/modbusRtu.md) — 大白话版：
- [modbusTcp](../../docs/computerScience/knowledge/communication/modbusTcp.md) — 大白话版：
- [QAbstractSocket 类概述](../../docs/computerScience/knowledge/communication/tcp/base.md) — QAbstractSocket类在Qt中提供了TCP和UDP套接字的功能，QAbstractSocket是一个抽象基类，QTcpSocket和QUdpSocket是它的具体实现。是Qt网络模块的核心，它支持异步网络事件处理。
- [qabstractsocket类](../../docs/computerScience/knowledge/communication/tcp/qabstractsocket.md) — 在Qt中，QAbstractSocket类提供了TCP和UDP套接字的功能。下面我们来分析waitForReadyRead, waitForBytesWritten, 和waitForDisconnected等方法的实现，以及abort方法，这些方法是QAbstractSocket的核心功能之一。
- [QT源代码阅读](../../docs/computerScience/knowledge/communication/tcp/QtcpCodeReading.md) — QTcpSocket类继承自QAbstractSocket，只是简单的定义了一些基本的构造函数和析构函数，构造函数创建一个QTcpSocket对象，初始状态为UnconnectedState。它接受一个可选的父对象指针parent，并将其传递给QObject的构造函数。构造函数还初始化了私有数据成员isBuffered为true。这是为了确保QTcpSock
- [QTcpSocket 类概述](../../docs/computerScience/knowledge/communication/tcp/Derived.md) — QTcpSocket 类，继承自 QAbstractSocket，主要用于处理TCP网络通信。
- [tcp](../../docs/computerScience/knowledge/communication/tcp/tcp.md) — TCP（传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议。

## knowledge / cpp

- [回调函数（Callback Function）](../../docs/computerScience/knowledge/cpp/basic/Callback.md) — 是一种通过函数指针/对象 实现的异步编程模型：
- [解释一下C++中的RAII（Resource Acquisition Is Initialization）以及作用](../../docs/computerScience/knowledge/cpp/basic/mutex_smart_ptr.md) — RAII是一种管理资源的方法，将资源的获取与对象的生命周期绑定在一起。
- [面向对象编程](../../docs/computerScience/knowledge/cpp/basic/README.md) — 标准库，STL，多线程编程
- [设计模式](../../docs/computerScience/knowledge/cpp/design_model/README.md) — 善用设计模式，降低代码的耦合度，提高代码的可维护，可重用，可扩展性
- [虚函数实现：](../../docs/computerScience/knowledge/cpp/objModel/virtual_function.md) — 1.在C++中使用虚函数来实现多态时，编译器会为每一个有虚函数的类生成一个虚函数表，也叫vtable。vtable是一个存储类中所有虚函数地址的数组。编译器同时也会在每个类
- [C++](../../docs/computerScience/knowledge/cpp/README.md) — C++的目标是让程序员有能力按照他们的需要去编程，而不是按照语言的限制
- [C++面向对象模型](../../docs/computerScience/knowledge/cpp/objModel/README.md) — 从编译器的角度去理解C++是怎样运行的
- [Delegate](../../docs/computerScience/knowledge/cpp/design_model/Delegate.md) — 当然可以！让我们用更通俗易懂的语言来解释委托。
- [Observer](../../docs/computerScience/knowledge/cpp/design_model/Observer.md) — 观察者模式含有一个被观察者和多个观察者，是一对多的关系，打个比方，被观察者可以是一个发布消息的电台，而观察者可以是订阅消息的多个人。当电台有新消息发布时，会通知所有订阅的人。而这些订阅的听众会对应作出反应，比如记录消息，或者转发给别人。好处是电台不需要知道具体是谁在订阅，而订阅者可以随时订随时取消。也就是被观察者在自身状态发生变化的时候会通知观察者，所有观察
- [Singleton](../../docs/computerScience/knowledge/cpp/design_model/Singleton.md) — 单例模式确保一个类只有一个实例，并提供全局访问点来访问该实例
- [TemplateClass](../../docs/computerScience/knowledge/cpp/objModel/TemplateClass.md) — 模板类是一种特殊的C++类，它可以让你编写通用的代码，以处理不同类型的数据，而不必为每种数据类型编写不同的代码。

## knowledge / deep-learning

- [车道检测](../../docs/computerScience/knowledge/deep-learning/lane_detection/README.md) — An awesome project.
- [Deep Learning](../../docs/computerScience/knowledge/deep-learning/basic/README.md) — 深度学习是人工智能的未来，它让机器能够像人类一样学习和思考
- [Deep Learning](../../docs/computerScience/knowledge/deep-learning/README.md) — 深度学习是人工智能的未来，它让机器能够像人类一样学习和思考

## knowledge / opencv

- [概念](../../docs/computerScience/knowledge/opencv/basic/Mean_Filtering.md) — 均值滤波是一种线性平滑滤波方法，通过将每个像素的值替换为其邻域内像素值的平均值来减少噪声。假设有一个  k  k  的滤波窗口，均值滤波公式如下：
- [基本思想](../../docs/computerScience/knowledge/opencv/Advanced/Watershed.md) — 分水岭算法的名字来源于地理学中的“分水岭”概念。
- [计算梯度](../../docs/computerScience/knowledge/opencv/Line_Circle/code.md) — 关键的算法是RANSAC和通过三点确定一个圆。通过这个函数，我们可以从给定的点集中找出一个最佳的圆，并找出这个圆以外的离群点。
- [数学逻辑](../../docs/computerScience/knowledge/opencv/basic/Rotate.md) — 图像的旋转操作需要将每个像素点的位置通过一个旋转变换公式计算出新的位置。旋转变换公式基于二维平面上的旋转矩阵。
- [数学原理](../../docs/computerScience/knowledge/opencv/basic/medianFilter.md) — 中值滤波的基本思想是用图像局部区域的中值来替换该区域中心像素的值，从而减少噪声的影响。
- [图像压缩](../../docs/computerScience/knowledge/opencv/Image_Compression/README.md) — 旨在减少图像文件的存储空间和传输带宽，同时尽量保持图像的质量
- [修改像素值](../../docs/computerScience/knowledge/opencv/basic/pixel_operations.md) — 图像数据表示为Mat型，图像数据（像素点）存储在 cv::Mat 对象中。
- [一般步骤](../../docs/computerScience/knowledge/opencv/basic/Image_processing.md) — 1.图像采集
- [原理](../../docs/computerScience/knowledge/opencv/basic/Gaussian.md) — 高斯滤波是一种用于平滑图像的技术，目的是减少图像中的噪声或细小的干扰点，让图像看起来更加平滑和连贯。
- [找直线：](../../docs/computerScience/knowledge/opencv/Line_Circle/Line_circle.md) — 两个过程：边缘提取（抓取边缘点）   拟合成直线
- [直接取平均值](../../docs/computerScience/knowledge/opencv/basic/grayImage.md) — 直接取平均值的方法是将 RGB 三个通道的值相加后除以 3，公式如下：
- [Adaptive Threshold](../../docs/computerScience/knowledge/opencv/Advanced/Adaptive_Threshold.md) — 普通阈值分割是指使用一个全局的阈值将图像分为前景和背景。这个阈值是固定的，对整个图像都适用。
- [Blob](../../docs/computerScience/knowledge/opencv/Advanced/Blob.md) — Blob分析是一种图像处理方法，用来识别和分析图像中的“块”或“物体”。
- [Canny](../../docs/computerScience/knowledge/opencv/Advanced/Canny.md) — Canny边缘检测是一种多阶段算法，用于检测图像中的边缘。
- [Context](../../docs/computerScience/knowledge/opencv/basic/Context.md) — 好的，让我们详细展开讲解这几个方面的内容。
- [DCT（离散余弦变换）](../../docs/computerScience/knowledge/opencv/Image_Compression/Image_Compression.md) — 是一种基于频域转换的压缩技术
- [DFT](../../docs/computerScience/knowledge/opencv/Advanced/DFT.md) — 傅里叶变换是一种数学方法，它可以将一个信号（例如图像）从空间域转换到频率域。
- [Dilation Erosion](../../docs/computerScience/knowledge/opencv/basic/Dilation_Erosion.md) — 滑动结构元素，每一次查找最大值（对于膨胀）或最小值（对于腐蚀）来更新目标图像中的像素点。
- [face detection](../../docs/computerScience/knowledge/opencv/Advanced/face_detection.md) — 级联分类器是一种快速而高效的人脸检测方法。它由一系列简单的检查步骤组成，每一步都像是一个小考官，逐层筛选图像中的区域，最终找出人脸。
- [Feature Matching](../../docs/computerScience/knowledge/opencv/Advanced/Feature_Matching.md) — 特征匹配的基本思想是通过比较特征描述符来找到两个图像中相似的特征点。
- [find line and find circle](../../docs/computerScience/knowledge/opencv/Line_Circle/README.md) — 直线的交点可以确定目标物体的角点位置，圆心可以确定目标物体的中心位置。
- [Harris](../../docs/computerScience/knowledge/opencv/Advanced/Harris.md) — 一种用来找到图像中“角点”的方法。角点是图像中那些在两个方向上都有显著变化的点，比如图像中的拐角、交叉点等。
- [Histogram Equalization](../../docs/computerScience/knowledge/opencv/basic/Histogram_Equalization.md) — 直方图均衡化（Histogram Equalization）是一种用于增强图像对比度的技术，
- [Hough Transform](../../docs/computerScience/knowledge/opencv/Advanced/Hough_Transform.md) — 霍夫变换（Hough Transform）用于检测图像中直线、圆等几何形状的技术，步骤如下：
- [OpenCV](../../docs/computerScience/knowledge/opencv/README.md) — OpenCV 是计算机视觉领域的瑞士军刀，提供了丰富的工具和库，帮助开发者实现各种视觉任务
- [opencv基础算法](../../docs/computerScience/knowledge/opencv/basic/README.md) — 遍历图像像素点，从数学逻辑层面理解和应用算法
- [opencv进阶算法](../../docs/computerScience/knowledge/opencv/Advanced/README.md) — 遍历图像像素点，从数学逻辑层面理解和应用算法
- [ORB](../../docs/computerScience/knowledge/opencv/Advanced/ORB.md) — ORB（Oriented FAST and Rotated BRIEF）是一种用于图像处理的技术，
- [PNG](../../docs/computerScience/knowledge/opencv/Image_Compression/PNG.md) — PNG（可移植网络图形格式） 是一种常用的图像文件格式，主要用于在互联网上显示图像。
- [Resize](../../docs/computerScience/knowledge/opencv/basic/Resize.md) — 当我们放大或缩小图像时，我们其实是在进行插值计算。对于图像放大，我们需要在原有的像素点之间插入新的像素点；对于图像缩小，我们需要将一些像素点进行合并。
- [template matching](../../docs/computerScience/knowledge/opencv/basic/template_matching.md) — 在一张大图（待匹配图像）中找到一小块图（模板图像）的位置
- [Threshold](../../docs/computerScience/knowledge/opencv/Advanced/Threshold.md) — 阈值分割是一种简单而有效的图像分割方法。其基本思想是通过设定一个或多个阈值，

## knowledge / openGL

- [1. 平面度 (Planarity)](../../docs/computerScience/knowledge/openGL/3D_basic/Height_Difference.md) — 平面度是指点云数据如何接近一个平面的程度。可以使用主成分分析（PCA）来计算平面度：
- [3Drebuild](../../docs/computerScience/knowledge/openGL/3D_basic/3Drebuild.md) — 使用MeshLab进行8个点云数据的点云配准和3D重建涉及以下步骤：
- [编程技巧实战总结](../../docs/computerScience/knowledge/openGL/cloudcompare/openGL.md) — 1.ccHObjectCaster类没有成员变量，所有的成员函数都是静态函数，这意味着你可以在没有创建ccHObjectCaster对象的情况下直接调用这些函数
- [点云数据如何规避二维图像处理中的姿态和光照问题：](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Question.md) — 点云数据是通过扫描物体表面的点来获取的，它记录了物体表面上各点在三维空间中的精确位置。由于点云直接反映了物体的几何结构，它不依赖于光照和视角。与二维图像不同，二维图像是物体表面的投影，受到光照条件和拍摄角度的强烈影响，这会导致阴影、反射等视觉效应，从而影响图像识别和处理。点云数据通过提供物体的准确3D坐标来避免这些问题，使得在任何光照条件下，即使物体姿态发生
- [法向量](../../docs/computerScience/knowledge/openGL/cloudcompare/Explanation_of_Terms.md) — 法向量就是一个指向直线、平面或曲面“垂直”方向的箭头
- [绘制整个窗体](../../docs/computerScience/knowledge/openGL/cloudcompare/A_3D_Process.md) — 画整个窗体，包括前景（图片），背景（窗体颜色）和中间层的3D视图
- [基于信息熵和聚类的点云简化算法](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Chapter3.md) — 高效地处理和重建从三维激光扫描技术获取的大量点云数据。这些数据通常很庞大且密集，如果直接处理，会使得重建模型的效率降低。因此，需要一种方法能够在保持点云的重要几何特征的同时，减少数据的数量，也就是进行“简化”。
- [基于栅格划分和曲率分级的点云简化算法](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Chapter5.md) — - 问题：点云简化算法分为基于网格和基于点的两类，前者复杂度高，后者对细节保持性差。
- [基于正态分布和曲率的层次化点云配准算法](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Chapter6.md) — 点云配准是点云处理的一个重要研究内容，旨在通过一种刚体变换使两片点云对齐。为了提高配准精度和速度，本章提出了一种结合基于特征和无特征配准算法优点的层次化点云配准算法。
- [三维点云数据：](../../docs/computerScience/knowledge/openGL/3D_cloud_book/cloudPoint.md) — a:散乱点云
- [特征保持的点云去噪算法](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Chapter2.md) — 目的是在去除点云中的噪声的同时，尽可能保留点云的几何特征信息
- [about cloudcompare](../../docs/computerScience/knowledge/openGL/cloudcompare/about_cloudcompare.md) — 想象一下，你有一堆小球，每个小球都放在地板上的不同位置。现在，我们要给每个小球标记一些信息，比如颜色深浅、大小、距离墙壁的远近等。标量场，就像是给这些小球贴上标签一样，这些标签上写着不同的信息，比如“这个小球很大”或“那个小球离门很远”。
- [Architecture](../../docs/computerScience/knowledge/openGL/cloudcompare/Architecture.md) — CloudCompare 的架构并不严格遵循单一的设计模式，但它主要采用了以下几种模式的结合：
- [Axis](../../docs/computerScience/knowledge/openGL/code/Axis.md) — 使用C++和Qt来实现一个带有3D坐标系的OpenGL窗口，并实现旋转和缩放功能。参考CloudCompare中的ccGLWindow.cpp类来编写这个类。
- [camera](../../docs/computerScience/knowledge/openGL/3D_basic/camera.md) — 好的，我们来详细解读一下这些相机的内参和外参以及标定参数。我们分为左相机和右相机分别解读。
- [Chapter4](../../docs/computerScience/knowledge/openGL/3D_cloud_book/Chapter4.md) — 初始点云数据量大，点与点之间没有明确关联，处理工作量大。
- [FBO](../../docs/computerScience/knowledge/openGL/cloudcompare/FBO.md) — ccFrameBufferObject 是一个封装了 OpenGL 帧缓冲对象（FBO）操作的类。
- [OpenGL](../../docs/computerScience/knowledge/openGL/3D_basic/README.md) — 一个跨语言、跨平台的API，用于渲染2D和3D矢量图形
- [OpenGL](../../docs/computerScience/knowledge/openGL/3D_cloud_book/README.md) — 一个跨语言、跨平台的API，用于渲染2D和3D矢量图形
- [OpenGL](../../docs/computerScience/knowledge/openGL/cloudcompare/README.md) — 一个跨语言、跨平台的API，用于渲染2D和3D矢量图形
- [OpenGL](../../docs/computerScience/knowledge/openGL/code/README.md) — 一个跨语言、跨平台的API，用于渲染2D和3D矢量图形
- [OpenGL](../../docs/computerScience/knowledge/openGL/README.md) — 一个跨语言、跨平台的API，用于渲染2D和3D矢量图形
- [OpenGL 简介](../../docs/computerScience/knowledge/openGL/cloudcompare/about_Vtk.md) — OpenGL是一个跨语言、跨平台的API，用于渲染2D和3D矢量图形。它提供了一组底层接口，允许开发者直接与图形硬件交互，用于实现各种图形和视觉效果。应用于视频游戏、CAD（计算机辅助设计）、虚拟现实。
- [QOpenGLShaderProgram](../../docs/computerScience/knowledge/openGL/cloudcompare/QOpenGLShaderProgram.md) — QOpenGLShaderProgram 是 Qt 提供的一个方便的类，用于在 OpenGL 应用程序中编译和链接着色器。
- [shader](../../docs/computerScience/knowledge/openGL/cloudcompare/shader.md) — Shader编程和图形渲染是CloudCompare中处理三维数据可视化的重要部分。
- [shader code](../../docs/computerScience/knowledge/openGL/cloudcompare/shader_code.md) — 这个ccShader类是用于管理OpenGL着色器程序的一个封装类。它继承自QOpenGLShaderProgram，并提供了从文件加载和编译着色器的功能。下面是对这个类的详细解读：

## knowledge / Operting_System

- [进程和线程](../../docs/computerScience/knowledge/Operting_System/Operating_System.md) — 进程是一个正在运行的程序，是最小的资源分配单位；线程Thread是操作系统能够进行运算调度的最小单位。一个进程可以包含多个线程
- [Operating System](../../docs/computerScience/knowledge/Operting_System/README.md) — 操作系统是计算机的灵魂，它管理着硬件资源，使得软件能够顺利运行

## knowledge / python

- [Python](../../docs/computerScience/knowledge/python/Anaconda/README.md) — Python是一种追求优雅，明确和简单的编程语言。
- [Python](../../docs/computerScience/knowledge/python/README.md) — Python是一种追求优雅，明确和简单的编程语言。

## knowledge / robot

- [标定的一般过程](../../docs/computerScience/knowledge/robot/Calibration.md) — 1. 准备工作：
- [机器人末端检测](../../docs/computerScience/knowledge/robot/Image_model.md) — 机器人末端检测是涉及到机器人学、感知、控制和计算机科学的复杂主题。它通常要确定机器人末端执行器（例如手臂、夹爪等）的位置和/或方向。这对于执行精确的任务至关重要，比如组装、焊接或搬运物品。需要涉及以下几个方面：
- [机器人末端检测](../../docs/computerScience/knowledge/robot/Move_model.md) — 涉及到机器人学、感知、控制和计算机科学。机器人末端检测通常要确定机器人末端执行器（例如手臂、夹爪等）的位置和/或方向。这对于执行精确的任务至关重要，比如组装、焊接或搬运物品。涉及以下几个方面：
- [机器人末端检测](../../docs/computerScience/knowledge/robot/README.md) — An awesome project.
- [用于控制和模拟简单机器人手臂的类 robot_arm。](../../docs/computerScience/knowledge/robot/robot_arm_operate.md) — 该类包括正向运动学、逆向运动学、碰撞检测、路径规划等功能，
- [arm eye calibration](../../docs/computerScience/knowledge/robot/arm_eye_calibration.md) — cloudcompare中的3D点云处理算法：1.点云分割算法的详细描述（写出数学逻辑），2. 这里的点云分割算法是采用PCL库的吗？

## Project

- [计算机](../../docs/computerScience/Project/README.md) — 计算机是地球上的一个新物种，它们正在学习如何与我们共存

## Project / Vision

- [1.接口模块简介](../../docs/computerScience/Project/Vision/3D_Vision/Interface_vision/interface.md) — 这里是3D视觉项目的顶层接口类，对于所有的接口，均不提供具体实现。
- [1.Interface_vision模块](../../docs/computerScience/Project/Vision/3D_Vision/Interface_vision/factory.md) — 一个纯粹的接口模块，不含有任何实现。是架构的最顶层
- [插件是怎样导出的？](../../docs/computerScience/Project/Vision/3D_Vision/plugins/export.md) — 导出机制：QDECLEXPORT + extern "C"
- [插件是怎样实现的？](../../docs/computerScience/Project/Vision/3D_Vision/plugins/Implement.md) — 1.抽象层接口
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/Interface_vision/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/lib_QT/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/main_vision/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/models/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/plugins/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/3D_Vision/README.md) — 如何用C++ Qt组织一个视觉架构
- [深度探索C++对象模型](../../docs/computerScience/Project/Vision/README.md) — 编译器是怎样组织C++的语言和运行环境的
- [Vision架构分析记录](../../docs/computerScience/Project/Vision/3D_Vision/Interface_vision/communication.md) — 一个纯粹的接口模块，不含有任何实现。是架构的最顶层

## Tools

- [计算机](../../docs/computerScience/Tools/README.md) — 计算机是地球上的一个新物种，它们正在学习如何与我们共存

## Tools / CMake

- [1. VTK9.3.0编译](../../docs/computerScience/Tools/CMake/compile_pcl.md) — 使用cmake-gui编译
- [计算机](../../docs/computerScience/Tools/CMake/README.md) — 计算机是地球上的一个新物种，它们正在学习如何与我们共存
- [CMake的使用：](../../docs/computerScience/Tools/CMake/CMake.md) — 针对软件跨平台，在不同的平台下的编译

## Tools / Debug

- [一个拦截 double free 的钩子](../../docs/computerScience/Tools/Debug/hook.md)
- [ASan gdb](../../docs/computerScience/Tools/Debug/ASan_gdb.md) — 这条命令：
- [ASan vs Valgrind: 内存泄漏检测对比](../../docs/computerScience/Tools/Debug/memory_leak.md) — | 特性   | AddressSanitizer (ASan)       | Valgrind (Memcheck)      |
- [gdb](../../docs/computerScience/Tools/Debug/gdb.md) — 定位大型项目中，double‑free、heap corruption、buffer overflow 出现的地方
- [gdb](../../docs/computerScience/Tools/Debug/README.md)

## Tools / Gdb

- [在Linux上使用gdb调试已经在运行的程序](../../docs/computerScience/Tools/Gdb/gdb.md) — 当程序已经在运行并发生错误时，可以使用gdb的附加功能来调试。以下是具体步骤和命令：
- [gdb](../../docs/computerScience/Tools/Gdb/README.md)

## Tools / Git

- [提交删除操作](../../docs/computerScience/Tools/Git/delete_remote.md) — git commit -m "Remove unwanted files except for .ui, .cpp, .h, .pro, and .gitignore"
- [Git](../../docs/computerScience/Tools/Git/Git.md) — 在 Linux 主机上创建 Git 裸仓库，并通过 SSH 进行访问和推送。
- [Git](../../docs/computerScience/Tools/Git/README.md) — 通过ssh来链接github
- [Git 忽略规则示例](../../docs/computerScience/Tools/Git/gitignore.md)
- [ssh](../../docs/computerScience/Tools/Git/ssh.md) — 要通过SSH从GitHub克隆仓库

## Tools / QT

- [MVVM架构简介](../../docs/computerScience/Tools/QT/Architecture.md) — - Model（模型）：负责处理应用程序的业务逻辑和数据。模型直接与数据库或网络通信，获取和存储数据。
- [QT](../../docs/computerScience/Tools/QT/README.md) — fine

## Tools / VSCode

- [QT](../../docs/computerScience/Tools/VSCode/README.md) — fine
- [Status Bar Visibility](../../docs/computerScience/Tools/VSCode/set.md) — 在设置一栏中搜索该项，并选择visible

## Ubuntu

- [报错](../../docs/computerScience/Ubuntu/Startu_issues.md) — COMRESET failed   Filesystem check or mount failed , A maintenance shell will now be started ...输入密码的提示
- [Ubuntu](../../docs/computerScience/Ubuntu/README.md) — Ubuntu 是一个用户友好且稳定的开源 Linux 操作系统，适用于桌面和服务器环境，提供丰富的软件和社区支持
