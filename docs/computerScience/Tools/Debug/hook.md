
## 一个拦截 double free 的钩子

``` cpp

#ifndef _GNU_SOURCE
#define _GNU_SOURCE
#endif

#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <execinfo.h>
#include <pthread.h>
#include <string.h>

// 定义哈希表结构
typedef struct mem_entry {
    void* ptr;
    size_t size;
    struct mem_entry* next;
} mem_entry;

// 哈希表参数
#define HASH_SIZE 1024
static mem_entry* freed_table[HASH_SIZE] = {0};
static pthread_mutex_t table_lock = PTHREAD_MUTEX_INITIALIZER;

// 获取原始函数指针
static void* (*real_malloc)(size_t) = NULL;
static void* (*real_calloc)(size_t, size_t) = NULL;
static void* (*real_realloc)(void*, size_t) = NULL;
static void (*real_free)(void*) = NULL;
static void (*real_aligned_free)(void*) = NULL;

// 哈希函数
static inline unsigned int ptr_hash(void* ptr) {
    return ((unsigned long)ptr >> 4) % HASH_SIZE;
}

// 添加指针到已释放表
static void add_freed_ptr(void* ptr) {
    if (!ptr) return;

    unsigned int idx = ptr_hash(ptr);
    mem_entry* entry = static_cast<mem_entry*>(real_malloc(sizeof(mem_entry)));
    if (!entry) {
        fprintf(stderr, "Failed to allocate memory for tracking!\n");
        return;
    }

    entry->ptr = ptr;
    entry->next = freed_table[idx];
    freed_table[idx] = entry;
}

// 检查是否已释放
static int is_ptr_freed(void* ptr) {
    if (!ptr) return 0;

    unsigned int idx = ptr_hash(ptr);
    pthread_mutex_lock(&table_lock);
    mem_entry* current = freed_table[idx];

    while (current) {
        if (current->ptr == ptr) {
            pthread_mutex_unlock(&table_lock);
            return 1;
        }
        current = current->next;
    }
    pthread_mutex_unlock(&table_lock);
    return 0;
}

// 从表中移除指针（用于realloc等特殊情况）
static void remove_freed_ptr(void* ptr) {
    if (!ptr) return;

    unsigned int idx = ptr_hash(ptr);
    pthread_mutex_lock(&table_lock);
    mem_entry** current = &freed_table[idx];

    while (*current) {
        if ((*current)->ptr == ptr) {
            mem_entry* tmp = *current;
            *current = (*current)->next;
            real_free(tmp);
            break;
        }
        current = &(*current)->next;
    }
    pthread_mutex_unlock(&table_lock);
}

// 打印堆栈跟踪
static void print_stacktrace() {
    void* array[20];
    size_t size = backtrace(array, 20);
    char** strings = backtrace_symbols(array, size);

    fprintf(stderr, "\nStack trace (%zd frames):\n", size);
    for (size_t i = 0; i < size; i++) {
        fprintf(stderr, "#%zd %s\n", i, strings[i]);
    }

    free(strings);
}

// 错误报告函数
static void report_double_free(const char* type, void* ptr) {
    fprintf(stderr, "\n\033[1;31m%s DETECTED!\033[0m\n", type);
    fprintf(stderr, "Address: %p\n", ptr);
    print_stacktrace();
    abort();
}

// 初始化原始函数指针
static void init_original_functions() {
    static pthread_once_t once = PTHREAD_ONCE_INIT;
    pthread_once(&once, []{
        real_malloc = reinterpret_cast<void*(*)(size_t)>(dlsym(RTLD_NEXT, "malloc"));
        real_calloc = reinterpret_cast<void*(*)(size_t, size_t)>(dlsym(RTLD_NEXT, "calloc"));
        real_realloc = reinterpret_cast<void*(*)(void*, size_t)>(dlsym(RTLD_NEXT, "realloc"));
        real_free = reinterpret_cast<void(*)(void*)>(dlsym(RTLD_NEXT, "free"));
        real_aligned_free = reinterpret_cast<void(*)(void*)>(dlsym(RTLD_NEXT, "aligned_free"));

        if (!real_malloc || !real_free) {
            fprintf(stderr, "Failed to get original memory functions!\n");
            abort();
        }
    });
}

// 拦截的free函数
extern "C" void free(void* ptr) {
    init_original_functions();

    if (is_ptr_freed(ptr)) {
        report_double_free("DOUBLE FREE", ptr);
    }

    add_freed_ptr(ptr);
    real_free(ptr);
}

// 拦截的aligned_free函数
extern "C" void aligned_free(void* ptr) {
    init_original_functions();

    if (!real_aligned_free) {
        // 如果系统没有aligned_free，回退到普通free
        free(ptr);
        return;
    }

    if (is_ptr_freed(ptr)) {
        report_double_free("DOUBLE ALIGNED FREE", ptr);
    }

    add_freed_ptr(ptr);
    real_aligned_free(ptr);
}

// 拦截的operator delete (C++)
void operator delete(void* ptr) noexcept {
    init_original_functions();

    if (is_ptr_freed(ptr)) {
        report_double_free("DOUBLE DELETE", ptr);
    }

    add_freed_ptr(ptr);
    real_free(ptr);
}

// 拦截的operator delete[] (C++ 数组)
void operator delete[](void* ptr) noexcept {
    operator delete(ptr);
}

// 拦截的realloc函数
extern "C" void* realloc(void* ptr, size_t size) {
    init_original_functions();

    if (ptr && is_ptr_freed(ptr)) {
        report_double_free("REALLOC ON FREED MEMORY", ptr);
    }

    void* new_ptr = real_realloc(ptr, size);
    if (ptr && new_ptr != ptr) {
        remove_freed_ptr(ptr);
    }
    return new_ptr;
}

```
 
## 2 编译与使用

```sh
g++ -shared -fPIC -o double_free_hook.so double_free_hook.cpp -ldl -lpthread -rdynamic
LD_PRELOAD=./libdfdetector.so ./YourApp
```
