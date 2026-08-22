import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules"]);

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

function localTargets(markdown) {
  const targets = [];
  const expression = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of markdown.matchAll(expression)) {
    const target = match[1].replace(/^<|>$/g, "");
    if (/^(?:[a-z]+:|#|\/\/)/i.test(target)) continue;
    targets.push(target.split("#", 1)[0].split("?", 1)[0]);
  }
  return targets.filter(Boolean);
}

function proseLines(lines) {
  const visible = [];
  let fence = null;
  let frontMatter = lines[0]?.trim() === "---";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (frontMatter) {
      if (index > 0 && line.trim() === "---") frontMatter = false;
      continue;
    }

    const candidate = fenceAt(line);
    if (candidate) {
      if (!fence) fence = candidate;
      else if (candidate.character === fence.character && candidate.length >= fence.length && /[`~]\s*$/.test(line)) fence = null;
      continue;
    }

    if (!fence) visible.push(line);
  }

  return visible;
}

const files = await collectMarkdownFiles(root);
const report = {
  files: files.length,
  bytes: 0,
  crlfFiles: 0,
  bomFiles: [],
  invalidUtf8Files: [],
  missingTitleFiles: [],
  multipleH1Files: [],
  unclosedFenceFiles: [],
  brokenLocalTargets: [],
  exactDuplicateGroups: [],
};
const hashes = new Map();

for (const file of files) {
  const buffer = await fs.readFile(file);
  const markdown = buffer.toString("utf8");
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const name = relative(file);
  report.bytes += buffer.length;
  if (markdown.includes("\r\n")) report.crlfFiles += 1;
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) report.bomFiles.push(name);
  if (markdown.includes("\uFFFD")) report.invalidUtf8Files.push(name);

  const h1Count = proseLines(lines).filter((line) => /^#\s+\S/.test(line)).length;
  const structuralFile = /(^|\/)(?:_sidebar|_navbar|_coverpage)\.md$/i.test(name);
  if (!structuralFile && h1Count === 0) report.missingTitleFiles.push(name);
  if (h1Count > 1) report.multipleH1Files.push(name);

  let fence = null;
  for (const line of lines) {
    const candidate = fenceAt(line);
    if (!candidate) continue;
    if (!fence) fence = candidate;
    else if (candidate.character === fence.character && candidate.length >= fence.length && /[`~]\s*$/.test(line)) fence = null;
  }
  if (fence) report.unclosedFenceFiles.push(name);

  for (const target of localTargets(markdown)) {
    let decoded = target;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      // Keep malformed escapes verbatim so the existence check can report them.
    }
    const resolved = path.resolve(path.dirname(file), decoded.replaceAll("/", path.sep));
    try {
      await fs.access(resolved);
    } catch {
      report.brokenLocalTargets.push(`${name} -> ${target}`);
    }
  }

  const normalizedContent = markdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
  if (!structuralFile && normalizedContent.replace(/\s/g, "").length >= 80) {
    const hash = createHash("sha256").update(normalizedContent).digest("hex");
    const group = hashes.get(hash) ?? [];
    group.push(name);
    hashes.set(hash, group);
  }
}

report.exactDuplicateGroups = [...hashes.values()].filter((group) => group.length > 1);
report.brokenLocalTargets = [...new Set(report.brokenLocalTargets)];

console.log(JSON.stringify(report, null, 2));
