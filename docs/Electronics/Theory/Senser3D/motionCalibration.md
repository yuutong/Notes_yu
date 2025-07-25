
## 方案概述

运动平台连接一张雷赛的轴卡，轴卡连接电机，电机搭载在运动平台上。
然后通过轴卡给电机发脉冲信号，电机就能驱动运动平台做直线运动。但是这里运动平台移动的具体距离还不知道。这里是不是需要通过标定才能知道运动平台在一个脉冲下移动的物理位移是多远？
现在有一张12x9的已知尺寸的棋盘格 和一个海康威视的2D相机，相机搭载在运动平台上，棋盘格放在运动平台的载物台上。

1.做相机的当量标定，拍摄一张棋盘格的图像，计算出一个格子的边长（长度为3mm）为多少个像素，就能得到在当前的相机坐标系下每个像素点对应的实际距离是多少

2.做运动平台的移动标定：通过雷赛轴卡给运动平台发100个脉冲，驱动运动平台直线运动一段距离。求解这段距离的方式是：在运动前相机（位置固定）拍摄一张棋盘格的图像，在运动后再拍摄一张棋盘格的图像，运用两张图像中的棋盘格的(x,y)位置的差值像素点数，假设为N。

由于在1中已经得到了1个像素点对应的实际物理距离x，所以现在就可以知道，发100个脉冲运动平台移动的距离是Nx，每个脉冲运动 Nx/100

---

## 具体流程

1. **相机当量标定**

   * 拍摄一张已知方格边长 @L_{\rm phys} = 3\text{ mm}@、尺寸为 @12\times9@ 的棋盘格图像，检测出棋盘格在图像上的像素间距 @L_{\rm px}@。
   * 则得到像素到物理距离的换算系数：

     @@
       s = \frac{L_{\rm phys}}{L_{\rm px}}
       \quad
       \bigl[\text{mm/px}\bigr].
     @@

2. **运动平台移动标定**

   * 下达 100 个脉冲，平台做一次直线平移。
   * 运动前后各拍一张棋盘格图，检测相同棋盘格角点（或格子中心）在图像中的像素位移总数 @N_{\rm px}@。
   * 则 100 个脉冲对应的物理位移为

     @@
       D = N_{\rm px}\;s
       \quad[\text{mm}],
     @@

     每个脉冲的移动距离为

     @@
       d_{\rm per} = \frac{D}{100} = \frac{N_{\rm px}\;s}{100}.
     @@

---

## 主要误差来源

1. *像素检测误差*

   * 棋盘格角点（或格子中心）检测本身有亚像素误差，假设每次检测误差约 @\delta_{\rm px}@ 像素。
   * 总像素位移测量误差约 @\delta_{N} \approx \sqrt{2}\,\delta_{\rm px}@（两次检测累积）。

2. *标定板制备误差*

   * 棋盘格格子的实际 @L_{\rm phys}@ 可能存在制作公差 @\delta_{L}@（例如 ±0.01 mm）。

3. *相机畸变残留*

   * 虽然做过畸变矫正，但残余误差仍会让像素-物理尺度略有偏差。

4. *机械误差*

   * 运动平台本身有导轨间隙、螺杆螺距误差、皮带拉伸等，导致每个脉冲对应的实际位移不完全线性。

5. *环境振动和温漂*

   * 标定和测量过程中振动或温度变化也会引入微米级偏差。

---

## 标定精度计算

### 1. 单次测量的不确定度

从误差传播角度，单次测量的物理位移 @D@ 的不确定度 @\delta_D@ 近似为：

@@
\delta_D
\;=\;
\sqrt{\,
  \bigl(s\,\delta_{N}\bigr)^2
  \;+\;
  \bigl(N_{\rm px}\,\delta_{s}\bigr)^2
\,},
@@

其中

* @\delta_{N}\approx\sqrt{2}\,\delta_{\rm px}@ 是像素位移测量误差，
* @\delta_{s}@ 是尺度因子 @s=L_{\rm phys}/L_{\rm px}@ 的不确定度，由

  @@
    \delta_s
    = s \,\sqrt{\Bigl(\frac{\delta_{L}}{L_{\rm phys}}\Bigr)^2 + \Bigl(\frac{\delta_{L_{\rm px}}}{L_{\rm px}}\Bigr)^2},
  @@

  而 @\delta_{L_{\rm px}}\approx\delta_{\rm px}@（假设格子像素宽度测量也有同样像素误差）。

### 2. 多次重复测量的统计精度

为了得到更可靠的脉冲位移 @d_{\rm per}@：

1. 重复做 @M@ 次「100 脉冲→拍摄→测量」实验，得到一组测量值 @\{D_k\}_{k=1}^M@。

2. 计算平均值

   @@
     \overline{D}
     = \frac{1}{M}\sum_{k=1}^M D_k,
   @@

   及标准偏差

   @@
     \sigma_D
     = \sqrt{\frac{1}{M-1}\sum_{k=1}^M \bigl(D_k - \overline{D}\bigr)^2}.
   @@

3. 则每脉冲平均位移

   @@
     d_{\rm per} = \frac{\overline{D}}{100},
   @@

   不确定度约为

   @@
     \delta_{d_{\rm per}}
     = \frac{\sigma_D}{100}.
   @@


