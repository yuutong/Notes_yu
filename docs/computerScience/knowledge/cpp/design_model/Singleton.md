
单例模式确保一个类只有一个实例，并提供全局访问点来访问该实例

就像是一个家庭只有一个卫生间，大家都可以用这个卫生间，但不能同时使用

### 单例模式的实现

**通过私有构造函数、静态成员变量，和静态获取实例方法** 实现单例模式。

1. *私有化构造函数*：将类的构造函数设为私有，防止外部直接实例化该类。

2. *静态成员变量*：在类中声明一个静态成员变量来存储唯一实例。

3. *静态获取实例方法*：提供一个静态方法来获取单例实例，确保每次调用都返回同一个实例。

```cpp
#include <iostream>

class Singleton {
private:
    static Singleton* instance;  // 静态成员变量存储唯一实例

    Singleton() {}  // 私有构造函数

public:
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();  // 如果实例不存在，则创建实例
        }
        return instance;  // 返回单例实例
    }

    void showMessage() {
        std::cout << "Hello, I am a Singleton instance!" << std::endl;
    }
};

// 初始化静态成员变量
Singleton* Singleton::instance = nullptr;

int main() {
    Singleton* singleton1 = Singleton::getInstance();
    singleton1->showMessage();

    Singleton* singleton2 = Singleton::getInstance();
    singleton2->showMessage();

    return 0;
}
```

 `Singleton` 类的构造函数是私有的，外部无法直接实例化该类。

 `instance` 是静态成员变量，用于存储唯一实例。

 `getInstance()` 是静态方法，用于获取单例实例。如果实例不存在，则创建实例并返回。

 在 `main` 函数中，通过 `getInstance()` 获取单例实例


**使用静态成员变量来保存单例实例**

当实现单例模式时，可以使用静态成员变量来保存单例实例，确保在整个应用程序中只有一个实例存在。将单例实例声明为类的私有静态成员变量，并通过静态方法来返回该实例。这种方式最简单直接，适合于大多数情况。

```cpp
class Singleton {
private:
    static Singleton* instance;  // 静态成员变量保存单例实例

    Singleton() {}  // 私有构造函数

public:
    static Singleton* getInstance() {
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
};

// 在类外初始化静态成员变量
Singleton* Singleton::instance = nullptr;
```



### 懒汉模式和饿汉模式

是两种常见的单例模式变体

- **懒汉模式**：实例在第一次被请求时才被创建，懒加载。
如果在多线程环境下使用，需要考虑线程安全性。

```cpp
#include <iostream>
#include <mutex>

class LazySingleton {
private:
    static LazySingleton* instance; // 静态成员变量保存单例实例
    static std::mutex mutex; // 互斥锁用于线程安全

    LazySingleton() {} // 私有构造函数，防止外部实例化

public:
    // 获取单例实例的静态方法
    static LazySingleton* getInstance() {
        if (instance == nullptr) { // 检查实例是否已经存在
            std::lock_guard<std::mutex> lock(mutex); // 加锁保证线程安全
            if (instance == nullptr) { // 双重检查，确保只创建一次
                instance = new LazySingleton(); // 创建单例实例
            }
        }
        return instance; // 返回单例实例
    }

    // 示例方法，显示单例实例消息
    void showMessage() {
        std::cout << "Hello, I am a Lazy Singleton instance!" << std::endl;
    }
};

// 静态成员变量初始化为 nullptr
LazySingleton* LazySingleton::instance = nullptr;
// 静态成员变量初始化为默认构造函数
std::mutex LazySingleton::mutex;

int main() {
    // 获取单例实例
    LazySingleton* singleton1 = LazySingleton::getInstance();
    // 调用示例方法，显示消息
    singleton1->showMessage();

    // 再次获取单例实例
    LazySingleton* singleton2 = LazySingleton::getInstance();
    // 调用示例方法，显示消息
    singleton2->showMessage();

    return 0;
}
```


- **饿汉模式**：实例在类加载时就创建，无需懒加载。
这种方式简单直观，但可能会产生资源浪费。

```cpp
#include <iostream>

class EagerSingleton {
private:
    static EagerSingleton* instance; // 静态成员变量保存单例实例

    EagerSingleton() {} // 私有构造函数，防止外部实例化

public:
    // 获取单例实例的静态方法
    static EagerSingleton* getInstance() {
        return instance;
    }

    // 示例方法，显示单例实例消息
    void showMessage() {
        std::cout << "Hello, I am an Eager Singleton instance!" << std::endl;
    }
};

// 类的静态成员变量初始化为单例实例
EagerSingleton* EagerSingleton::instance = new EagerSingleton();

int main() {
    // 获取单例实例
    EagerSingleton* singleton1 = EagerSingleton::getInstance();
    
    // 调用示例方法，显示消息
    singleton1->showMessage();

    return 0;
}
```
饿汉模式通过静态成员变量在类加载时就创建实例，在 main 函数中获取单例实例并调用 showMessage 方法来展示单例模式的应用。

### 线程安全的设计

使用互斥锁、双检锁、局部静态变量等方法确保线程安全性

**1. 互斥锁（Mutex）**

