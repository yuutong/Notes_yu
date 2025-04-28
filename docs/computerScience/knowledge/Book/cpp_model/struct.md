## struct 关键词

### class 和 struct

事实上，在很多情况下，这两个关键词可以等同

看下面的例子：

```cpp
class cplus_plus_keyword{
	public:
	//numbers
}

```


```c
struct c_keyword {
	//the same number
}
```

C++所支持的 struct 和 C 所支持的 struct 是不同的 :

* C 的 struct：在 C 中，struct 是纯数据集合体，无封装或方法

* struct 在 C++ 中与 class 几乎等价，仅默认访问修饰符不同（struct 默认为 public，class 默认为 private）

C++ 兼容struct以直接兼容C代码，但是可能会给带来一些疑惑：
  开发者可能认为struct表示纯数据，但是struct本身可能包含 虚函数，继承等面向对象特性

这是C++存在的设计矛盾。需要留意


### c程序和C++程序不兼容的地方

在C语言中，程序员可以通过在结构体末尾定义一个单一元素的数组来实现可变长度数组（柔性数组）
```c
struct CStruct{
	int count;
	int data[1];
}

```

动态分配时，通过计算总内存大小并扩展数组长度：

```c
CStruct* s = malloc(sizeof(CStruct) + (n - 1) * sizeof(int));
s->count = n;
// 此时可以通过 s->data[i] 访问 0 ≤ i < n 的元素
```
这在C中是允许的，但是在C++中容易出错，是不允许这么写的

C++对类型和内存访问的检查更严格。声明为data[1]的数组在编译时被认为是固定大小的，但运行时越界访问可能导致未定义行为（如内存破坏、崩溃）


### C++  通过什么方式兼容C程序

老方法是让 C++的class 继承 C的结构体

```c
// C结构体
struct CData { int x; double y; };

// C++类继承C结构体
class CPPClass : public CData {
    virtual void func(); // 插入vptr，破坏C兼容布局
};
```

但是如果新的C++类加入虚函数，则可能波快C结构体的布局，之后编译器改进，不再支持这种方式


新方法是 C++程序 可以 通过 **组合** 的方式 兼容 C的struct

将c结构体作为C++类的成员变量嵌入进来，这样，其内存布局独立于C++类，与C代码兼容

```cpp
// C兼容结构体
struct CPoint { int x; int y; };

// C++类封装
class Shape {
private:
    CPoint position; // 组合
    // 其他成员...
public:
    // 转换运算符提供C结构体访问
    operator CPoint*() { return &position; }
    const CPoint* c_ptr() const { return &position; }
};

// C函数接口
extern "C" void process_point(CPoint* p);

int main() {
    Shape shape;
    process_point(shape); // 隐式转换或显式调用shape.c_ptr()
}

```



  
