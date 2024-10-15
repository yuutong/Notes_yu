## 报错

`COMRESET failed   Filesystem check or mount failed , A maintenance shell will now be started ...输入密码的提示`

> 分析

系统在尝试检查文件系统、挂载文件系统时遇到了问题，可以输入密码进入系统命令行去手动修复

1.输入密码：

系统密码为123123 回车

2.运行 `f`sck -y /dev/sda1`

用于检查并修复文件系统错误

- `fsck`：文件系统一致性检查工具。
- `-y`：自动修复任何检测到的问题，而不询问用户确认。
- `/dev/sda1`：指定要检查的分区，通常是系统的根分区或某个挂载点。

当时报错：`e2fsck: Cannot continue,aborting.`

3.运行`mount -o remount rw /`

用于重新挂载根文件系统为可读写模式

- `mount`：用于挂载文件系统的命令。
- `-o`：指定挂载选项。
- `remount`：表示重新挂载已挂载的文件系统。
- `rw`：表示以可读写模式挂载。
- `/`：指定要重新挂载的文件系统，这里是根文件系统

4.再运行`fsck -y /dev/sda1`

检查上一个步骤挂载的情况

5.也可以执行 `umount /dev/sda1 & fsck -y /dev/sda1`

`umount /dev/sda1`：卸载 `/dev/sda1` 设备。如果设备正在使用中，可能会失败。
  
`fsck -y /dev/sda1`：检查并修复 `/dev/sda1` 文件系统中的错误。`-y` 选项表示自动回答“是”以确认所有修复。

在运行这些命令之前，请确保没有进程正在使用 `/dev/sda1`，否则卸载可能会失败


6.运行 `df -lh`

用于显示文件系统的磁盘空间使用情况，输出格式为人类可读（即以合适的单位显示，如 MB、GB）

- `-l`：仅显示本地文件系统，不包括远程挂载。
- `-h`：以人类可读的格式显示文件大小（例如 1K、234M、2G）。

执行此命令后，输出一个表格，包含每个挂载的文件系统的总大小、已用空间、可用空间和挂载点等信息

