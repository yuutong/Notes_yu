## 通过sdk实现相机采集图像的大致过程

```cpp
static void BatchOneTimeCallBack(const void *info, const SR7IF_Data *data)
{
    const SR7IF_STR_CALLBACK_INFO * conInfo = (const SR7IF_STR_CALLBACK_INFO*) info;

    int mNumD = conInfo->BatchPoints * conInfo->xPoints;

    //高度数据获取--相机 A
    const int* mTmpData = SR7IF_GetBatchProfilePoint(data, 0);
    int mNumP = sizeof(int) * conInfo->BatchPoints * conInfo->xPoints;

    //高度数据缓存
    int *mProfileDataA = new int[mNumD];

    if(mTmpData != NULL)
    {
        memset(mProfileDataA, -1000000000, mNumP);
        memcpy(mProfileDataA, &mTmpData[0], mNumP);
    }

    //灰度数据获取
    int mNumG = sizeof(unsigned char) * conInfo->BatchPoints * conInfo->xPoints;
    const unsigned char* mTmpGraydata = SR7IF_GetBatchIntensityPoint(data, 0);

    //灰度数据缓存
    char *mIntensityDataA = new char[mNumD];

    if(mTmpGraydata != NULL)
    {
        memset(mIntensityDataA, 0, mNumG);
        memcpy(mIntensityDataA, &mTmpGraydata[0], mNumG);
    }

    //编码器数据获取
    int mNumE = sizeof(unsigned int) * conInfo->BatchPoints;
    const unsigned int* mTmpEncoderdata = SR7IF_GetBatchEncoderPoint(data, 0);

    //编码器数据缓存
    int *mEncoderDataA = new int[conInfo->BatchPoints];

    if(mTmpEncoderdata != NULL)
    {
        memset(mEncoderDataA, 0, mNumE);
        memcpy(mEncoderDataA, &mTmpEncoderdata[0], mNumE);
    }

    if(conInfo->HeadNumber == 2)
    {
        //相机 B 数据
        const int* mTmpDataB = SR7IF_GetBatchProfilePoint(data, 1);

        //高度数据缓存
        int *mProfileDataB = new int[mNumD];

        if(mTmpData != NULL)
        {
            memset(mProfileDataB, -1000000000, mNumP);
            memcpy(mProfileDataB, &mTmpDataB[0], mNumP);
        }

        const unsigned char* mTmpGraydataB = SR7IF_GetBatchIntensityPoint(data, 1);

        //灰度数据缓存
        char *mIntensityDataB = new char[mNumD];

        if(mTmpGraydataB != NULL)
        {
            memset(mIntensityDataB, 0, mNumG);
            memcpy(mIntensityDataB, &mTmpGraydataB[0], mNumG);
        }

        const unsigned int* mTmpEncoderdataB = SR7IF_GetBatchEncoderPoint(data, 1);

        //编码器数据缓存
        int *mEncoderDataB = new int[conInfo->BatchPoints];

        if(mTmpEncoderdata != NULL)
        {
            memset(mEncoderDataB, 0, mNumE);
            memcpy(mEncoderDataB, &mTmpEncoderdataB[0], mNumE);
        }
    }
}

int _tmain(int argc, _TCHAR* argv[])
{

    //网络配置结构体
    SR7IF_ETHERNET_CONFIG SREthernetConFig;
    SREthernetConFig.abyIpAddress[0] = 192;
    SREthernetConFig.abyIpAddress[1] = 168;
    SREthernetConFig.abyIpAddress[2] = 0;
    SREthernetConFig.abyIpAddress[3] = 124;

    //设备 ID 号 0-3
    const int DEVICE_ID = 0;
    SR7IF_Data DataObject = NULL;

    //连接相机
    int reT = SR7IF_EthernetOpen(DEVICE_ID, &SREthernetConFig);
    if(reT < 0)
    {
        printf("Error: 连接失败:%d\n", reT);
        system("pause"); //窗口暂停
        return -1;
    }

    //回调函数设置
    reT = SR7IF_SetBatchOneTimeDataHandler(DEVICE_ID, BatchOneTimeCallBack);

    if(reT < 0)
    {
        printf("Error: 回调函数设置失败:%d\n", reT);

        //关闭设备
        reT = SR7IF_CommClose(DEVICE_ID);
        if(reT < 0)
        printf("Error: 关闭设备失败:%d\n", reT);
        system("pause"); //窗口暂停
        return -1;
    }
    else
    {
        // 等待外部硬件触发批处理
        reT = SR7IF_StartMeasureWithCallback(0, 1);
        if(reT < 0)
        {
            printf("Error: 开始批处理失败:%d\n", reT);
            system("pause"); //窗口暂停
            return -1;
        }
    }

    system("pause"); //窗口暂停
    return 0;
}
```