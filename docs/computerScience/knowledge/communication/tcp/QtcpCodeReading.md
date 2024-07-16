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
      *,addPendingConnection:新的连接添加到待处理连接列表中,逻辑：将 QTcpSocket 对象添加到 pendingConnections 列表中
      *setMaxPendingConnections : 设置最大待处理连接数,逻辑：设置 maxConnections 的值
      * maxPendingConnections :返回最大待处理连接数,逻辑：返回 maxConnections 的值。
      *serverError:返回最后一次错误的错误码。逻辑：返回 serverSocketError 的值。
      *errorString :返回最后一次错误的描述字符串。逻辑：返回 serverSocketErrorString 的值
      *resumeAccepting :恢复接受新的连接。逻辑：启用读通知。
      *setProxy :功能：设置网络代理。逻辑：设置 proxy 的值
      *proxy :回当前使用的网络代理。逻辑：返回 proxy 的值


### 1. `waitForNewConnection` 是做什么的？
`waitForNewConnection` 是 `QTcpServer` 类中的一个成员函数。这个函数会阻塞当前线程，直到有新的连接到来或超时：

```cpp
bool QTcpServer::waitForNewConnection(int msec = 0, bool* timedOut = nullptr);
```

- `msec` 参数指定了等待新连接的超时时间（以毫秒为单位）；
  - 如果 `msec` 设置为 0，则表示不超时，会一直等待直到有新连接到来。
- `timedOut` 指针用于指示是否因为超时而返回 `false`；如果不需要该信息，可以将其设置为 `nullptr`。

### 2. `waitForNewConnection` 函数可以用在哪些场景中？
`waitForNewConnection` 通常用于以下场景：
- **同步服务器设计**：在你希望使用阻塞模式来处理新的连接而不使用信号和槽的异步机制时。
- **单线程服务器**：在某些简单的单线程服务器实现中，可以使用该方法来等待新连接，然后进行处理。
- **调试和测试**：在调试和测试环境中，使用该函数可以简化逻辑，便于观察和控制连接的处理过程。

### 3. `waitForNewConnection` 函数是否会阻塞整个应用进程的执行？
`waitForNewConnection` **会**阻塞当前调用的线程，直到有新的连接到来或超时。这意味着如果在主线程上调用该函数，将会阻塞整个主事件循环的执行。因此，通常在使用时需要小心，尤其在主线程中调用时要格外注意。

#### 解决方案：
为了避免阻塞主线程，可以考虑以下几种方法：
- **使用子线程**：在子线程中调用 `waitForNewConnection`，从而避免阻塞主线程。
- **异步处理**：使用 `QTcpServer` 的信号 `newConnection()` 来处理新连接，这样可以避免阻塞。

```cpp
connect(server, &QTcpServer::newConnection, this, &YourClass::handleNewConnection);
```

### 4. `waitForNewConnection` 函数返回 `false` 的情况有哪些？
`waitForNewConnection` 返回 `false` 的情况包括但不限于以下几种：

- **超时**：指定的等待时间耗尽，没有新的连接到来。如果传递了 `timedOut` 参数，则该变量会被设置为 `true`。
- **服务器未启动**：即尚未调用 `listen()` 方法或 `listen()` 方法失败。
- **QTcpServer 对象已删除**：如果在等待期间 `QTcpServer` 对象被删除，也会导致返回 `false`。
- **其他错误**：内部错误导致函数执行失败。

### 示例代码

下面是一个简单的示例，展示了如何使用 `waitForNewConnection` 并处理新连接：

```cpp
class MyTcpServer : public QTcpServer
{
public:
    void startServer()
    {
        if (!this->listen(QHostAddress::Any, 1234)) {
            qDebug() << "Server could not start!";
        } else {
            qDebug() << "Server started!";
        }
    }

    void waitForConnections()
    {
        while (this->isListening()) {
            bool timedOut = false;
            if (this->waitForNewConnection(5000, &timedOut)) {
                qDebug() << "New connection received!";
                QTcpSocket *clientSocket = this->nextPendingConnection();
                // Handle new connection
            } else if (timedOut) {
                qDebug() << "Wait timed out, no new connection.";
            } else {
                qDebug() << "Error waiting for new connection.";
            }
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    MyTcpServer server;
    server.startServer();
    server.waitForConnections();

    return a.exec();
}
```

