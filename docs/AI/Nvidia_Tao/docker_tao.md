## 一 环境配置与验证

1.确认驱动状态

```
 nvidia-smi 

 +---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.230.02             Driver Version: 535.230.02   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA GeForce RTX 4060        On  | 00000000:01:00.0  On |                  N/A |
|  0%   45C    P8              N/A / 115W |    615MiB /  8188MiB |      1%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A      1166      G   /usr/lib/xorg/Xorg                           35MiB |
|    0   N/A  N/A      1622      G   /usr/lib/xorg/Xorg                          362MiB |
|    0   N/A  N/A      1777      G   /usr/bin/gnome-shell                         78MiB |
|    0   N/A  N/A      2005      G   ...in/bin/sunloginclient --cmd=autorun        9MiB |
|    0   N/A  N/A      2213      G   ...) Chrome/58.0.3029.81 Safari/537.36        2MiB |
|    0   N/A  N/A      2256      G   ...en=14DE9D9F1036BA5AC66677CA2131A703        2MiB |
|    0   N/A  N/A      2430      G   ...86,262144 --variations-seed-version       59MiB |
|    0   N/A  N/A      3366      G   ...erProcess --variations-seed-version       40MiB |
+---------------------------------------------------------------------------------------+

```shell

2.安装CUDA Toolkit 12.2（匹配TAO 5.0要求）

```
wget https://developer.download.nvidia.com/compute/cuda/12.2.0/local_installers/cuda_12.2.0_535.54.03_linux.run<br>
sudo sh cuda_12.2.0_535.54.03_linux.run

```shell

安装选项：取消勾选Driver

添加环境变量：<br>

```
echo 'export PATH=/usr/local/cuda-12.2/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
```shell

3.安装cuDNN 8.9.7（CUDA 12.x兼容版本）

网址:https://developer.nvidia.com/rdp/cudnn-archive

```
sudo dpkg -i cudnn-local-repo-ubuntu2004-8.9.7.29_1.0-1_amd64.deb 
```shell

## 二、Docker与NVIDIA容器工具链配置

1.安装Docker CE:

```
sudo apt update && sudo apt install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER  # 将当前用户加入docker组
newgrp docker  # 立即生效

```shell

2.安装NVIDIA Container Toolkit

```
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt update && sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker
```bash

3.验证GPU容器支持

```
docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu20.04 nvidia-smi

```bash


## 三、TAO Toolkit部署与训练优化

1. 获取TAO资源

登录NGC（需提前注册账号）

链接：  https://ngc.nvidia.com/signin

登录之后点进右上角的Setup栏:

docs/AI/Nvidia_Tao/1.jpg

```
docker login nvcr.io
Username: $oauthtoken
Password: <你的NGC API Key>（从NGC账户设置中获取）

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
```bash

拉取TAO镜像

链接：  https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/containers/tao-toolkit

docker pull nvcr.io/nvidia/tao/tao-toolkit:5.0.0-pyt

```bash


2. 数据准备（适配工业缺陷数据集）

目录结构示例：

```
~/defect_detection/
├── images/          # 存放所有图片
│   ├── train/
│   └── val/
└── labels/          # 对应标注文件（YOLO格式）
    ├── train/
    └── val/
```bash

3.创建数据集配置文件 defect_spec.yaml：

```
dataset_config:
  data_sources:
    train_images_path: "/workspace/defect_detection/images/train"
    train_labels_path: "/workspace/defect_detection/labels/train"
    val_images_path: "/workspace/defect_detection/images/val"
    val_labels_path: "/workspace/defect_detection/labels/val"
  class_map: ["scratch", "dent", "crack"]
augmentation_config:
  output_width: 640
  output_height: 640
```shell


4. 启动训练容器（显存优化版）

```
docker run --gpus all -it --shm-size=8g \
  -v ~/defect_detection:/workspace/defect_detection \
  -v ~/tao_output:/workspace/output \
  nvcr.io/nvidia/tao/tao-toolkit:5.0.0-pyt
```shell

5. 执行训练（针对RTX 4060优化）

```
进入容器后执行
tao yolo_v4 train \
  -e /workspace/defect_detection/defect_spec.yaml \
  -r /workspace/output \
  -k <你的NGC_API_KEY> \
  --gpus 1 \
  --batch_size 6 \          # 根据显存调整
  --num_epochs 50 \
  --learning_rate 0.0001 \  # 小数据集建议降低学习率
  --amp                     # 启用自动混合精度

```bash

6. 实时监控技巧

显存使用监控：

```
watch -n 1 nvidia-smi  # 每秒刷新GPU状态
```shell


训练过程可视化：

```
tensorboard --logdir /workspace/output --bind_all

```bash
