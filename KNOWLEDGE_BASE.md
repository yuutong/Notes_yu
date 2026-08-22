# 知识库中心

> 这是由仓库内 Markdown 自动生成的知识入口。正文仍是唯一数据源；索引和关系图可随时重建。

## 当前规模

- 权威笔记：302 篇
- 兼容跳转页：104 篇
- 笔记间链接：145 条
- 待处理失效链接：3 条
- 待合并重复组：0 组

## 主题地图

- [人工智能](kb/topics/ai.md)：44 篇
- [计算机科学](kb/topics/computer-science.md)：163 篇
- [数学](kb/topics/math.md)：8 篇
- [电子与通信](kb/topics/electronics.md)：21 篇
- [工作与自我管理](kb/topics/life-work.md)：55 篇
- [收件箱](kb/topics/inbox.md)：1 篇
- [归档](kb/topics/archive.md)：1 篇
- [其他](kb/topics/other.md)：9 篇

## 使用入口

- [向知识库提问](chat.html)
- [知识库聊天使用说明](CHAT_SETUP.md)
- [质量报告](kb/quality-report.md)
- [笔记优化与知识库方案](NOTE_OPTIMIZATION.md)
- [Obsidian 使用说明](OBSIDIAN_SETUP.md)
- [知识笔记模板](templates/knowledge-note.md)
- [项目复盘模板](templates/project-note.md)

## 更新知识库

```shell
npm run kb:build
npm run kb:check
```

`kb/index.json` 可供搜索、自动化和后续 RAG 使用；`kb/graph.json` 保存笔记节点与内部链接关系。

## 启动聊天

```shell
npm run kb:chat
```

然后打开 <http://127.0.0.1:3000/chat>。聊天会自动检索 Markdown 原文，并在答案后显示引用笔记。
