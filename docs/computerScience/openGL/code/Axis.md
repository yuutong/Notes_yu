使用C++和Qt来实现一个带有3D坐标系的OpenGL窗口，并实现旋转和缩放功能。参考CloudCompare中的`ccGLWindow.cpp`类来编写这个类。

以下是实现步骤：

1. 创建一个Qt窗口类，包含OpenGL的初始化和基本设置。
2. 实现渲染3D坐标系的函数。
3. 实现鼠标交互功能，包括左键旋转和中键缩放。

我们从头开始，逐步实现这些功能。

### 步骤 1: 创建Qt OpenGL窗口类

首先，确保你已经安装了Qt库和OpenGL库。你可以在Qt Creator中创建一个新的Qt Widgets Application项目。

接着，创建一个新的类`OpenGLWindow`，继承自`QOpenGLWidget`和`QOpenGLFunctions`，并在其中实现基本的OpenGL设置。

```cpp
// OpenGLWindow.h
#ifndef OPENGLWINDOW_H
#define OPENGLWINDOW_H

#include <QOpenGLWidget>
#include <QOpenGLFunctions>
#include <QMouseEvent>
#include <QWheelEvent>
#include <QMatrix4x4>

class OpenGLWindow : public QOpenGLWidget, protected QOpenGLFunctions
{
    Q_OBJECT

public:
    OpenGLWindow(QWidget *parent = nullptr);
    ~OpenGLWindow();

protected:
    void initializeGL() override;
    void resizeGL(int w, int h) override;
    void paintGL() override;

    void mousePressEvent(QMouseEvent *event) override;
    void mouseMoveEvent(QMouseEvent *event) override;
    void wheelEvent(QWheelEvent *event) override;

private:
    void drawAxes(float scale);
    void adjustAxes(const QVector3D &objBounds);

    float yaw, pitch, fov;
    QPoint lastMousePosition;
    QMatrix4x4 model, view, projection;
};

#endif // OPENGLWINDOW_H
```

```cpp
// OpenGLWindow.cpp
#include "OpenGLWindow.h"
#include <QOpenGLShaderProgram>
#include <QOpenGLBuffer>

OpenGLWindow::OpenGLWindow(QWidget *parent)
    : QOpenGLWidget(parent),
      yaw(-90), pitch(0), fov(45)
{
}

OpenGLWindow::~OpenGLWindow()
{
}

void OpenGLWindow::initializeGL()
{
    initializeOpenGLFunctions();
    glEnable(GL_DEPTH_TEST);
}

void OpenGLWindow::resizeGL(int w, int h)
{
    glViewport(0, 0, w, h);
    projection.setToIdentity();
    projection.perspective(fov, float(w) / float(h), 0.1f, 100.0f);
}

void OpenGLWindow::paintGL()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    view.setToIdentity();
    view.lookAt(QVector3D(5, 5, 5), QVector3D(0, 0, 0), QVector3D(0, 1, 0));
    model.setToIdentity();
    model.rotate(pitch, 1, 0, 0);
    model.rotate(yaw, 0, 1, 0);

    QMatrix4x4 mvp = projection * view * model;

    drawAxes(20.0f);
}

void OpenGLWindow::mousePressEvent(QMouseEvent *event)
{
    lastMousePosition = event->pos();
}

void OpenGLWindow::mouseMoveEvent(QMouseEvent *event)
{
    if (event->buttons() & Qt::LeftButton)
    {
        float dx = event->x() - lastMousePosition.x();
        float dy = event->y() - lastMousePosition.y();
        yaw += dx * 0.5f;
        pitch -= dy * 0.5f;

        if (pitch > 89.0f) pitch = 89.0f;
        if (pitch < -89.0f) pitch = -89.0f;

        lastMousePosition = event->pos();
        update();
    }
}

void OpenGLWindow::wheelEvent(QWheelEvent *event)
{
    fov -= event->angleDelta().y() / 120.0f;
    if (fov < 1.0f) fov = 1.0f;
    if (fov > 45.0f) fov = 45.0f;
    projection.setToIdentity();
    projection.perspective(fov, float(width()) / float(height()), 0.1f, 100.0f);
    update();
}

void OpenGLWindow::drawAxes(float scale)
{
    glBegin(GL_LINES);
    // X axis (red)
    glColor3f(1.0f, 0.0f, 0.0f);
    glVertex3f(0, 0, 0);
    glVertex3f(scale, 0, 0);
    // Y axis (green)
    glColor3f(0.0f, 1.0f, 0.0f);
    glVertex3f(0, 0, 0);
    glVertex3f(0, scale, 0);
    // Z axis (blue)
    glColor3f(0.0f, 0.0f, 1.0f);
    glVertex3f(0, 0, 0);
    glVertex3f(0, 0, scale);
    glEnd();
}

void OpenGLWindow::adjustAxes(const QVector3D &objBounds)
{
    float maxBound = std::max({objBounds.x(), objBounds.y(), objBounds.z()});
    drawAxes(maxBound * 1.1f);
}
```

### 主窗口

最后，在主窗口中创建并显示这个OpenGL窗口。

```cpp
// main.cpp
#include <QApplication>
#include "OpenGLWindow.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    OpenGLWindow window;
    window.resize(800, 600);
    window.show();
    return a.exec();
}
```

这个代码展示了如何使用Qt和OpenGL创建一个简单的3D坐标系，支持鼠标左键旋转和中键缩放。你可以进一步优化和调整代码以满足具体需求，并根据CloudCompare中的`ccGLWindow.cpp`类来进行更复杂的实现。