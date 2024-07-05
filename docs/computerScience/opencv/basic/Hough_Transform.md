霍夫变换（Hough Transform）用于检测图像中直线、圆等几何形状的技术，步骤如下：

1. *边缘检测*：首先，需要对图像进行边缘检测，通常使用边缘检测算法（如Canny边缘检测）来获取图像中的边缘信息。

2. *霍夫空间*：霍夫变换将直线的表示从图像空间（x-y坐标系）转换到霍夫空间（极坐标系）。<br>
              在霍夫空间中，一条直线可以表示为参数空间中的一个点，其中直线的参数通常是极径（r）和极角（θ）。<br>

3. *霍夫累加*：对于每个边缘像素，在霍夫空间中进行累加操作。对于每个边缘像素，计算其在霍夫空间中可能的直线参数，并将这些参数进行累加。

4. *霍夫变换*：在霍夫空间中，通过累加操作，直线在参数空间中的交点将形成峰值。这些峰值对应于图像中的直线。

5. *直线提取*：在霍夫空间中找到峰值对应的直线参数，进而确定图像中的直线。通常，可以设置阈值来筛选出具有足够累加值的直线。

霍夫变换可以有效地检测图像中的直线。霍夫变换的优点在于其对噪声和缺失的边缘具有一定的鲁棒性。


##### 1. 边缘检测的数学逻辑

  1. *高斯滤波*：对图像进行高斯平滑，以减少噪声。<br>
  2. *梯度计算*：使用Sobel算子计算图像的梯度幅值和方向，取梯度的峰值。<br>
      Sobel算子采用水平和垂直方向上的卷积核，它能像放大镜一样分辨出像素点之间的差值大不大，差值大的地方就是边缘<br>
  3. *边缘跟踪*：通过连接强边缘像素和弱边缘像素，形成完整的边缘。<br>

##### 2.霍夫空间

一条直线可以表示为参数空间中的一个点。这是因为在参数空间中，每个点对应于一条直线，直线在参数空间中的位置由其参数（ρ、θ）决定

x-y坐标系转换到极坐标系<br>

- 笛卡尔坐标系中的直线表示为y = 2x + 3。<br>
- 参数空间中的直线表示为ρ = x * cos(θ) + y * sin(θ)。每个点(ρ, θ)对应于一条直线。<br>

##### 3.霍夫累加找峰值
  
- 可以看做投票过程，每个边缘像素也会投票给参数空间中经过它的直线<br>
- 将所有的投票累加起来，统计哪条直线得到了最多的投票，在参数空间中，累加值高的点表示了有很多边缘像素都认为这条直线经过这个点<br>

##### 4.直线提取

- 找到峰值，获得最高投票的这个点（ρ，θ），就是最终拟合的直线的参数，可以得到参数方程，再转为直角坐标系下的方程


#### 基于霍夫变换的倾斜检测与文档校正项目

在激光打印机的光学字符识别（OCR）和文档分析中，倾斜检测和校正是一个关键步骤。

##### 倾斜检测

- *霍夫变换*：使用霍夫变换检测图像中的直线。<br>
             霍夫变换是一种将图像空间中的点映射到参数空间中直线的方法，通过检测参数空间中的峰值来找到图像中的直线。<br>
- *边界点组*：提取图像中的边界点，使用霍夫变换计算边界点组的直线。<br>
- *中心线计算*：计算文档的中心线，作为倾斜检测的参考线。<br>

##### 倾斜角度估计

- *边界点与中心线关系*：通过计算边界点组和中心线的关系，精确估计文档的倾斜角度。<br>
- *角度计算*：使用几何方法计算文档的倾斜角度，确保估计的准确性。<br>

##### 文档校正

- *自动化校正*：使用自动化算法对倾斜文档进行校正。根据估计的倾斜角度，旋转图像，使文档恢复到正确的角度。<br>
- *图像变换*：使用仿射变换或透视变换对图像进行校正，确保文档的边缘平行于图像边框。<br>

