#### 用于控制和模拟简单机器人手臂的类 robot_arm。
该类包括正向运动学、逆向运动学、碰撞检测、路径规划等功能，
并提供了3D可视化功能来展示机器人的运动

代码定义了一个用于控制和模拟简单机器人手臂的类 robot_arm，并提供了一些关键功能：
正向和逆向运动学：计算末端执行器的位置和关节角度。
碰撞检测：检查机器人是否与障碍物发生碰撞。
路径规划：生成机器人的运动路径。
3D 可视化：在三维空间中绘制机器人的运动路径和障碍物，帮助直观地理解机器人的工作过程。
通过这些功能，用户可以模拟和验证机器人手臂在特定环境下的运动情况，并确保其路径不与障碍物发生碰撞。


#### 主要模块和包：
  numpy：用于科学计算，特别是数组操作。
  matplotlib.pyplot 和 mpl_toolkits.mplot3d：用于3D绘图。


#### 类属性：
```cpp
class robot_arm():
    x_init = [1.5, 0, 0.1]  # 初始位置
    x_product = [1, 1.5]  # 产品位置

    l1 = 1  # 机器人的某一长度参数
    security = 0.005  # 安全距离

    obstacle_center = np.array([0.0, 1.5])  # 障碍物中心位置
    obstacle_radius = 0.2  # 障碍物半径
    obstacle_height = 0.2  # 障碍物高度

    lim_angle = np.array((-np.pi, np.pi))  # 角度限制
    lim_length_d2 = np.array((1, 2))  # 伸缩范围限制
    lim_length_d3 = np.array((0, 0.9))  # 另一伸缩范围限制
```

#### 路径定义：
if x_product[0] > 0:
    Xn = np.array([x_init, [x_init[0], x_init[1], 1], [x_product[0], x_product[1], 1], [x_product[0], x_product[1], 0.1]])
if x_product[0] <= 0 and x_product[1] <= 1.5:
    Xn = np.array([x_init, [0, 1.5, 1], [0, 1.5 - (0.2 + 0.005 + 0.001), 1], [x_product[0], x_product[1], 1], [x_product[0], x_product[1], 0.1]])
if x_product[0] < 0 and x_product[1] > 1.5:
    Xn = np.array([x_init, [0, 1.5, 1], [0, 1.5 + (0.2 + 0.005 + 0.001), 1], [x_product[0], x_product[1], 1], [x_product[0], x_product[1], 0.1]])


#### 初始化函数：
def __init__(self):
    pass


#### 正向运动函数
def direct_kinematics(self, q):
    x = q[1] * np.cos(q[0])
    y = q[1] * np.sin(q[0])
    z = self.l1 - q[2]
    return np.array([x, y, z])  # 返回末端执行器的位置


#### 逆向运动函数：
def inv_kinematics(self, X):
    tetha1 = np.arctan2(X[1], X[0])
    d2 = ((X[0]**2) + (X[1]**2))**0.5
    d3 = 0.9
    values = np.array([tetha1, d2, d3])
    return values

#### 碰撞检测函数：
def collision_checker(self, q):
    x = self.direct_kinematics(q)
    radius = (self.x_product[0]**2 + self.x_product[1]**2)**0.5

    distance = np.linalg.norm(x[:2] - self.obstacle_center[:2])
    if distance < self.obstacle_radius + self.security and 0 < x[2] < self.obstacle_height + self.security:
        return True
    if -2 < self.x_product[0] < -1 and self.x_product[1] < self.security:
        raise Exception("Error : the final position is too close to the workspace limit")
    if 1 <= radius <= 1 + self.security:
        raise Exception("Error : the final position is too close to the workspace limit")
    if 2 >= radius >= 2 - self.security:
        raise Exception("Error : the final position is too close to the workspace limit")
    if radius > 2 or radius < 1:
        raise Exception("Error : the final position is outside the workspace")
    if (x[0] < self.lim_angle[0]) or (x[0] > self.lim_angle[1]):
        return True
    if (x[1] < self.lim_length_d2[0]) or (x[1] > self.lim_length_d2[1]):
        return True
    if (x[2] < self.lim_length_d3[0]) or (x[2] > self.lim_length_d3[1]):
        return True
    return False

#### 路径规划函数：
def theta_pol(self, X, T=1):
    Tt = np.linspace(0, T, 100)
    Q = []
    for i in range(1, len(X)):
        q1 = self.inv_kinematics(X[i-1])
        q2 = self.inv_kinematics(X[i])

        a1 = np.zeros((3,))
        a0 = q1
        a3 = (q2 - q1) / (T**3 - 1.5*T**4)
        a2 = -1.5 * a3 * T**2
        [Q.append(a0 + a1 * t + a2 * t**2 + a3 * t**3) for t in Tt]
    Q = np.array(Q)
    X = np.array([self.direct_kinematics(q) for q in Q])
    return Q, X