在这个示例中，`waitForConnections` 方法会持续等待新的连接，并在每个循环中处理连接或处理超时情况。



   1. 在 `waitForConnections` 等待新连接时发生错误的情况主要有：
      - 网络问题，如网络断开或者服务器无法访问。
      - 服务器未正确启动，如 `listen()` 方法未被正确调用或者调用失败。
      - `QTcpServer` 对象在等待过程中被删除。
      - 内部错误，如系统资源不足。

    2. 在 `waitForConnections` 中设置超时时间，只需要在调用 `waitForNewConnection` 函数时，传入你希望设置的超时时间（单位为毫秒）即可。例如，`waitForNewConnection(5000)` 就是设置超时时间为5秒。

    3. 使用 `server.errorString()` 函数可以获取到更多的错误信息。这个函数会返回一个描述最后一次发生的网络错误的字符串。



### 几个关于连接的问题

    1. 在 Qt 网络编程中，`QTcpSocket` 类是用来处理 TCP 连接的主要类。当 `QTcpServer` 接收到新的客户端连接时，它会创建一个与该连接相关联的 `QTcpSocket` 对象。你可以通过这个对象来读取和发送数据，处理连接的各种状态。

    5. `QTcpSocket` 对象的主要方法包括：
    - `read()` 和 `readAll()`：用于读取从客户端发送过来的数据。
    - `write()`：用于向客户端发送数据。
    - `connectToHost()`：用于连接到服务器。
    - `disconnectFromHost()`：用于断开与服务器的连接。

    6. `readyRead` 信号在有数据可读时被发出，`disconnected` 信号在连接断开时被发出。将这些信号与自定义的槽函数连接起来，可以让你的程序在这些事件发生时执行特定的操作，如读取数据、处理断开连接等，这对于网络编程来说是非常有用的。
    7. 使用 `QTcpServer` 类来处理 TCP 连接的基本步骤如下：

    - 创建一个 `QTcpServer` 对象。
    - 调用 `listen()` 方法让服务器开始监听一个特定的 IP 地址和端口，等待客户端的连接。
    - 当有客户端尝试连接时，`QTcpServer` 会发出一个 `newConnection` 信号。你可以将这个信号与一个自定义的槽函数连接起来，以处理新的连接。
    - 在这个槽函数中，你可以调用 `nextPendingConnection()` 方法获取一个 `QTcpSocket` 对象，这个对象代表了客户端的连接。你可以通过这个对象来与客户端进行通信。

    8. `QTcpSocket` 对象的以下方法可以用来读取客户端发送过来的数据：

    - `read()`：读取一定数量的字节，并返回这些字节组成的字节数组。
    - `readAll()`：读取所有可用的字节，并返回这些字节组成的字节数组。
    - `readLine()`：读取一行文本，直到遇到一个换行符。

    9. 在网络编程中，除了 `QTcpSocket` 用于处理 TCP 连接外，Qt 还提供了其他类的套接字来处理不同的数据：

    - `QUdpSocket`：用于处理 UDP 连接。UDP 是一种无连接的协议，数据的发送和接收都是独立的，不需要建立和断开连接。`QUdpSocket` 提供了 `writeDatagram()` 和 `readDatagram()` 方法来发送和接收数据。

    - `QSslSocket`：用于处理 SSL 加密的 TCP 连接。`QSslSocket` 是 `QTcpSocket` 的子类，提供了与 SSL/TLS 相关的功能，如加密、证书验证等。

    - `QWebSocket`：用于处理 WebSocket 连接。WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。`QWebSocket` 提供了 `sendTextMessage()`、`sendBinaryMessage()` 和 `readMessage()` 等方法来发送和接收数据。



##### 几个PendingConnection相关
###### `hasPendingConnections()`
- **功能**：检查当前是否有挂起的连接等待接受。
- **签名**：`bool hasPendingConnections() const;`
- **返回值**：如果有挂起的连接，返回 `true`；否则返回 `false`。

###### `nextPendingConnection()`
- **功能**：获取下一个挂起的连接。
- **签名**：`QTcpSocket* nextPendingConnection();`
- **返回值**：返回一个指向挂起连接的 `QTcpSocket` 对象的指针。如果没有挂起的连接，则返回 `nullptr`。
- **注意**：调用此函数会返回连接，并将其从挂起列表中移除。

###### `incomingConnection()`
- **功能**：虚函数，在有新连接到来时调用，实现自定义处理新连接的行为。
- **签名**：`virtual void incomingConnection(qintptr socketDescriptor);`
- **参数**：`socketDescriptor` 是标识新连接的套接字描述符。

