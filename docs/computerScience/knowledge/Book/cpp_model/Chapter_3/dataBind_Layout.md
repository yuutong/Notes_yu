
## 一.Data Member的绑定

C++在处理全局成员变量和类成员变量的名称冲突时，编译器能正确绑定对象吗？<br>

### 1.早期的问题
在早期的C++编译器中，内联成员函数的定义若出现在类声明中，其函数体内的成员函数绑定可能在类声明未完全被解析时被处理，导致成员绑定错误<br>

```cpp
typedef int length;  //全局类型别名

class Point2d{
public:

    //
    void number(length val){ _val = val};  //参数类型：全局的int
    length number() { return _val;}         //  参数类型：全局的int

private:
    typedef float length;                   //类内部的嵌套类型别名（实际希望绑定到此处）
    length _val;                            //val的类型为float

}；
```
* 参数列表的绑定：<br>
函数参数和返回类型中的 length 在类声明到该函数时即被解析，绑定的是全局的int

* 函数体的绑定：<br>
而函数体内的_val在整个类声明完成后才解析，绑定的是float类型

---->这样导致： 函数的参数和返回值是int，但是函数体里面是float，导致潜在的类型不匹配和逻辑错误

### 2.解决之道

* 1）数据成员前置声明

```cpp
class Point3d{
private:
    typedef float length;               // 嵌套类型前置声明
    length  -val;                       //成员变量前置声明
public:
    void mumber(length val) {_val = val;}  //正确绑定到float
    lengeh mumber() {return _val; }         // 正确绑定到float
}
```
将数据成员放在类声明的起始位置，确保后续成员函数正确绑定

* 2）内联函数外置定义<br>

```cpp
class Point3d{
public:
    void mumber(length val);
    length mumber();

private:
    typedef float length;
    length _val;
};

//类外定义（显式指定作用域）
inline void Point3d::mumber(length val) {_val = val;}
inline Point3d::length Point3d::mumber() {return _val;}

```
将内联函数的定义移到类外，确保类声明完整后再解析

### 2.现代C++的改进

* a **内联函数体的延时绑定**：<br>
类声明中所有的内联函数体的解析被延迟到整个类声明完成之后，此时所有成员（包括嵌套类型）已可见

* b **参数列表即时绑定**:<br>
函数参数列表中的名称在声明时立即解析，若此时嵌套尚未声明，则绑定到外部作用域的同名实体。<br>
参数列表的绑定规则是静态作用域解析，只能看到类内部已经声明的成员和外部作用域的名称<br>

**参数列表仍需要注意声明顺序**:<br>
全局作用域的成员与类的成员同名称时仍要注意,最佳实践：<br>

* 避免名称冲突：少用全局变量，尽量不要使全局成员和类成员同名。<br>
* 显式作用域指定：若必须使用全局同名实体，通过::显式指定作用域。














