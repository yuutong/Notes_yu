
观察者模式含有一个被观察者和多个观察者，是一对多的关系，打个比方，被观察者可以是一个发布消息的电台，而观察者可以是订阅消息的多个人。当电台有新消息发布时，会通知所有订阅的人。而这些订阅的听众会对应作出反应，比如记录消息，或者转发给别人。好处是电台不需要知道具体是谁在订阅，而订阅者可以随时订随时取消。也就是被观察者在自身状态发生变化的时候会通知观察者，所有观察者在得到通知后会进行相应的更新操作。


##### 1. 一对多关系

- *被观察者（发布者）*：一个对象，可以有多个观察者。
- *观察者（订阅者）*：多个对象，观察并响应被观察者的状态变化。

 生活中的比喻：

- *电台（被观察者）*：发布消息的源头。
- *听众（观察者）*：订阅电台消息的人。

##### 3. 工作机制

- *通知机制*：当电台发布新消息时，会通知所有订阅的听众。
- *反应机制*：听众收到通知后，会根据接收到的消息做出相应的反应，比如记录消息、转发消息等。

##### 4. 优点

- *解耦*：电台（被观察者）不需要知道具体有谁在订阅，只需要发布消息。
- *灵活性*：订阅者（观察者）可以随时订阅或取消订阅，增加了系统的灵活性。

##### 5. 代码对应

在代码层面：

- *Subject（被观察者）*：维护观察者列表，并在状态变化时通知观察者。
- *Observer（观察者）*：定义了一个更新接口，用于接收通知并进行相应的操作。

具体代码：

```cpp

// 被观察者接口
class Subject {
public:
    virtual void attach(Observer *observer) = 0; // 增加观察者
    virtual void detach(Observer *observer) = 0; // 移除观察者
    virtual void notify() = 0; // 通知所有观察者
};

// 观察者接口
class Observer {
public:
    virtual void update(const std::string &message) = 0; // 接收通知并更新
};

// 具体的被观察者，电台
class ConcreteSubject : public Subject {
    // 保存观察者列表
    std::vector<Observer *> observers;
    std::string message;

public:
    void attach(Observer *observer) override {
        observers.push_back(observer);
    }

    void detach(Observer *observer) override {
        observers.erase(std::remove(observers.begin(), observers.end(), observer), observers.end());
    }

    void notify() override {
        for (Observer *observer : observers) {
            observer->update(message);
        }
    }

    void setMessage(const std::string &msg) {
        message = msg;
        notify(); // 发布消息，通知所有观察者
    }
};

// 具体的观察者，听众
class ConcreteObserver : public Observer {
    std::string observerName;

public:
    ConcreteObserver(const std::string &name) : observerName(name) {}

    void update(const std::string &message) override {
        std::cout << observerName << " received message: " << message << std::endl;
    }
};
```

当`ConcreteSubject`（电台）发布新消息时，它会通知所有的`ConcreteObserver`（听众），每个听众会根据消息进行相应的操作。

