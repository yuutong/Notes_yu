

1. 抽象层设计
   • 定义纯虚基类 Camera（接口）：connect()/disconnect()、start()/pause()、capture()、getImgs()、setTrigMode()、各类属性读写接口  
   • SafeQueue<cv::Mat> 用于线程安全地存取相机抓取到的帧

2. 驱动实现
   • HuarayCamera/HikvisionCamera 继承 Camera，调用厂商 SDK（IMVApi/Hik API）  
   • 注册 frameCallback 回调：SDK 拉流时把 IMV_Frame 转成 cv::Mat 并 push 到 SafeQueue

3. 触发模式
   • 连续模式（trigContinuous）：相机持续“推流” → 用于预览或不需同步场景  
   • 软件触发（trigSoftware）：调用 SDK “TriggerSoftware” 抓取单帧 → 可按条纹序列逐帧采集  
   • 硬件线触发（trigLine）：通过外部 TTL（Line2）口同步投影仪信号 → 保证投影图案与相机曝光严格同步

4. 与投影仪的交互
   • 投影仪通过 GPIO/TTL 输出 “图案切换” 触发信号  
   • 相机设为 trigLine 模式后，每收到一次外触发就采集一帧，图案–图像一一对应  
   • Software 模式下可手动触发：先切换到 trigSoftware，再调用 TriggerSoftware

5. 参数配置
   • 通过 setEnum/String/Number/BooleanAttribute 接口，动态调整“曝光时间”、“增益”、“帧率”等  
   • 运行时实时读取 getFps()、ExposureTime 等，保证采集节奏匹配投影速率

6. 数据流与业务管线
   • CameraFactory 负责创建并复用 Camera 实例（按 cameraUserId 和品牌区分）  
   • 主流程：camera->start() 启动拉流，后台回调写入 SafeQueue；  
     主线程或处理线程不断 popImg() 或 timeout_pop() → 得到 cv::Mat → 送给结构光解码模块

7. 单元测试
   • 使用 Google Test 对 CameraFactory、connect/disconnect、start/stop、触发等核心接口做单元测试  
   • 保证不同 SDK 实现下，上层业务逻辑不变

—— 以上即相机控制层的核心逻辑：  
   1. 抽象接口 + Factory 解耦硬件品牌；  
   2. SafeQueue 缓冲；  
   3. 三种触发模式（连续/软件/外部）→ 与投影仪同步；  
   4. 属性动态配置；  
   5. 图像队列对接后端结构光解码与三角测量模块。  
