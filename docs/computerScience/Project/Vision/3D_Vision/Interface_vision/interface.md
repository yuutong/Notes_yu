
## 1.接口模块简介

这里是3D视觉项目的顶层接口类，对于所有的接口，均不提供具体实现。<br>
对于功能插件化管理，整体架构采用工厂模式，具体提供了一个工厂接口类，和具体的插件功能类，可派生出不同类别的插件基类（视觉，设备，通信插件基类等）<br>
可以理解为一个工厂可以生产多种产品，分成不同厂区，每个厂区可以生产不同类型的产品，在厂区内又可以有多个流水线，每个流水线生产一种产品<br>
而用户可以购买这产品，以任意的组合方式，却不需要知道具体的生产过程


## 2.纯虚接口的模块的库创建

```cmake

# 创建一个 INTERFACE 类型的库目标
add_library( ${PROJECT_NAME} INTERFACE )

# 为 INTERFACE 库暴露头文件搜索路径
target_include_directories(${PROJECT_NAME} INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/include/
)
```
INTERFACE 库本身不编译任何源代码，也不产出任何二进制文件。它只是一个“用来传递 include 路径、编译选项和链接依赖”的占位目标。


## 3.其他模块是怎样拿到 Interface_vision 的头文件的？

当在其他模块中使用：

```cmake

target_link_libraries(xxx PRIVATE Interface_vision)

```
会触发 INTERFACE 库的“传递属性”机制，它会把自己身上的属性“打包”并传给 其他模块：

* 头文件搜索路径（INCLUDE_DIRECTORIES）

```cmake
target_include_directories(Interface_vision
  INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/include/
)
```
这样其他模块就能直接找到Interface_vision下面的接口头文件了。<br>

还有其他的属性：

* 1. 编译特性（COMPILE_FEATURES）<br>
任何链接了它的模块都会强制使用C++17编译<br>

* 2.链接依赖（LINK_LIBRARIES）

```cmake
target_link_libraries(Interface_vision
  INTERFACE
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
)
```
其他模块会把其链接的库也加入到自己的库依赖，编译器会在链接阶段去查找和链接这些库<br>

* 3 安装头文件（INSTALL）

```cmake
install(DIRECTORY include/ DESTINATION include)
```
当对 Interface_vision 做 cmake --install . 时，它会把接口头文件拷到 ${CMAKE_INSTALL_PREFIX}/include/Interface_vision/下，使得可执行程序可以找到它






