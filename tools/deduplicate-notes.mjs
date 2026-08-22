import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const write = process.argv.includes("--write");
const ignoredDirectories = new Set([".git", "node_modules", "private", "kb", "templates"]);
const structuralNames = new Set(["_sidebar.md", "_navbar.md", "_coverpage.md"]);
const ignoredFiles = new Set(["KNOWLEDGE_BASE.md", "NOTE_OPTIMIZATION.md", "OBSIDIAN_SETUP.md"]);

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

function normalizedContent(source) {
  return source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
}

function canonicalScore(file, group) {
  const name = relative(file);
  const hasAiAndComputerScience = group.some((item) => relative(item).startsWith("docs/AI/"))
    && group.some((item) => relative(item).startsWith("docs/computerScience/"));
  const deepLearning = group.some((item) => relative(item).includes("/deep-learning/"));

  if (hasAiAndComputerScience && deepLearning) return name.startsWith("docs/AI/") ? 0 : 100;
  if (hasAiAndComputerScience) return name.startsWith("docs/computerScience/") ? 0 : 100;
  if (group.some((item) => relative(item).includes("/work/Camera/"))) {
    return name.includes("/work/Camera/") ? 0 : 100;
  }
  return name.split("/").length;
}

function chooseCanonical(group) {
  return [...group].sort((left, right) => {
    const score = canonicalScore(left, group) - canonicalScore(right, group);
    return score || relative(left).localeCompare(relative(right), "en");
  })[0];
}

function titleOf(source, file) {
  const match = source.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  const parsed = path.parse(file);
  return (parsed.name.toLowerCase() === "readme" ? path.basename(parsed.dir) : parsed.name)
    .replaceAll("_", " ")
    .replaceAll("-", " ");
}

function stubFor(source, duplicate, canonical) {
  let target = path.relative(path.dirname(duplicate), canonical).replaceAll("\\", "/");
  if (!target.startsWith(".")) target = `./${target}`;
  return `# ${titleOf(source, duplicate)}\n\n> 此页面与其他笔记内容重复，已合并至权威页面。\n\n[前往权威笔记](${target})\n\n<!-- kb-canonical: ${relative(canonical)} -->\n`;
}

const files = (await collectMarkdownFiles(root)).filter((file) => {
  const name = path.basename(file).toLowerCase();
  return !structuralNames.has(name) && !ignoredFiles.has(path.basename(file));
});
const groupsByHash = new Map();

for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  const content = normalizedContent(source);
  if (content.length < 80 || content.includes("<!-- kb-canonical:")) continue;
  const hash = createHash("sha256").update(content).digest("hex");
  const group = groupsByHash.get(hash) ?? [];
  group.push(file);
  groupsByHash.set(hash, group);
}

const actions = [];
for (const group of groupsByHash.values()) {
  if (group.length < 2) continue;
  const canonical = chooseCanonical(group);
  for (const duplicate of group) {
    if (duplicate === canonical) continue;
    const source = await fs.readFile(duplicate, "utf8");
    const stub = stubFor(source, duplicate, canonical);
    actions.push({ duplicate: relative(duplicate), canonical: relative(canonical) });
    if (write) await fs.writeFile(duplicate, stub, "utf8");
  }
}

console.log(`${write ? "Replaced" : "Would replace"} ${actions.length} duplicate notes with canonical links.`);
for (const action of actions) console.log(`${action.duplicate} -> ${action.canonical}`);
process.exitCode = !write && actions.length ? 1 : 0;
