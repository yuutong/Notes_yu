### C++面向对象模型之关于对象：

##### 虚函数实现：
    1.在C++中使用虚函数来实现多态时，编译器会为每一个有虚函数的类生成一个虚函数表，也叫vtable。vtable是一个存储类中所有虚函数地址的数组。编译器同时也会在每个类
    的对象中添加一个指向vtable的指针vptr（虚函数表指针）。
    2.当通过基类调用虚函数时，编译器会先通过vptr找到vtable，然后在vtable中查找虚
    函数的地址，从而调用正确的函数实现
    假设我们有一个基类Base和一个从Base派生的类Derived：
    `   
    class Base
    {
    public:
        virtual void func()
        {
            cout << "Base func" << endl;
        }
    };

    class Derived : public Base
    {
    public:
        void func() override
        {
            cout << "Derived func" << endl;
        }
    };
    `
    * 创建一个Derived对象并通过Base指针调用func()：
    Base* ptr = new Derived();
    ptr->func();

    编译器会生成以下操作：
        1.通过ptr找到对象的内存。
        2.在对象内存中的固定位置找到vptr。这个位置通常是对象内存的开始位置。
        3.通过vptr找到vtable。
        4.在vtable中找到func的地址。如果ptr指向的是Derived对象，那么这个地址就是Derived::func()。
        5.通过找到的地址调用函数。
    所以，虽然ptr是Base类型的，但是调用的却是Derived类的func()函数。这就是C++中多态的实现原理。

    3.派生对象的内存布局：
    `
    +----------------+
    |   vptr         | --> points to vtable
    +----------------+
    |   base_data    |
    +----------------+
    |   derived_data |
    +----------------+
    `
    如何通过基类指针来访问和操作派生类对象：通过Base指针调用func()时，实际上调用的是Derived::func()，而不是Base::func()。这就是通过vtable实现的。
    







     