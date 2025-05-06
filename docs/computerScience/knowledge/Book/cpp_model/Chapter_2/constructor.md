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


### 2. 派生自一个base class


### 3.内含一个虚函数


### 4.派生自虚基类