###### `addPendingConnection()`
- **功能**：将一个现有的套接字添加到挂起连接队列中。
- **签名**：`void addPendingConnection(QTcpSocket* socket);`
- **参数**：`socket` 是指向要添加的 `QTcpSocket` 对象的指针。

###### `setMaxPendingConnections()`
- **功能**：设置最大可以同时等待的挂起连接数。
- **签名**：`void setMaxPendingConnections(int numConnections);`
- **参数**：`numConnections` 是允许的最大挂起连接数。

###### `maxPendingConnections()`
- **功能**：获取当前设置的最大挂起连接数。
- **签名**：`int maxPendingConnections() const;`
- **返回值**：返回最大挂起连接数。

##### 2. 函数使用场景

###### `hasPendingConnections()`
- **场景**：通常在服务器的事件循环中使用，以检查是否有新的未处理连接。例如，当 `newConnection()` 信号发出时，可以使用此函数。

###### `nextPendingConnection()`
- **场景**：在有挂起连接时，获取并处理这些连接。通常在信号槽机制中使用，例如在处理 `newConnection()` 信号时。

###### `incomingConnection()`
- **场景**：当你需要自定义处理新连接时，可以重写此虚函数。比如，可以派生一个类，并在其中实现特定的连接处理逻辑。

###### `addPendingConnection()`
- **场景**：在一些高级用途中，你可能需要手动管理连接。例如，通过socket拆分创建不同类型的连接，然后将它们添加到挂起队列中以便后续处理。

###### `setMaxPendingConnections()` 和 `maxPendingConnections()`
- **场景**：管理服务器的连接容量。例如，限制服务器只能处理一定数量的挂起连接，以便流量控制或减轻服务器压力。

##### 3. 阻塞行为

- **不会阻塞整个应用进程的执行**。这些函数在设计上都非常轻量级，不会阻塞主事件循环。
  - `hasPendingConnections() `和 `nextPendingConnection()` 这些查询和获取挂起连接的函数，为简单函数式调用;
  - `incomingConnection()` 是一个回调函数，专门用于异步事件到来的处理。

##### 4. 函数返回false或其他错误的情况

###### `hasPendingConnections()`
- **返回 `false` 的情况**：没有挂起的连接。

###### `nextPendingConnection()`
- **返回 `nullptr` 的情况**：没有挂起的连接。

###### `incomingConnection()`
- **错误情况**：具体行为取决于函数的重写实现。默认实现不会返回错误，但重写时可能会产生异常。

###### `addPendingConnection()`
- **错误情况**：如果 `socket` 为 `nullptr` 或已经存在于挂起队列中，可能导致逻辑错误。

###### `setMaxPendingConnections()`
- **不会返回值**，直接设置参数。

###### `maxPendingConnections()`
- **不会返回错误**，直接返回配置值。

###### 示例代码

```cpp
class MyTcpServer : public QTcpServer
{
protected:
    void incomingConnection(qintptr socketDescriptor) override {
        QTcpSocket *socket = new QTcpSocket(this);
        if (socket->setSocketDescriptor(socketDescriptor)) {
            addPendingConnection(socket);
            emit newConnection();
        } else {
            delete socket;
        }
    }
};

int main(int argc, char *argv[]) {
    QCoreApplication a(argc, argv);

    MyTcpServer server;
    server.listen(QHostAddress::Any, 1234);

    if (server.hasPendingConnections()) {
        QTcpSocket *clientSocket = server.nextPendingConnection();
        // 处理新连接
    }

    return a.exec();
}
```

在这个例子中，自定义的 `incomingConnection` 函数被重写，用于处理新的连接。`hasPendingConnections` 和 `nextPendingConnection` 被用来处理挂起的连接。



