1.	CLVisionBase（所有工程的基类工程）、DllManager（动态库的动态链接工程，与其他工程没有互联，可放在第一位）
2.	ROIExpand（ROI区域添加工程，需要调用CLVisionBase库以及opencv库）
3.	ShowImageAndCloud（显示窗口工程，调用CLVisionBase库、ROIExpand库以及boost、opencv和vtk库）
4.	CLToolServiceBase（额外创建基类，用于工具通用函数执行，调用CLVisionBase库、ROIExpand库、ShowImageAndCloud库以及halcon库）
5.	CLFunctions（算法执行工程，调用CLVisionBase、ROIExpand、CLToolServiceBase及halcon、pcl的库）

小注：
1、	以上属于工程基类，需要注意编译顺序，如果最内层基类做了函数增加和删除等修改操作，需要从基类进行完整的工程构建，否则软件可能会出现异常崩溃。
2、	对以上基类顺次编译过程中，需要顺次把编译好的工程放到/usr/local/lib/baselib文件夹下再进行对应编译，其他工程读取内部库路径亦为此路径。
3、	后续工程分为通信模块、工具模块、相机模块和主程序进行编译，各模块之间不存在包含关系，没有严格的编译顺序，每个模块的某个工程修改和更新仅对每个模块的对应工程进行编译即可，对修改工程进行单独修改即可。
4、	编译顺序及库包含信息可通过源码工程的.pro文件内容查看。

现有通信模块：
TCPComm（包含所有的通信执行内容，将通信模块打包成了一个工程）

现有工具模块：各工具之间不存在包含关系，没有严格编译顺序，以下工具顺序按字母顺序排列
1、	calcul（计算器）
2、	CloudConvertCircle（圆形转换）
3、	CloudCorrect（点云矫正、点云合并均在此工程；3D点映射也在此工程（未完成实现））
4、	CloudDifference（点云差分）
5、	CloudRegistration（点云配准）
6、	ContourDetec（轮廓检测）
7、	DefectChecks（缺陷）
8、	ImageAndCloud（点云转图像）
9、	ModelLocate（图形和轮廓匹配，基于图像）
10、	PlaneFitting（基准面拟合）
11、	PointAndLine（直线检测、圆检测、点间距、线间距等通过找边缘方式实现的工具集合工程）
12、	PoiToPoiSeg（两点高度差）
13、	PositivePosistionDeg（正位度）
14、	Pretreatment（2D预处理、3D预处理）
15、	RegionsSelect（区域选择）
16、	SegmentMeasure（高度检测）
17、	VolumeMeasure（体积检测）
18、	TemplateTool（工程模板、仅用于快速创建新工具工程，不用于发布）

现有相机模块：
1、	SSZNLaser（深视激光头，使用深视SDK及库文件（库文件需要在ubuntu14.04 gcc4.8.4环境下编译才可兼容））
2、	XGLaser（芯歌激光头，同上）

主程序：
CLVision

额外说明：
GenKey工程为注册软件使用时间的工程，可单独编译并执行，与其他模块无关联关系，仅用于软件有效使用时间注册。


