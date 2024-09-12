### 插件的逻辑

1.主工程要加载某个动态链接库，这个动态链接库放在某个固定的路径下

> 加载路径：

2.动态链接库必须实现某些固定的接口

> 接口包括

```cpp
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
// 导出宏定义，用于确定是导出 (Q_DECL_EXPORT) 还是导入 (Q_DECL_IMPORT)
#  define CLOUDMIRRORSHARED_EXPORT Q_DECL_EXPORT
#else
#  define CLOUDMIRRORSHARED_EXPORT Q_DECL_IMPORT
#endif

// 外部 C 接口，用于获取插件 ID
extern "C" CLOUDMIRRORSHARED_EXPORT bool GetID(QString *mDllId);

// 外部 C 接口，获取工具信息列表
extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolInfo(vector<ToolInfoStructure> *mToolInfoList);

// 外部 C 接口，根据工具信息获取工具对象
extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolObj(ToolInfoStructure ToolInfo, ToolBase **mToolBase);

// 外部 C 接口，复制工具对象
extern "C" CLOUDMIRRORSHARED_EXPORT bool CloneToolObj(ToolBase *mSrcTool, ToolBase **mToolBase);

// 外部 C 接口，获取工具图标
extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolIco(ToolInfoStructure ToolInfo, QIcon *mIcon);

// 外部 C 接口，获取工具说明
extern "C" CLOUDMIRRORSHARED_EXPORT bool GetToolExplain(ToolInfoStructure ToolInfo, QString *mExplain);

// 外部 C 接口，重置序列号
extern "C" CLOUDMIRRORSHARED_EXPORT bool ResetSerialNumber();

#endif // CLOUDMIRROR_H

```