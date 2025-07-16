# 激光三维重建标定与点云拼接原理

## 1. 相机与激光平面标定

### 相机内参标定（Camera Calibration）
- **标定方法**：
  - 使用棋盘格标定板拍摄多张图像
  - 通过OpenCV的`calibrateCamera()`求解参数：
  
$$
\mathbf{K} = \begin{bmatrix}
f_x & 0 & c_x \\
0 & f_y & c_y \\
0 & 0 & 1
\end{bmatrix}, \quad \text{畸变系数} = [k_1, k_2, p_1, p_2, k_3]
$$

- **坐标转换**：
  像素坐标$(u,v)$ → 归一化平面坐标$(x_n,y_n)$：

$$
\begin{pmatrix}x_n\\y_n\\1\end{pmatrix} = \mathbf{K}^{-1}\begin{pmatrix}u\\v_c\\1\end{pmatrix}
$$

### 激光平面标定（Laser Plane Calibration）
- **平面方程拟合**：
  采集激光在标定板上的投影点$\{(u_i,v_i)\}$，对应世界坐标$\{(X_i,Y_i,Z_i)\}$，用最小二乘法拟合：

$$
aX + bY + cZ + d = 0
$$

- **3D反投影**：
  将中心线像素$(u,v_c)$转换为相机坐标系3D点$(X,Z)$：

$$
Z = -\frac{d}{a\,x_n + b\,y_n + c} \\
X = x_n\,Z, \quad Y = y_n\,Z
$$

---

## 2. 多帧拼接3D点云流程

### 数据获取
1. **位移记录**：
   - 第$i$帧的编码器位移：$Y_i$
   - 初始帧$Y_0=0$

2. **单帧处理**：
   对第$i$帧中心线像素$(u_j,v_j)$计算3D坐标：

$$
P_{ij} = (X_{ij},\,Y_i,\,Z_{ij}), \quad \text{其中} \quad 
\begin{cases}
X_{ij} = x_n^{(j)} \cdot Z_{ij} \\
Z_{ij} = -\frac{d}{a\,x_n^{(j)} + b\,y_n^{(j)} + c}
\end{cases}
$$

### 点云生成
合并所有帧的点：

$$
\mathcal{P} = \bigcup_{i=0}^{N-1}\bigcup_{j=0}^{W-1}\{P_{ij}\}
$$

---

## 伪代码实现

```cpp
// 标定阶段
CameraIntrinsics K = calibrateCamera(chessboard_images);
LaserPlane LP = calibrateLaserPlane(laser_images, K);

// 点云重建
vector<Point3f> pointCloud;
for (int i = 0; i < numFrames; ++i) {
    double Yi = encoder.getPosition(i);
    vector<Point> centerline = extractCenterline(frame);
    
    for (auto& uv : centerline) {
        Vec3d norm = K.inv() * Vec3d(uv.x, uv.y, 1);
        double Z = -LP.d / (LP.a*norm[0] + LP.b*Yi + LP.c);
        pointCloud.emplace_back(norm[0]*Z, Yi, Z);
    }
}

savePointCloud("scan.ply", pointCloud);