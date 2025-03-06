
# 相机模块接口文档

本文档提供了相机模块的详细接口说明，包括相机控制、图像采集、用户界面参数设置等功能。

---

## 1. 相机控制

### 1.1 打开相机

打开相机，设置IP地址，注册回调函数，启动测量。

1. mainWindow：
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

```cpp
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

   // 如果相机打开成功
    if(Is_Open)
    {
        return 0;
    }

    return  -1;
}

```

### 1.2 关闭相机

- **CloseCamera**：关闭相机。
...


### 1.3第三方软件的开闭

LaserObj::OnRunSsznFinished()
LaserObj::OpenLaser()

LaserObj::on_btnConfig_clicked()
LaserObj::CloseLaser()



## 2. 图像采集

### 2.1 单次采集 

从相机获取图像和点云数据

- **GrabOnce**：执行单次数据采集。

1.
DatasSourceDlg::GrabDatas(int mGrabType)

mResult = laser_obj->GrabOnce(this); 

2.
LaserWorkClass::GrabOnce(QString mTaskName)

3.
mLaser->StartGrab(false, &image_obj, &cloud_obj);  
LaserObj::StartGrab

### 2.1 传输图像

1.LaserObj::StartGrab
this->PushDatas_3D(image_obj, cloud_obj);  
2.  
virtual int PushDatas_3D(CLImage &mImage, CLCloud &mCloud)   
LaserClass::PushData_3D
3.
DatasSourceDlg::PushData_3D


### 2.2 硬触发采集 
- TrigOnce：执行硬触发模式下的数据采集。
...同上

- LaserTrigThread：一个用于控制激光触发操作的线程类，通过周期性地调用 **LaserWorkClass::TrigOnce** 方法来执行激光触发。





## 3. 用户界面参数设置

### 3.1 参数显示更新
- *UpdateParamShow*：更新参数显示。

### 3.2 触发模式设置
- *SetTrig*：设置设备为硬触发或单帧工作模式。

### 3.3 参数加载
- *UpdateCameraParm*：加载参数到激光设备。

---


## 4. 实时显示和数据处理

### 4.1 实时数据显示
- *on_btnRealTime_clicked* 和 *on_btnStopRealTime_clicked*：控制实时数据显示的开始和停止。

### 4.2 实时数据处理线程
- *MeasureUpdateThead*：一个用于实时数据处理的线程类，处理从相机接收到的数据，并更新绘图。

---