##### 应用场景

- *OCR*：在光学字符识别中，校正后的文档可以提高字符识别的准确性。<br>
- *文档分析*：在文档分析中，校正后的文档可以提高分析结果的准确性和可靠性。<br>


##### 示例代码

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;
using namespace cv;

void houghTransform(const Mat& edges, Mat& accumulator, vector<pair<int, int>>& lines, int threshold) 
{
    int rows = edges.rows;
    int cols = edges.cols;

    // θ的取值范围为[0, 180]，ρ的取值范围为[-d, d]，其中d为对角线长度
    int maxRho = hypot(rows, cols);
    int thetaSteps = 180;
    int rhoSteps = 2 * maxRho;

    // 初始化累加器
    accumulator = Mat::zeros(Size(thetaSteps, rhoSteps), CV_32SC1);

    // 遍历所有边缘点
    for (int y = 0; y < rows; ++y) 
    {
        for (int x = 0; x < cols; ++x) 
        {
            if (edges.at<uchar>(y, x) > 0) 
            {
                // 对每个边缘点，计算所有θ对应的ρ值，并在累加器中进行投票
                for (int theta = 0; theta < thetaSteps; ++theta) 
                {
                    double rad = theta * CV_PI / 180.0;
                    int rho = static_cast<int>(x * cos(rad) + y * sin(rad)) + maxRho;
                    accumulator.at<int>(rho, theta)++;
                }
            }
        }
    }

    // 检测累加器中的峰值
    for (int rho = 0; rho < rhoSteps; ++rho) 
    {
        for (int theta = 0; theta < thetaSteps; ++theta) 
        {
            if (accumulator.at<int>(rho, theta) > threshold) 
            {
                lines.emplace_back(rho - maxRho, theta);
            }
        }
    }
}

void drawLines(Mat& image, const vector<pair<int, int>>& lines) 
{
    int rows = image.rows;
    int cols = image.cols;

    for (const auto& line : lines) 
    {
        int rho = line.first;
        int theta = line.second;
        double rad = theta * CV_PI / 180.0;

        Point pt1, pt2;
        double a = cos(rad), b = sin(rad);
        double x0 = a * rho, y0 = b * rho;
        pt1.x = cvRound(x0 + 1000 * (-b));
        pt1.y = cvRound(y0 + 1000 * (a));
        pt2.x = cvRound(x0 - 1000 * (-b));
        pt2.y = cvRound(y0 - 1000 * (a));

        line(image, pt1, pt2, Scalar(0, 0, 255), 2, LINE_AA);
    }
}

int main() 
{
    // 读取图像并转换为灰度图像
    Mat image = imread("image.jpg");
    if (image.empty()) 
    {
        cerr << "无法读取图像!" << endl;
        return -1;
    }
    Mat gray;
    cvtColor(image, gray, COLOR_BGR2GRAY);

    // 边缘检测
    Mat edges;
    Canny(gray, edges, 50, 150, 3);

    // 霍夫变换
    Mat accumulator;
    vector<pair<int, int>> lines;
    houghTransform(edges, accumulator, lines, 100);

    // 绘制检测到的直线
    drawLines(image, lines);

    // 显示结果
    imshow("Hough Lines", image);
    waitKey(0);

    return 0;
}
```

### 代码说明

1. *预处理图像*：<br>
    - 使用`cvtColor`将图像转换为灰度图像。<br>
    - 使用`Canny`进行边缘检测。<br>

2. *初始化累加器*：<br>
    - 创建一个二维累加器数组，用于存储参数（ρ, θ）的投票结果。<br>

3. *遍历图像像素*：<br>
    - 对每一个边缘点，计算对应的ρ值，并在累加器中进行投票。<br>

4. *检测峰值*：<br>
    - 在累加器中找到投票数超过阈值的位置，即为检测到的直线参数（ρ, θ）。<br>

5. *绘制直线*：<br>
    - 根据检测到的参数，在原图像上绘制直线。<br>




