## 预处理宏

```cpp

//处理DLL导出和导入的宏定义
DEFINES += SSZNLASER_LIBRARY

#if defined(SSZNLASER_LIBRARY)  //检查是否定义了宏
#  define SSZNLASERSHARED_EXPORT Q_DECL_EXPORT  //导出库
#else
#  define SSZNLASERSHARED_EXPORT Q_DECL_IMPORT //导入库
#endif

```

## 编译选项调整

```pro

#编译选项根据 Qt 版本调整
if(contains(DEFINES,ubuntu20)){
    #忽略关于隐式声明的赋值运算符的弃用警告
    QMAKE_CXXFLAGS += -Wno-deprecated-copy
}
else
{
   #添加 PCL 1.8 的包含路径
    INCLUDEPATH += /usr/local/include/pcl-1.8
}

```


## 包含路径和库文件路径

```cpp
INCLUDEPATH += /usr/include/eigen3
INCLUDEPATH +=  /root/Work/3D/CLV3D/CLVisionBase
INCLUDEPATH += /usr/local/include/sszz

LIBS +=/usr/local/lib/baselib/libCLVisionBase.so
LIBS +=/usr/local/lib/baselib/libSR7Link.so
LIBS += /usr/local/lib/baselib/libCirCRiBuf.a

```

## Unix 安装路径

在 Unix 系统上，目标文件将安装到 /usr/lib 目录。
```
#Unix 系统的安装路径
unix {
    target.path = /usr/lib
    INSTALLS += target
}
```

## QT的ui文件
```
#UI 文件自动编译成代码
FORMS += \
    laserobj.ui \
    inforemindlg.ui
```


