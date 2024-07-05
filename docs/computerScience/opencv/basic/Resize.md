当我们放大或缩小图像时，我们其实是在进行插值计算。对于图像放大，我们需要在原有的像素点之间插入新的像素点；对于图像缩小，我们需要将一些像素点进行合并。

#### 数学公式
   - 最近邻插值: `f(x, y) = f(round(x), round(y))`,用于缩小 <br>
   - 双线性插值: `f(x, y) = f(1-x, 1-y)*f(0, 0) + x*f(1, 0)*f(0, 0) `<br>
    ` + y*f(0, 1)*f(0, 0) + x*y*f(1, 1)*f(0, 0)`  用于放大 <br>
   
讨论双线性插值，实际上我们正在讨论一种未知点的估计方法。<br>
假设我们有一个放大的图片，里面有许多空白像素待填充，双线性插值就是一种填充这些空白的方法。<br>
想象一个格子，你知道格子四个角的值，但你不知道格子中间的值是多少。<br>
双线性插值就是一种使你能够根据四个角的值来估计中间值的方式。<br>

#### 代码示例

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

// 双线性插值算法实现图像放大2倍
cv::Mat enlargeImage(const cv::Mat& src) {
    int newWidth = src.cols * 2;
    int newHeight = src.rows * 2;
    cv::Mat dst(newHeight, newWidth, src.type());

    for (int y = 0; y < newHeight; ++y) {
        for (int x = 0; x < newWidth; ++x) {
            // 计算源图像中的坐标
            float srcX = x / 2.0f;
            float srcY = y / 2.0f;

            // 获取周围的四个像素点
            int x1 = static_cast<int>(std::floor(srcX));
            int y1 = static_cast<int>(std::floor(srcY));
            int x2 = std::min(x1 + 1, src.cols - 1);
            int y2 = std::min(y1 + 1, src.rows - 1);

            // 计算插值权重
            float dx = srcX - x1;
            float dy = srcY - y1;

            // 双线性插值计算新像素值
            for (int c = 0; c < src.channels(); ++c) {
                float value = 
                    (1 - dx) * (1 - dy) * src.at<cv::Vec3b>(y1, x1)[c] +
                    dx * (1 - dy) * src.at<cv::Vec3b>(y1, x2)[c] +
                    (1 - dx) * dy * src.at<cv::Vec3b>(y2, x1)[c] +
                    dx * dy * src.at<cv::Vec3b>(y2, x2)[c];
                dst.at<cv::Vec3b>(y, x)[c] = static_cast<uchar>(value);
            }
        }
    }

    return dst;
}

// 最近邻插值算法实现图像缩小2倍
cv::Mat shrinkImage(const cv::Mat& src) {
    int newWidth = src.cols / 2;
    int newHeight = src.rows / 2;
    cv::Mat dst(newHeight, newWidth, src.type());

    for (int y = 0; y < newHeight; ++y) {
        for (int x = 0; x < newWidth; ++x) {
            // 计算源图像中的坐标
            int srcX = x * 2;
            int srcY = y * 2;

            // 获取最近邻像素值
            dst.at<cv::Vec3b>(y, x) = src.at<cv::Vec3b>(srcY, srcX);
        }
    }

    return dst;
}

int main() {
    // 从文件加载图像
    cv::Mat img = cv::imread("input.jpg");
    if (img.empty()) {
        std::cerr << "Error: Could not open or find the image." << std::endl;
        return -1;
    }

    // 放大图像
    cv::Mat enlargedImg = enlargeImage(img);
    cv::imwrite("enlarged.jpg", enlargedImg);

    // 缩小图像
    cv::Mat shrunkImg = shrinkImage(img);
    cv::imwrite("shrunk.jpg", shrunkImg);

    // 显示图像
    cv::imshow("Original Image", img);
    cv::imshow("Enlarged Image", enlargedImg);
    cv::imshow("Shrunk Image", shrunkImg);
    cv::waitKey(0);

    return 0;
}
```

#### 代码解释

1. *enlargeImage 函数*：使用双线性插值算法实现图像放大2倍。
   - 计算源图像中的浮点坐标。
   - 获取周围的四个像素点。
   - 计算插值权重。
   - 使用双线性插值公式计算新像素值。

2. *shrinkImage 函数*：使用最近邻插值算法实现图像缩小2倍。
   - 计算源图像中的整数坐标。
   - 获取最近邻像素值。

3. *main 函数*：
   - 使用OpenCV的 `cv::imread` 函数从文件加载图像。
   - 调用 `enlargeImage` 函数对图像进行放大，并保存结果到文件 `enlarged.jpg`。
   - 调用 `shrinkImage` 函数对图像进行缩小，并保存结果到文件 `shrunk.jpg`。
   - 使用OpenCV的 `cv::imshow` 函数显示原始图像、放大后的图像和缩小后的图像。



