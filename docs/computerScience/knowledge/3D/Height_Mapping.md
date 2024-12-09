将高度值（从最低点到最高点）映射到 0 到 255 之间
那么可以根据以下公式来计算映射值：

\[
\text{mapped value} = \frac{(\text{height} - \text{min height})}{(\text{max height} - \text{min height})} \times 255
\]

其中：
- `min height` 是点云中最低的高度。
- `max height` 是点云中最高的高度。
- `height` 是需要映射的具体高度值。

### 假设：
- 最高高度为 5mm，`max height = 5`mm。
- 最低高度为 0mm，`min height = 0`mm。
- 映射的范围是 0 到 255。

那么映射公式就是：

\[
\text{mapped value} = \frac{(\text{height})}{5} \times 255
\]

### 计算：
1. 对于 3.11mm 的映射值：
\[
\text{mapped value} = \frac{3.11}{5} \times 255 = 0.622 \times 255 \approx 158.61
\]
映射值大约为 159。

2. 对于 3.12mm 的映射值：
\[
\text{mapped value} = \frac{3.12}{5} \times 255 = 0.624 \times 255 \approx 159.12
\]
映射值大约为 159。

### 结果：
- 3.11mm 对应的映射值大约是 159。
- 3.12mm 对应的映射值大约是 159。

由于高度差距非常小，3.11mm 和 3.12mm 映射后的值几乎是一样的，都是 159，显示出的差异不明显。