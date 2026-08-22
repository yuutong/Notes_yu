import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const ignoredDirectories = new Set([".git", "node_modules"]);

async function collectMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function fenceAt(line) {
  const match = line.match(/^\s*(?:>\s*)*(?:(?:[-+*]|\d+[.)])\s+)?(`{3,}|~{3,})/);
  return match ? { character: match[1][0], length: match[1].length } : null;
}

function isClosingFence(line, fence) {
  const candidate = fenceAt(line);
  return (
    candidate &&
    candidate.character === fence.character &&
    candidate.length >= fence.length &&
    new RegExp(`^[\\s>]*(?:${fence.character}{${fence.length},})[\\s]*$`).test(line)
  );
}

function normalizeTrailingWhitespace(line) {
  // Use blank lines or explicit <br> tags for line breaks so invisible trailing
  // spaces never carry document structure.
  return line.replace(/[ \t]+$/, "");
}

function formatMarkdown(source) {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const input = normalized.split("\n");
  const output = [];
  let fence = null;
  let frontMatter = input[0]?.trim() === "---";
  let htmlBlock = null;

  for (let index = 0; index < input.length; index += 1) {
    let line = input[index];

    if (frontMatter) {
      output.push(normalizeTrailingWhitespace(line));
      if (index > 0 && line.trim() === "---") frontMatter = false;
      continue;
    }

    if (fence) {
      output.push(line.replace(/[ \t]+$/, ""));
      if (isClosingFence(line, fence)) fence = null;
      continue;
    }

    if (htmlBlock) {
      output.push(line.replace(/[ \t]+$/, ""));
      if (new RegExp(`</${htmlBlock}\\s*>`, "i").test(line)) htmlBlock = null;
      continue;
    }

    const openingFence = fenceAt(line);
    if (openingFence) {
      fence = openingFence;
      output.push(line.replace(/[ \t]+$/, ""));
      continue;
    }

    const htmlOpening = line.match(/^\s*<(pre|script|style)(?:\s|>)/i);
    if (htmlOpening && !new RegExp(`</${htmlOpening[1]}\\s*>`, "i").test(line)) {
      htmlBlock = htmlOpening[1];
      output.push(line);
      continue;
    }

    line = normalizeTrailingWhitespace(line);

    // ATX headings require a space after the hash run. This deliberately avoids
    // comments and headings made entirely of hash characters.
    line = line.replace(/^( {0,3}#{1,6})([^\s#])/, "$1 $2");
    output.push(line);
  }

  // Trim the document and collapse excessive vertical whitespace outside code.
  while (output.length && output[0].trim() === "") output.shift();
  while (output.length && output.at(-1).trim() === "") output.pop();

  const compact = [];
  let activeFence = null;
  let blankRun = 0;
  for (const line of output) {
    const marker = fenceAt(line);
    if (!activeFence && marker) activeFence = marker;

    if (!activeFence && line.trim() === "") {
      blankRun += 1;
      if (blankRun > 1) continue;
    } else {
      blankRun = 0;
    }

    compact.push(line);
    if (activeFence && isClosingFence(line, activeFence)) activeFence = null;
  }

  // Put one blank line around top-level headings and fenced blocks. Indented and
  // quoted blocks are left alone because their blank lines carry nesting meaning.
  const spaced = [];
  activeFence = null;
  for (let index = 0; index < compact.length; index += 1) {
    const line = compact[index];
    const topLevelHeading = /^#{1,6}\s+/.test(line);
    const topLevelFence = /^(`{3,}|~{3,})/.test(line);
    const beginsBlock = topLevelHeading || (!activeFence && topLevelFence);

    if (beginsBlock && spaced.length && spaced.at(-1).trim() !== "") spaced.push("");
    spaced.push(line);

    if (!activeFence && topLevelFence) {
      activeFence = fenceAt(line);
    } else if (activeFence && isClosingFence(line, activeFence)) {
      activeFence = null;
    }

    const endsBlock = topLevelHeading || (!activeFence && topLevelFence);
    const next = compact[index + 1];
    if (endsBlock && next !== undefined && next.trim() !== "") spaced.push("");
  }

  return `${spaced.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

const files = await collectMarkdownFiles(root);
const changed = [];

for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  if (source.includes("\uFFFD")) {
    throw new Error(`Refusing to format a file with invalid UTF-8: ${file}`);
  }

  const formatted = formatMarkdown(source);
  if (formatted !== source) {
    changed.push(path.relative(root, file));
    if (!checkOnly) await fs.writeFile(file, formatted, "utf8");
  }
}

console.log(`${checkOnly ? "Would format" : "Formatted"} ${changed.length} of ${files.length} Markdown files.`);
for (const file of changed) console.log(file);
process.exitCode = checkOnly && changed.length ? 1 : 0;
