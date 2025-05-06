## 单一继承的虚函数调用
每个class只会有一个虚表，表中是对应class object中所有active virtual function的地址<br>
active virtual function有：<br>
* a.当前类的虚函数实例，它改写了base class virtual function 函数实例<br>
* b.继承自base class的函数实例，派生类不改写虚函数<br>
* c. 一个纯虚函数

![虚函数单一继承](image.png)

这种情况下虚函数调用符合之前所述a.虚表查找，b.this 指针转换，c.编译器重命名函数的逻辑

## 多重继承的虚函数调用

其复杂度围绕在第二个及后继的 base classes身上，以及“必须在执行期调整this 指针”，
策略的重点在于**this 指针的运行时调整** 和 **虚表（vtable）的管理**

### this指针运行时调整
```cpp
class Base1 { 
public:
    virtual ~Base1() {}
    virtual void mumble() {}
    virtual Base1* clone() const { return new Base1(*this); }
};

class Base2 { 
public:
    virtual ~Base2() {}
    virtual Base2* clone() const { return new Base2(*this); }
};

class Derived : public Base1, public Base2 {
public:
    virtual ~Derived() {}
    virtual Derived* clone() const { return new Derived(*this); }
};
```

![多重继承下的虚函数调用](image-1.png)

“Derived 支持virtual functions”的困难度，统统落在Base2 subobject 身上。有三个问题需要解决，以此例而言分别是（1） virtual destructor，（2） 被继承下来的Base2 ：​：mumble（​） ，（3） 一组clone（​） 函数实例。

```shell
Derived* der;                  // 完整对象指针
size_t ofs1 = 0;               // Base1 子对象在 Derived 内的偏移 
size_t ofs2 = sizeof(Base1);   // Base2 子对象相对于 Derived 开头的偏移 
```

* a.通过 第二个base class的指针，调用derived class virtual function

```shell
#入口：p2 指向 Derived 的 Base2 子对象
Base2* p2 = der + ofs2;             // 简写：der + sizeof(Base1) 
#调整到完整对象
Derived* full = p2 - ofs2;          // 减去 ofs2 回到完整对象 
#调用真正的析构
full->~Derived();
```
在多重继承里，Derived 的 Base2 子对象位于完整对象地址之后 ofs2 字节处，当通过 Base2* p2 调用时，要做减法（p2 - ofs2）而不是加法，才能得到原始的 Derived*

* b.通过 Base1* 调用继承自 Base2::mumble()<br>

```shell
#入口：p1 指向 Derived 的 Base1 子对象
Base1* p1 = der + ofs1;             // ofs1=0，直接指向 der 
# 调整到完整对象
Derived* full = p1 - ofs1;          // 减去 ofs1 回到完整对象
# 再定位到 Base2 子对象
Base2* real2  = full + ofs2;        // 加上 ofs2 定位到 Base2 子对象
# 调用 Base2::mumble()
real2->mumble();                    // 方法定义在 Base2，需要偏移 
```
* c 通过 Base2* 调用 Derived 覆盖自 Base2::clone() （协变返回）

```shell
# 入口：p2 指向 Derived 的 Base2 子对象
Base2* p2 = der + ofs2;            
# 调整到完整对象
Derived* full     = p2 - ofs2;             // 回到完整对象
# 调用覆盖的 clone，返回的是 Derived*
Derived* new_full = full->clone();         // 协变返回 
# 返回时，再偏移到 Base2 子对象
Base2* ret2       = new_full + ofs2;
return ret2;
```

### 虚表管理

在虚函数的多重继承中，派生类可能含有多个虚表<br>
* 每个基类对应一个虚表：Derived 会为 Base1 和 Base2 各维护一个虚表。

* 虚表内容：<br>
    主虚表（与 Base1 共享）：包含 ~Derived(), mumble(), clone()。
    次虚表（与 Base2 共享）：包含 ~Derived() 的 Thunk 和 clone() 的 Thunk。

```tab
+----------------+----------------+----------------+
| Base1 子对象   | Base2 子对象   | Derived 成员    |
| (vptr → vtbl_Base1) | (vptr → vtbl_Base2) |                |
+----------------+----------------+----------------+
```

**优化**：<br>
* 虚表合并：将多个虚表链接为单个实体，通过偏移量访问次要虚表
* 优势：减少符号数量，加快动态链接速度
    主虚表名称：vtbl_Derived。
    次虚表位置：vtbl_Derived + offset。

