这条命令：

```bash
ASAN_OPTIONS="symbolize=1:verbosity=2:abort_on_error=1:fast_unwind_on_malloc=0:log_path=asan.log" gdb ./CLVision
```

背后发生了几件事：

| 参数                        | 含义                                                |
| ------------------------- | ------------------------------------------------- |
| `symbolize=1`             | 打开地址到源码行号的符号化，让报告里出现 `file.cpp:123`               |
| `verbosity=2`             | 打印更详细的 ASan 调试信息                                  |
| `abort_on_error=1`        | 一旦 ASan 发现越界/UAF/双重释放等错误，**立刻** `abort()`，而不是继续运行 |
| `fast_unwind_on_malloc=0` | 在报告分配/释放相关错误时，使用「慢但准确」的栈展开（更可能拿到完整调用栈）            |
| `log_path=asan.log`       | 将 ASan 的完整报告写到 `asan.log`，而不仅仅输出到终端               |

然后把这个环境直接传给 `gdb`：`gdb` 启动的那一行里带着 ASan 配置，**inferior（被调试的进程）** 在它启动时就会带上这些设置。

---

### 为什么这样能让“前期”异常就 `abort()`?

1. **`abort_on_error=1`**：任何一次 ASan 检测到非法内存访问（heap-buffer-overflow、use-after-free、double-free 等），它就会立即调用 `abort()`。
2. **启动在 GDB 下**：`abort()` 会触发 `SIGABRT`，而 GDB 默认在捕获到信号时会停下来，让你在断点处的那一刻就能执行 `bt`、拿到当时的全部调用栈。

这样，你就可以在「第一次」触发越界或 UAF 的地方停住，精准地看到是哪行代码、哪个函数栈做错了。

---

### 为什么你之前的那串 `export ASAN_OPTIONS=...` 没用？

```bash
export ASAN_OPTIONS="symbolize=1:verbosity=2:abort_on_error=1:alloc_dealloc_mismatch=1:detect_stack_use_after_return=1:strict_string_checks=1:fast_unwind_on_malloc=0"
./CLVision
```

1. 你虽然也开了 `abort_on_error=1`，但你跑的是「**普通终端**」下的可执行，**没用 GDB**。一旦 `abort()`，程序就直接退出，终端只会打印 `double free or corruption (out)`，而不会停下来让你 `bt`。
2. 那些额外的选项 (`alloc_dealloc_mismatch`、`detect_stack_use_after_return`、`strict_string_checks`) 并不会覆盖所有类型的非法内存访问，**只有在特定场景**才触发检查，而且它们本身不会让 GDB 停下来。

---

### 关键区别

|                | 普通终端                               | `gdb` 下                                                  |
| -------------- | ---------------------------------- | -------------------------------------------------------- |
| ASan 检测到错误后的行为 | `abort()` → 终端打印 glibc 信息 → 进程直接退出 | `abort()` → GDB 捕获 SIGABRT → 停在崩溃点 → 运行 `(gdb) bt` 查看调用栈 |
| 是否能交互式调试       | 否                                  | 是                                                        |
| 能否看到「第一次」崩溃点   | 不会，只看到最后 glibc 错误                  | 会，在发生错误的那一刻停下来                                           |

---

