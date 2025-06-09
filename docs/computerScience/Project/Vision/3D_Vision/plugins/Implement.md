
## 插件是怎样实现的？

* 1.抽象层接口

定义了 工厂接口 Factory_plugin_Function 以及功能接口 功能接口 Interface_Function

* 2.工厂实现层:Factory_this

```cpp
// “工厂方法”：负责构造一个具体的功能实例
  void Create_plugin_function(std::shared_ptr<Interface_Function>& function) override {
    function = std::make_shared<Function_this>();
  }
```
核心工厂方法，用来生产具体的功能对象<br>
工厂内部直接 new Function_this，并通过 shared_ptr<Interface_Function> 返回给调用者。


* 3. 功能对象层：Function_this

包括UI交互和算法在内的具体实现

* 4 对外入口：PLUGIN_OUTPUT 函数 

extern "C"：去除 C++ 名字重整，保证所有平台上符号名都叫 PLUGIN_OUTPUT<br>
调用端动态加载库后，只需调用此函数，就能拿到一个指向 Factory_plugin_Function 的指针（Factory_this 实例）