#### 3D可视化函数plot_3D 负责在三维空间中绘制机器人手臂的运动路径和工作空间中的障碍物
def plot_3D(self, location):
    fig = plt.figure()
    ax = plt.axes(projection="3d")

    Q, X = self.theta_pol(location, 1)
    ax.plot3D(X[:, 0], X[:, 1], X[:, 2])

    red = (1, 0, 0, 1)
    grey = (0.5, 0.5, 0.5, 1)
    z_cylinder = np.linspace(0, 0.2, 100)
    r_cylinder = 0.2
    tetha_cylinder = np.linspace(0, 2 * np.pi, 100)
    X_cylinder = r_cylinder * np.cos(tetha_cylinder)
    Y_cylinder = r_cylinder * np.sin(tetha_cylinder) + 1.5
    a_cylinder, Z_cylinder = np.meshgrid(tetha_cylinder, z_cylinder)

    r_int = 1
    tetha_int = np.linspace(0, np.pi, 100)
    X_int = r_int * np.cos(tetha_int)
    Y_int = r_int * np.sin(tetha_int)

    r_ext = 2
    tetha_ext = tetha_int
    X_ext = r_ext * np.cos(tetha_int)
    Y_ext = r_ext * np.sin(tetha_int)

    # 定义矩形顶点
    left_rect_x = np.array([-2, -2, -1, -1])
    left_rect_y = np.array([0, 0, 0, 0])
    left_rect_z = np.array([0, 0.05, 0.05, 0])
    left_rectangle_verts = np.vstack((left_rect_x, left_rect_y, left_rect_z)).T

    right_rect_x = np.array([1, 1, 2, 2])
    right_rect_y = np.array([0, 0, 0, 0])
    right_rect_z = np.array([0, 0.05, 0.05, 0])
    right_rectangle_verts = np.vstack((right_rect_x, right_rect_y, right_rect_z)).T

    # 定义矩形面
    left_rectangle_faces = [[0, 1, 2], [0, 1, 3]]
    right_rectangle_faces = [[0, 1, 2], [0, 1, 3]]

    # 创建矩形
    left_rectangle = Poly3DCollection([left_rectangle_verts[face] for face in left_rectangle_faces], alpha=0.5)
    left_rectangle.set_facecolor('grey')
    right_rectangle = Poly3DCollection([right_rectangle_verts[face] for face in right_rectangle_faces], alpha=0.5)
    right_rectangle.set_facecolor('grey')

    # 添加矩形到图中
    ax.add_collection3d(right_rectangle)
    ax.add_collection3d(left_rectangle)

    ax.plot_surface(X_cylinder, Y_cylinder, Z_cylinder, color=red)
    ax.plot_surface(X_int, Y_int, z_cylinder[:100], color=grey)
    ax.plot_surface(X_cylinder, Y_cylinder, Z_cylinder, color=red)
    ax.plot_surface(X_int, Y_int, z_cylinder[:100], color=grey)
    ax.plot_surface(X_ext, Y_ext, z_cylinder[:100], color=grey)
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_axis_on()
    ax.grid(True)
    plt.show()

#### 3D可视化函数的主要功能：
路径绘制：
通过调用 theta_pol 方法生成机器人沿着路径 location 的关节角度和末端执行器的位置。
使用 plot3D 函数绘制末端执行器的运动路径。
障碍物绘制：
使用 plot_surface 方法绘制工作空间中的圆柱形障碍物。
绘制内、外圆环表示机器人的工作空间范围。
矩形（工作空间边界）绘制：
定义矩形顶点和面，表示工作空间的边界。
使用 Poly3DCollection 创建矩形，并添加到3D图中。

#### 脚本主体部分：
   脚本主体部分用于实例化 robot_arm 类，计算机器人末端位置，并检查碰撞情况，最后可视化路径。

#### 实例化机器人手臂
robot = robot_arm()

#### 根据产品位置定义路径
if robot.x_product[0] > 0:
    Xn = np.array([robot.x_init, [robot.x_init[0], robot.x_init[1], 1], [robot.x_product[0], robot.x_product[1], 1], [robot.x_product[0], robot.x_product[1], 0.1]])
if robot.x_product[0] <= 0 and robot.x_product[1] <= 1.5:
    Xn = np.array([robot.x_init, [robot.x_init[0], robot.x_init[1], 1], [0, 1.5 - (0.2 + 0.005 + 0.001), 1], [robot.x_product[0], robot.x_product[1], 1], [robot.x_product[0], robot.x_product[1], 0.1]])
