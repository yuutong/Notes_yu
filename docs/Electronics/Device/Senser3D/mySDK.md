下面是对该博文“结构光3D相机SDK开发（C/C++）”的核心内容提炼：

1. **目标**

   * 构建一个可配置、可扩展的结构光3D相机 SDK，用于单目/双目/多目场景无缝切换。
   * 用 JSON 文件描述整机参数，算法、硬件、相机、投影仪等全在配置中完成动态加载和修改。

2. **模块划分**

   * **SLCamera（基类）**：抽象出 “在线检测”、“连接/断开”、“捕获重建”、“属性读写” 四大核心接口；
   * **TrinocularCamera** 等派生类：组合底层 2D 相机和投影仪，对应 JSON 中的 “Left Camera”、“Right Camera”、“Color Camera”、“DLP Evm” 等字段；

3. **JSON 配置**

   * 参数分为两大组：

     1. **device**：3D 相机名称、内置 2D 相机型号、投影仪型号等硬件描述；
     2. **algorithm**：相移次数、曝光时间、GPU 加速开关等算法控制；
   * SDK 启动时 `loadParams(jsonPath, jsonVal_)` 读取，并保存在 `stringProperties_`、`numberProperties_`、`booleanProperties_` 中；析构时统一写回 JSON。

4. **在线状态查询**

   * `getCameraInfo()`：

     * 从 `CameraFactory` 和 `ProjectorFactory` 获取对应设备实例；
     * 分别调用各设备 `getCameraInfo()` / `getInfo()`，合并返回结构光相机整体在线状态和内参；

5. **连接与断开**

   * `connect()`／`disConnect()`：

     * 遍历 JSON 配置中的所有 2D 相机和投影仪名称；
     * 调用各自 `connect()`／`disConnect()`，返回整体成功与否；

6. **捕获与三维重建**

   * 引入**Strategy 模式**：抽象基类 `Pattern`（条纹编码解码算法接口），具体算法如“相移+格雷码互补”继承自它；
   * `SLCamera` 类中持有 `Pattern *pattern_`，通过 `setPattern()` 切换算法；
   * 重建时仅调用 `pattern_->decode(imgs, depthMap, useGpu)` 完成从多帧灰度图到深度图的全过程。

7. **工厂与解耦**

   * **CameraFactory** & **ProjectorFactory**：根据 JSON 中 “Manufactor” 字段（如 Huaray、Halcon）动态创建并复用底层设备对象；
   * 上层 SDK 与具体 SDK（IMVApi、Halcon API）完全解耦，添加新品牌只需在工厂中注册。

8. **线程与性能**

   * 2D 相机帧通过回调异步写入 **SafeQueue[cv::Mat](cv::Mat)**；
   * 主线程或专门的处理线程不停地 `pop()` 图像送入 `Pattern::decode()`，确保高帧率实时重建；

9. **单元测试**

   * 使用 Google Test 覆盖工厂、在线检测、连接断开、触发模式（软件/硬件）、属性读写等接口；
   * 保证不同底层 SDK 下，上层业务逻辑一致不变；

---

**整体架构**：

```
 JSON 配置
     ↓
 SLCamera（基类）
     ↓              ←—— Pattern 算法插件
 TrinocularCamera — decode() → 深度图
     ↑
 CameraFactory / ProjectorFactory
     ↑
 2D 相机 SDK   投影仪 SDK
```

这样，一个结构光3D相机从硬件描述到算法解码、从配置文件到运行时调参，都被封装在可编程、可测试、可扩展的 C/C++ SDK 中。
