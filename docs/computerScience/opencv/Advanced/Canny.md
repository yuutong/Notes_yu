
Canny边缘检测是一种多阶段算法，用于检测图像中的边缘。<br>
1. *高斯滤波*：使用高斯滤波器平滑图像，减少噪声。<br>
2. *计算梯度*：计算图像的梯度强度和方向。<br>
3. *非极大值抑制*：对梯度强度进行非极大值抑制，精确定位边缘。<br>
4. *双阈值检测*：应用双阈值检测确定潜在的边缘。<br>
5. *边缘连接*：通过抑制孤立的弱边缘，连接强边缘和弱边缘。<br>

#### 数学步骤

1. 高斯滤波：参考高斯滤波篇

2. **计算梯度**：
   - 使用Sobel算子计算图像的梯度强度和方向。<br>
   - Sobel算子的公式：
     
     G_x = <br>
     -1  0  1 <br>
     -2  0  2 <br>
     -1  0  1<br>
     
     G_y = <br>

     -1  -2 -1 <br>
     0  0  0 <br>
     1  2  1<br>
    
     
   - 梯度强度和方向的公式：

     G = sqrt{G_x^2 + G_y^2},  θ = arctan({G_y}/{G_x})


3. *非极大值抑制*：<br>
   - 对梯度强度进行非极大值抑制，精确定位边缘。<br>
   - 通过比较梯度方向上的像素值，抑制非极大值。<br>

4. *双阈值检测*：<br>
   - 应用双阈值检测确定潜在的边缘。<br>
   - 使用两个阈值：高阈值和低阈值。<br>
   - 如果梯度强度大于高阈值，则认为是强边缘；如果梯度强度介于高阈值和低阈值之间，<br>
   则认为是弱边缘；否则认为不是边缘。<br>

5. *边缘连接*：<br>
   - 通过抑制孤立的弱边缘，连接强边缘和弱边缘。<br>


#### 通俗解释

当我们使用Sobel算子计算图像的梯度时，我们得到的是每个像素点的“变化程度”和“变化方向”。<br>
这意味着我们知道图像中哪些地方有显著的亮度变化（即可能的边缘），以及这些变化的方向。<br>

*为什么还需要其他步骤？*<br>

虽然Sobel算子可以帮助我们找到图像中变化显著的地方，但它并不能直接告诉我们哪些地方是真正的边缘。<br>
为了更精确地检测边缘，我们需要进一步处理这些梯度信息。这就是为什么我们需要进行非极大值抑制、双阈值检测和边缘连接。<br>

##### 1. 非极大值抑制

问题：Sobel算子计算出的梯度图像中，边缘可能会显得很宽，因为它会在边缘的两侧都检测到显著的变化。<br>

解决方法：非极大值抑制就像是“瘦身”过程，它帮助我们精确定位边缘。<br>
具体来说，它会沿着梯度方向检查每个像素点，如果这个像素点的梯度值不是局部最大的，那么它就会被抑制（即设为0）。<br>
这样，我们就能得到更细、更精确的边缘。<br>

##### 2. 双阈值检测

问题：即使经过非极大值抑制处理后，图像中仍然可能会有一些噪声和弱边缘，这些不是真正的边缘。<br>

解决方法：双阈值检测通过设置两个阈值（高阈值和低阈值）来区分强边缘和弱边缘。具体来说：<br>
- 如果一个像素点的梯度值大于高阈值，那么它被认为是强边缘。<br>
- 如果一个像素点的梯度值介于高阈值和低阈值之间，那么它被认为是弱边缘。<br>
- 如果一个像素点的梯度值小于低阈值，那么它被认为不是边缘。<br>

##### 3. 边缘连接

问题：有些弱边缘可能是真正的边缘的一部分，但它们的梯度值不足以被高阈值检测到。<br>

解决方法：边缘连接步骤会检查弱边缘是否与强边缘相连。如果一个弱边缘像素与一个强边缘<br>
像素相连，那么它也被认为是边缘。否则，它将被抑制。这一步帮助我们连接断开的边缘，确保边缘的连续性。<br>


- *Sobel算子计算梯度*：就像是初步筛选，找到所有可能的边缘区域。<br>
- *非极大值抑制*：就像是精确定位，确保边缘是细的和准确的。<br>
- *双阈值检测*：就像是进一步筛选，区分强边缘和弱边缘。<br>
- *边缘连接*：就像是连接断开的边缘，确保边缘的连续性。<br>

#### 代码实现

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>
#include <vector>
#include <cmath>

// 高斯滤波器
cv::Mat gaussianFilter(const cv::Mat& src, double sigma) 
{
    int ksize = 2 * (int)(3 * sigma) + 1;
    cv::Mat dst;
    cv::GaussianBlur(src, dst, cv::Size(ksize, ksize), sigma);
    return dst;
}

// 计算梯度
void computeGradient(const cv::Mat& src, cv::Mat& gradX, cv::Mat& gradY, cv::Mat& grad, cv::Mat& angle) 
{
    gradX = cv::Mat::zeros(src.size(), CV_32F);
    gradY = cv::Mat::zeros(src.size(), CV_32F);
    grad = cv::Mat::zeros(src.size(), CV_32F);
    angle = cv::Mat::zeros(src.size(), CV_32F);

    for (int y = 1; y < src.rows - 1; ++y) 
    {
        for (int x = 1; x < src.cols - 1; ++x) 
        {
            float gx = -src.at<uchar>(y - 1, x - 1) + src.at<uchar>(y - 1, x + 1)
                       - 2 * src.at<uchar>(y, x - 1) + 2 * src.at<uchar>(y, x + 1)
                       - src.at<uchar>(y + 1, x - 1) + src.at<uchar>(y + 1, x + 1);

            float gy = -src.at<uchar>(y - 1, x - 1) - 2 * src.at<uchar>(y - 1, x) - src.at<uchar>(y - 1, x + 1)
                       + src.at<uchar>(y + 1, x - 1) + 2 * src.at<uchar>(y + 1, x) + src.at<uchar>(y + 1, x + 1);

            gradX.at<float>(y, x) = gx;
            gradY.at<float>(y, x) = gy;
            grad.at<float>(y, x) = std::sqrt(gx * gx + gy * gy);
            angle.at<float>(y, x) = std::atan2(gy, gx);
        }
    }
}

