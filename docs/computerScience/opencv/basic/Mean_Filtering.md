#### 均值滤波公式

均值滤波是一种线性平滑滤波方法，通过将每个像素的值替换为其邻域内像素值的平均值来减少噪声。假设有一个  k * k  的滤波窗口，均值滤波公式如下：

![均值滤波](image-3.png)


其中：
-  I(x, y)  是原图像在 (x, y) 位置的像素值
-  I'(x, y) 是滤波后的图像在 (x, y) 位置的像素值
-  k 是滤波窗口的尺寸（通常取奇数）

#### 滤波窗口

-  公式中累加符号的上下限（k-1）/2 和 -(k-1)/2
假设我们有一个 3x3 的滤波窗口，当前像素位于 (x, y)。滤波窗口覆盖的像素范围如下所示：

```
+-----+-----+-----+
| (x-1, y-1) | (x, y-1) | (x+1, y-1) |
+-----+-----+-----+
| (x-1, y)   | (x, y)   | (x+1, y)   |
+-----+-----+-----+
| (x-1, y+1) | (x, y+1) | (x+1, y+1) |
+-----+-----+-----+
```

在这种情况下，累加的范围是：

-  i  从 -1 到 1：
  - i = -1  表示 (x-1, y)
  - i = 0   表示 (x, y)
  - i = 1   表示 (x+1, y)

-  j  从 -1 到 1：
  -  j = -1  表示 (x, y-1)
  -  j = 0  表示 (x, y)
  -  j = 1  表示 (x, y+1)


#### 代码实现

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>

cv::Mat meanFilter(const cv::Mat& src, int kernelSize) {
    cv::Mat dst = src.clone();
    int radius = kernelSize / 2;

    for (int y = radius; y < src.rows - radius; ++y) {
        for (int x = radius; x < src.cols - radius; ++x) {
            float sum = 0.0;
            for (int dy = -radius; dy <= radius; ++dy) {
                for (int dx = -radius; dx <= radius; ++dx) {
                    sum += src.at<uchar>(y + dy, x + dx);
                }
            }
            dst.at<uchar>(y, x) = cv::saturate_cast<uchar>(sum / (kernelSize * kernelSize));
        }
    }

    return dst;
}

int main() {
    cv::Mat src = cv::imread("path_to_your_image.jpg", cv::IMREAD_GRAYSCALE);
    if (src.empty()) {
        std::cerr << "Could not open or find the image!" << std::endl;
        return -1;
    }

    int kernelSize = 3; // 滤波窗口大小
    cv::Mat dst = meanFilter(src, kernelSize);

    cv::imshow("Original Image", src);
    cv::imshow("Mean Filtered Image", dst);
    cv::waitKey(0);

    return 0;
}
```

#### 解释

    - **滤波窗口的尺寸 `kernelSize`**：在上述代码中，我们使用尺寸为 3 的滤波窗口
    - **遍历图像的每个像素**：对于每个像素 (x, y)，我们遍历其周围的像素范围
    - **累加范围**：使用两个嵌套的循环 `for (int dy = -radius; dy <= radius; ++dy)` 和 `for (int dx = -radius; dx <= radius; ++dx)` 来累加当前像素及其周围像素的值
    - **计算均值**：累加完所有像素值后，计算均值并将结果赋值给目标图像

