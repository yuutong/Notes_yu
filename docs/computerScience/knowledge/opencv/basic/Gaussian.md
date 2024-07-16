#### 原理

高斯滤波是一种用于平滑图像的技术，目的是减少图像中的噪声或细小的干扰点，让图像看起来更加平滑和连贯。<br>
核心是一个叫做“高斯核”的小矩阵。这个矩阵里的数值是根据高斯分布计算出来的。<br>
用这个矩阵去“扫描”图像中的每个像素点，并计算一个新的像素值，这个新的像素值是周围像素点的加权平均值。<br>

![高斯滤波](image-4.png)

其中：<br>
-  G(x, y)  是高斯核在 (x, y) 位置的值<br>
-  sigma  是标准差，决定了高斯核的宽度<br>

#### 卷积核（Convolution Kernel）

*定义*：卷积核是一个小的矩阵，用于在图像处理过程中对图像进行各种操作，如模糊、锐化、边缘检测等。

*作用*：卷积核通过与图像进行卷积操作，改变图像的某些特性。

*特点*：<br>
- 卷积核的大小通常是奇数，如3x3、5x5等。<br>
- 卷积核的元素值可以是任意的，取决于你想要实现的操作。<br>

*示例*：<br>
- 一个用于边缘检测的卷积核：<br>

  ```
  -1  -1  -1
  -1   8  -1
  -1  -1  -1
  ```

- 一个用于模糊的卷积核（均值滤波）：<br>

  ```
  1/9  1/9  1/9
  1/9  1/9  1/9
  1/9  1/9  1/9
  ```

#### 高斯核（Gaussian Kernel）

*定义*：高斯核是一个小矩阵，用于计算每个像素的新值。<br>
矩阵的中心元素对应当前处理的像素，周围的元素对应这个像素周围的像素。<br>
高斯核的数值越高，表示该位置像素对新值的影响越大。通常中心的位置影响最大，离中心越远影响越小。<br>

*示例*：<br>
- 一个3x3的高斯核（假设 sigma = 1）：<br>

  ```
    0.075  0.123  0.075
    0.123  0.204  0.123
    0.075  0.123  0.075
  ```

- 一个3x3的高斯核（假设 sigma = 2）：<br>

  ```
    0.094 0.118 0.094 
    0.118 0.148 0.118 
    0.094 0.118 0.094 
  ```

#### 标准差

标准差（σ）决定了高斯核的“宽度”或“扩散程度”。可以把标准差想象成一个控制高斯核形状的按钮。<br>

* *标准差小*（比如 σ=1）：高斯核的数值集中在中心，周围的数值很小。这样，平滑效果较弱，细节保留更多。

* *标准差大*（比如 σ=2）：高斯核的数值分布得更广，中心的数值较小，但周围的数值较大。<br>
                         这样，平滑效果更强，能去掉更多噪声，但也可能丢失更多细节。


#### 高斯核与图像块的卷积操作

*卷积操作* 是图像处理中一种基本的数学运算。<br>
它通过一个小的矩阵（称为“卷积核”或“滤波器”）在图像上滑动，并对每个位置的像素进行计算，从而生成一个新的图像。

假设我们有一个3x3的高斯核：<br>

```
高斯核：
0.075  0.123  0.075
0.123  0.204  0.123
0.075  0.123  0.075
```

1. *将高斯核放在图像的左上角*：

```
图像块：       高斯核：                 计算：
1  2  3       0.075  0.123  0.075       1*0.075 + 2*0.123 + 3*0.075
4  5  6       0.123  0.204  0.123     + 4*0.123 + 5*0.204 + 6*0.123
7  8  9       0.075  0.123  0.075     + 7*0.075 + 8*0.123 + 9*0.075
```
2. *计算新像素值*：

```
1*0.075 + 2*0.123 + 3*0.075 + 4*0.123 + 5*0.204 + 6*0.123 + 7*0.075 + 8*0.123 + 9*0.075 = 0.075 + 0.246 + 0.225 + 0.492 + 1.02 + 0.738 + 0.525 + 0.984 + 0.675 = 4.98
```

3. *将新像素值放入新图像的对应位置*，这就是左上角的新像素坐标值，然后遍历还需要计算8次，才能得到完整的新图像块的像素坐标值

#### 代码实现

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
#include <cmath>

using namespace cv;
using namespace std;

// 计算高斯核
Mat createGaussianKernel(int ksize, double sigma) 
{
    int radius = ksize / 2;
    Mat kernel(ksize, ksize, CV_64F);
    double sum = 0.0;

    for (int i = -radius; i <= radius; ++i) 
    {
        for (int j = -radius; j <= radius; ++j) 
        {
            double value = exp(-(i * i + j * j) / (2 * sigma * sigma)) / (2 * M_PI * sigma * sigma);
            kernel.at<double>(i + radius, j + radius) = value;
            sum += value;
        }
    }

    // 归一化
    kernel /= sum;
    return kernel;
}

// 高斯滤波
void gaussianBlur(const Mat& src, Mat& dst, int ksize, double sigma) 
{
    int radius = ksize / 2;
    dst = Mat::zeros(src.size(), src.type());
    Mat kernel = createGaussianKernel(ksize, sigma);

    // 对图像进行卷积
    for (int i = radius; i < src.rows - radius; ++i) 
    {
        for (int j = radius; j < src.cols - radius; ++j) 
        {
            double pixelValue = 0.0;
            for (int m = -radius; m <= radius; ++m) 
            {
                for (int n = -radius; n <= radius; ++n) 
                {
                    pixelValue += kernel.at<double>(m + radius, n + radius) * src.at<uchar>(i + m, j + n);
                }
            }
            dst.at<uchar>(i, j) = static_cast<uchar>(pixelValue);
        }
    }
}

int main() 
{
    Mat src = imread("image.jpg", IMREAD_GRAYSCALE);
    if (src.empty()) 
    {
        cout << "无法打开或找到图像!" << endl;
        return -1;
    }

    Mat dst;
    gaussianBlur(src, dst, 5, 1.0);

    imshow("Source Image", src);
    imshow("Gaussian Blurred Image", dst);
    waitKey(0);
    return 0;
}
```

#### 总结

- *卷积操作*：将卷积核在图像上滑动，计算每个位置的加权和，生成新的像素值。<br>
- *高斯核*：一个特殊的卷积核，用于平滑图像，去除噪声。<br>
- *高斯滤波*：通过高斯核对图像进行卷积，实现图像平滑。