// 非极大值抑制
cv::Mat nonMaxSuppression(const cv::Mat& grad, const cv::Mat& angle) 
{
    cv::Mat suppressed = cv::Mat::zeros(grad.size(), CV_32F);

    for (int y = 1; y < grad.rows - 1; ++y) 
    {
        for (int x = 1; x < grad.cols - 1; ++x) 
        {
            float theta = angle.at<float>(y, x);
            float magnitude = grad.at<float>(y, x);

            float q = 0, r = 0;
            if ((theta >= -CV_PI / 8 && theta < CV_PI / 8) || (theta >= 7 * CV_PI / 8 || theta < -7 * CV_PI / 8)) 
            {
                q = grad.at<float>(y, x + 1);
                r = grad.at<float>(y, x - 1);
            }
            else if ((theta >= CV_PI / 8 && theta < 3 * CV_PI / 8) || (theta >= -7 * CV_PI / 8 && theta < -5 * CV_PI / 8)) 
            {
                q = grad.at<float>(y + 1, x - 1);
                r = grad.at<float>(y - 1, x + 1);
            }
            else if ((theta >= 3 * CV_PI / 8 && theta < 5 * CV_PI / 8) || (theta >= -5 * CV_PI / 8 && theta < -3 * CV_PI / 8)) 
            {
                q = grad.at<float>(y + 1, x);
                r = grad.at<float>(y - 1, x);
            }
            else if ((theta >= 5 * CV_PI / 8 && theta < 7 * CV_PI / 8) || (theta >= -3 * CV_PI / 8 && theta < -CV_PI / 8)) 
            {
                q = grad.at<float>(y - 1, x - 1);
                r = grad.at<float>(y + 1, x + 1);
            }

            if (magnitude >= q && magnitude >= r) 
            {
                suppressed.at<float>(y, x) = magnitude;
            }
        }
    }

    return suppressed;
}

// 双阈值检测和边缘连接
cv::Mat doubleThresholdAndEdgeLinking(const cv::Mat& suppressed, float lowThresh, float highThresh) 
{
    cv::Mat edges = cv::Mat::zeros(suppressed.size(), CV_8U);

    for (int y = 1; y < suppressed.rows - 1; ++y) 
    {
        for (int x = 1; x < suppressed.cols - 1; ++x) 
        {
            float magnitude = suppressed.at<float>(y, x);

            if (magnitude >= highThresh) 
            {
                edges.at<uchar>(y, x) = 255;
            }
            else if (magnitude >= lowThresh) 
            {
                bool connectedToStrongEdge = false;
                for (int j = -1; j <= 1; ++j) 
                {
                    for (int i = -1; i <= 1; ++i) 
                    {
                        if (suppressed.at<float>(y + j, x + i) >= highThresh) 
                        {
                            connectedToStrongEdge = true;
                            break;
                        }
                    }
                    if (connectedToStrongEdge) break;
                }
                if (connectedToStrongEdge) 
                {
                    edges.at<uchar>(y, x) = 255;
                }
            }
        }
    }

    return edges;
}

int main() 
{
    // 从文件加载灰度图像
    cv::Mat img = cv::imread("input.jpg", cv::IMREAD_GRAYSCALE);
    if (img.empty()) 
    {
        std::cerr << "Error: Could not open or find the image." << std::endl;
        return -1;
    }

    // 高斯滤波
    double sigma = 1.0;
    cv::Mat smoothed = gaussianFilter(img, sigma);

    // 计算梯度
    cv::Mat gradX, gradY, grad, angle;
    computeGradient(smoothed, gradX, gradY, grad, angle);

    // 非极大值抑制
    cv::Mat suppressed = nonMaxSuppression(grad, angle);

    // 双阈值检测和边缘连接
    float lowThresh = 50;
    float highThresh = 150;
    cv::Mat edges = doubleThresholdAndEdgeLinking(suppressed, lowThresh, highThresh);

    // 保存和显示结果图像
    cv::imwrite("canny_edges.jpg", edges);
    cv::imshow("Canny Edges", edges);
    cv::waitKey(0);

    return 0;
}
```

#### 代码解释

1. *高斯滤波*：
   - `gaussianFilter` 函数使用高斯滤波器平滑图像，减少噪声。高斯滤波器的标准差 `sigma` 决定了滤波器的宽度。

2. *计算梯度*：
   - `computeGradient` 函数计算图像的水平和垂直梯度（`gradX` 和 `gradY`），并计算梯度强度（`grad`）和方向（`angle`）。

3. *非极大值抑制*：
   - `nonMaxSuppression` 函数对梯度强度进行非极大值抑制，通过比较梯度方向上的像素值，抑制非极大值。

4. *双阈值检测和边缘连接*：
   - `doubleThresholdAndEdgeLinking` 函数应用双阈值检测确定潜在的边缘，并通过抑制孤立的弱边缘，连接强边缘和弱边缘。

好的，让我用更简单的语言来解释为什么在使用Sobel算子计算梯度之后，还需要进行非极大值抑制、双阈值检测和边缘连接。

