## 非静态成员函数调用

C++的设计准则之一：nonstatic member function 调用至少必须和一般的nonmember function有相同的效率。那么怎样才能做到呢？<br>
答案是编译器内部将“member函数实例”转换为对等的“nonmember函数实例”​,下面是转换步骤：

### 1.将this指针写到函数签名中

```cpp
//函数原型
float Point3d::magnitude() const
{
    return sqrt(m_x * m_x + m_y * m_y );
}

//编译器安插this指针
float Point3d::magnitude(const Pointd *const this)
{
    return sqrt(this->m_x * this->m_x + this->m_y * this->m_y);
}

//上面的float Point3d::magnitude(const...) 是因为  float Point3d::magnitude() const 是常量，非常量的写法：
float Point3d::magnitude(Pointd *const this)
{
    return sqrt(this->m_x * this->m_x + this->m_y * this->m_y);
}

```
编译器将函数原型参数中插入一个this指针，然后对于非静态数据成员的操作都改为使用this指针来完成。

### 2.编译器对函数名称做唯一性处理

编译器如何在调用时区分不同类中的同名成员函数，基类和派生类中的同名成员函数，以及通过函数重载产生的同名函数？<br>
答案是给每一个函数根据名称和参数重新分配名称，使程序中的每一个函数独一无二

```cpp
float Point3d::magnitude(Pointd *const this)
{
    return sqrt(this->m_x * this->m_x + this->m_y * this->m_y);
}

//重新命名为magnitude_7Point3dFv
extern magnitude_7Point3dFv( register Point3d *const this)

class Point{
public:
    void x(float newX);
    float x();
}

//重新命名
class Point{
public:
    void x_5PointFv(float newX);
    float x_5PointFv();
}
```
对函数重命名是编译器内部做的事，编译错误消息使用的函数名称仍然是程序源码中的函数名称，但是编译完成之后，链接器使用的是经过重命名的内部函数名称

## 虚成员函数调用

### 1.通过动态绑定机制调用
通过vptr和虚表动态绑定，是**虚函数的默认调用机制**，调用虚函数时，需通过两次间接寻址<br>
* a.通过vptr找到虚表<br>
* b.通过虚表索引找到函数地址-->调用<br>

虚函数调用的逻辑是在非静态成员函数的基础之上，多了虚指针检索虚表的转换。

```cpp
Point3d *ptr = &obj;
ptr->normalize();

//内部转换 
(*(ptr->vptr[index]))(ptr)

```
* a.index是normalize函数在虚表中的索引值<br>
* b.第二个ptr表示this指针<br>


### 2.绕过虚表通过静态绑定方式调用

a.上下文确定虚函数具体类型<br>
在派生类的虚函数中调用另一个虚函数时，若可以通过上下文确定具体类型，编译器可以通过*静态绑定*函数调用，避免重复的虚表查找。

```cpp
void Point3d::normalize()
{
    //此处编译器已经知道对象的类型说Point3d
    this->Point3d::magnitude();                 //显式调用另一个虚函数
    //转换成Point3d::magnitude(this) 直接静态绑定
}
```
b.通过对象直接调用<br>
无需查找虚表，只能绑定一个类的实现<br>

c.虚函数通常无法内联，但是在上面的a.b两种情况的静态绑定中，编译器可以内联：<br>

```cpp
//magnitude()是内联虚函数
inline float Point3d::magnitude() const{
    return sqrt(x * x + y * y);
}

//调用代码
float len = obj.magnitude();

//内联展开后
float len = sqrt(obj.x * obj.x + obj.y * obj.y);
```

#### 1).静态多态
通过编译时的类型推导或模板机制实现多态行为，无需运行时类型信息或虚函数表（vtbl）

* a.函数重载(Function Overloading)<br>
    同一作用域内定义多个同名函数，通过参数类型或个数区分。编译器会根据实参类型在编译时选择匹配的函数


* b.运算符重载(Operator Overloading)<br>
    为自定义类型定义运算符。运算符的规则在编译时已经确定

```cpp
class Vector{
    public:
    Vector operator+(const Vector& other){
        //向量加法的实现
    }
}；
Vector v1，v2;
Vector v3 = v1 + v2;  //调用operator+
```

* c.模板(Templates)
    通过泛型编程实现代码复用，模板的实例化在编译时完成,生成类型特化的代码

```cpp
template <typename T>
T max(T a,T b)
{
    return (a > b) ? a : b;
}

int m1 = max(3,5);          //实例化max(int)
double m2 = max(3.23,2.69); //实例化max(double)  
```

#### 2).静态绑定
又称早期绑定，在编译时确定函数调用的具体地址，无需动态查找<br>

```cpp
class Base{
public:
    void func(){
        cout<< "Base::func" <<endl;
    }
};
class Derived ： public Base{
public:
    void func(){
    cout<< "Derived::func" <<endl;
    }
};

Base* obj = new Derived();
obj->func();  //输出Base::func（静态绑定，调用Base::func）
```
无需运行时动态查找，没有运行时间接寻址开销，无法根据运行时对象类型调整行为<br>



## 静态成员函数调用

在引入static member functions之前，C++语言要求所有的member functions都必须经由该 class 的 object 来调用。而实际上，只有当一个或多个 nonstatic data members 在member function中被直接存取时，才需要class object。<br>
Class object提供了this 指针给这种形式的函数调用使用。这个this 指针把“在member func tion中存取的nonstatic class members”绑定于“object内对应的members”之上。如果没有任何一个members被直接存取，事实上就不需要this 指针，因此也就没有必要通过一个class object 来调用一个member function<br>

静态成员函数就是这样的存在，它不依赖类的对象，所以**没有this指针**,所以：<br>
* a.它不能够直接存取其 class中的 nonstatic members<br>
* b.它不能够被声明为 const、volatile或 virtual<br>

```cpp
// 非成员函数
void nonMemberFunc() {}

// 静态成员函数
class MyClass {
public:
    static void staticMemberFunc() {}
};
```
上述的特性使它和非成员函数很相似,于是：<br>
* a.兼容C，C语言库（如X Window系统）通常要求回调函数为普通函数指针，无法直接使用C++的非静态成员函数（因隐含this指针）
* b. 回调逻辑仍封装在类内部,可以过参数间接访问对象实例

```cpp
class GUIHandler {
public:
    static void handleEvent(void* context) {
        GUIHandler* handler = static_cast<GUIHandler*>(context);
        handler->onClick(); // 通过实例指针访问非静态方法
    }
    void onClick() { /* 处理点击事件 */ }
};

// 注册回调
GUIHandler handler;
register_callback(GUIHandler::handleEvent, &handler);
```


