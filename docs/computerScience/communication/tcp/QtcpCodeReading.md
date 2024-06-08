## QT源代码阅读

### Qtcpsoccket类：
    QTcpSocket类继承自QAbstractSocket，只是简单的定义了一些基本的构造函数和析构函数，构造函数创建一个QTcpSocket对象，初始状态为UnconnectedState。它接受一个可选的父对象指针parent，并将其传递给QObject的构造函数。构造函数还初始化了私有数据成员isBuffered为true。这是为了确保QTcpSocket对象在创建时默认启用缓冲功能。这意味着数据在传输过程中会被缓冲，以提高传输效率和性能。缓冲机制可以减少系统调用的次数，从而提高网络通信的效率。

### QTcpServer类
    QTcpServer类用于创建和管理TCP服务器，提供了监听、接受连接、错误处理网络代理等功能。
    包含了包含了算法、主机地址、列表、指针、抽象套接字引擎、TCP套接字和网络代理等相关类的定义
    1.代理解析函数：用于解析代理设置，根据地址和端口返回合适的代理
      *resolveProxy：解析并返回合适的网络代理
       逻辑：如果地址是回环地址，返回 NoProxy。否则，根据设置的代理或应用程序的代理设置，返回第一个可用的代理
    2.配置创建的套接字：用于配置创建的套接字，使其在Unix系统下可以绑定到已经在TIME_WAIT状态的端口
    *configureCreatedSocket：在Unix系统下，设置套接字选项以允许地址重用
    3.读取通知readNotification：处理读取通知，接受传入的连接并发出相应的信号，循环接受新的连接，直到达到最大连接数或发生错误。
    4.接下来才是QTcpServer类的函数：
      * 监听函数：初始化套接字引擎，绑定地址和端口，并开始监听，如果绑定或监听失败，会设置错误信息并返回false。成功后，设置接收器并启用读取通知。
      *isListening：返回服务器是否正在监听传入连
      *close：关闭服务器并清除所有待处理的连接
      *socketDescriptor：返回服务器使用的本地套接字描述符
      *setSocketDescriptor：设置服务器使用的套接字描述符，并初始化套接字引擎
      *serverPort 和 serverAddress：返回服务器的端口和地址
      *waitForNewConnection：等待传入连接，最多等待msec毫秒。如果连接可用，返回true，否则返回false
      *hasPendingConnections 和 nextPendingConnection：检查是否有待处理的连接以及返回下一个待处理的连接。
      *incomingConnection 处理新的连接，创建一个新的 QTcpSocket 对象，并将其添加到待处理连接列表中。
      *addPendingConnection 


 