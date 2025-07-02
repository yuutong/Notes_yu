**大白话总结：**

1. 结构光系统有两种数学模型：

   * **相位高度模型**：直接把相位值映射到高度，需要精密位移设备；
   * **三角测量模型**：把投影仪当“逆相机”，与普通相机形成双目，利用三角测量算深度。

2. 博主推荐用**三角测量模型**，因为标定简单、参数直观，对景深不敏感。

3. **核心思路**：

   * 用两组（水平/垂直）相移+灰度互补的格雷码投射条纹，先在相机图像中解出每个像素对应的投影仪像平面坐标 $(u_p,v_p)$；
   * 已知相机 $\bigl[P_c=K_c[R_c|T_c]\bigr]$ 和投影仪 $\bigl[P_p=K_p[R_p|T_p]\bigr]$ 的内外参后，令两条光线——相机光心到像素点的射线、投影仪光心到对应投影像素的射线——相交，解三角测量方程，就能得到空间点 $(X_w,Y_w,Z_w)$ 的三维坐标。 ([blog.csdn.net][1])

4. **逆相机法标定投影仪**：

   * 先用相机标定得到 $K_c,[R_c|T_c]$；
   * 再用格雷码映射，把靶标在相机图像中的特征点 $(u_c,v_c)$ 映射到投影仪像平面的 $(u_p,v_p)$；
   * 多个视角下反复采集，最后用张正友法算出投影仪的 $K_p,[R_p|T_p]$ ([blog.csdn.net][1])。

---

**数学原理与公式推导：**

1. **相机成像方程**

   $$
   Z_c
   \begin{bmatrix}u_c\\v_c\\1\end{bmatrix}
   =
   K_c\,[R_c\mid T_c]\,
   \begin{bmatrix}X_w\\Y_w\\Z_w\\1\end{bmatrix},
   $$

   其中 $K_c$ 是内参，$[R_c|T_c]$ 是外参，$(X_w,Y_w,Z_w)$ 是空间点。

2. **投影仪（逆相机）成像方程**

   $$
   Z_p
   \begin{bmatrix}u_p\\v_p\\1\end{bmatrix}
   =
   K_p\,[R_p\mid T_p]\,
   \begin{bmatrix}X_w\\Y_w\\Z_w\\1\end{bmatrix}.
   $$

3. **投影矩阵表示**
   令 $P_c=K_c[R_c|T_c]$，$P_p=K_p[R_p|T_p]$，则上式可写为：

   $$
   Z_c\,[u_c\,v_c\,1]^\top \;=\;P_c\,[X_w\,Y_w\,Z_w\,1]^\top,\quad
   Z_p\,[u_p\,v_p\,1]^\top \;=\;P_p\,[X_w\,Y_w\,Z_w\,1]^\top.
   $$

4. **线性方程组**
   将二者联立，消去深度 $Z_c,Z_p$，可构造齐次线性方程

   $$
   A\;\begin{bmatrix}X_w\\Y_w\\Z_w\\1\end{bmatrix}
   = \mathbf{0},
   $$

   其中矩阵 $A$ 的形式为

   $$
   A=\begin{bmatrix}
     u_c\,P^c_3 - P^c_1\\
     v_c\,P^c_3 - P^c_2\\
     u_p\,P^p_3 - P^p_1
   \end{bmatrix},
   $$

   $P^c_i$ 是 $P_c$ 的第 $i$ 行，$P^p_i$ 是 $P_p$ 的第 $i$ 行。 ([blog.csdn.net][1])

5. **显式解深度**
   由上式可解得空间坐标：

   $$
   \begin{bmatrix}X_w\\Y_w\\Z_w\end{bmatrix}
   = M^{-1}\mathbf{b},
   $$

   其中

   $$
   M=
   \begin{bmatrix}
     p^{c}_{11}-u_c\,p^{c}_{31} & p^{c}_{12}-u_c\,p^{c}_{32} & p^{c}_{13}-u_c\,p^{c}_{33}\\
     p^{c}_{21}-v_c\,p^{c}_{31} & p^{c}_{22}-v_c\,p^{c}_{32} & p^{c}_{23}-v_c\,p^{c}_{33}\\
     p^{p}_{11}-u_p\,p^{p}_{31} & p^{p}_{12}-u_p\,p^{p}_{32} & p^{p}_{13}-u_p\,p^{p}_{33}
   \end{bmatrix},
   \quad
   \mathbf{b}=
   \begin{bmatrix}
     p^{c}_{34}u_c - p^{c}_{14}\\
     p^{c}_{34}v_c - p^{c}_{24}\\
     p^{p}_{34}u_p - p^{p}_{14}
   \end{bmatrix}.
   $$

   反解即可得到 $(X_w,Y_w,Z_w)$。 ([blog.csdn.net][1])

---

这样，通过格雷码建立 $(u_c,v_c)\leftrightarrow(u_p,v_p)$ 对应，结合两“相机”几何模型的三角测量，就能精准恢复结构光系统下每个像素的空间坐标。

