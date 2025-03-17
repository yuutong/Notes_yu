`
#include <opencv2/opencv.hpp>
#include <iostream>
#include <cmath>

using namespace cv;
using namespace std;

// 计算图像块的均值
double mean(const Mat& img) {
    double sum = 0.0;
    for (int i = 0; i < img.rows; ++i) {
        for (int j = 0; j < img.cols; ++j) {
            sum += img.at<uchar>(i, j);
        }
    }
    return sum / (img.rows * img.cols);
}

// 计算图像块的标准差
double stddev(const Mat& img, double mean_val) {
    double sum = 0.0;
    for (int i = 0; i < img.rows; ++i) {
        for (int j = 0; j < img.cols; ++j) {
            sum += pow(img.at<uchar>(i, j) - mean_val, 2);
        }
    }
    return sqrt(sum / (img.rows * img.cols));
}

// 计算归一化相关系数
double normalized_cross_correlation(const Mat& img, const Mat& templ, int x, int y) {
    double mean_templ = mean(templ);
    double stddev_templ = stddev(templ, mean_templ);

    double sum = 0.0;
    double mean_img = mean(img(Rect(x, y, templ.cols, templ.rows)));
    double stddev_img = stddev(img(Rect(x, y, templ.cols, templ.rows)), mean_img);

    for (int i = 0; i < templ.rows; ++i) {
        for (int j = 0; j < templ.cols; ++j) {
            double templ_val = templ.at<uchar>(i, j);
            double img_val = img.at<uchar>(y + i, x + j);
            sum += (templ_val - mean_templ) * (img_val - mean_img);
        }
    }

    return sum / (templ.rows * templ.cols * stddev_templ * stddev_img);
}

int main() {
    // 读取待匹配图像和模板图像
    Mat img = imread("source_image.jpg", IMREAD_GRAYSCALE);
    Mat templ = imread("template_image.jpg", IMREAD_GRAYSCALE);

    if (img.empty() || templ.empty()) {
        cout << "无法打开或找到图像!" << endl;
        return -1;
    }

    // 初始化最大相关系数和匹配位置
    double max_ncc = -1.0;
    Point matchLoc;

    // 遍历待匹配图像的每个像素点
    for (int y = 0; y <= img.rows - templ.rows; ++y) {
        for (int x = 0; x <= img.cols - templ.cols; ++x) {
            double ncc = normalized_cross_correlation(img, templ, x, y);
            if (ncc > max_ncc) {
                max_ncc = ncc;
                matchLoc = Point(x, y);
            }
        }
    }

    // 在图像中绘制矩形，标记匹配位置
    rectangle(img, matchLoc, Point(matchLoc.x + templ.cols, matchLoc.y + templ.rows), Scalar::all(0), 2, 8, 0);

    // 显示结果
    namedWindow("Image", WINDOW_AUTOSIZE);
    imshow("Image", img);
    
    waitKey(0);
    return 0;
}
`