if robot.x_product[0] < 0 and robot.x_product[1] > 1.5:
    Xn = np.array([robot.x_init, [robot.x_init[0], robot.x_init[1], 1], [0, 1.5 + (0.2 + 0.005 + 0.001), 1], [robot.x_product[0], robot.x_product[1], 1], [robot.x_product[0], robot.x_product[1], 0.1]])

#### 计算逆向运动学得到最终位置的关节角度和伸缩量
final_position = [robot.x_product[0], robot.x_product[1], 0.1]
tetha1_d2_d3 = robot.inv_kinematics(final_position)

#### 检查末端执行器是否与障碍物碰撞
if robot.collision_checker(tetha1_d2_d3):
    print("Warning: End-effector in collision!!!")
else:
    print("No collision.")

#### 可视化路径
robot.plot_3D(Xn)

以上脚本主体部分的主要步骤：
实例化机器人手臂：
创建一个 robot_arm 对象。
定义路径：
根据产品位置 x_product，选择相应的路径并存储在变量 Xn 中。
逆向运动学计算：
使用 inv_kinematics 方法计算末端执行器在目标位置的关节角度和伸缩量。
碰撞检测：
使用 collision_checker 方法检查末端执行器是否与障碍物发生碰撞。
路径可视化：
调用 plot_3D 方法在三维空间中绘制机器人手臂的运动路径和障碍物。


#### 完整代码：

