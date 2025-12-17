---
legacy: true
id: matlab-robotics-simulation-guide
title: MATLAB 机器人仿真完全指南
sidebar_label: MATLAB 机器人仿真
description: 详细介绍如何使用 MATLAB 进行机器人仿真，包括坐标变换、机器人建模、运动学、动力学、路径规划和控制系统设计
date: 2021-09-24T19:54:29+08:00
tags: [MATLAB, 机器人, 仿真, 运动学, 动力学, 路径规划, 控制]
authors: [w0x7ce]
---

# MATLAB 机器人仿真完全指南

MATLAB 是机器人仿真和控制的强大工具，提供了丰富的工具箱和函数库。本指南将详细介绍如何使用 MATLAB 进行机器人仿真，涵盖从基础概念到高级应用的全方位内容。

## 目录

- [MATLAB 机器人工具箱简介](#matlab-机器人工具箱简介)
- [坐标系统与变换](#坐标系统与变换)
- [二维空间仿真](#二维空间仿真)
- [三维空间仿真](#三维空间仿真)
- [机器人建模](#机器人建模)
- [正向运动学](#正向运动学)
- [逆向运动学](#逆向运动学)
- [动力学仿真](#动力学仿真)
- [路径规划](#路径规划)
- [轨迹生成](#轨迹生成)
- [控制器设计](#控制器设计)
- [实际案例](#实际案例)
- [高级应用](#高级应用)
- [最佳实践](#最佳实践)
- [总结](#总结)

## MATLAB 机器人工具箱简介

### 工具箱功能

MATLAB Robotics System Toolbox 提供以下功能：

- **机器人建模**：创建刚体链和机器人模型
- **运动学求解**：正向和逆向运动学
- **动力学仿真**：考虑质量、惯性和摩擦
- **路径规划**：A*、RRT 等算法
- **轨迹生成**：样条插值和轨迹优化
- **可视化**：3D 动画和交互式显示
- **代码生成**：生成 C/C++ 代码

### 安装和设置

```matlab
% 检查工具箱
ver('robotics')

% 如果未安装，使用以下命令安装
% roboticsToolbox = matlab.addons.ToolboxInstaller
```

### 基本使用

```matlab
% 导入工具箱
import robotics.*

% 查看示例
roboticsExampleGenerator
```

## 坐标系统与变换

### 齐次变换矩阵

在机器人学中，齐次变换矩阵用于描述坐标系之间的变换：

```
T = [R  t]
    [0  1]
```

其中：
- `R`：3×3 旋转矩阵
- `t`：3×1 平移向量
- `0`：1×3 零向量
- `1`：标量 1

### 变换运算

```matlab
% 矩阵乘法（坐标系复合变换）
T_total = T1 * T2 * T3

% 矩阵求逆（逆变换）
T_inv = inv(T)

% 变换插值
T_interp = trinterp(T1, T2, s)  % s ∈ [0,1]
```

## 二维空间仿真

### SE2 类基础

SE2 表示二维特殊欧几里得群，用于描述二维空间中的刚体变换。

#### 创建二维变换

```matlab
% 创建平移+旋转的变换矩阵
% 语法：SE2(x, y, theta)
T1 = SE2(1, 2, 30*pi/180)

% 显示变换矩阵
disp(T1);
% 输出：
%    0.8660   -0.5000         1
%    0.5000    0.8660         2
%         0         0         1

% 设置坐标系范围
axis([0 5 0 5])
grid on

% 绘制坐标系
trplot2(T1, 'frame', '1', 'color', 'b', 'length', 0.5)

% 保存图像
print -dpng robot_frame1.png
```

#### 复合变换

```matlab
% 创建第二个变换
T2 = SE2(2, 1, 0);

% 绘制第二个坐标系
hold on
trplot2(T2, 'frame', '2', 'color', 'r', 'length', 0.5)

% 复合变换：T3 = T1 * T2
T3 = T1 * T2

% 绘制复合变换后的坐标系
trplot2(T3, 'frame', '3', 'color', 'g', 'length', 0.5)

% 验证变换顺序的影响
T4 = T2 * T1
trplot2(T4, 'frame', '4', 'color', 'c', 'length', 0.5)

% 图例
legend('Frame 1', 'Frame 2', 'Frame 3 (T1*T2)', 'Frame 4 (T2*T1)', 'Location', 'best')
```

#### 逆变换

```matlab
% 计算逆变换
T1_inv = inv(T1)

% 验证：T * T_inv = I
T1 * T1_inv

% 相对变换
T_rel = T1 \ T2  % 等价于 inv(T1) * T2
```

### 旋转向量

```matlab
% 创建旋转向量
theta = 45 * pi / 180;
R = rot2(theta)

% 旋转向量与齐次变换的转换
T = SE2(1, 2, theta);
R = T(1:2, 1:2);
theta = atan2(R(2,1), R(1,1));
```

### 平移向量

```matlab
% 创建平移向量
t = [2; 1];

% 齐次变换中的平移
T = SE2(t(1), t(2), 0);

% 提取平移分量
t_extracted = T(1:2, 3);
```

## 三维空间仿真

### 旋转矩阵

#### 基本旋转

```matlab
% 绕 X 轴旋转
Rx = rotx(pi/2)

% 绕 Y 轴旋转
Ry = roty(pi/2)

% 绕 Z 轴旋转
Rz = rotz(pi/2)

% 组合旋转
R = Rx * Ry

% 验证旋转矩阵性质
assert(norm(R'*R - eye(3)) < 1e-10, 'R 不是正交矩阵');
assert(abs(det(R) - 1) < 1e-10, 'R 不是特殊正交矩阵');
```

#### 欧拉角

```matlab
% ZYX 欧拉角
roll = 30 * pi/180;   % 绕 Z 轴
pitch = 45 * pi/180;  % 绕 Y 轴
yaw = 60 * pi/180;    % 绕 X 轴

% 转换为旋转矩阵
R = euler2r(roll, pitch, yaw, 'zyx')

% 反向转换
[roll_back, pitch_back, yaw_back] = r2euler(R, 'zyx')

% 验证
assert(abs(roll - roll_back) < 1e-10);
assert(abs(pitch - pitch_back) < 1e-10);
assert(abs(yaw - yaw_back) < 1e-10);
```

#### 四元数

```matlab
% 从欧拉角创建四元数
q = euler2q(roll, pitch, yaw, 'zyx')

% 从旋转矩阵创建四元数
q = r2q(R)

% 四元数运算
q_conj = q';        % 共轭
q_norm = norm(q);   % 范数
q_normalized = q / q_norm;  % 归一化

% 四元数插值（球面线性插值）
q_interp = qinterp(q1, q2, s)

% 四元数转换为旋转矩阵
R = q2r(q)
```

### 三维变换

```matlab
% 创建齐次变换矩阵
T = transl(1, 2, 3) * trotx(pi/4) * troty(pi/4)

% 使用 SE3 类
T_se3 = se3(1, 2, 3, 'euler', 'ZYX', [30, 45, 60]*pi/180)

% 绘制三维坐标系
figure
trplot(T, 'frame', 'A', 'color', 'b', 'length', 1)
hold on
trplot(eye(4), 'frame', 'O', 'color', 'k', 'length', 1)

% 动画显示旋转变换
tranimate(T)
```

### 平移动画

```matlab
% 创建动画序列
for i = 1:50
    T_temp = transl(0, i*0.1, 0) * trotx(pi/4 * i/50);
    trplot(T_temp, 'frame', 'B', 'color', 'r', 'length', 0.5);
    drawnow;
    pause(0.01);
end

% 或使用 tranimate 函数
tranimate(T, 'length', 0.5, 'color', 'b')
```

## 机器人建模

### 创建机器人模型

```matlab
% 创建刚体和关节
link1 = Link('revolute', 'a', 1, 'alpha', pi/2);
link2 = Link('revolute', 'a', 1, 'alpha', 0);
link3 = Link('prismatic', 'a', 1, 'alpha', pi/2, 'qlim', [0 1]);

% 创建机器人
robot = SerialLink([link1 link2 link3], 'name', 'myRobot');

% 显示机器人模型
robot.plot([0 pi/4 pi/2])
robot.teach

% 机器人信息
robot.fkine([0.1 0.2 0.3])  % 正向运动学
robot.ikine(transl(1, 2, 3)) % 逆向运动学
```

### DH 参数建模

```matlab
% 标准 DH 参数表
% alpha(i-1), a(i-1), d(i), theta(i)
L1 = Link([0, 0, 0.5, 0]);
L2 = Link([0, 1, 0, 0]);
L3 = Link([0, 0.5, 0, 0]);

% 创建机器人
robot = SerialLink([L1 L2 L3], 'name', 'planar3R');

% 绘图
q = [pi/6, pi/4, pi/3];
robot.plot(q)

% 正向运动学
T = robot.fkine(q)

% 雅可比矩阵
J = robot.jacob0(q)
J = robot.jacobe(q)  % 末端执行器坐标系下的雅可比
```

### 图形化建模工具

```matlab
% 启动机器人建模器
robotModeller

% 或使用 roboticsRobotImporter 从 URDF 文件导入
robot = importrobot('humanoid.urdf');
show(robot);
```

## 正向运动学

### 基础计算

```matlab
% 定义关节角度
q1 = 0.3;
q2 = 0.5;
q3 = 0.7;

% 计算正向运动学
T = robot.fkine([q1 q2 q3]);

% 提取位置
p = T(1:3, 4);

% 提取旋转矩阵
R = T(1:3, 1:3);

% 提取欧拉角
euler_angles = tr2euler(T);
```

### 轨迹可视化

```matlab
% 生成关节轨迹
t = linspace(0, 10, 100);
q = [sin(t); cos(t); 0.5*sin(2*t)];

% 绘制机器人运动
robot.plot(q')

% 计算末端执行器轨迹
T_traj = robot.fkine(q');
p_traj = squeeze(T_traj(1:3, 4, :));

% 绘制轨迹
figure
plot3(p_traj(1,:), p_traj(2,:), p_traj(3,:), 'b-', 'LineWidth', 2)
grid on
xlabel('X')
ylabel('Y')
zlabel('Z')
title('末端执行器轨迹')
```

### 工作空间分析

```matlab
% 蒙特卡洛方法分析工作空间
N = 10000;
q1_range = linspace(-pi, pi, 50);
q2_range = linspace(-pi, pi, 50);
q3_range = linspace(-pi, pi, 50);

workspace = zeros(N, 3);
for i = 1:N
    q = [rand*2*pi-pi, rand*2*pi-pi, rand*2*pi-pi];
    T = robot.fkine(q);
    workspace(i, :) = T(1:3, 4)';
end

% 可视化工作空间
figure
plot3(workspace(:,1), workspace(:,2), workspace(:,3), 'r.', 'MarkerSize', 1)
xlabel('X'); ylabel('Y'); zlabel('Z')
title('机器人工作空间')
grid on
```

## 逆向运动学

### 解析解法

```matlab
% 对于 2R 平面机器人，解析解
function q = ikine_2R(p, L1, L2)
    x = p(1); y = p(2);

    % 计算肘部角度
    c2 = (x^2 + y^2 - L1^2 - L2^2) / (2*L1*L2);
    s2 = sqrt(1 - c2^2);

    % 两个解（肘上、肘下）
    q2(1) = atan2(s2, c2);
    q2(2) = atan2(-s2, c2);

    % 计算肩部角度
    for i = 1:2
        q1(i) = atan2(y, x) - atan2(L2*sin(q2(i)), L1 + L2*cos(q2(i)));
    end

    q = [q1' q2'];
end
```

### 数值解法

```matlab
% 使用数值方法求解逆运动学
q0 = [0 0 0];  % 初始猜测
T_target = transl(0.5, 0.5, 0);

% ikine 方法
q_solution = robot.ikine(T_target, 'q0', q0);

% 验证解
T_solution = robot.fkine(q_solution);
fprintf('误差: %f\n', norm(T_target - T_solution));

% 处理多解情况
[q1, err1] = robot.ikine(T_target, 'q0', [0 0 0]);
[q2, err2] = robot.ikine(T_target, 'q0', [pi 0 0]);
[q3, err3] = robot.ikine(T_target, 'q0', [-pi 0 0]);
```

### 梯度下降法

```matlab
% 自定义逆运动学求解器
function q = ikine_gradient(T_target, robot, q_init, max_iter)
    q = q_init;
    for i = 1:max_iter
        % 计算当前正向运动学
        T_current = robot.fkine(q);

        % 计算误差
        e = T_target - T_current;
        error_norm = norm(e, 'fro');

        if error_norm < 1e-6
            fprintf('收敛于第 %d 次迭代\n', i);
            break;
        end

        % 计算雅可比矩阵
        J = robot.jacob0(q);

        % 伪逆求解
        dq = pinv(J) * e(1:3, 4);

        % 更新关节角度
        q = q + 0.1 * dq';
    end
end
```

## 动力学仿真

### 动力学方程

机器人动力学方程：
```
M(q) * qdd + C(q, qd) * qd + G(q) = τ
```

其中：
- `M(q)`：惯性矩阵
- `C(q, qd)`：科里奥利力和离心力矩阵
- `G(q)`：重力向量
- `τ`：关节驱动力矩

### 惯性矩阵计算

```matlab
% 计算惯性矩阵
q = [0.1 0.2 0.3];
M = robot.inertia(q)

% 验证惯性矩阵性质
assert(norm(M - M') < 1e-10, 'M 应该是对称矩阵');
eig(M)  % 特征值应该为正
```

### 完整动力学仿真

```matlab
% 仿真参数
dt = 0.01;
t_final = 5;
t = 0:dt:t_final;

% 初始状态
q = [0; 0; 0];  % 关节角度
qd = [0; 0; 0]; % 关节速度

% 仿真循环
for i = 1:length(t)
    % 计算惯性矩阵
    M = robot.inertia(q);

    % 计算科里奥利力和离心力
    C = robot.coriolis(q, qd);

    % 计算重力
    G = robot.gravload(q);

    % 控制输入（简单 PID 控制）
    q_desired = [sin(t(i)); cos(t(i)); 0.5*sin(2*t(i))];
    qd_desired = [cos(t(i)); -sin(t(i)); cos(2*t(i))];

    Kp = 10 * eye(3);
    Kd = 2 * eye(3);

    tau = Kp * (q_desired - q) + Kd * (qd_desired - qd) + G;

    % 动力学积分
    qdd = M \ (tau - C*qd - G);

    % 更新状态
    qd = qd + qdd * dt;
    q = q + qd * dt;

    % 记录数据
    Q(:, i) = q;
    QD(:, i) = qd;
    QDD(:, i) = qdd;
    Tau(:, i) = tau;
end

% 绘制结果
figure('Position', [100 100 1200 800]);

subplot(2, 2, 1);
plot(t, Q');
xlabel('时间 (s)');
ylabel('关节角度 (rad)');
title('关节角度');
legend('q1', 'q2', 'q3');
grid on;

subplot(2, 2, 2);
plot(t, QD');
xlabel('时间 (s)');
ylabel('关节速度 (rad/s)');
title('关节速度');
legend('qd1', 'qd2', 'qd3');
grid on;

subplot(2, 2, 3);
plot(t, QDD');
xlabel('时间 (s)');
ylabel('关节加速度 (rad/s²)');
title('关节加速度');
legend('qdd1', 'qdd2', 'qdd3');
grid on;

subplot(2, 2, 4);
plot(t, Tau');
xlabel('时间 (s)');
ylabel('关节力矩 (N·m)');
title('关节力矩');
legend('τ1', 'τ2', 'τ3');
grid on;
```

## 路径规划

### A* 算法

```matlab
% A* 路径规划
function path = a_star(start, goal, map)
    % 初始化
    openSet = [start];
    cameFrom = containers.Map();
    gScore = containers.Map('KeyType', 'char', 'ValueType', 'double');
    fScore = containers.Map('KeyType', 'char', 'ValueType', 'double');

    % 起点评分
    gScore(num2str(start)) = 0;
    fScore(num2str(start)) = heuristic(start, goal);

    while ~isempty(openSet)
        % 找到 fScore 最小的节点
        current = openSet(1);
        [~, idx] = min(cellfun(@(x) fScore(num2str(x)), num2cell(openSet, 2)));
        current = openSet{idx};

        % 到达目标
        if isequal(current, goal)
            path = reconstruct_path(cameFrom, current);
            return;
        end

        % 从开放集合移除当前节点
        openSet(idx) = [];

        % 检查邻居
        neighbors = get_neighbors(current, map);
        for neighbor = neighbors
            tentative_g = gScore(num2str(current)) + cost(current, neighbor);

            if ~gScore.isKey(num2str(neighbor)) || ...
               tentative_g < gScore(num2str(neighbor))
                cameFrom(num2str(neighbor)) = current;
                gScore(num2str(neighbor)) = tentative_g;
                fScore(num2str(neighbor)) = tentative_g + heuristic(neighbor, goal);

                if ~any(cellfun(@(x) isequal(x, neighbor), openSet))
                    openSet{end+1} = neighbor;
                end
            end
        end
    end
end
```

### RRT 算法

```matlab
% 快速随机搜索树（RRT）
function path = rrt(start, goal, robot, map, maxIter)
    nodes = struct('q', {start}, 'parent', {-1});

    for i = 1:maxIter
        % 随机采样
        q_rand = random_config(map);

        % 找到最近的节点
        distances = cellfun(@(node) norm(node.q - q_rand), nodes);
        [~, nearest_idx] = min(distances);
        q_nearest = nodes(nearest_idx).q;

        % 扩展树
        q_new = extend(q_nearest, q_rand, step_size);

        % 检查碰撞
        if ~check_collision(q_new, robot, map)
            nodes(end+1) = struct('q', {q_new}, 'parent', {nearest_idx});

            % 检查是否到达目标
            if norm(q_new - goal) < goal_radius
                % 重建路径
                path = [];
                current_idx = length(nodes);
                while current_idx ~= -1
                    path = [nodes(current_idx).q; path];
                    current_idx = nodes(current_idx).parent;
                end
                return;
            end
        end
    end
end
```

### 轨迹优化

```matlab
% 使用三次样条插值生成平滑轨迹
function trajectory = cubic_spline(q_start, q_end, t_start, t_end, points)
    % 创建时间向量
    t = linspace(t_start, t_end, points);

    % 计算三次样条系数
    for i = 1:length(q_start)
        cs = cubicSpline(t_start, t_end, q_start(i), q_end(i), 0, 0);
        q(:, i) = cs(t);
        qd(:, i) = cs(t, 1);  % 一阶导数
        qdd(:, i) = cs(t, 2); % 二阶导数
    end

    trajectory = struct('t', {t}, 'q', {q}, 'qd', {qd}, 'qdd', {qdd});
end
```

## 轨迹生成

### 关节空间轨迹

```matlab
% 多点轨迹规划
q0 = [0; 0; 0];        % 起始位置
q1 = [pi/4; pi/6; pi/3]; % 中间点
q2 = [pi/2; pi/3; pi/2]; % 结束位置

% 时间分配
t0 = 0; t1 = 2; t2 = 5;

% 轨迹生成
[q_traj, qd_traj, qdd_traj, t] = jtraj(q0, q2, 100, q1, t1);

% 绘制轨迹
figure;
subplot(3, 1, 1);
plot(t, q_traj);
title('关节角度轨迹');
xlabel('时间 (s)'); ylabel('角度 (rad)');
legend('q1', 'q2', 'q3');
grid on;

subplot(3, 1, 2);
plot(t, qd_traj);
title('关节速度轨迹');
xlabel('时间 (s)'); ylabel('速度 (rad/s)');
legend('qd1', 'qd2', 'qd3');
grid on;

subplot(3, 1, 3);
plot(t, qdd_traj);
title('关节加速度轨迹');
xlabel('时间 (s)'); ylabel('加速度 (rad/s²)');
legend('qdd1', 'qdd2', 'qdd3');
grid on;

% 动画演示
robot.plot(q_traj');
```

### 操作空间轨迹

```matlab
% 末端执行器轨迹（直线轨迹）
p0 = [1; 0; 0];
p1 = [0; 1; 0];
p2 = [-1; 0; 0];

% 生成直线轨迹
t = linspace(0, 10, 100);
p = zeros(3, length(t));

for i = 1:length(t)
    s = t(i) / t(end);
    if s <= 0.5
        p(:, i) = p0 + 2*s * (p1 - p0);
    else
        p(:, i) = p1 + 2*(s-0.5) * (p2 - p1);
    end
end

% 逆运动学求解
q_traj = zeros(length(t), robot.n);
for i = 1:length(t)
    T_desired = transl(p(:, i));
    q_traj(i, :) = robot.ikine(T_desired, 'q0', q_traj(max(1, i-1), :));
end

% 绘制轨迹
figure;
plot3(p(1, :), p(2, :), p(3, :), 'r-', 'LineWidth', 2);
hold on;
robot.plot(q_traj);
xlabel('X'); ylabel('Y'); zlabel('Z');
title('操作空间轨迹');
grid on;
legend('期望轨迹', '实际轨迹', 'Location', 'best');
```

## 控制器设计

### PID 控制器

```matlab
classdef PIDController < handle
    properties
        Kp, Ki, Kd
        q_prev, integral
    end

    methods
        function obj = PIDController(Kp, Ki, Kd)
            obj.Kp = Kp;
            obj.Ki = Ki;
            obj.Kd = Kd;
            obj.q_prev = zeros(3, 1);
            obj.integral = zeros(3, 1);
        end

        function tau = compute(obj, q_desired, q_current, qd_desired, qd_current, dt)
            % 位置误差
            e = q_desired - q_current;

            % 速度误差
            ed = qd_desired - qd_current;

            % 积分项
            obj.integral = obj.integral + e * dt;

            % 微分项
            ed_dot = (e - obj.q_prev) / dt;

            % PID 控制律
            tau = obj.Kp * e + obj.Ki * obj.integral + obj.Kd * ed;

            obj.q_prev = e;
        end
    end
end

% 使用示例
pid = PIDController(10, 5, 2);
```

### 计算力矩控制

```matlab
function tau = computed_torque_control(robot, q_desired, qd_desired, qdd_desired, q, qd)
    % 计算期望动力学
    M_desired = robot.inertia(q_desired);
    C_desired = robot.coriolis(q_desired, qd_desired);
    G_desired = robot.gravload(q_desired);

    % 计算实际动力学
    M = robot.inertia(q);
    C = robot.coriolis(q, qd);
    G = robot.gravload(q);

    % 计算误差
    e = q_desired - q;
    ed = qd_desired - qd;

    % PD 前馈控制
    Kp = 50 * eye(3);
    Kd = 10 * eye(3);

    % 计算力矩
    tau_feedforward = M * qdd_desired + C * qd_desired + G_desired;
    tau_feedback = Kp * e + Kd * ed;

    tau = tau_feedforward + tau_feedback;
end
```

### 自适应控制

```matlab
function tau = adaptive_control(robot, q_desired, qd_desired, qdd_desired, q, qd)
    % 参数估计
    [theta, dtheta] = estimate_parameters(q, qd, qdd);

    % 自适应律
    P = eye(robot.n);  % 正定矩阵
    dtheta_adaptive = -P * robot.regressor(q, qd, qdd)' * (qdd_desired - qdd);

    % 更新参数
    theta = theta + dtheta_adaptive * dt;

    % 计算力矩
    tau = robot.inertia(q) * qdd_desired + ...
          robot.coriolis(q, qd) * qd_desired + ...
          robot.gravload(q) - ...
          robot.regressor(q, qd, qdd) * theta;
end
```

## 实际案例

### 案例 1：两轮差分驱动机器人

```matlab
% 创建差分驱动机器人模型
robot = DifferentialDriveRobot('wheelRadius', 0.1, 'trackWidth', 0.5);

% 路径跟踪控制器
classdef PathFollower < handle
    properties
        kp, kd
    end

    methods
        function obj = PathFollower(kp, kd)
            obj.kp = kp;
            obj.kd = kd;
        end

        function [v, w] = compute_control(obj, pose, path, index)
            % 获取路径点
            p_goal = path(:, min(index+1, size(path, 2)));

            % 误差计算
            e = p_goal(1:2) - pose(1:2);
            heading_error = atan2(e(2), e(1)) - pose(3);

            % 控制律
            v = obj.kp * norm(e);
            w = obj.kd * heading_error;
        end
    end
end

% 仿真
dt = 0.1;
t_final = 20;
t = 0:dt:t_final;

pose = [0; 0; 0];  % [x, y, theta]
path = [cos(t); sin(t); zeros(1, length(t))];  % 圆形路径

controller = PathFollower(1, 2);

for i = 1:length(t)
    [v, w] = controller.compute_control(pose, path, i);

    % 运动学模型
    pose_dot = [v*cos(pose(3)); v*sin(pose(3)); w];
    pose = pose + pose_dot * dt;

    % 记录轨迹
    trajectory(:, i) = pose;
end

% 绘制结果
figure;
plot(trajectory(1, :), trajectory(2, :), 'b-', 'LineWidth', 2);
hold on;
plot(path(1, :), path(2, :), 'r--', 'LineWidth', 1);
xlabel('X (m)'); ylabel('Y (m)');
title('路径跟踪仿真');
legend('实际轨迹', '期望轨迹', 'Location', 'best');
grid on;
axis equal;
```

### 案例 2：机械臂轨迹跟踪

```matlab
% 创建 3R 机械臂
L1 = Link([0, 0, 1, 0]);
L2 = Link([0, 1, 0, 0]);
L3 = Link([0, 0.5, 0, 0]);
robot = SerialLink([L1 L2 L3], 'name', '3R');

% 定义任务空间轨迹
t = linspace(0, 5, 100);
x = 1 + 0.5*cos(2*pi*t/5);
y = 0.5*sin(2*pi*t/5);
z = 1 + 0.2*sin(4*pi*t/5);

% 逆运动学求解
q_traj = zeros(100, 3);
for i = 1:100
    T_desired = transl(x(i), y(i), z(i));
    q_traj(i, :) = robot.ikine(T_desired, 'q0', [0 pi/4 pi/2]);
end

% PID 控制器
K_p = 50 * eye(3);
K_d = 10 * eye(3);
K_i = 5 * eye(3);

q_error_integral = zeros(3, 1);
q = [0; 0; 0];
qd = zeros(3, 1);

for i = 1:100
    % 期望值
    q_desired = q_traj(i, :)';
    qd_desired = [0; 0; 0];
    qdd_desired = [0; 0; 0];

    % 误差
    e = q_desired - q;
    ed = qd_desired - qd;

    % 积分项
    q_error_integral = q_error_integral + e * dt;

    % 控制律
    M = robot.inertia(q);
    C = robot.coriolis(q, qd);
    G = robot.gravload(q);

    tau = M * qdd_desired + C * qd_desired + G + ...
          K_p * e + K_d * ed + K_i * q_error_integral;

    % 动力学积分
    qdd = M \ (tau - C*qd - G);
    qd = qd + qdd * dt;
    q = q + qd * dt;

    % 记录数据
    Q(:, i) = q;
    QD(:, i) = qd;
    Tau(:, i) = tau;
end

% 可视化
robot.plot(Q');
title('机械臂轨迹跟踪');
```

## 高级应用

### 碰撞检测

```matlab
function collision = check_collision(q, robot, obstacles)
    % 计算机器人当前位置
    T = robot.fkine(q);

    % 检查每个连杆
    for i = 1:robot.n
        % 获取连杆变换矩阵
        T_link = robot.links(i).A(q(i));

        % 检查与障碍物的碰撞
        for obs = obstacles
            if check_robot_obstacle_collision(T_link, obs)
                collision = true;
                return;
            end
        end
    end

    collision = false;
end
```

### 冗余度解析

```matlab
% 7-DOF 机械臂冗余度解析
robot7 = SerialLink([L1 L2 L3 L4 L5 L6 L7], 'name', '7R');

% 奇异性回避
q0 = [0 pi/4 pi/2 pi/3 pi/4 pi/2 pi/6];
q_goal = [pi/2 0 pi/2 0 pi/2 0 pi/2];

% 零空间投影法
q = q0;
for i = 1:1000
    % 期望运动
    qd_desired = 0.01 * (q_goal - q);

    % 计算雅可比矩阵
    J = robot7.jacob0(q);

    % 零空间投影
    J_pinv = pinv(J);
    N = eye(7) - J_pinv * J;  % 零空间投影矩阵

    % 冗余度解析
    qd = J_pinv * qd_desired + 0.1 * N * qd_nullspace;

    % 更新关节角度
    q = q + qd * dt;

    % 检查碰撞
    if check_collision(q, robot7, obstacles)
        break;
    end

    % 检查是否到达目标
    if norm(q_goal - q) < 1e-3
        break;
    end
end
```

### 机器学习集成

```matlab
% 强化学习控制
env = RobotEnvironment(robot);

% Q-learning
Q = zeros(1000, robot.n * 10);  % 状态-动作空间离散化

alpha = 0.1;  % 学习率
gamma = 0.9;  % 折扣因子
epsilon = 0.1; % 探索率

for episode = 1:1000
    state = env.reset();
    done = false;

    while ~done
        % ε-贪心策略
        if rand < epsilon
            action = randi(size(Q, 2));
        else
            [~, action] = max(Q(state, :));
        end

        % 执行动作
        [next_state, reward, done] = env.step(action);

        % Q-learning 更新
        Q(state, action) = Q(state, action) + ...
            alpha * (reward + gamma * max(Q(next_state, :)) - Q(state, action));

        state = next_state;
    end
end
```

## 最佳实践

### 代码组织

```matlab
% 机器人仿真主脚本
function robot_simulation_main()
    % 1. 机器人建模
    robot = create_robot_model();

    % 2. 控制器设计
    controller = create_controller();

    % 3. 仿真参数
    params = get_simulation_parameters();

    % 4. 执行仿真
    results = run_simulation(robot, controller, params);

    % 5. 结果分析
    analyze_results(results);

    % 6. 可视化
    visualize_results(results);
end

function robot = create_robot_model()
    % 创建连杆
    L1 = Link([0, 0, 1, 0]);
    L2 = Link([0, 1, 0, 0]);

    % 创建机器人
    robot = SerialLink([L1 L2], 'name', 'planar2R');
end
```

### 性能优化

```matlab
% 向量化运算
% 避免循环，使用矩阵运算
q_all = [q1, q2, q3, q4];  % 多个关节角度
T_all = robot.fkine(q_all');  % 同时计算所有变换

% 预分配内存
q = zeros(3, 1000);  % 预分配而不是动态扩展
for i = 1:1000
    q(:, i) = robot.ikine(T(:, :, i));
end

% 使用查找表
function q = ikine_lookup(T_target, lookup_table)
    % 预计算的查找表
    distances = sum((lookup_table.T - T_target).^2, [1 2 3]);
    [~, idx] = min(distances);
    q = lookup_table.q(:, idx);
end
```

### 调试技巧

```matlab
% 绘制中间结果
figure(1);
robot.plot(q);
title('当前机器人位姿');
drawnow;

% 检查变换矩阵
fprintf('变换矩阵:\n');
disp(T);
fprintf('行列式: %f\n', det(T(1:3, 1:3)));

% 检查雅可比矩阵
fprintf('雅可比矩阵:\n');
disp(J);
fprintf('条件数: %f\n', cond(J));

% 数值检查
assert(abs(det(R) - 1) < 1e-10, '旋转矩阵行列式应该为 1');
assert(norm(R'*R - eye(3)) < 1e-10, '旋转矩阵应该正交');
```

## 总结

本指南全面介绍了 MATLAB 机器人仿真的各个方面：

- **基础概念**：坐标变换、齐次矩阵、SE2/SE3
- **二维仿真**：平面机器人、2R 机器人
- **三维仿真**：空间机器人、UR5/UR10 等
- **机器人建模**：DH 参数、SerialLink
- **运动学**：正向、逆向运动学求解
- **动力学**：惯性矩阵、科里奥利力、重力
- **路径规划**：A*、RRT、轨迹优化
- **控制器**：PID、计算力矩、自适应控制
- **实际案例**：差分驱动、机械臂跟踪
- **高级应用**：碰撞检测、冗余度解析、机器学习

通过掌握这些技能，您可以：

- 建立准确的机器人模型
- 进行运动学和动力学分析
- 设计高效的控制器
- 实现智能路径规划
- 构建完整的机器人仿真系统

MATLAB 的强大功能结合系统的机器人学理论，将帮助您在机器人领域取得更大突破！

## 相关资源

- [MATLAB Robotics System Toolbox](https://www.mathworks.com/products/robotics.html)
- [Robotics System Toolbox Documentation](https://www.mathworks.com/help/robotics/)
- [Peter Corke's Robotics Toolbox](http://petercorke.com/Robotics_Toolbox.html)
- [Modern Robotics: Mechanics, Planning, and Control](http://hades.mech.northwestern.edu/images/7/79/MR.pdf)

持续学习和实践，您将成为机器人仿真专家！
