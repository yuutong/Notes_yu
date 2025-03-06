## 相机模块的实现


#### 相机控制
OpenCamera：打开相机，设置IP地址，注册回调函数，启动测量。

CloseCamera：关闭相机。

OpenLaser和CloseLaser：打开和关闭激光设备。


1.
    QString mCameraPath = fileName + QString::fromStdString("/cameralib");
    //获取相机列表，并把所有相机打开
    camera_manager.GetCametaList(mCameraPath);
    camera_manager.OpenAllCamara();

2.
CameraManager::OpenAllCamara()

3.
LaserClass::OpenLaserDevice()

4.
LaserWorkClass::OpenLaserDevice

5.
LaserObj::OpenCamera()
int LaserObj::OpenCamera()
{
     // 如果激光设备索引无效
    if(laser_index < 0)
    {
        return -1;
    }
     // 如果激光设备基类指针为空
    if(laser_base == NULL)
    {
        return -1;
    }
   // 如果相机已经打开
    if(Is_Open)
    {
        // 返回成功
        return 0;
    }
    // 设置相机的 IP 地址
    SREthernetConFig[laser_index].abyIpAddress[0] = laser_base->laser_info.LaserIPAdress[0];
    SREthernetConFig[laser_index].abyIpAddress[1] = laser_base->laser_info.LaserIPAdress[1];
    SREthernetConFig[laser_index].abyIpAddress[2] = laser_base->laser_info.LaserIPAdress[2];
    SREthernetConFig[laser_index].abyIpAddress[3] = laser_base->laser_info.LaserIPAdress[3];
     // 尝试打开相机
    int mResult = SR7IF_EthernetOpen(laser_index, &(SREthernetConFig[laser_index]));

    //注册回调函数
    SR7IF_SetBatchOneTimeDataHandler(laser_index, BatchOneTimeCallBack);

    //等待外部硬件触发批处理
    SR7IF_StartMeasureWithCallback(0,1);
    // 如果打开成功
    if(mResult == 0)
    {
        // 更新相机状态为打开
        Is_Open = true;
         // 设置默认参数
        SetDefaultParam();
        // 更新相机状态为关闭
        UpdateParmToLaser();
    }
    else
    {
        // 更新参数到激光设备
        Is_Open = false;
    }
    //    SetDlgparam();
    //    UpdateDlgParam();
   // 如果相机打开成功
    if(Is_Open)
    {
        return 0;
    }

    return  -1;
}


### DatasSourceDlg






 
### 第三方软件的开闭
LaserObj::OnRunSsznFinished()
LaserObj::OpenLaser()

LaserObj::on_btnConfig_clicked()
LaserObj::CloseLaser()


### 采集

DatasSourceDlg::GrabDatas(int mGrabType)

mResult = laser_obj->GrabOnce(this);  LaserWorkClass::GrabOnce(QString mTaskName)

mLaser->StartGrab(false, &image_obj, &cloud_obj);  LaserObj::StartGrab


this->PushDatas_3D(image_obj, cloud_obj);    virtual int PushDatas_3D(CLImage &mImage, CLCloud &mCloud)   LaserClass::PushData_3D
DatasSourceDlg::PushData_3D


#### 设备控制：

OpenLaserDevice：打开激光设备，如果设备已打开则不进行操作。
FreeLaserDevice（可能应为 CloseLaserDevice）：关闭激光设备，只有当没有其他任务使用时才能关闭。
StopGrab 和 BreakGrab：停止数据采集。
SetLaserState：设置激光设备的状态（打开或关闭）。
数据采集：

GrabOnce：执行单次数据采集。
TrigOnce：执行硬触发模式下的数据采集。
参数设置和更新：

UpdateParamShow：更新参数显示。
SetTrig：设置设备为硬触发或单帧工作模式。
UpdateCameraParm：加载参数到激光设备。


#### 参数设置和更新

InitParam：初始化默认参数。
UpdateParmToLaser：将设置的参数更新到激光设备。
SetDlgparam：从激光设备获取当前参数并更新到用户界面。

#### 实时显示和数据处理

on_btnRealTime_clicked和on_btnStopRealTime_clicked：控制实时数据显示的开始和停止。
MeasureUpdateThead：一个用于实时数据处理的线程类，处理从相机接收到的数据，并更新绘图。

#### 用户界面交互

各种on_开头的函数处理用户界面控件的事件，如按钮点击和下拉框选择，这些函数会根据用户的操作更新相机的设置。

#### 绘图和数据显示

updatePlot：更新绘图控件的数据。
LineShowPlotInit：初始化绘图控件


#### 控制激光触发操作
LaserTrigThread 类是一个用于控制激光触发操作的线程类，它通过周期性地调用 LaserWorkClass 的 TrigOnce 方法来执行激光触发，直到外部请求停止线程。这个类的设计允许激光触发操作在后台线程中执行，从而不会阻塞主线程，提高程序的响应性和性能

#### sszn
用于获取激光设备的信息并创建与之关联的 LaserBase 对象

