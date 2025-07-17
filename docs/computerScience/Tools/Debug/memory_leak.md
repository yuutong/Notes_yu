
# ASan vs Valgrind: 内存泄漏检测对比


## 1. 工具概览

| 特性   | AddressSanitizer (ASan)       | Valgrind (Memcheck)      |
| ---- | ----------------------------- | ------------------------ |
| 类型   | 编译时插桩（Instrument）             | 运行时仿真（Emulation）         |
| 开销   | 约 1.5× 运行时间                   | 约 10–50× 运行时间            |
| 支持   | C/C++ （Clang/GCC 插件）          | 多语言（C/C++/Fortran …）     |
| 检测能力 | 堆/栈/全局 越界、Use-after-free、内存泄漏 | 堆 越界、Use-after-free、内存泄漏 |

---

## 2. 内存泄漏检测——用法

### 2.1 AddressSanitizer

1. 编译和链接：

   ```bash
   g++ -g -O1 -fsanitize=address -fno-omit-frame-pointer \
       main.cpp -o app -fsanitize=address
   ```
2. 运行：

   ```bash
   ASAN_OPTIONS=detect_leaks=1:log_path=asan.log ./app
   ```
3. 查看报告：

   * 在 `asan.log` 中搜索 `LEAK` 条目。
   * 输出示例：

     ```
     =================================================================
     ==12345==ERROR: LeakSanitizer: detected memory leaks
     Direct leak of 64 byte(s) in 1 object(s) allocated from:
         #0 0x... in malloc (/lib/.../libasan.so)
         #1 0x... in main /path/to/main.cpp:10
     ```

### 2.2 Valgrind

1. **执行**：无需重编译（最好加 `-g`）：

   ```bash
   valgrind --leak-check=full --show-leak-kinds=all \
       --track-origins=yes ./app
   ```
2. **查看报告**：

   * 运行结束后，Valgrind 会在控制台打印泄漏摘要：

     ```
     ==12345== LEAK SUMMARY:
     ==12345==    definitely lost: 64 bytes in 1 blocks
     ==12345==    indirectly lost: 0 bytes in 0 blocks
     ==12345==
     ==12345== 64 bytes in 1 blocks are definitely lost in loss record 1 of 1
     ==12345==    at 0x4C2BBAF: malloc (vg_replace_malloc.c:299)
     ==12345==    by 0x4005F6: main (main.cpp:10)
     ```

---

## 3. 优势与局限

| 方面   | ASan                         | Valgrind           |
| ---- | ---------------------------- | ------------------ |
| 精度   | 高（精准定位到源码行）                  | 高（同样精准）            |
| 速度   | 较快，可用于日常回归测试                 | 较慢，仅适合本地深度调试       |
| 易用性  | 需重编译，少量命令行配置                 | 无需重编译，直接运行即可       |
| 资源占用 | 较低（内存 ×2）                    | 较高（内存 ×3–5，CPU负载大） |
| 并发支持 | 支持多线程                        | 支持，但性能进一步下降        |
| 平台支持 | Linux, macOS, Windows (MSVC) | Linux, macOS       |

---

## 4. 结论

* 日常开发：使用 **ASan**，快速捕获内存泄漏与越界。
* 深度分析：使用 **Valgrind**，无需重编译，全面追踪历史遗留内存问题


