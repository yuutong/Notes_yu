## 相机的导出函数

### 接口函数GetLaserInfo

```cpp
/**
* @description: 从激光设备获取信息并填充到传入的 mLaserInfoList 中
* @param { vector<LaserInfomation> } LaserInfomation 是存储激光头信息的结构体
*                 而 vector<LaserInfomation> 则是保存多个激光头信息的列表。
* @return {*bool}  返回值为 bool 类型，表示成功或失败
*/
extern "C" SSZNLASERSHARED_EXPORT bool GetLaserInfo(vector<LaserInfomation> *mLaserInfoList);

bool SSZNLASERSHARED_EXPORT GetLaserInfo(vector<LaserInfomation> *mLaserInfoList)
{
    //这里将指针 mLaserInfoList 解引用为 mInfoList，方便后续操作
    vector<LaserInfomation> &mInfoList = *mLaserInfoList;
    //网络配置结构体,用于存储最多 4 台激光设备的网络配置。
    SR7IF_ETHERNET_CONFIG SREthernetConFig[4];
    //手动配置了四个默认的 IP 地址，这些地址代表了激光设备的预定义网络配置
    SREthernetConFig[0].abyIpAddress[0] = 192;
    SREthernetConFig[0].abyIpAddress[1] = 168;
    SREthernetConFig[0].abyIpAddress[2] = 100;
    SREthernetConFig[0].abyIpAddress[3] = 10;

    SREthernetConFig[1].abyIpAddress[0] = 192;
    SREthernetConFig[1].abyIpAddress[1] = 168;
    SREthernetConFig[1].abyIpAddress[2] = 101;
    SREthernetConFig[1].abyIpAddress[3] = 10;

    SREthernetConFig[2].abyIpAddress[0] = 192;
    SREthernetConFig[2].abyIpAddress[1] = 168;
    SREthernetConFig[2].abyIpAddress[2] = 102;
    SREthernetConFig[2].abyIpAddress[3] = 10;

    SREthernetConFig[3].abyIpAddress[0] = 192;
    SREthernetConFig[3].abyIpAddress[1] = 168;
    SREthernetConFig[3].abyIpAddress[2] = 103;
    SREthernetConFig[3].abyIpAddress[3] = 10;

   /*
    *搜索在线的激光设备
    *  并将找到的设备数量存储到 mLaserNum 中
    * 可以添加读取个数，根据获取到的相机个数进行不同数量的添加
    */
    int mLaserNum = 0;
    SR7IF_ETHERNET_CONFIG *mLasers = SR7IF_SearchOnline(&mLaserNum, 1000);

     // 防错：确保获取到的激光设备数量不超过 SREthernetConFig 的容量,最多复制 4 台设备
     int copyCount = (mLaserNum < 4) ? mLaserNum : 4;

     // 将 mLasers 数组的内容复制到 SREthernetConFig 数组中
     for (int i = 0; i < copyCount; ++i) {
           SREthernetConFig[i] = mLasers[i]; // 直接结构体赋值
     }

     //循环遍历找到的激光设备
    for(int i=0; i < mLaserNum; i++)
    {
        //通过 SR7IF_EthernetOpen 打开每个设备的以太网连接。
        int ret = SR7IF_EthernetOpen(i, &(SREthernetConFig[i]));
        //如果连接成功
        if (ret == 0)
        {
            const char * strModel = SR7IF_GetModels(i);   //获取设备的型号
            const char * mSerial = SR7IF_GetHeaderSerial(i, 0);  //获取设备的序列号
            //将信息存储到 LaserInfomation 结构体中并添加到 mInfoList 中。
            LaserInfomation mLaserInfomation;
            mLaserInfomation.LaserType = "CLZN";
            mLaserInfomation.LaserInterface = strModel;
            mLaserInfomation.LaserID = mSerial;
            mLaserInfomation.LaserExplain = QString::number(i).toStdString();
            mLaserInfomation.LaserIPAdress[0] = SREthernetConFig[i].abyIpAddress[0];
            mLaserInfomation.LaserIPAdress[1] = SREthernetConFig[i].abyIpAddress[1];
            mLaserInfomation.LaserIPAdress[2] = SREthernetConFig[i].abyIpAddress[2];
            mLaserInfomation.LaserIPAdress[3] = SREthernetConFig[i].abyIpAddress[3];
            mLaserInfomation.mLaserDataType = LaserDataType::LASER_3D;
            mInfoList.push_back(mLaserInfomation);
        }
        //连接关闭时调用 SR7IF_CommClose
        SR7IF_CommClose(i);
    }
    return true;
}

```



### 接口函数GetLaserObj

