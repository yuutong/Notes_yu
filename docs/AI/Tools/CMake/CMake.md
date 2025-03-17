#####  CMake的使用：
* 针对软件跨平台，在不同的平台下的编译
* 它首先允许开发者编写一种平台无关的 CMakeList.txt 文件来定制整个编译流程，
* 然后再根据目标用户的平台进一步生成所需的本地化 Makefile 和工程文件，如 Unix 的 Makefile 或 Windows 的 Visual Studio 工程。

**CMake 是一个比上述几种 make 更高级的编译配置工具。一些使用 CMake 作为项目架构系统的知名开源项目有 VTK、ITK、KDE、OpenCV、OSG 等 。


##### 在linux 平台下使用 CMake 生成 Makefile 并编译的流程如下：

* 编写 CMake 配置文件 CMakeLists.txt 。
* 执行命令 cmake PATH 或者 ccmake PATH 生成 Makefile（ccmake 和 cmake 的区别在于前者提供了一个交互式的界面）。其中， PATH 是 CMakeLists.txt 所在的目录。
* 使用 make 命令进行编译。
* 具体的过程详见各个样例