### QTcpServerPrivate类：
    采用的是把一个类的私有实现都放在一个单独的类中，然后在公共类中用一个指向这个私有类的指针来访问这些实现。这种模式被称为 Pimpl（"Pointer to implementation"）或者编译器防火墙
    QTcpServerPrivate 的实现通常在 QT 源代码的 qtbase/src/network/socket/qtcpserver_p.h 和 qtcpserver.cpp 文件中。这两个文件分别包含了 QTcpServerPrivate 的声明和定义

    - `pendingConnections`：这是一个 `QTcpSocket` 对象的列表，存储了所有等待处理的连接。
    - `port` 和 `address`：这两个成员分别存储了服务器监听的端口和地址。
    - `socketType` 和 `state`：这两个成员分别存储了套接字的类型和状态。
    - `socketEngine`：这是一个指向 `QAbstractSocketEngine` 对象的指针，用于处理底层的套接字操作。
    - `serverSocketError` 和 `serverSocketErrorString`：这两个成员分别存储了最后一次发生的错误的类型和描述。
    - `maxConnections`：这个成员存储了服务器可以接受的最大连接数。
    - `proxy`：这个成员存储了服务器的网络代理设置。
    此外，还定义了一些方法，如 `readNotification`、`closeNotification` 等，这些方法是从 `QAbstractSocketEngineReceiver` 类继承过来的，用于处理套接字的各种事件。例如，当有数据可读时，`readNotification` 方法会被调用。

    1. `pendingConnections` 是一个 `QTcpSocket` 对象的列表，用于存储所有等待处理的客户端连接。每当有新的客户端连接到服务器时，就会创建一个新的 `QTcpSocket` 对象，并将其添加到 `pendingConnections` 列表中。

    2. `maxConnections` 是一个整数，用于存储服务器可以接受的最大连接数。如果新的连接请求超过这个数，那么这些连接将不会被接受。这可以防止服务器在面对大量的连接请求时过载。

    3. `readNotification` 方法是用来处理有数据可读的事件的。当 `QTcpSocket` 对象接收到新的数据时，就会调用这个方法。你可以在这个方法中读取和处理数据。例如，你可以调用 `QTcpSocket` 的 `read()` 或 `readAll()` 方法来读取数据。



### QSctpSocket类 
     QTcpSocket 的公开继承类。这个类提供了一些用于处理 SCTP（流控制传输协议）套接字的方法，列方法显示了 QSctpSocket 类是如何管理其底层连接的，包括读写数据报、通道管理以及错误处理等。结合这些方法可以实现对 SCTP 协议的支持，并且允许在多通道模式下进行高级别的网络传输。   

    - 构造函数：`QSctpSocket(QObject *parent = nullptr)`。这是一个显式构造函数，接受一个 QObject 指针作为其父对象。

    - 析构函数：`~QSctpSocket()`。当对象被销毁时，这个函数会被调用。

    - `close()` 和 `disconnectFromHost()` 函数：这两个函数都被覆盖了，并且它们在 QSctpSocket 类中有自己的实现。

    - `setMaximumChannelCount(int count)` 和 `maximumChannelCount() const`：这两个函数用于设置和获取 SCTP 套接字的最大通道数。

    - `isInDatagramMode() const`：这个函数返回一个布尔值，表示套接字是否处于数据报模式。

    - `readDatagram()` 和 `writeDatagram(const QNetworkDatagram &datagram)`：这两个函数用于读取和写入网络数据报。

    - `readData(char *data, qint64 maxlen)` 和 `readLineData(char *data, qint64 maxlen)`：这两个函数被覆盖了，并且它们在 QSctpSocket 类中有自己的实现。

    此外，这个类还使用了 `Q_DECLARE_PRIVATE(QSctpSocket)` 宏来声明其私有成员。这是 QT 的一种常见做法，用于实现类的数据隐藏和二进制兼容性。

    请注意，这个类的实现依赖于你的 QT 版本是否支持 SCTP，这由 `QT_NO_SCTP` 宏来决定。如果 QT 不支持 SCTP，或者你正在使用的是 QDoc 文档生成器，那么这个类将不会被定义。

    1. 除了 `readDatagram` 和 `writeDatagram` 函数，`QSctpSocket` 类还从其父类 `QTcpSocket` 继承了一些用于读取和写入网络数据包的函数，如 `readData(char *data, qint64 maxlen)` 和 `writeData(const char *data, qint64 len)`。这些函数处理的是字节流，而不是数据报。

    2. 你可以使用 `QSctpSocket` 类的 `isInDatagramMode()` 函数来确定套接字是否处于数据报模式。如果这个函数返回 `true`，那么套接字处于数据报模式；如果返回 `false`，那么套接字处于流模式。

    3. `QSctpSocket` 类的 `writeDatagram` 函数在写入数据报时可能会遇到一些失败情况，包括但不限于：
    - 网络连接中断：如果网络连接被中断，数据报将无法发送。
    - 数据报过大：如果数据报的大小超过了网络的最大传输单元（MTU），那么数据报可能无法成功发送。
    - 套接字未连接：如果套接字未连接到任何主机，那么无法发送数据报。
    - 系统资源不足：如果系统资源（如内存）不足，那么可能无法创建或发送数据报。   
    当 `writeDatagram` 函数失败时，它会返回 `false`，并且可以通过 `QSctpSocket` 类的 `error()` 函数来获取更具体的错误信息。
    4. `QSctpSocket` 从 `QTcpSocket` 继承了以下用于读取和写入网络数据包的函数：
    - `write(const char *data, qint64 maxSize)`：将数据写入套接字。返回实际写入的字节数。如果没有错误发生，返回的值将等于 maxSize；否则返回 -1。
    - `read(char *data, qint64 maxSize)`：从套接字读取最多 maxSize 字节的数据，并将其存储到数据中。返回实际读取的字节数，如果没有可用数据，则返回 -1。
    - `readAll()`：从套接字读取所有剩余的字节，并返回一个字节数组，包含了读取的数据。
    - `write(const QByteArray &byteArray)`：将字节数组中的数据写入套接字。返回实际写入的字节数。

    5. `QSctpSocket` 的 `writeDatagram` 函数不支持同时发送多个数据报。每次调用此函数只会发送一个数据报。如果你需要发送多个数据报，你需要多次调用此函数。

    6. 如果数据报过大，超过了网络的最大传输单元（MTU），你需要在应用层手动将数据报分割为多个较小的数据报。例如，你可以将大的数据报分割为多个小的字节数组，然后对每个字节数组调用 `writeDatagram` 函数。注意，接收端也需要进行相应的处理，以便正确地重新组装数据报。

