
### 一、投影仪业务逻辑处理

1. **业务层抽象**

   * 定义纯虚基类 `Projector`，接口包括：

     * `getInfo()`、`connect()`/`disConnect()`/`isConnect()`
     * `populatePatternTableData(...)`（加载要投的图案序列）
     * `project(isContinue)`、`pause()`、`stop()`、`resume()`、`step()`
     * `getLEDCurrent()` / `setLEDCurrent()`（控制红绿蓝 LED）
     * `getFlashImgsNum()`（查询 Flash 中图案数量） ([blog.csdn.net][1])

2. **工厂 + 接口继承**

   * 通过接口继承、简单工厂模式，延迟具体实现注入（高内聚低耦合）。
   * UML 类图与相机控制模块完全一致，仅把“Camera”替换为“Projector” ([blog.csdn.net][1])。

3. **SDK 封装**

   * 将德州仪器（TI）官方 **DLPC-API** 源码（针对 34xx 系列）拷贝入项目；
   * 通过一组 `common.hpp` 静态函数封装 I2C 读写、Flash 烧录、延时等底层操作；
   * 在 `ProjectorDlpc34xx` 中，调用 DLPC-API 提供的 `DLPC34XX_*` 接口完成具体控制。

4. **OpenCV 集成**

   * 用 `cv::Mat` 组织要投的图案图像集合 (`PatternOrderSet`)，简化图案加载与格式管理 ([blog.csdn.net][1])。

---

### 二、具体投影仪品牌与型号

* **厂商**：Texas Instruments（TI）
* **系列一**：DLP 34xx 控制器，使用 TI 官方 **DLPC-API** SDK （如 `dlpc34xx.h/dlpc34xx_dual.h` 等） ([blog.csdn.net][1])
* **系列二**：DLP 4500 / DLP 6500 等，可选 **DLP-ALC-LIGHTCRAFTER-SDK**（该博主未实现，但接口相同） ([blog.csdn.net][1])

---

**结论**：

* 业务逻辑层完全复用“相机控制”模式；
* 具体实现基于 TI DLP 34xx 系列硬件（DLPC-API），并兼容 DLP 4500/6500（LightCrafter SDK）。

