## 编译器在什么时候生成默认构造函数
C++新手一般有两个常见的误区：<br>
* 1.任何class如果没有定义default constructor，就会被合成一个出来<br>
* 2.编译器合成出来的default constructor会显式设定 class内每一个data member的默认值<br>
以上没有一个是对的。

C++标准中阐明：默认构造函数在“有需要的时候”被编译器产生出来，什么是有需要的时候？<br>
答案是当编译器需要它的时候，只存在四种情况：<br>
* a.一个类没有任何构造函数，但是它内涵一个member object，而后者有default constructor<br>
* b.一个类没有任何构造函数，但它派生自一个base class，而后者有default constructor<br>
* c.一个类没有任何构造函数，但它含有（或继承）一个虚函数<br>
* d.一个类没有任何构造函数，但它派生自一个继承链，其中有一个或多个virtual base class

### 1.内含member object

```cpp
class Foo{
public:
    Foo();
    Foo(int)
    ...
};
class Bar{
public:
    Foo foo;
    char *str;
};

void foo_bar()
{
    Bar bar ;   //Bar::Foo 必须在此处初始化
    if(str){}
}
```
编译器合成以恶搞Bar类的默认构造函数，内含必要的代码，能够调用Foo类的构造函数来处理member object Bar::foo,
但不会产生任何代码来初始化Bar::str<br>
将Bar::foo初始化是编译器的责任，而初始化Bar::str则是程序员的责任

```cpp
//合成的默认构造
inline Bar::Bar()
{
    //C++伪代码
    foo.Foo::Foo();   
}
```
### 2. 派生自一个base class

如果基类拥有默认构造而派生类既没有默认构造也没有用户自定义的符合需求的构造函数，尝试 Derived d; 会导致编译器报错 “no matching constructor for initialization of ‘Derived’”。该错误本质上是因为编译器找不到可用于初始化基类子对象和派生类成员的构造函数<br>
于是这种情况下当前类的默认构造会被合成出来，它会调用上一层base class的默认构造函数，对于当前类的后续派生类，这个合成的默认构造和 显式提供的默认构造 没有什么差异。


### 3.内含一个虚函数

一个类含有虚函数，那么在编译时，
a.会生成一个虚表，存放虚函数的实现地址<br>
b.在每个class object中，生成一个vptr，指向虚表<br>
编译器必须要为object的vptr设置初始值，使它指向当前类的虚表，这件事由默认构造函数来做，没有默认构造，编译器就生成默认构造函数


### 4.派生自虚基类

为了初始化虚函数表指针和虚基类访问指针，必须要生成默认构造函数，在默认构造中插入初始化代码，没有别的地方可以做这件事。
编译器能在多重/虚继承场景下，自动帮你设置好运行期访问虚基类的所有必要指针，而不需要程序员手动编写任何额外的初始化代码