```cpp
/**
* @description: 根据指定的激光设备信息从列表中匹配，并创建对应的 LaserBase 对象
* @param { vector<LaserInfomation> } 一个包含所有激光设备信息的列表，用于查找特定设备
* @param { LaserInfomation } 目标设备的信息，用于匹配查找设备
* @param {LaserBase} 输出参数，存储创建的 LaserBase 对象的地址，供外部使用
* @return {*bool}  返回值为 bool 类型，表示操作成功或失败
*/
extern "C" SSZNLASERSHARED_EXPORT bool GetLaserObj(vector<LaserInfomation> mLaserInfoList, LaserInfomation mLaserInfo, LaserBase **mLaseBase);


//根据 mLaserInfoList 中的信息查找特定的激光设备，并创建对应的激光对象 LaserBase
bool SSZNLASERSHARED_EXPORT GetLaserObj(vector<LaserInfomation> mLaserInfoList, LaserInfomation mLaserInfo, LaserBase **mLaseBase)
{
    //如果传入的 mLaserInfoList 为空, 表示无法找到激光设备
    if(mLaserInfoList.empty() || mLaserInfoList.size() < 1)
    {
        return false;
    }

    //检查 mLaserInfo 的激光类型是否为 "CLZN"。
    if (mLaserInfo.LaserType == "CLZN")
    {
        int mIndex = -1;
        int mSize = (int)(mLaserInfoList.size());
        LaserInfomation _mInfomation;
        //遍历, 在 mLaserInfoList 中查找与 mLaserInfo 匹配的激光设备信息
        for(int i=0; i< mSize; i++)
        {
            // 通过设备 ID 和接口匹配目标设备。
            LaserInfomation mInfomation = mLaserInfoList.at(i);
            if(mInfomation.LaserID == mLaserInfo.LaserID && mInfomation.LaserInterface == mLaserInfo.LaserInterface)
            {
                //如果找到匹配项，记录其索引 mIndex。
                mIndex = i;
                _mInfomation = mInfomation;
                break;
            }
        }
       //如果找到匹配的设备（mIndex > -1）
        if(mIndex > (-1))
        {
            //则创建 LaserWorkClass 的实例
            *mLaseBase = new LaserWorkClass(mIndex);
            //并初始化它的 IP 地址等属性。
            (*mLaseBase)->laser_info.LaserIPAdress[0] = _mInfomation.LaserIPAdress[0];
            (*mLaseBase)->laser_info.LaserIPAdress[1] = _mInfomation.LaserIPAdress[1];
            (*mLaseBase)->laser_info.LaserIPAdress[2] = _mInfomation.LaserIPAdress[2];
            (*mLaseBase)->laser_info.LaserIPAdress[3] = _mInfomation.LaserIPAdress[3];
            //返回 true 表示成功创建
            return true;
        }
    }
    return false;
}
```

#### 参数1. `vector<LaserInfomation> mLaserInfoList`
- *类型*: `vector<LaserInfomation>`
- *作用*: 
  - 这是一个包含多个 `LaserInfomation` 对象的向量，表示系统中获取到的所有激光设备信息列表。
  - 每个 `LaserInfomation` 结构体保存了单个激光设备的信息，如设备类型、接口、ID等。
  - 在函数内部，程序会遍历此列表，查找与 `mLaserInfo` 匹配的设备。
- *传递方式*: 
  - 传递的是值拷贝，即一个 `LaserInfomation` 向量的副本。由于是值拷贝，这意味着函数内部对该列表的修改不会影响外部的列表内容。

#### 参数2. `LaserInfomation mLaserInfo`
- *类型*: `LaserInfomation`
- *作用*: 
  - 这是一个存储单个激光设备信息的结构体，包含了待查找设备的具体信息。
  - 结构体内部可能包含设备的类型、接口、设备ID、IP地址等信息。
  - 函数使用此结构体的信息与 `mLaserInfoList` 中的设备进行匹配，找到与之对应的设备。
- *传递方式*: 
  - 以值传递的方式传入，即将 `LaserInfomation` 的副本传递给函数。函数内部对该结构体的修改不会影响传入的实际值。

#### 参数3. `LaserBase **mLaseBase`
- *类型*: `LaserBase **`（指向指针的指针）
- *作用*: 
  - 这是一个输出参数，指向 `LaserBase` 类的指针地址。
  - `LaserBase` 是一个表示激光设备的类（或基类），其对象代表具体的激光设备实例。
  - 函数通过查找 `mLaserInfoList` 中的设备，并根据匹配结果创建 `LaserBase` 的对象实例。然后通过 `mLaseBase` 输出该对象的地址。
  - 由于是指向指针的指针，函数内部会分配 `LaserBase` 对象并赋值给 `*mLaseBase`，因此外部能够访问这个新创建的对象。
- *传递方式*: 
  - 传递的是指向指针的地址，所以函数内部对 `*mLaseBase` 的赋值会影响外部变量。这个机制允许函数创建新的对象并将其返回给调用方。

#### 返回值 `bool`
- *作用*: 
  - 函数返回一个布尔值，表示操作是否成功。
  - 如果找到匹配的激光设备并成功创建了 `LaserBase` 对象，返回 `true`；否则返回 `false`。


为工程中的mainwindow类和相机SSZN添加代码注释
