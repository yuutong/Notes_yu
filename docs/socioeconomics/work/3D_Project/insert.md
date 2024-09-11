### 插件的逻辑

1.主工程要加载某个动态链接库，这个动态链接库放在某个固定的路径下

> 加载路径：

2.动态链接库必须实现某些固定的接口

> 接口包括

a.

b. 

c.

d.


``` cpp
#ifndef CLOUDMIRROR_H
#define CLOUDMIRROR_H


/*********************************************************************************
 * NAME:  HONGKELI
 * DATA:    2024/03/27
 * 点云镜像
 * ********************************************************************************/

#include <QtCore/qglobal.h>
#include <fstream>
#include <vector>
#include <QString>
#include <QIcon>
#include <QDebug>

#include "toolbase.h"
#include "CloudMirror/CL_ToolDerived.h"


#if defined(CLOUDMIRROR_LIBRARY)
#  define CLOUDMIRRORSHARED_EXPORT Q_DECL_EXPORT
#else
#  define CLOUDMIRRORSHARED_EXPORT Q_DECL_IMPORT
#endif


extern "C" CLOUDMIRRORSHARED_EXPORT bool GetID(QString *mDllId);

extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolInfo(vector<ToolInfoStructure> *mToolInfoList);

extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolObj(ToolInfoStructure ToolInfo, ToolBase **mToolBase);

extern "C" CLOUDMIRRORSHARED_EXPORT bool CloneToolObj(ToolBase *mSrcTool, ToolBase **mToolBase);

extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolIco(ToolInfoStructure ToolInfo, QIcon *mIcon);

extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolExplain(ToolInfoStructure ToolInfo, QString *mExplain);

extern "C" CLOUDMIRRORSHARED_EXPORT bool ResetSerialNumber();

#endif // CLOUDMIRROR_H
```
