#### sda-->sdb

> 从Ubuntu系统上将磁盘sda中的全部内容迁移到磁盘sdb中去

1. 用DiskGenius工具将原磁盘的内容复制到新磁盘，在复制时要选择第一项，会复制全部的扇区，包括引导分区
   而不能选择第二项 `复制文件系统`，这样的话就无法复制引导分区

 