### 分析 QSctpSocket.cpp源码
    包含QSctpSocketPrivate 类的函数实现
    1.canReadNotification：处理数据报的读取，在数据到来时进行处理。如果超时或连接关闭则设置错误状态。
    逻辑：调用 socketEngine->readDatagram 读取数据，如果读取成功则将数据存储在 readBuffers 中，并在 header.endOfRecord 标志位为真时处理完整的数据报。
    2.writeToSocket：处理数据报的写入操作。
    逻辑：
    检查是否为数据报模式，如果是则在循环中遍历 writeBuffers，并调用 socketEngine->writeDatagram 将数据写出。
    如果写入成功，则更新缓冲区。否则根据失败类型处理错误。
    代码末尾禁用写通知，除非处于 ClosingState 状态。

#####  QSctpSocket 类：
     1.readData：从当前读通道读取数据。
     逻辑：清除当前读通道的头部信息，然后调用基类 QTcpSocket::readData 函数
     2.从当前读通道读取一行数据。
     逻辑：清除当前读通道的头部信息，然后调用基类 QTcpSocket::readLineData 函数
     3.close：关闭套接字连接。
     逻辑：调用基类 QTcpSocket::close() 函数关闭连接，同时清除 readHeaders 中的头部信息。
     4.disconnectFromHost：断开与主机的连接。
     逻辑：调用基类 QTcpSocket::disconnectFromHost() 函数，如果断开成功且状态为 UnconnectedState，则清除挂起的数据报和写头部信息。
**QSctpSocket 数据报（Datagram）相关方法**
    *readDatagram：从当前读通道读取数据报并返回。
    逻辑：检查当前通道是否可读且处于数据报模式，如果不满足条件则返回无效的数据报。读取头部信息和数据段，将其封装成 QNetworkDatagram 对象返回，并从头部队列中移除已读取的头部
    *writeDatagram：将一个数据报写入当前写通道缓冲区。
    逻辑：
    检查套接字是否在可写状态且处于连接状态，否则返回 false。
    检查数据报是否为空，如果为空则返回 false。
    将数据报的头部信息加入头部队列，将数据加入缓冲区。
    启用写通知，并返回 true 表示操作成功。
**QSctpSocket 道和模式相关方法**    
   *setMaximumChannelCount：设置最大通道数量。
   逻辑：只能在套接字处于未连接状态时设置。将 count 值与最小值 -1 比较取最大值，并赋值给 maximumChannelCount。
   *isInDatagramMode：检查当前套接字是否处于数据报模式。
    逻辑：返回一个布尔值，只有 maximumChannelCount 不等于 -1 且 isBuffered 为 true 时为真。
   *configureCreatedSocket：配置已创建的套接字。
    逻辑：设置套接字引擎的 MaxStreamsSocketOption 选项，根据 maximumChannelCount 的值来决定使用的通道数


### QStcpServer类：

`QSctpServer` 类是继承自 `QTcpServer` 的一个专门用于 SCTP 协议的服务器类。通过分析其头文件可以了解该类的构造、析构、主要方法以及保护和私有数据的使用。下面

#### 头文件保护和命名空间

