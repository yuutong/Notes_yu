import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const ignoredDirectories = new Set([".git", "node_modules", "private", "kb", "templates"]);
const structuralNames = new Set(["_sidebar.md", "_navbar.md", "_coverpage.md"]);
const ignoredFiles = new Set(["KNOWLEDGE_BASE.md"]);
const sectionDefinitions = [
  { key: "ai", label: "人工智能", prefix: "docs/AI/" },
  { key: "computer-science", label: "计算机科学", prefix: "docs/computerScience/" },
  { key: "math", label: "数学", prefix: "docs/math/" },
  { key: "electronics", label: "电子与通信", prefix: "docs/Electronics/" },
  { key: "life-work", label: "工作与自我管理", prefix: "docs/socioeconomics/" },
  { key: "inbox", label: "收件箱", prefix: "inbox/" },
  { key: "archive", label: "归档", prefix: "archive/" },
];

async function collectMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdownFiles(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function fenceAt(line) {
  const match = line.match(/^\s*(?:>\s*)*(?:(?:[-+*]|\d+[.)])\s+)?(`{3,}|~{3,})/);
  return match ? { character: match[1][0], length: match[1].length } : null;
}

function proseLines(source) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const visible = [];
  let fence = null;
  let frontMatter = lines[0]?.trim() === "---";
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (frontMatter) {
      if (index > 0 && line.trim() === "---") frontMatter = false;
      continue;
    }
    const marker = fenceAt(line);
    if (marker) {
      if (!fence) fence = marker;
      else if (marker.character === fence.character && marker.length >= fence.length && /^[\s>]*[`~]+\s*$/.test(line)) fence = null;
      continue;
    }
    if (!fence) visible.push(line);
  }
  return visible;
}

