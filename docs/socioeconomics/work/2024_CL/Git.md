chmod -R 775 /root/Work/3D/Code_git
sudo chown -R $USER:$USER /root/Work/3D/Code_git
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub
sudo service ssh restart
sudo service ssh status
git ls-remote
ls -la
git push origin master
git remote set-url origin /root/Work/3D/Code_git
git remote set-url origin ssh://root@192.168.0.108:/root/Work/3D/Code_git   not correct
sudo nano /etc/ssh/sshd_config
git remote -v
ifconfig
sudo ufw allow ssh
cd /root/Work/3D/20240624
sudo apt install openssh-server
sudo apt update
git init --bare
git config --global user.email ¨yuutong1002@outlook.com¨
git config --global user.name ¨yutong¨
git --version
sudo apt-get install git
sudo apt install git
sudo apt update






ifconfig
unity-control-center
cat /proc/cpuinfo |grep -i 'flags'
lscpu | grep -E
gnome-session-properties 
./EdgeImagingV3.3.3.4-x86_64.AppImage -m
 chmod +x EdgeImagingV3.3.3.4-x86_64.AppImage 