- `#ifndef QSCTPSERVER_H` 和 `#define QSCTPSERVER_H` 用于头文件包含保护。
- `QT_BEGIN_NAMESPACE` 和 `QT_END_NAMESPACE` 包裹整个类定义确保类在 `QT` 命名空间内定义。

#### 条件编译

- `#if !defined(QT_NO_SCTP) || defined(Q_CLANG_QDOC)` 条件编译用于确保只有在支持 SCTP 协议时编译此部分代码。

#### 前向声明

- `class QSctpServerPrivate;` 和 `class QSctpSocket;` 是前向声明，用于减少头文件之间的依赖并加快编译速度。

#### 类定义

- `class Q_NETWORK_EXPORT QSctpServer : public QTcpServer` 表示 `QSctpServer` 类公开继承自 `QTcpServer`，并且使用 `Q_NETWORK_EXPORT` 进行符号导出。这允许该类或其成员可以被其他共享库或应用程序访问。

#### 构造函数和析构函数

- `explicit QSctpServer(QObject *parent = nullptr);` 表示构造函数。
  - 使用 `explicit` 关键字的构造函数防止隐式转换。
  - `QObject *parent` 表示可以传入一个父对象，用来管理对象的生命周期。
- `virtual ~QSctpServer();` 是虚析构函数，确保正确释放资源。

#### 公有方法

- `void setMaximumChannelCount(int count);`
  - **功能**：设置最大通道数量。
  - **参数**：`count` 表示最大通道数量。
  
- `int maximumChannelCount() const;`
  - **功能**：返回最大通道数量。
  - **返回值**：整型表示最大通道数量。
  
- `QSctpSocket *nextPendingDatagramConnection();`
  - **功能**：获取下一个待处理的数据报连接。
  - **返回值**：指向 `QSctpSocket` 对象的指针。
  - **用途**：用于从挂起连接队列中获取并处理一个新的数据报连接。类似于 `QTcpServer` 中的 `nextPendingConnection()`。

#### 保护方法

- `void incomingConnection(qintptr handle) Q_DECL_OVERRIDE;`
  - **功能**：重写基类的 `incomingConnection` 方法，用于处理传入连接。
  - **参数**：`qintptr handle` 是新连接的套接字描述符。
  - **关键字**：`Q_DECL_OVERRIDE` 表示该方法重写了基类的虚方法。
  - **用途**：用于在接收到新连接时进行处理和管理。

#### 私有部分

- `Q_DISABLE_COPY(QSctpServer)` 禁用拷贝构造函数和赋值运算符。防止类对象被拷贝。
- `Q_DECLARE_PRIVATE(QSctpServer)` 声明私有数据类的访问接口，用于访问和管理私有数据。`d_ptr` 指针指向实际数据。

### `QSctpServer` 的总体功能

- **主要功能**：`QSctpServer` 类用于监听和处理基于 SCTP 协议的数据报连接。
               -最大通道管理：能够设置和获取最大通道数量。
                -传入连接处理：重写 incomingConnection 方法处理新的传入连接，并创建 QSctpSocket。
                -数据报连接管理：提供了 nextPendingDatagramConnection 方法来获取挂起的数据报模式连接。
                -套接字配置：私有方法 configureCreatedSocket 提供了对套接字选项的配置支持。
- **继承**：继承自 `QTcpServer`，因此保留了 `QTcpServer` 的大部分功能，同时增加了对 SCTP 协议的支持。
- **增强功能**：包括最大通道数的设置和管理，新数据报连接的处理，以及业已重写的保护方法 `incomingConnection`。

### 使用场景

- **网络服务器**：`QSctpServer` 常用于需要多通道管理的网络服务器，这些服务器需要处理以 SCTP 协议传输的数据报。
- **高性能网络应用**：适用于需要管理多个并发连接和高数据吞吐量的应用程序，实现对 SCTP 协议的支持。
- **特殊网络协议**：用于那些需要高可靠性和顺序传输特性的专用服务场景。

综上所述，`QSctpServer` 类通过继承和扩展 `QTcpServer`，为其增加了对 SCTP 协议的支持。关键函数如 `setMaximumChannelCount` 和 `nextPendingDatagramConnection` 帮助开发者有效地管理和处理多通道 SCTP 连接。


### `QAbstractSocket` 类分析

`QAbstractSocket` 是一个抽象类，继承自 `QIODevice`，用于处理网络套接字的基本操作。它定义了多种枚举类型、信号和槽函数，以及一系列虚函数，供具体的套接字类（如 `QTcpSocket` 和 `QUdpSocket`）继承和实现。

