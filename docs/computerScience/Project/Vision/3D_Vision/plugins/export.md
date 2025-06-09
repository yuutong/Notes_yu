
## 插件是怎样导出的？

**导出机制**：Q_DECL_EXPORT + extern "C"

### 1.Q_DECL_EXPORT

```cpp
#if defined(PLUGIN_FUNCTION_OCR)
#  define FRAMEWORK_PLUGIN_OPERATIONS_EXPORT Q_DECL_EXPORT
#else
#  define FRAMEWORK_PLUGIN_OPERATIONS_EXPORT Q_DECL_IMPORT
#endif
```

这是一个跨平台指令， 在 Windows 下会展开为 __declspec(dllexport)，在 GCC/Clang（Linux/macOS）下会展开为 __attribute__((visibility("default")))


### 2.extern "C" 

```cpp
extern "C" FRAMEWORK_PLUGIN_OPERATIONS_EXPORT
bool PLUGIN_OUTPUT(DY::Factory_plugin_Function*& ret);
```
去除了 C++ 的名字重整（name mangling），使得在所有平台上，这个函数的导出名始终为 PLUGIN_OUTPUT，调用端可以通过绝对相同的名字来查找

### 3.CMakeLists配置

```cpp
# 打包成动态库
add_library ( 
	${PROJECT_NAME}   
	SHARED
	${header_list_out} 
	${header_list} 
	${source_list} 
	${generated_ui_list} 
	${generated_qrc_list}
)
```
SHARED 库目标，自动处理平台差异，实现
在 Windows 上会产出 .dll<br>
在 Linux 上产出 .so<br>
在 macOS 上产出 .dylib<br>

最终实现：安装目录一份源码，多平台通用