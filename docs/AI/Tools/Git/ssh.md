要通过SSH从GitHub克隆仓库

### 1. **检查是否已有SSH密钥**

> Ubuntu在终端输入以下命令：

```bash
ls -al ~/.ssh
```
如果看到 `id_rsa` 和 `id_rsa.pub` 这样的文件，就表示你已有SSH密钥。

> windows打开 PowerShell

按下 `Win + R`，输入 `powershell` 然后按回车。输入以下命令来查看 `.ssh` 文件夹中的内容：
```powershell
dir ~/.ssh
```
如果你看到类似 `id_rsa` 和 `id_rsa.pub` 的文件，说明你已经有SSH密钥了。


### 2. **生成SSH密钥**

如果没有SSH密钥，可以生成一个。输入以下命令来生成SSH密钥：
```bash
ssh-keygen -t rsa -b 4096 -C "yuutong1002@outlook.com"
```
- 按 `Enter` 键保存到默认位置 
- 接下来可以选择设置一个密码短语，也可以按 `Enter` 直接跳过。


### 3. **将SSH公钥添加到GitHub**
现在需要将你的公钥添加到GitHub。

首先，查看你的公钥：
```bash
cat ~/.ssh/id_rsa.pub
```
复制终端中显示的公钥内容。

然后：
1. 打开 [GitHub SSH设置页面](https://github.com/settings/keys)。
2. 点击 “**New SSH Key**”。
3. 将刚刚复制的公钥粘贴到“**Key**”字段，并给它起一个名字（例如 “My Ubuntu Key”）。
4. 点击 “**Add SSH key**”。

### 5. **通过SSH克隆仓库**
现在，你可以使用SSH来克隆GitHub仓库。在GitHub项目页面中，点击 “**Code**”，选择 “**SSH**”，然后复制SSH链接。

在终端中执行以下命令：
```bash
git clone git@github.com:username/repository.git
```
