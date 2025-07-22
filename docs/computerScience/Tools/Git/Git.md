
## 1. 在主机上创建裸仓库

```sh

sudo mkdir -p /root/Work/3D/Code_git
sudo chown -R $USER:$USER /root/Work/3D/Code_git
chmod 0755 /root/Work/3D/Code_git

# 进入目录并初始化为裸仓库
cd /root/Work/3D/Code_git
git init --bare

```

## 2. 配置 SSH 访问

### 1.安装ssh服务（ubuntu）

```sh

sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh    # 确认 SSH 服务已启动

```

### 2.创建用户/使用已有用户

```sh

git config --global user.name "Your Name"
git config --global user.email "you@example.com"

ssh-keygen -t rsa -b 4096 -C "yuutong1002@outlook.com"

```

### 3.配置 SSH 公钥认证（免密码登录）

**客户端**：将生成的公钥复制

```sh
cat ~/.ssh/id_rsa.pub

```

**服务器**： 设置权限，并将所有开发者的公钥都加到authorized_keysh中

```sh
# 确保 .ssh 目录及文件权限安全
sudo mkdir -p /root/.ssh
sudo chmod 700 /root/.ssh

# 编辑或追加所有开发者的公钥
sudo nano /root/.ssh/authorized_keys
# —— 粘贴每人 id_rsa.pub 的内容，每行一个公钥

sudo chmod 600 /root/.ssh/authorized_keys
sudo chown -R root:root /root/.ssh

```


## 3. 本地项目目录（非裸仓库）设置并推送

``` sh
# 进入自己的项目
cd ~/my_local_project

# 如果还不是 Git 仓库，先初始化
git init
git add .
git commit -m "Initial commit"

# 添加远程，格式为 user@host:/absolute/path
git remote add origin root@192.168.1.100:/root/Work/3D/Code_git

# 测试连通性（无需密码，应自动用公钥）
ssh root@192.168.1.100

# 推送主分支
git push -u origin master

```




