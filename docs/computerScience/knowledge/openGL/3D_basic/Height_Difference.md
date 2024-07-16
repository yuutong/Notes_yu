

#### 1. 平面度 (Planarity)

平面度是指点云数据如何接近一个平面的程度。可以使用主成分分析（PCA）来计算平面度：

1. *计算点云的协方差矩阵*。
2. *计算协方差矩阵的特征值和特征向量*。
3. *平面度* 可以通过特征值来衡量，通常使用最小特征值与所有特征值之和的比值来表示。

#### 2. 轮廓度 (Contour)

轮廓度是指点云数据的边缘特征。可以通过计算点云的凸包（Convex Hull）来测量轮廓度：

1. *计算点云的凸包*。
2. *计算凸包的周长*或面积。

#### 3. 高度差 (Height Difference)

高度差是指点云在某一方向上的最大和最小值之间的差异，通常是Z轴方向：

1. *找到点云中所有点的Z值*。
2. *计算最大Z值与最小Z值之间的差异*。

#### 示例代码（C++ + PCL）


```cpp
#include <iostream>
#include <pcl/io/pcd_io.h>
#include <pcl/point_types.h>
#include <pcl/common/common.h>
#include <pcl/common/pca.h>
#include <pcl/segmentation/convex_hull.h>

using namespace std;
using namespace pcl;

// 计算平面度
float computePlanarity(const PointCloud<PointXYZ>::Ptr& cloud) 
{
    PCA<PointXYZ> pca;
    pca.setInputCloud(cloud);
    Eigen::Matrix3f eigen_vectors = pca.getEigenVectors();
    Eigen::Vector3f eigen_values = pca.getEigenValues();

    float planarity = eigen_values(2) / (eigen_values(0) + eigen_values(1) + eigen_values(2));
    return planarity;
}

// 计算轮廓度
float computeContour(const PointCloud<PointXYZ>::Ptr& cloud) 
{
    PointCloud<PointXYZ>::Ptr hull(new PointCloud<PointXYZ>);
    ConvexHull<PointXYZ> chull;
    chull.setInputCloud(cloud);
    chull.reconstruct(*hull);

    return chull.getTotalArea(); // 或者使用周长
}

// 计算高度差
float computeHeightDifference(const PointCloud<PointXYZ>::Ptr& cloud) 
{
    PointXYZ min_pt, max_pt;
    getMinMax3D(*cloud, min_pt, max_pt);

    return max_pt.z - min_pt.z;
}

int main(int argc, char** argv) 
{
    PointCloud<PointXYZ>::Ptr cloud(new PointCloud<PointXYZ>);

    // 从文件读取点云数据
    if (io::loadPCDFile<PointXYZ>("sample.pcd", *cloud) == -1) 
    {
        PCL_ERROR("Couldn't read file sample.pcd \n");
        return (-1);
    }

    // 计算平面度
    float planarity = computePlanarity(cloud);
    std::cout << "Planarity: " << planarity << std::endl;

    // 计算轮廓度
    float contour = computeContour(cloud);
    std::cout << "Contour: " << contour << std::endl;

    // 计算高度差
    float height_diff = computeHeightDifference(cloud);
    std::cout << "Height Difference: " << height_diff << std::endl;

    return 0;
}
```

#### 代码说明

1. *计算平面度*：
    - 使用PCL的PCA类计算点云的主成分，并通过特征值来衡量平面度。

2. *计算轮廓度*：
    - 使用PCL的ConvexHull类计算点云的凸包，并用凸包的面积来表示轮廓度。

3. *计算高度差*：
    - 使用PCL的getMinMax3D函数找到点云中Z值的最大和最小值，并计算它们的差异。



#### 示例代码（ 3D点云数据的遍历 ）