*概念*：使用互斥锁确保在同一时间只有一个线程可以访问实例，避免并发访问引起的问题。
*实现*：通过 `std::mutex` 或其他线程安全的 mutex 类来保护单例的访问。

```cpp
#include <mutex>

class Singleton {
private:
    static Singleton* instance;
    static std::mutex mutex;

    Singleton() {}

public:
    static Singleton* getInstance() {
        std::lock_guard<std::mutex> lock(mutex);
        if (instance == nullptr) {
            instance = new Singleton();
        }
        return instance;
    }
};
```

**2. 双检锁（Double-Checked Locking）**

本质上还是互斥锁

 *概念*：双检锁机制优化了懒汉模式，通过两次检查实例是否为空来减少锁的竞争。
 *实现*：使用两次检查实例是否为空，并且在加锁前后检查来减少锁的开销。


```cpp
class Singleton {
private:
    static Singleton* instance;
    static std::mutex mutex;

    Singleton() {}

public:
    static Singleton* getInstance() {
        if (instance == nullptr) {
            std::lock_guard<std::mutex> lock(mutex);
            if (instance == nullptr) {
                instance = new Singleton();
            }
        }
        return instance;
    }
};
```



**3. 饿汉模式**

*实现*：在饿汉模式中，实例在类加载时就被创建，不存在并发访问问题，不需要额外的线程安全处理。


```cpp
class Singleton {
private:
    static Singleton* instance;

    Singleton() {}

public:
    static Singleton* getInstance() {
        return instance;
    }
};

Singleton* Singleton::instance = new Singleton();
```

**4. 使用局部静态变量（Local Static Variable）**

- *概念*：C++11 引入了线程安全的局部静态变量初始化机制，避免了静态初始化顺序问题。

* 在函数内部声明的静态局部变量只会初始化一次，而不是每次函数调用时都初始化
* C++ 11 引入了线程安全的初始化机制，确保静态局部变量在首次访问时线程安全地进行初始化
* 静态局部变量的线程安全初始化机制使得在需要时才会初始化变量，实现了懒加载的效果
* 避免静态初始化顺序问题：传统的静态变量初始化顺序可能会导致初始化顺序问题，而线程安全的局部静态变量初始化机制解决了这个问题

- *实现*：使用局部静态变量初始化单例实例，确保在多线程环境下安全。


```cpp
class Singleton {
public:
    static Singleton& getInstance() {
        static Singleton instance;
        return instance;
    }
};
```
### 单例模式的优势

- 节省资源：通过控制实例数量，避免了不必要的资源消耗。
- 全局状态管理：单例模式可以用于管理全局状态，确保状态的一致性。
- 线程安全：在多线程环境中，单例模式可以确保线程安全，避免多个线程同时创建实例。
- 简化代码：提供一个全局访问点，简化了代码的复杂性和维护性。


### 懒加载以及代理类

- *懒加载*：延迟加载资源或对象直到需要访问，节约资源和提高性能。
- *代理类*：可以结合懒加载

以CloudCompare中的八叉树（Octree）为例，八叉树代理类和八叉树单例的结合常用于管理和操作大量体素数据，确保在全局环境中只有一个八叉树实例存在，并提供统一的访问接口。


**八叉树代理类和八叉树单例的使用过程**

1. *定义八叉树数据结构*：实现八叉树数据结构和操作方法，用于管理体素数据。

2. *实现八叉树代理类*：创建八叉树代理类，作为对八叉树对象的替代或占位符，提供额外的操作和控制。

3. *将代理类设计为单例*：将八叉树代理类设计为单例模式，确保只有一个代理对象实例存在。

4. *提供全局访问点*：在代理类中提供静态方法来获取八叉树代理类的实例，以便在全局环境中使用。

```cpp
// 八叉树数据结构
class Octree {
    // 实现八叉树数据结构和操作方法
};

// 八叉树代理类
class OctreeProxy {
private:
    static OctreeProxy* instance;
    Octree octree;

    OctreeProxy() {}  // 私有构造函数

public:
    static OctreeProxy* getInstance() {
        if (instance == nullptr) {
            instance = new OctreeProxy();
        }
        return instance;
    }

    void doOperation() {
        // 实现对八叉树的操作
    }
};

OctreeProxy* OctreeProxy::instance = nullptr;

// 在全局环境中使用八叉树代理类的单例
int main() {
    OctreeProxy* proxy = OctreeProxy::getInstance();
    proxy->doOperation();

    return 0;
}
```

在这个示例中，`Octree` 类表示八叉树数据结构，`OctreeProxy` 类作为八叉树的代理类。`OctreeProxy` 类被设计为单例模式，通过静态方法 `getInstance()` 返回唯一的代理实例。在全局环境中，其他类可以通过调用 `OctreeProxy::getInstance()` 来获取八叉树代理对象的唯一实例，并调用方法来操作八叉树数据。

通过将八叉树代理类设计为单例模式，可以确保在整个应用程序中只有一个代理对象实例存在，并提供了全局访问点供其他类使用。这种方式确保了八叉树代理类的唯一性，同时提供了统一的操作接口，方便在全局环境中管理和操作八叉树数据。
