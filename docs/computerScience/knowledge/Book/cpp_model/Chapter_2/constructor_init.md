编译器会一 一操作初始化列表，以适当的顺序在构造函数之内安插初始化操作，这些操作在所有的explicit user code之前

## 1.必须使用成员初始化列表的情况

* a.当初始化一个refrence member时

* b.当初始化一个const member时

* c.当调用一个base class的constructor，而它拥有一组参数时

```cpp
class Word{
public：
    Word();

private:
    String m_name;
    int m_cnt;
}

Word::Word(const std::string& name, int cnt) : m_name(0),m_cnt(0)
{

}

//伪代码  编译器插入在构造函数中的内容
Word::Word(/*this pointer goes here*/)
{
    m_name.String::String(0);  
    m_cnt = 0;
}

```

* d.当调用一个base class的constructor，而它拥有一组参数时


## 2.初始化顺序

成员的初始化顺序是初始化列表的排序吗？
答案是否定的，初始化顺序是成员的声明顺序。 编译器会对初始化列表中的成员初始化重新排序，以符合members的声明顺序

下面这种写法会导致错误：

```cpp
class X{
    int i;
    int j;
public:
    X(int val)
    :j(val),i(j)
    {}
    ...
};
```
由于声明顺序的缘故，初始化列表中的i(j)会比j(val)更早执行<br>
但因为j一开始没有初值，所以i(j)的执行结果导致i无法预知其值<br>
下面这个是正确的：

```cpp
X::X（int val）: j(val)
{
    i = j;
}
```
在执行 j= val，和i= j之前， i已经被编译器初始化完成了