```cpp
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits import mplot3d # Package for 3D plotting
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from matplotlib.patches import Rectangle

class robot_arm():
    x_init = [1.5,0,0.1]
    x_product = [1,1.5]

    
    l1 = 1

    security = 0.005
    
    obstacle_center = np.array([0.0, 1.5])  # center of cylindrical obstacle
    obstacle_radius = 0.2  # radius of cylindrical obstacle
    obstacle_height = 0.2  # height of cylindrical obstacle

    # define path steps
    if x_product[0] > 0 :
        Xn = np.array([x_init,[x_init[0],x_init[1],1], [x_product[0], x_product[1],1], [x_product[0],x_product[1],0.1]])
    if x_product[0] <= 0 and x_product[1] <= 1.5:
        Xn = np.array([x_init,[0,1.5,1],[0,1.5-(0.2+0.005+0.001), 1],[x_product[0],x_product[1],1],  [x_product[0],x_product[1],0.1]])
    if x_product[0] < 0 and x_product[1] > 1.5 :
        Xn = np.array([x_init,[0,1.5,1],[0,1.5+(0.2+0.005+0.001), 1],[x_product[0],x_product[1],1],  [x_product[0],x_product[1],0.1]])

    lim_angle = np.array((-np.pi, np.pi))
    lim_length_d2 = np.array((1, 2))
    lim_length_d3 = np.array((0, 0.9))

    # ---------------------------------------------------------------------------------------------------------
    def __init__(self):
        pass
    # ---------------------------------------------------------------------------------------------------------
    # Direct kinematics function - receives the angles of the robot and returns the position of the end-effector
    def direct_kinematics(self, q):
        x = q[1]*np.cos(q[0])
        y = q[1]*np.sin(q[0])
        z = self.l1-q[2]
    
        return np.array([x, y, z]) # Position of end-effector
    
    
    def inv_kinematics(self, X):         
        tetha1 = np.arctan2(X[1], X[0])
        d2 = ((X[0]**(2))+(X[1]**(2)))**(0.5)
        d3 = 0.9
        values = np.array([tetha1,d2,d3])
        return values

    # ---------------------------------------------------------------------------------------------------------
    # Checks if the end-effector is in collision with the obstacle, returns: True - in collision, False - no collision
    def collision_checker(self,q):
        x = self.direct_kinematics(q)
        radius = (self.x_product[0]**2+self.x_product[1]**2)**(0.5)

        distance = np.linalg.norm(x[:2] - self.obstacle_center[:2])
        if distance < self.obstacle_radius+self.security and 0 < x[2] < self.obstacle_height+self.security:
            return True
        if -2< self.x_product[0] <-1 and self.x_product[1]<self.security:
            raise Exception("Error : the final position is to close to the workspace limit")
        if 1 <= radius <= 1+ self.security :
            raise Exception("Error : the final position is to close to the workspace limit")
        if 2 >= radius >= 2- self.security :
            raise Exception("Error : the final position is to close to the workspace limit")
        if radius > 2 or radius < 1 :
            raise Exception("Error : the final position is outside the workspace")
        
        # Check if angle & lengths in limit
        if (x[0] < self.lim_angle[0]) or (x[0] > self.lim_angle[1]):
            return True 
        if (x[1] < self.lim_length_d2[0]) or (x[1] > self.lim_length_d2[1]):
            return True
        if (x[2] < self.lim_length_d3[0]) or (x[2]> self.lim_length_d3[1]):
            return True
        
        
        
        return False # No collsion

    # ---------------------------------------------------------------------------------------------------------

    def theta_pol(self, X, T=1):
        Tt = np.linspace(0, T, 100)
        Q = []
        for i in range(1, len(X)):
            q1 = self.inv_kinematics(X[i-1])             
            q2 = self.inv_kinematics(X[i])

            a1 = np.zeros((3,))             
            a0 = q1            
            a3 = (q2 - q1) / (T**3 - 1.5*T**4)             
            a2 = -1.5 * a3 * T**2              
            [Q.append(a0 + a1*t + a2 * t**2 + a3 * t**3) for t in Tt]
        Q=np.array(Q)

        X = np.array([self.direct_kinematics(q) for q in Q])
        return Q, X
    
    #------------------------------------
    # Plot the robot in 3D

    def plot_3D(self,location):

        # X=np.array([0,0,0],[0,0,self.l1],######################)
        # ax.plot3D(X[:,0],X[:,1],X[:,2],"-ok", markersize = 10)
        # xyz = self.direct_kinematics(self, q)
        # ax.scatter3D(xyw[0], xyz[1],xyz[2], color = "gold")
        # ax.scatter3D(0,0,0, color = "limegreen")

        fig = plt.figure()
        ax = plt.axes(projection = "3d")

        a= location
        Q ,X = self.theta_pol(a, 1)
        ax.plot3D(X[:,0],X[:,1],X[:,2])

        red = (1, 0, 0, 1)
        grey = (0.5, 0.5, 0.5, 1)
        z_cylinder = np.linspace(0,0.2,100)
        z_boudaries = np.linspace(0,0.05,100)

        r_cylinder = 0.2
        tetha_cylinder = np.linspace(0,2*np.pi, 100)
        X_cylinder = r_cylinder*np.cos(tetha_cylinder)
        Y_cylinder = r_cylinder*np.sin(tetha_cylinder) + 1.5
        a_cylinder,Z_cylinder = np.meshgrid(tetha_cylinder,z_cylinder)

        r_int = 1
        tetha_int = np.linspace(0,np.pi, 100)
        X_int = r_int*np.cos(tetha_int)
        Y_int = r_int*np.sin(tetha_int)
        a_int,Z_int = np.meshgrid(tetha_int,z_boudaries)

        r_ext = 2
        tetha_ext = tetha_int
        X_ext = r_ext*np.cos(tetha_int)
        Y_ext = r_ext*np.sin(tetha_int)
        a_ext,Z_ext = np.meshgrid(tetha_ext,z_boudaries)

        # Define the rectangle vertices
        left_rect_x = np.array([-2, -2, -1, -1])
        left_rect_y = np.array([0, 0, 0, 0])
        left_rect_z = np.array([0, 0.05, 0.05, 0])
        left_rectangle_verts = np.vstack((left_rect_x, left_rect_y, left_rect_z)).T

        right_rect_x = np.array([1, 1, 2, 2])
        right_rect_y = np.array([0, 0, 0, 0])
        right_rect_z = np.array([0, 0.05, 0.05, 0])
        right_rectangle_verts = np.vstack((right_rect_x, right_rect_y, right_rect_z)).T

        # Define the rectangle faces
        left_rectangle_faces = [[0, 1, 2], [0, 1, 3]]
        right_rectangle_faces = [[0, 1, 2], [0, 1, 3]]

        # Create the rectangle
        left_rectangle = Poly3DCollection([left_rectangle_verts[face] for face in left_rectangle_faces], alpha=0.5)
        left_rectangle.set_facecolor('grey')
        right_rectangle = Poly3DCollection([right_rectangle_verts[face] for face in right_rectangle_faces], alpha=0.5)
        right_rectangle.set_facecolor('grey')

        # Add the rectangle to the plot
        ax.add_collection3d(right_rectangle)
        ax.add_collection3d(left_rectangle)

        ax.plot_surface(X_cylinder,Y_cylinder,Z_cylinder, color = red)
        ax.plot_surface(X_int,Y_int,Z_int, color = grey)
        ax.plot_surface(X_ext,Y_ext,Z_ext, color = grey)
        #ax.scatter3D(location[0],location[1],location[2])
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z')
        # ax.set_xlim([-2, 2])
        # ax.set_ylim([-2, 2])
        # ax.set_zlim([0, 0.25])
        ax.set_axis_on()
        ax.grid(True)
        plt.show()
```
        




