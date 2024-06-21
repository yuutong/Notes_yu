
#### 数学原理
中值滤波的基本思想是用图像局部区域的中值来替换该区域中心像素的值，从而减少噪声的影响。

1. **选择滤波窗口**：通常是一个奇数大小的矩形窗口（如3x3、5x5等）。
2. **滑动窗口**：将滤波窗口从图像的左上角开始，逐个像素地滑动到右下角。
3. **计算中值**：在每个位置，取滤波窗口内所有像素值的中值，作为该位置的新像素值。

好的，理解中值滤波的过程通过图形化的方式解释会更直观。我们来详细地解释一下中值滤波的操作步骤，包括如何处理每个像素点以及如何替换像素值。

#### 图形化过程模拟

中值滤波并不只处理一个像素点，而是遍历整个图像的每一个像素点，逐个执行上述步骤。让我们用更大的图像来说明这一点：

假设我们有一个 5x5 的图像：

```
+-----+-----+-----+-----+-----+
| 100 | 200 | 150 | 250 | 100 |
+-----+-----+-----+-----+-----+
|  50 |  80 |  90 | 100 |  70 |
+-----+-----+-----+-----+-----+
|  65 |  75 |  85 |  95 |  55 |
+-----+-----+-----+-----+-----+
|  60 |  70 |  80 | 100 |  50 |
+-----+-----+-----+-----+-----+
|  55 |  65 |  75 |  85 |  45 |
+-----+-----+-----+-----+-----+
```

我们进行中值滤波处理。以下是处理 `85` 这个像素点（处于图像中央）的步骤：

 **步骤1：提取 3x3 窗口的像素值**

```
+-----+-----+-----+
|  80 |  90 | 100 |
+-----+-----+-----+
|  75 |  85 |  95 |
+-----+-----+-----+
|  70 |  80 | 100 |
+-----+-----+-----+
```

***步骤2：排序像素值**

将这些像素值排序：

```
[70, 75, 80, 80, 85, 90, 95, 100, 100]
```

**步骤3：取中值**

在排序后的数组中，找到中间的那个值：

```
中值 = 85
```

替换中心像素的值：

```
+-----+-----+-----+
|  80 |  90 | 100 |
+-----+-----+-----+
|  75 |  85（替换前）|  95 |
+-----+-----+-----+
|  70 |  80 | 100 |
+-----+-----+-----+
```

实际上，这个示例中的中心像素值并没有变化，但是你可以想象如果原始值是极端的噪声值时，它会被中值替换为更合理的值。

#### C++ 实现

遍历所有像素点，并对每个像素应用中值滤波：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
#include <vector>
#include <algorithm>

// 中值滤波实现
cv::Mat medianFilter(const cv::Mat& src, int kernelSize) {
    int radius = kernelSize / 2;
    cv::Mat dst = src.clone();

    for (int y = radius; y < src.rows - radius; ++y) {
        for (int x = radius; x < src.cols - radius; ++x) {
            std::vector<uchar> neighborhood;

            // 遍历窗口内的所有像素
            for (int dy = -radius; dy <= radius; ++dy) {
                for (int dx = -radius; dx <= radius; ++dx) {
                    neighborhood.push_back(src.at<uchar>(y + dy, x + dx));
                }
            }

            // 对窗口内的像素值进行排序，并取中值
            std::nth_element(neighborhood.begin(), neighborhood.begin() + neighborhood.size() / 2, neighborhood.end());
            uchar medianValue = neighborhood[neighborhood.size() / 2];

            // 将中值赋给目标图像对应位置的像素
            dst.at<uchar>(y, x) = medianValue;
        }
    }

    return dst;
}

int main() {
    // 读取灰度图像
    cv::Mat src = cv::imread("path_to_your_image.jpg", cv::IMREAD_GRAYSCALE);
    if (src.empty()) {
        std::cerr << "Could not open or find the image!" << std::endl;
        return -1;
    }

    int kernelSize = 3; // 窗口大小
    cv::Mat dst = medianFilter(src, kernelSize);

    // 显示结果
    cv::imshow("Original Image", src);
    cv::imshow("Median Filtered Image", dst);
    cv::waitKey(0);

    return 0;
}
```

#### 代码解释

1. **定义窗口大小**：选择一个 3x3 的窗口。
2. **遍历图像**：遍历图像的每个像素点（边缘除外）。
3. **提取邻域像素值**：在每个像素点处提取邻域内的所有像素值。
4. **排序并取中值**：对这些值进行排序，并取中间值作为新的像素值。
5. **赋值**：将中值赋给新的图像。

