import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const write = process.argv.includes("--write");
const ignoredDirectories = new Set([".git", "node_modules", "private"]);
const structuralNames = new Set(["_sidebar.md", "_navbar.md", "_coverpage.md"]);

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

function displayName(file) {
  const parsed = path.parse(file);
  const raw = parsed.name.toLowerCase() === "readme" ? path.basename(parsed.dir) : parsed.name;
  const known = new Map([
    ["AI", "人工智能"],
    ["computerScience", "计算机科学"],
    ["Electronics", "电子与通信"],
    ["socioeconomics", "工作与自我管理"],
    ["Self-Management", "自我管理"],
    ["useful_tips", "常用技巧"],
    ["deep-learning", "深度学习"],
    ["Operting_System", "操作系统"],
    ["opencv", "OpenCV"],
    ["openGL", "OpenGL"],
    ["cpp", "C++"],
    ["python", "Python"],
    ["math", "数学"],
  ]);
  return known.get(raw) ?? raw.replaceAll("_", " ").replaceAll("-", " ");
}

function fenceAt(line) {
  const match = line.match(/^\s*(?:>\s*)*(?:(?:[-+*]|\d+[.)])\s+)?(`{3,}|~{3,})/);
  return match ? { character: match[1][0], length: match[1].length } : null;
}

function visibleLineIndexes(lines) {
  const indexes = [];
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
    if (!fence) indexes.push(index);
  }
  return indexes;
}

function normalizeTitle(source, file) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const visible = visibleLineIndexes(lines);
  if (visible.some((index) => /^#\s+\S/.test(lines[index]))) return null;

  const firstContentIndex = visible.find((index) => lines[index].trim() !== "");
  if (firstContentIndex !== undefined) {
    const heading = lines[firstContentIndex].match(/^#{2,6}\s+(.+?)\s*#*$/);
    if (heading) {
      lines[firstContentIndex] = `# ${heading[1]}`;
      return `${lines.join("\n").replace(/\n*$/, "")}\n`;
    }
  }

  let insertionIndex = 0;
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
    if (end !== -1) insertionIndex = end + 1;
  }
  while (lines[insertionIndex]?.trim() === "") insertionIndex += 1;
  lines.splice(insertionIndex, 0, `# ${displayName(file)}`, "");
  return `${lines.join("\n").replace(/\n*$/, "")}\n`;
}

const files = await collectMarkdownFiles(root);
const changes = [];
for (const file of files) {
  if (structuralNames.has(path.basename(file).toLowerCase())) continue;
  const source = await fs.readFile(file, "utf8");
  const normalized = normalizeTitle(source, file);
  if (!normalized || normalized === source) continue;
  changes.push(path.relative(root, file));
  if (write) await fs.writeFile(file, normalized, "utf8");
}

console.log(`${write ? "Added" : "Would add"} titles to ${changes.length} Markdown files.`);
for (const file of changes) console.log(file);
process.exitCode = !write && changes.length ? 1 : 0;