function parseFrontmatter(source) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  if (lines[0]?.trim() !== "---") return {};
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) return {};
  const properties = {};
  let listKey = null;
  for (const line of lines.slice(1, end)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      properties[listKey].push(listItem[1].trim().replace(/^['"]|['"]$/g, ""));
      continue;
    }
    const property = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!property) continue;
    const [, key, rawValue] = property;
    if (!rawValue) {
      properties[key] = [];
      listKey = key;
    } else {
      properties[key] = rawValue.trim().replace(/^['"]|['"]$/g, "");
      listKey = null;
    }
  }
  return properties;
}

function titleFromPath(name) {
  const parsed = path.posix.parse(name);
  const raw = parsed.name.toLowerCase() === "readme" ? path.posix.basename(parsed.dir) : parsed.name;
  return raw.replaceAll("_", " ").replaceAll("-", " ");
}

function sectionFor(name) {
  return sectionDefinitions.find((section) => name.startsWith(section.prefix))
    ?? { key: "other", label: "其他", prefix: "" };
}

function tagsFor(name, frontmatter) {
  const manual = Array.isArray(frontmatter.tags)
    ? frontmatter.tags
    : typeof frontmatter.tags === "string"
      ? frontmatter.tags.replace(/^\[|\]$/g, "").split(",")
      : [];
  const ignored = new Set(["docs", "knowledge", "tools", "readme.md", "inbox", "archive"]);
  const derived = name.split("/").slice(0, -1).filter((part) => !ignored.has(part.toLowerCase()));
  return [...new Set([...manual, ...derived].map((tag) => tag.trim()).filter(Boolean))].slice(0, 8);
}

function summaryFor(lines, title) {
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("<!--") || line.startsWith("![")) continue;
    const cleaned = line
      .replace(/^>\s*/, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    if (cleaned && cleaned !== title) return cleaned.slice(0, 180);
  }
  return "";
}

function markdownLinks(lines) {
  const links = [];
  const expression = /(!?)\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const line of lines) {
    for (const match of line.matchAll(expression)) {
      if (match[1] === "!") continue;
      const target = match[2].replace(/^<|>$/g, "");
      if (/^(?:[a-z]+:|#|\/\/)/i.test(target)) continue;
      const extension = path.posix.extname(target.split("#", 1)[0].split("?", 1)[0]);
      if (extension && extension.toLowerCase() !== ".md") continue;
      links.push(target);
    }
  }
  return links;
}

function resolveTarget(sourceName, rawTarget, knownPaths) {
  let target = rawTarget.split("#", 1)[0].split("?", 1)[0];
  if (!target) return null;
  try { target = decodeURIComponent(target); } catch { /* keep the original */ }
  const base = path.posix.dirname(sourceName);
  const normalized = path.posix.normalize(target.startsWith("/") ? target.slice(1) : path.posix.join(base, target));
  const candidates = [normalized];
  if (!path.posix.extname(normalized)) candidates.push(`${normalized}.md`, path.posix.join(normalized, "README.md"));
  if (normalized.endsWith("/")) candidates.push(path.posix.join(normalized, "README.md"));
  return candidates.find((candidate) => knownPaths.has(candidate)) ?? null;
}

function groupLabel(name, section) {
  const remainder = name.slice(section.prefix.length).split("/").slice(0, -1);
  if (!remainder.length) return "概览";
  return remainder.slice(0, 2).join(" / ");
}

function linkFrom(fromFile, toFile) {
  let target = path.posix.relative(path.posix.dirname(fromFile), toFile);
  if (!target.startsWith(".")) target = `./${target}`;
  return target;
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function output(file, content, stale) {
  const fullPath = path.join(root, ...file.split("/"));
  let current = null;
  try { current = await fs.readFile(fullPath, "utf8"); } catch { /* missing output */ }
  if (current === content) return;
  stale.push(file);
  if (!checkOnly) {
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf8");
  }
}

const allFiles = await collectMarkdownFiles(root);
const sourceFiles = allFiles.filter((file) => {
  const name = path.basename(file).toLowerCase();
  return !structuralNames.has(name) && !ignoredFiles.has(path.basename(file));
});
const knownPaths = new Set(allFiles.map(relative));
const notes = [];

for (const file of sourceFiles) {
  const name = relative(file);
  const source = await fs.readFile(file, "utf8");
  const lines = proseLines(source);
  const frontmatter = parseFrontmatter(source);
  const headings = lines.flatMap((line) => {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    return match ? [{ level: match[1].length, text: match[2].trim() }] : [];
  });
  const title = String(frontmatter.title || headings.find((heading) => heading.level === 1)?.text || titleFromPath(name));
  const canonicalMatch = source.match(/<!--\s*kb-canonical:\s*([^\s]+)\s*-->/);
  const section = sectionFor(name);
  notes.push({
    id: name,
    title,
    section: section.key,
    sectionLabel: section.label,
    group: groupLabel(name, section),
    status: canonicalMatch ? "alias" : String(frontmatter.status || (name.startsWith("inbox/") ? "draft" : name.startsWith("archive/") ? "archived" : "unreviewed")),
    tags: tagsFor(name, frontmatter),
    summary: summaryFor(lines, title),
    headings,
    outboundRaw: markdownLinks(lines),
    canonical: canonicalMatch?.[1] ?? null,
    contentHash: createHash("sha256").update(source.trim()).digest("hex"),
    characters: source.replace(/\s/g, "").length,
  });
}

const noteById = new Map(notes.map((note) => [note.id, note]));
const edges = [];
const brokenLinks = [];
for (const note of notes) {
  note.links = [...new Set(note.outboundRaw.map((target) => resolveTarget(note.id, target, knownPaths)).filter(Boolean))].sort();
  for (const target of note.outboundRaw) {
    const resolved = resolveTarget(note.id, target, knownPaths);
    if (resolved) edges.push({ source: note.id, target: resolved });
    else brokenLinks.push({ source: note.id, target });
  }
  delete note.outboundRaw;
  note.backlinks = [];
}
for (const edge of edges) noteById.get(edge.target)?.backlinks.push(edge.source);
for (const note of notes) note.backlinks = [...new Set(note.backlinks)].sort();

notes.sort((left, right) => left.id.localeCompare(right.id, "en"));
const canonicalNotes = notes.filter((note) => note.status !== "alias");
const aliases = notes.filter((note) => note.status === "alias");
const duplicateHashes = new Map();
for (const note of canonicalNotes) {
  if (note.characters < 80) continue;
  const group = duplicateHashes.get(note.contentHash) ?? [];
  group.push(note.id);
  duplicateHashes.set(note.contentHash, group);
}
const duplicateGroups = [...duplicateHashes.values()].filter((group) => group.length > 1);
const orphanNotes = canonicalNotes.filter((note) => note.links.length === 0 && note.backlinks.length === 0);
const stale = [];

const indexData = {
  schemaVersion: 1,
  stats: {
    notes: notes.length,
    canonicalNotes: canonicalNotes.length,
    aliases: aliases.length,
    links: edges.length,
    brokenLinks: brokenLinks.length,
    duplicateGroups: duplicateGroups.length,
    orphanNotes: orphanNotes.length,
  },
  notes,
};
const graphData = {
  schemaVersion: 1,
  nodes: notes.map(({ id, title, section, status, tags, canonical }) => ({ id, title, section, status, tags, canonical })),
  edges: [...new Map(edges.map((edge) => [`${edge.source}\0${edge.target}`, edge])).values()].sort((a, b) => `${a.source}${a.target}`.localeCompare(`${b.source}${b.target}`, "en")),
};

await output("kb/index.json", json(indexData), stale);
await output("kb/graph.json", json(graphData), stale);

const topicLinks = [];
for (const definition of [...sectionDefinitions, { key: "other", label: "其他", prefix: "" }]) {
  const sectionNotes = canonicalNotes.filter((note) => note.section === definition.key);
  if (!sectionNotes.length) continue;
  const topicFile = `kb/topics/${definition.key}.md`;
  topicLinks.push({ ...definition, count: sectionNotes.length, file: topicFile });
  const groups = new Map();
  for (const note of sectionNotes) {
    const group = groups.get(note.group) ?? [];
    group.push(note);
    groups.set(note.group, group);
  }
  const lines = [`# ${definition.label}知识地图`, "", `共 ${sectionNotes.length} 篇权威笔记。`, ""];
  for (const [group, groupNotes] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "zh-CN"))) {
    lines.push(`## ${group}`, "");
    for (const note of groupNotes.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"))) {
      const summary = note.summary ? ` — ${note.summary}` : "";
      lines.push(`- [${note.title}](${linkFrom(topicFile, note.id)})${summary}`);
    }
    lines.push("");
  }
  await output(topicFile, `${lines.join("\n").trim()}\n`, stale);
}

const knowledgeBaseLines = [
  "# 知识库中心",
  "",
  "> 这是由仓库内 Markdown 自动生成的知识入口。正文仍是唯一数据源；索引和关系图可随时重建。",
  "",
  "## 当前规模",
  "",
  `- 权威笔记：${canonicalNotes.length} 篇`,
  `- 兼容跳转页：${aliases.length} 篇`,
  `- 笔记间链接：${graphData.edges.length} 条`,
  `- 待处理失效链接：${brokenLinks.length} 条`,
  `- 待合并重复组：${duplicateGroups.length} 组`,
  "",
  "## 主题地图",
  "",
  ...topicLinks.map((topic) => `- [${topic.label}](${topic.file})：${topic.count} 篇`),
  "",
  "## 使用入口",
  "",
  "- [向知识库提问](chat.html)",
  "- [知识库聊天使用说明](CHAT_SETUP.md)",
  "- [质量报告](kb/quality-report.md)",
  "- [笔记优化与知识库方案](NOTE_OPTIMIZATION.md)",
  "- [Obsidian 使用说明](OBSIDIAN_SETUP.md)",
  "- [知识笔记模板](templates/knowledge-note.md)",
  "- [项目复盘模板](templates/project-note.md)",
  "",
  "## 更新知识库",
  "",
  "```shell",
  "npm run kb:build",
  "npm run kb:check",
  "```",
  "",
  "`kb/index.json` 可供搜索、自动化和后续 RAG 使用；`kb/graph.json` 保存笔记节点与内部链接关系。",
  "",
  "## 启动聊天",
  "",
  "```shell",
  "npm run kb:chat",
  "```",
  "",
  "然后打开 <http://127.0.0.1:3000/chat>。聊天会自动检索 Markdown 原文，并在答案后显示引用笔记。",
];
await output("KNOWLEDGE_BASE.md", `${knowledgeBaseLines.join("\n")}\n`, stale);

const qualityLines = [
  "# 知识库质量报告",
  "",
  "> 本页由 `tools/build-knowledge-base.mjs` 自动生成，请勿手工编辑统计结果。",
  "",
  "## 汇总",
  "",
  `- 权威笔记：${canonicalNotes.length} 篇`,
  `- 兼容跳转页：${aliases.length} 篇`,
  `- 无任何内部关系的笔记：${orphanNotes.length} 篇`,
  `- 失效内部链接：${brokenLinks.length} 条`,
  `- 重复权威正文：${duplicateGroups.length} 组`,
  "",
  "## 下一步重点",
  "",
  "1. 优先为高频笔记补充 YAML 属性、摘要和来源。",
  "2. 在正文中补充真正有语义的相关笔记链接，减少孤立页面。",
  "3. 将 `unreviewed` 笔记逐步复核为 `evergreen` 或移入归档。",
  "",
];

if (brokenLinks.length) {
  qualityLines.push("## 失效链接", "", ...brokenLinks.slice(0, 100).map((item) => `- \`${item.source}\` → \`${item.target}\``), "");
}
if (duplicateGroups.length) {
  qualityLines.push("## 重复正文", "", ...duplicateGroups.map((group) => `- ${group.map((item) => `\`${item}\``).join("、")}`), "");
}
if (orphanNotes.length) {
  qualityLines.push("## 孤立笔记（前 100 篇）", "", ...orphanNotes.slice(0, 100).map((note) => `- [${note.title}](${linkFrom("kb/quality-report.md", note.id)})`), "");
}
await output("kb/quality-report.md", `${qualityLines.join("\n").trim()}\n`, stale);

console.log(`${checkOnly ? "Stale" : "Updated"} knowledge-base outputs: ${stale.length}.`);
for (const file of stale) console.log(file);
process.exitCode = checkOnly && stale.length ? 1 : 0;
