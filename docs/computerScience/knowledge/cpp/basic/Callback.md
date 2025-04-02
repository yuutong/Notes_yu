## 回调函数（Callback Function）

是一种通过函数指针/对象 实现的异步编程模型：<br>

注册机制：将用户定义的函数传递给底层模块（如 SDK、操作系统）

事件驱动：当特定事件（如数据到达、硬件中断）发生时，底层模块反向调用注册的函数

解耦设计：分离核心逻辑与具体实现，增强代码扩展性（例如不同相机厂商只需实现同一回调接口）

### 1.通俗解释

回调函数就像“留个电话号码，等我有事打给你”：

你告诉快递员：“包裹到了打我电话（注册回调）”

快递员不需要一直等你，而是等包裹到了主动拨号（触发回调）

你接到电话后去取包裹（处理数据）



### 2.实例：相机的数据采集
```cpp
bool Start()
{
    if (NULL == m_cameraSptr)
    {
        return false;  // 如果相机对象为空，返回失败
    }
    if (NULL == m_streamPtr)
    {
        return false;  // 如果流对象为空，返回失败
    }
    if (IsStarted())
    {
        return true;   // 如果已经启动，直接返回
    }
    if (m_pGCamDevice->m_bCaptureFlg)
    {
        return true;  // 如果已经在采集图像，直接返回
    }

    // 设置流的缓冲区数量
    m_streamPtr->setBufferCount(m_pGCamDevice->m_CamSettingParam.m_iBuffCount);


    //注册数据帧回调函数,数据帧回调函数(OnGetFrame)
    //建议不要在该函数中处理耗时的操作，否则会阻塞后续数据帧的实时性

    bool isSuccess = m_streamPtr->attachGrabbing(
        Dahua::GenICam::IStreamSource::Proc(&CHuaRuiCamPrivate::OnGetFrame, this));
    if (!isSuccess)
    {
        m_pGCamDevice->m_bCaptureFlg = true;
        return false;
    }
    qDebug()<<QString("startGrabbing");

    //开始拉流
    bool isStartGrabbingSuccess = m_streamPtr->startGrabbing(0, Dahua::GenICam::IStreamSource::grabStrartegyLatestImage);
    if (!isStartGrabbingSuccess)
    {
        m_pGCamDevice->m_bCaptureFlg = true;                // 标记为正在采集，避免重复尝试
        return false;                                       // 开始拉流失败，返回失败
    }

    // 复位信号
    ResetEvent(m_pGCamDevice->m_hFinishCapture);
    m_pGCamDevice->m_bCaptureFlg = true;                    // 标记为正在采集

    return true;
}

```

#### 2.1 回调函数通过以下代码注册

```cpp
// 注册数据帧回调函数
bool isSuccess = m_streamPtr->attachGrabbing(
    Dahua::GenICam::IStreamSource::Proc(&CHuaRuiCamPrivate::OnGetFrame, this)
);
```

#### 2.2 作用

功能：OnGetFrame 是一个用户定义的函数，当相机硬件捕获到新的图像帧时，SDK 会自动调用此函数

应用场景：<br>
实时帧处理：将原始图像数据从相机驱动层传递到应用层

数据同步：触发事件通知（例如 m_hFinishCapture），告知其他线程（如 WorkThread）可以安全读取缓冲区

资源管理：在回调中完成数据拷贝、标记缓冲区状态等操作

3. 具体流程

注册回调：通过 attachGrabbing 将 OnGetFrame 绑定到相机数据流

开始拉流：startGrabbing 启动数据流，SDK 内部会持续推送帧数据

触发回调：每帧数据到达时，SDK 调用 OnGetFrame，用户在此函数中处理数据（如填充缓冲区、计算帧率等）

通知主逻辑：回调中可能设置事件（如 SetEvent(m_hFinishCapture)），唤醒 DrawImageTimer() 中的等待线程


#### 2,3 关键细节

1.性能要求：<br>
注释明确提示 OnGetFrame 中不能做耗时操作（如复杂图像处理），否则会阻塞后续帧的实时性<br>
应仅做数据拷贝、标记状态等轻量级操作

2.线程安全：<br>
回调函数可能运行在SDK 内部线程，与主线程或其他线程共享数据时需加锁（如 m_pImageBuffer）

3.数据生命周期：<br>
回调中接收的帧数据可能来自临时内存，需及时拷贝到应用层缓冲区，避免被 SDK 覆盖


#### 2.4 回调函数与多线程协作的典型架构

```shell
[相机硬件] 
    |--(中断/数据到达)--> [SDK 内部线程] 
                          |-- 调用 OnGetFrame() 
                              |-- 拷贝数据到缓冲区 
                              |-- 设置事件 (SetEvent) 
                                  |
[WorkThread] <--(WaitForSingleObject 唤醒)-- 读取缓冲区 
                                  |-- 发送信号到 UI 线程 
                                      |
[主线程] <--(Qt 信号槽)-- 更新图像显示

```

### 3.回调函数的其他常见应用场景

1. 硬件交互
传感器数据读取：温度传感器、陀螺仪等实时数据采集

USB/串口通信：异步接收外部设备发送的数据包

2. 网络通信
HTTP 异步响应：收到服务器响应后触发回调处理数据

Socket 消息监听：客户端收到消息时自动调用回调解析内容

3. 图形界面（GUI）
按钮点击事件：用户点击按钮后触发回调更新 UI

定时器事件：定时刷新界面元素（如进度条）

注：这里是通过qt的信号槽机制实现的回调 
信号槽机制（Signals & Slots）本质上就是Qt对回调函数的一种封装和升级

4. 异步任务
文件读写完成通知：大文件读取完成后回调通知主线程

多线程任务协调：子线程完成任务后回调主线程汇总结果




