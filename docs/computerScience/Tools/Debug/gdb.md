

定位大型项目中，**double‑free**、**heap corruption**、**buffer overflow** 出现的地方

## 1.GDB 基础

```
# 启动并附加可执行
gdb ./YourApp

# 运行程序
(gdb) run [args...]

# 打印调用栈
(gdb) bt

# 列出某行源码
(gdb) list *0xADDRESS

# 查看某符号对应地址
(gdb) info symbol 0xADDRESS

```


## 3. 定位 Double‑Free

### 3.1 设置条件断点拦截 `free()`

1. 断点 `free` 并检查第一个参数（x86\_64 下为 `$rdi`）

   ```gdb
   (gdb) break free if (void*)$rdi == (void*)0xDEADBEEF
   (gdb) commands
   > printf ">>> free called: %p\n", $rdi
   > bt
   > continue
   > end
   ```

2. **运行**，GDB 在每次 `free(0xDEADBEEF)` 时打印：

   ```
   >>> free called: 0xDEADBEEF
   #0  free at malloc.c:...
   #1  Foo::~Foo() at foo.cpp:42
   #2  ...
   ```

### 3.2 拦截 C++ `delete`

```gdb
(gdb) break operator delete(void*) if (void*)$rdi == (void*)0xDEADBEEF
(gdb) commands
> printf ">>> delete called: %p\n", $rdi
> bt
> continue
> end
```


