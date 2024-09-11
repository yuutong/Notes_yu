
```cpp
#-------------------------------------------------
#
# CLToolServiceBase
#
#-------------------------------------------------


greaterThan(QT_MAJOR_VERSION, 4): QT += widgets printsupport
QT += widgets sql

TARGET = /usr/local/lib/baselib/CLToolServiceBase
TEMPLATE = lib
CONFIG += C++11
DEFINES += CLTOOLSERVICEBASE_LIBRARY

SOURCES += cltoolservicebase.cpp \
    toolservicebase.cpp \
    unifyaddroi.cpp \
    tooldlgcommonuse.cpp \
    roimanagerdlg.cpp

HEADERS += cltoolservicebase.h \
    toolservicebase.h \
    unifyaddroi.h \
    tooldlgcommonuse.h \
    roimanagerdlg.h \
    mytablewidget.h

FORMS += \
    roimanagerdlg.ui

#版本检查,判断QT版本是否低于5.10
QT_VERSION=$$[QT_VERSION]
QT_VERSION=$$split(QT_VERSION,".")
QT_VER_MAJ=$$member(QT_VERSION,0)
QT_VER_MIN=$$member(QT_VERSION,1)
lessThan(QT_VER_MAJ,5)|lessThan(QT_VER_MIN,10){
    DEFINES += ubuntu14
}
else{
    DEFINES += ubuntu20
}
INCLUDEPATH +=/root/Work/3D/CLV3D/CLVisionBase
INCLUDEPATH += /root/Work/3D/CLV3D/ROIExpand 

LIBS += /usr/local/lib/baselib/libCLVisionBase.so
LIBS += /usr/local/lib/baselib/libROIExpand.so

if(contains(DEFINES,ubuntu20)){
    INCLUDEPATH += /var/pvt/.pvt/include
    INCLUDEPATH += /var/pvt/.pvt/include/halconcpp
    LIBS += -L/var/pvt/.pvt/lib/x64-linux2.4-gcc40 -lhalcon -lhalconcpp
    #忽略关于隐式声明的赋值运算符的弃用警告
    QMAKE_CXXFLAGS += -Wno-deprecated-copy
}else{
    INCLUDEPATH += /usr/local/include/pcl-1.8
    INCLUDEPATH += /usr/include
    INCLUDEPATH += /usr/include/halconcpp
    LIBS += -L/var/pvt/.pvt/lib/x64-linux2.4-gcc40 -lhalcon -lhalconcpp
}

INCLUDEPATH += /usr/include/eigen3

unix {
    target.path = /usr/lib
    INSTALLS += target
}

RESOURCES += \
    ICO.qrc
```


其中包含了项目的配置信息、源文件、头文件、库依赖、Qt 版本检测等部分。可以处理一个跨版本支持的项目，目标平台是 Ubuntu 14 和 Ubuntu 20，并且依赖了多个外部库如 Halcon、PCL 和 Qt。

#### 1. Qt 版本判断
这个文件检测 Qt 的版本，如果低于 5.10 则定义 `ubuntu14`，否则定义 `ubuntu20`。这用于在不同的系统版本下编译不同的代码逻辑。
   
#### 2. 头文件和库路径设置
根据不同的操作系统版本，添加不同的包含路径和库路径，比如：
   - Ubuntu 14：包含了 PCL 库的路径 `/usr/local/include/pcl-1.8`。
   - Ubuntu 20：添加了 Halcon 库的路径 `/var/pvt/.pvt/include`。

#### 3. 库依赖
项目依赖多个外部库，如：

```shell
   - `libCLVisionBase.so` 和 `libROIExpand.so`（自定义库）
   - Halcon 视觉库 (`-lhalcon -lhalconcpp`)
   - PCL（在 Ubuntu 14 中）
```
#### 4.编译选项
针对 Ubuntu 20，忽略关于隐式声明的弃用警告 (`-Wno-deprecated-copy`)。