#### 枚举类型
- **SocketType**：定义了套接字的类型，包括 `TcpSocket`、`UdpSocket`、`SctpSocket` 和 `UnknownSocketType`。
- **NetworkLayerProtocol**：定义了网络层协议，包括 `IPv4Protocol`、`IPv6Protocol`、`AnyIPProtocol` 和 `UnknownNetworkLayerProtocol`。
- **SocketError**：定义了套接字可能遇到的错误类型，如 `ConnectionRefusedError`、`RemoteHostClosedError`、`HostNotFoundError` 等。
- **SocketState**：定义了套接字的状态，如 `UnconnectedState`、`HostLookupState`、`ConnectingState`、`ConnectedState`、`BoundState`、`ListeningState` 和 `ClosingState`。
- **SocketOption**：定义了套接字的选项，如 `LowDelayOption`、`KeepAliveOption`、`MulticastTtlOption` 等。
- **BindFlag**：定义了绑定标志，如 `DefaultForPlatform`、`ShareAddress`、`DontShareAddress` 和 `ReuseAddressHint`。
- **PauseMode**：定义了暂停模式，如 `PauseNever` 和 `PauseOnSslErrors`。

#### 构造函数和析构函数
- **QAbstractSocket(SocketType socketType, QObject *parent)**：构造函数，初始化套接字类型和父对象。
- **virtual ~QAbstractSocket()**：虚析构函数，销毁套接字对象。

#### 主要成员函数
- **resume()**：继续操作，如代理认证或SSL错误后继续。
- **PauseModes pauseMode() const**：返回当前的暂停模式。
- **void setPauseMode(PauseModes pauseMode)**：设置暂停模式。
- **bool bind(const QHostAddress &address, quint16 port = 0, BindMode mode = DefaultForPlatform)**：绑定到指定地址和端口。
- **bool bind(quint16 port = 0, BindMode mode = DefaultForPlatform)**：绑定到指定端口。
- **virtual void connectToHost(const QString &hostName, quint16 port, OpenMode mode = ReadWrite, NetworkLayerProtocol protocol = AnyIPProtocol)**：连接到指定主机名和端口。
- **virtual void connectToHost(const QHostAddress &address, quint16 port, OpenMode mode = ReadWrite)**：连接到指定地址和端口。
- **virtual void disconnectFromHost()**：断开与主机的连接。
- **bool isValid() const**：检查套接字是否有效。
- **qint64 bytesAvailable() const Q_DECL_OVERRIDE**：返回可读取的字节数。
- **qint64 bytesToWrite() const Q_DECL_OVERRIDE**：返回待写入的字节数。
- **bool canReadLine() const Q_DECL_OVERRIDE**：检查是否可以读取一行。
- **quint16 localPort() const**：返回本地端口。
- **QHostAddress localAddress() const**：返回本地地址。
- **quint16 peerPort() const**：返回对等端口。
- **QHostAddress peerAddress() const**：返回对等地址。
- **QString peerName() const**：返回对等主机名。
- **qint64 readBufferSize() const**：返回读取缓冲区大小。
- **virtual void setReadBufferSize(qint64 size)**：设置读取缓冲区大小。
- **void abort()**：中止当前操作。
- **virtual qintptr socketDescriptor() const**：返回套接字描述符。
- **virtual bool setSocketDescriptor(qintptr socketDescriptor, SocketState state = ConnectedState, OpenMode openMode = ReadWrite)**：设置套接字描述符。
- **virtual void setSocketOption(QAbstractSocket::SocketOption option, const QVariant &value)**：设置套接字选项。
- **virtual QVariant socketOption(QAbstractSocket::SocketOption option)**：返回套接字选项。
- **SocketType socketType() const**：返回套接字类型。
- **SocketState state() const**：返回套接字状态。
- **SocketError error() const**：返回套接字错误。
- **void close() Q_DECL_OVERRIDE**：关闭套接字。
- **bool isSequential() const Q_DECL_OVERRIDE**：检查是否是顺序设备。
- **bool atEnd() const Q_DECL_OVERRIDE**：检查是否到达末尾。
- **bool flush()**：刷新套接字。
- **virtual bool waitForConnected(int msecs = 30000)**：等待连接，最多等待指定毫秒数。
- **bool waitForReadyRead(int msecs = 30000) Q_DECL_OVERRIDE**：等待可读，最多等待指定毫秒数。
- **bool waitForBytesWritten(int msecs = 30000) Q_DECL_OVERRIDE**：等待字节写入，最多等待指定毫秒数。
- **virtual bool waitForDisconnected(int msecs = 30000)**：等待断开连接，最多等待指定毫秒数。

