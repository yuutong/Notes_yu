---
title: 知识库自动化与质量工具链
tags:
  - knowledge-base
  - automation
  - quality
status: evergreen
updated: 2026-08-22
---

# 知识库自动化与质量工具链

> 用可重复执行的脚本代替手工检查，让每次整理和发布都得到相同结果。

## 工具链组成

当前工具全部使用 Node.js 标准能力实现，不依赖额外 npm 包。

### Markdown 格式化

`tools/format-markdown.mjs` 负责统一换行、空白和 Markdown 排版。

```powershell
npm run format
npm run format:check
```

`format` 会写入修改，`format:check` 只报告需要格式化的文件，适合发布前验证。

### 标题规范化

`tools/normalize-note-titles.mjs` 为缺少一级标题的笔记补齐标题，并避免出现多个一级标题。

```powershell
npm run notes:titles
```

标题优先来自 YAML `title`，其次来自正文一级标题，最后才从文件名推导。

### 重复内容治理

`tools/deduplicate-notes.mjs` 识别内容相同的页面，将非权威路径转换为兼容跳转页。

```powershell
npm run notes:dedupe
```

去重不只是节省文件大小，更重要的是让搜索和 RAG 只召回一个可信版本。

### 知识库构建

`tools/build-knowledge-base.mjs` 扫描 Markdown 和内部链接，生成：

- 主题知识地图。
- 搜索与 RAG 索引。
- 笔记关系图。
- 质量报告。
- 知识库中心统计。

```powershell
npm run kb:build
npm run kb:check
```

`kb:build` 更新过期结果；`kb:check` 只验证派生文件是否与正文一致。

### 全库审计

`tools/audit-markdown.mjs` 检查：

- UTF-8、BOM 和换行格式。
- 缺失或重复的一级标题。
- 未闭合代码围栏。
- 失效本地链接。
- 完全重复的正文。

```powershell
npm run audit
```

审计结果中数组为空表示没有发现对应问题。

### 聊天系统测试

`tools/test-knowledge-chat.mjs` 验证中文分词、检索排序、状态接口和聊天数据流。

```powershell
npm run kb:chat:test
```

测试默认使用仅检索模式，不会消耗模型额度。

## 推荐执行顺序

日常编辑完成后：

```powershell
npm run kb:build
npm run check
npm run audit
```

修改聊天检索或接口代码后，再增加：

```powershell
npm run kb:chat:test
```

其中 `npm run check` 已组合格式检查和知识库新鲜度检查。

## 设计要点

### 检查和修复分离

带 `--check` 的流程不修改文件，适合自动化和提交前验证；写入操作必须由明确命令触发，避免检查过程意外改动正文。

### 输出必须可重建

所有生成结果使用稳定排序和统一 JSON 缩进。相同输入应产生完全相同的输出，减少无意义的 Git 差异。

### 自动化不替代内容判断

脚本可以判断标题、链接和精确重复，不能替代以下人工决策：

- 两篇相似笔记是否应该合并。
- 哪个结论已经过时。
- 来源是否可靠。
- 一篇笔记应该属于哪个长期主题。

## 常见问题

### `Updated knowledge-base outputs: 0`

表示所有生成文件已经是最新状态，不表示知识库中没有笔记。

### `Would format 0 of ...`

表示全部 Markdown 已符合格式规则。

### `Stale knowledge-base outputs: 0`

表示正文与主题地图、索引和报告完全一致。

## 相关笔记

- [个人知识库工程](README.md)
- [Markdown 笔记库的内容治理](knowledge-governance.md)
- [本地 RAG 知识库聊天系统](rag-chat-system.md)
