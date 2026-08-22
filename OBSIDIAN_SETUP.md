# Obsidian 使用说明

当前仓库可以直接作为 Obsidian vault 打开，不需要复制或迁移文件。Docsify 与 Obsidian 共用同一批 Markdown 原文。

## 首次设置

1. 在 Obsidian 中选择“打开本地仓库”，指向本仓库根目录。
2. 在“文件与链接”中，把新链接格式设为“基于当前笔记的相对路径”。
3. 关闭“使用 Wikilinks”，让新链接保持标准 Markdown 格式，以兼容 Docsify。
4. 开启“自动更新内部链接”，移动或重命名笔记时同步修复引用。
5. 把新笔记默认目录设为 `inbox`，附件目录设为 `_media`。
6. 开启核心“模板”功能，并把模板目录设为 `templates`。

## 推荐工作流

- 临时记录：在 `inbox` 新建草稿。
- 整理：查找是否已有权威笔记，优先合并而不是新建重复页面。
- 连接：至少添加一个上位主题链接和一个相关知识链接。
- 复核：把 YAML 中的 `status` 从 `draft` 改为 `evergreen`。
- 归档：过期内容移入 `archive`，不要继续作为当前结论引用。

## 隐私边界

`private/` 已加入 `.gitignore`，可用于本地隐私材料，但不要在任何笔记中保存令牌、密码或私钥。公开站点只应部署 Git 中已追踪的内容。

## 常用命令

```shell
npm run kb:build
npm run check
npm run audit
```
