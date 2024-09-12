## 相机的导出函数

### 接口函数GetLaserInfo

```cpp
/**
* @description: 从激光设备获取信息并填充到传入的 mLaserInfoList 中
* @param { vector<LaserInfomation> } LaserInfomation 是存储激光头信息的结构体
*                 而 vector<LaserInfomation> 则是保存多个激光头信息的列表。
* @return {*bool}  返回值为 bool 类型，表示成功或失败
*/
extern "C" SSZNLASERSHARED_EXPORT bool GetLaserInfo(vector<LaserInfomation> *mLaserInfoList);
```

### 接口函数GetLaserObj

```cpp
/**
* @description: 根据指定的激光设备信息从列表中匹配，并创建对应的 LaserBase 对象
* @param { vector<LaserInfomation> } 一个包含所有激光设备信息的列表，用于查找特定设备
* @param { LaserInfomation } 目标设备的信息，用于匹配查找设备
* @param {LaserBase} 输出参数，存储创建的 LaserBase 对象的地址，供外部使用
* @return {*bool}  返回值为 bool 类型，表示操作成功或失败
*/
extern "C" SSZNLASERSHARED_EXPORT bool GetLaserObj(vector<LaserInfomation> mLaserInfoList, LaserInfomation mLaserInfo, LaserBase **mLaseBase);
```

#### 参数1. `vector<LaserInfomation> mLaserInfoList`
- *类型*: `vector<LaserInfomation>`
- *作用*: 
  - 这是一个包含多个 `LaserInfomation` 对象的向量，表示系统中获取到的所有激光设备信息列表。
  - 每个 `LaserInfomation` 结构体保存了单个激光设备的信息，如设备类型、接口、ID等。
  - 在函数内部，程序会遍历此列表，查找与 `mLaserInfo` 匹配的设备。
- *传递方式*: 
  - 传递的是值拷贝，即一个 `LaserInfomation` 向量的副本。由于是值拷贝，这意味着函数内部对该列表的修改不会影响外部的列表内容。

#### 参数2. `LaserInfomation mLaserInfo`
- *类型*: `LaserInfomation`
- *作用*: 
  - 这是一个存储单个激光设备信息的结构体，包含了待查找设备的具体信息。
  - 结构体内部可能包含设备的类型、接口、设备ID、IP地址等信息。
  - 函数使用此结构体的信息与 `mLaserInfoList` 中的设备进行匹配，找到与之对应的设备。
- *传递方式*: 
  - 以值传递的方式传入，即将 `LaserInfomation` 的副本传递给函数。函数内部对该结构体的修改不会影响传入的实际值。

#### 参数3. `LaserBase **mLaseBase`
- *类型*: `LaserBase **`（指向指针的指针）
- *作用*: 
  - 这是一个输出参数，指向 `LaserBase` 类的指针地址。
  - `LaserBase` 是一个表示激光设备的类（或基类），其对象代表具体的激光设备实例。
  - 函数通过查找 `mLaserInfoList` 中的设备，并根据匹配结果创建 `LaserBase` 的对象实例。然后通过 `mLaseBase` 输出该对象的地址。
  - 由于是指向指针的指针，函数内部会分配 `LaserBase` 对象并赋值给 `*mLaseBase`，因此外部能够访问这个新创建的对象。
- *传递方式*: 
  - 传递的是指向指针的地址，所以函数内部对 `*mLaseBase` 的赋值会影响外部变量。这个机制允许函数创建新的对象并将其返回给调用方。

#### 返回值 `bool`
- *作用*: 
  - 函数返回一个布尔值，表示操作是否成功。
  - 如果找到匹配的激光设备并成功创建了 `LaserBase` 对象，返回 `true`；否则返回 `false`。

