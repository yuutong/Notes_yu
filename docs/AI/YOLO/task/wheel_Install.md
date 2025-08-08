
### 使用 --prefer-binary 让 pip 优先安装 wheel

```shell
# 升级 pip
python -m pip install --upgrade pip

# 安装 PyQt5（官方 wheel 包，自带 Qt 库）
pip install PyQt5==5.15.11 --prefer-binary

# 安装 pyqt5-tools（官方 PyPI 包，不包含 Qt，请确保 PyQt5 对应版本）
pip install pyqt5-tools==5.15.9.3.3 --prefer-binary

```