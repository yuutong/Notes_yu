#### 基本思想

分水岭算法的名字来源于地理学中的“分水岭”概念。<br>
在地理学中，分水岭是指两个流域之间的高地或山脊线，雨水会从分水岭两侧流向不同的流域。<br>
在图像处理中，我们可以把图像看作是一片地形，其中像素值代表高度。<br>
分水岭算法通过模拟水从低处向高处流动，找到图像中的“山脊线”（即分水岭），<br>
从而把图像分割成不同的区域。<br>

##### 1：计算梯度图像

我们先要找到图像中的边缘，边缘就像是地形中的陡峭的地方。<br>
我们通过计算图像的梯度来找到这些边缘。梯度高的地方表示变化剧烈（即边缘），<br>
梯度低的地方表示变化平缓（即非边缘）<br>
   - 使用Sobel算子计算图像的梯度强度和方向。<br>
   - Sobel算子的公式：<br>
     
     G_x = <br>
     -1  0  1 <br>
     -2  0  2 <br>
     -1  0  1<br>
     
     G_y = <br>

     -1  -2 -1 <br>
     0  0  0 <br>
     1  2  1
    
     
   - 梯度强度和方向的公式：

     G = sqrt{G_x^2 + G_y^2},  θ = arctan({G_y}/{G_x})


##### 2：标记初始区域

我们在图像中找到一些容易识别的区域，比如明显的前景和背景。<br>
这些区域就像是我们在地形上找到的一些小水池。<br>
我们用一些形态学操作（比如膨胀和腐蚀）来标记这些初始区域。<br>


##### 3：分水岭变换

我们开始向这些标记好的区域倒水，水会从低处向高处流动。<br>
随着水的流动，不同的水池会逐渐扩展，直到它们相遇。<br>
当两个水池相遇时，我们就找到了“分水岭”，即图像中不同区域的边界。<br>

数学逻辑：基于队列的广度优先搜索 <br>
    队列 <-- 标记区域 <br>
    当队列不为空时： <br>
    取出队列中的一个像素（x,y） <br>
    检查其邻域像素（x+i,y+j） <br>
    如果邻域像素未标记，且其梯度值小于当前像素： <br>
        标记邻域像素 <br>
        将邻域像素加入队列 <br>



##### 总结

1. *找到边缘*：我们先找到图像中的边缘，就像在地形图上找到陡峭的地方。<br>
2. *标记水池*：我们在图像中标记一些容易识别的区域，就像在地形上找到一些小水池。<br>
3. *倒水*：我们开始向这些水池倒水，水会从低处向高处流动，直到不同的水池相遇。<br>
           当水池相遇时，我们就找到了图像中不同区域的边界。<br>


#### 代码示例

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>
#include <queue>

// 计算梯度图像
cv::Mat computeGradient(const cv::Mat& src) 
{
    cv::Mat gradX, gradY, grad;
    cv::Sobel(src, gradX, CV_32F, 1, 0);
    cv::Sobel(src, gradY, CV_32F, 0, 1);
    cv::magnitude(gradX, gradY, grad);
    cv::normalize(grad, grad, 0, 255, cv::NORM_MINMAX, CV_8U);
    return grad;
}

// 标记初始区域
cv::Mat markInitialRegions(const cv::Mat& src) 
{
    cv::Mat markers;
    cv::threshold(src, markers, 0, 255, cv::THRESH_BINARY | cv::THRESH_OTSU);
    cv::morphologyEx(markers, markers, cv::MORPH_OPEN, cv::Mat::ones(3, 3, CV_8U));
    cv::morphologyEx(markers, markers, cv::MORPH_CLOSE, cv::Mat::ones(3, 3, CV_8U));
    cv::connectedComponents(markers, markers);
    markers.convertTo(markers, CV_32S);
    return markers;
}

// 分水岭变换
cv::Mat watershedTransform(const cv::Mat& grad, cv::Mat& markers) 
{
    std::queue<cv::Point> queue;

    // 将标记区域加入队列
    for (int y = 0; y < markers.rows; ++y) 
    {
        for (int x = 0; x < markers.cols; ++x)
        
            if (markers.at<int>(y, x) > 0) 
            {
                queue.push(cv::Point(x, y));
            }
        }
    }

    // 分水岭变换
    while (!queue.empty()) 
    {
        cv::Point p = queue.front();
        queue.pop();

        for (int j = -1; j <= 1; ++j) 
        {
            for (int i = -1; i <= 1; ++i) 
            {
                int nx = p.x + i;
                int ny = p.y + j;

                if (nx >= 0 && nx < markers.cols && ny >= 0 && ny < markers.rows) 
                {
                    if (markers.at<int>(ny, nx) == 0 && grad.at<uchar>(ny, nx) < grad.at<uchar>(p.y, p.x)) 
                    {
                        markers.at<int>(ny, nx) = markers.at<int>(p.y, p.x);
                        queue.push(cv::Point(nx, ny));
                    }
                }
            }
        }
    }

    return markers;
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

    // 计算梯度图像
    cv::Mat grad = computeGradient(img);

    // 标记初始区域
    cv::Mat markers = markInitialRegions(grad);

    // 分水岭变换
    cv::Mat result = watershedTransform(grad, markers);

    // 显示结果
    cv::Mat resultDisplay;
    result.convertTo(resultDisplay, CV_8U);
    cv::imshow("Watershed Result", resultDisplay);
    cv::waitKey(0);

    return 0;
}
```

#### 代码解释

1. *计算梯度图像*：<br>
   - `computeGradient` 函数使用Sobel算子计算图像的梯度，并归一化到 [0, 255] 范围内。这样我们就找到了图像中的边缘。

2. *标记初始区域*：<br>
   - `markInitialRegions` 函数使用Otsu阈值法和形态学操作（开运算和闭运算）标记图像中的初始区域（种子）。这些种子就像是我们找到的小水池。

3. *分水岭变换*：<br>
   - `watershedTransform` 函数从标记区域开始，使用广度优先搜索（BFS）模拟水从低处向高处流动，逐步填充图像中的所有区域。过程中，每当水流遇到不同的标记区域时，记录下分水岭线。