#### 信号
- **void hostFound()**：主机找到信号。
- **void connected()**：连接成功信号。
- **void disconnected()**：断开连接信号。
- **void stateChanged(QAbstractSocket::SocketState)**：状态改变信号。
- **void error(QAbstractSocket::SocketError)**：错误信号。
- **void proxyAuthenticationRequired(const QNetworkProxy &proxy, QAuthenticator *authenticator)**：代理认证信号。

#### 保护成员函数
- **qint64 readData(char *data, qint64 maxlen) Q_DECL_OVERRIDE**：读取数据。
- **qint64 readLineData(char *data, qint64 maxlen) Q_DECL_OVERRIDE**：读取一行数据。
- **qint64 writeData(const char *data, qint64 len) Q_DECL_OVERRIDE**：写入数据。
- **void setSocketState(SocketState state)**：设置套接字状态。
- **void setSocketError(SocketError socketError)**：设置套接字错误。
- **void setLocalPort(quint16 port)**：设置本地端口。
- **void setLocalAddress(const QHostAddress &address)**：设置本地地址。
- **void setPeerPort(quint16 port)**：设置对等端口。
- **void setPeerAddress(const QHostAddress &address)**：设置对等地址。
- **void setPeerName(const QString &name)**：设置对等主机名。

#### 私有成员函数
- **Q_DECLARE_PRIVATE(QAbstractSocket)**：声明私有数据成员。
- **Q_DISABLE_COPY(QAbstractSocket)**：禁用拷贝构造函数和赋值操作符。

#### 总结
`QAbstractSocket` 类提供了一个抽象接口，用于处理网络套接字的基本操作。它定义了多种枚举类型、信号和槽函数，以及一系列虚函数，供具体的套接字类（如 `QTcpSocket` 和 `QUdpSocket`）继承和实现。通过这些接口，开发者可以方便地进行网络通信操作。

### bind()函数：
   `bind()` 函数在 `QAbstractSocket` 类中用于将套接字绑定到指定的地址和端口。这个操作通常在服务器端套接字中使用，以便监听来自特定地址和端口的连接请求。
    ```cpp
    bool bind(const QHostAddress &address, quint16 port = 0, BindMode mode = DefaultForPlatform);
    bool bind(quint16 port = 0, BindMode mode = DefaultForPlatform);
    ```
    - **address**：要绑定的 `QHostAddress` 对象，表示IP地址。
    - **port**：要绑定的端口号，默认为0。如果端口号为0，系统会自动选择一个可用的端口。
    - **mode**：绑定模式，默认为 `DefaultForPlatform`。可以是以下值之一：
    - `DefaultForPlatform`：平台默认行为。
    - `ShareAddress`：允许其他套接字绑定到相同的地址和端口。
    - `DontShareAddress`：不允许其他套接字绑定到相同的地址和端口。
    - `ReuseAddressHint`：提示操作系统重用地址。
    - **bool**：如果绑定成功，返回 `true`；否则返回 `false`

    - **服务器端套接字**：在服务器端使用 `bind()` 函数将套接字绑定到特定的地址和端口，以便监听来自客户端的连接请求。
    - **多播和广播**：在多播和广播应用中，使用 `bind()` 函数将套接字绑定到特定的多播地址或广播地址。

    ```cpp
    QAbstractSocket *socket = new QAbstractSocket(QAbstractSocket::TcpSocket, this);
    if (socket->bind(QHostAddress::Any, 12345)) {
        // 绑定成功，可以开始监听连接请求
    } else {
        // 绑定失败，处理错误
    }
    ```
    通过 `bind()` 函数，开发者可以将套接字绑定到特定的地址和端口，如果绑定成功，我们可以开始监听连接请求；如果绑定失败，我们需要处理错误。从而控制套接字的网络通信行为。

    -使用 bind() 函数时，可以绑定到任何地址和端口。具体来说：
    绑定到任何地址：可以使用 QHostAddress::Any 作为地址参数，这样套接字将绑定到所有可用的网络接口。
    绑定到特定地址：可以使用具体的 QHostAddress 对象来绑定到特定的IP地址。
    绑定到任何端口：可以将端口参数设置为 0，这样系统会自动选择一个可用的端口。
    绑定到特定端口：可以指定一个具体的端口号来绑定。







































 