```cpp
#include <iostream>
#include <vector>
#include <cmath>
#include <limits>

struct Point3D 
{
    double x, y, z;
};

// 计算平面度
double computePlanarity(const std::vector<Point3D>& points) 
{
    size_t n = points.size();
    if (n == 0) return 0.0;

    // 计算质心
    Point3D centroid = {0, 0, 0};
    for (const auto& point : points) 
    {
        centroid.x += point.x;
        centroid.y += point.y;
        centroid.z += point.z;
    }
    centroid.x /= n;
    centroid.y /= n;
    centroid.z /= n;

    // 计算协方差矩阵
    double xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0;
    for (const auto& point : points) 
    {
        double dx = point.x - centroid.x;
        double dy = point.y - centroid.y;
        double dz = point.z - centroid.z;

        xx += dx * dx;
        xy += dx * dy;
        xz += dx * dz;
        yy += dy * dy;
        yz += dy * dz;
        zz += dz * dz;
    }

    // 计算协方差矩阵的特征值（这里使用已知特征值分解的方法）
    double trace = xx + yy + zz;
    double det = xx * yy * zz + 2 * xy * yz * xz - xz * xz * yy - yz * yz * xx - xy * xy * zz;
    double eigenvalue = trace / 3;

    // 平面度
    double planarity = eigenvalue / (xx + yy + zz);
    return planarity;
}

// 计算轮廓度（凸包周长）
double computeContour(const std::vector<Point3D>& points) 
{
    // 简单实现：假设点云在XY平面上，计算凸包的周长
    // 这里只是一个简单示例，实际应用中可以使用更复杂的凸包算法，如Graham扫描或Andrew算法

    // 找到最低的点
    Point3D start = points[0];
    for (const auto& point : points) 
    {
        if (point.y < start.y || (point.y == start.y && point.x < start.x)) {
            start = point;
        }
    }

    std::vector<Point3D> hull;
    Point3D current = start;
    do 
    {
        hull.push_back(current);
        Point3D next = points[0];
        for (const auto& point : points) 
        {
            if (point.x == current.x && point.y == current.y) continue;
            double cross = (next.x - current.x) * (point.y - current.y) - (next.y - current.y) * (point.x - current.x);
            if (cross < 0 || (cross == 0 && std::hypot(point.x - current.x, point.y - current.y) > std::hypot(next.x - current.x, next.y - current.y))) 
            {
                next = point;
            }
        }
        current = next;
    } while (current.x != start.x || current.y != start.y);

    // 计算周长
    double contour = 0;
    for (size_t i = 0; i < hull.size(); ++i) 
    {
        size_t next = (i + 1) % hull.size();
        contour += std::hypot(hull[next].x - hull[i].x, hull[next].y - hull[i].y);
    }

    return contour;
}

// 计算高度差
double computeHeightDifference(const std::vector<Point3D>& points) 
{
    double minZ = std::numeric_limits<double>::max();
    double maxZ = std::numeric_limits<double>::lowest();

    for (const auto& point : points) 
    {
        if (point.z < minZ) minZ = point.z;
        if (point.z > maxZ) maxZ = point.z;
    }

    return maxZ - minZ;
}

int main() 
{
    // 示例点云
    std::vector<Point3D> points = 
    {
        {1, 2, 3}, {4, 5, 6}, {7, 8, 9}, {1, 3, 5}, {2, 4, 6}
    };

    double planarity = computePlanarity(points);
    double contour = computeContour(points);
    double height_diff = computeHeightDifference(points);

    std::cout << "Planarity: " << planarity << std::endl;
    std::cout << "Contour: " << contour << std::endl;
    std::cout << "Height Difference: " << height_diff << std::endl;

    return 0;
}
```

#### 代码说明

1. *平面度计算*：
    - 计算点云的质心。
    - 计算每个点相对于质心的协方差矩阵。
    - 计算协方差矩阵的特征值，并使用特征值来衡量平面度。

2. *轮廓度计算*：
    - 找到点云在XY平面上的凸包。
    - 计算凸包的周长来表示轮廓度。

3. *高度差计算*：
    - 遍历所有点的Z值，找到最大和最小值，并计算它们的差值。

