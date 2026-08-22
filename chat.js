const elements = {
  composer: document.querySelector("#composer"), prompt: document.querySelector("#prompt"),
  send: document.querySelector("#send-button"), stop: document.querySelector("#stop-button"),
  messages: document.querySelector("#messages"), welcome: document.querySelector("#welcome"),
  conversation: document.querySelector("#conversation"), history: document.querySelector("#history-list"),
  newChat: document.querySelector("#new-chat"), title: document.querySelector("#chat-title"),
  connection: document.querySelector("#connection"), mode: document.querySelector("#mode-pill"),
  sidebar: document.querySelector("#sidebar"), menu: document.querySelector("#menu-button"), scrim: document.querySelector("#scrim"),
};

const storageKey = "notes-yu-chat-sessions-v1";
let sessions = readSessions();
let currentId = sessions[0]?.id || null;
let controller = null;
let sourceMap = [];

function readSessions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch { return []; }
}

function saveSessions() {
  localStorage.setItem(storageKey, JSON.stringify(sessions.slice(0, 20)));
  renderHistory();
}

function currentSession() { return sessions.find((session) => session.id === currentId); }
function makeId() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }

function ensureSession(firstPrompt) {
  let session = currentSession();
  if (!session) {
    session = { id: makeId(), title: firstPrompt.slice(0, 28), createdAt: Date.now(), messages: [] };
    sessions.unshift(session);
    currentId = session.id;
  }
  return session;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([1-9]\d*)\]/g, (_, number) => {
      const source = sourceMap[Number(number) - 1];
      return source ? `<a class="citation" href="${escapeHtml(source.url)}" target="_blank" title="${escapeHtml(source.title)}">${number}</a>` : `[${number}]`;
    });
}

function renderMarkdown(value) {
  const codeBlocks = [];
  const protectedText = String(value).replace(/```([^\n]*)\n([\s\S]*?)```/g, (_, language, code) => {
    const key = `@@CODE${codeBlocks.length}@@`;
    codeBlocks.push(`<pre><code data-language="${escapeHtml(language.trim())}">${escapeHtml(code.trimEnd())}</code></pre>`);
    return key;
  });
  const lines = protectedText.split("\n");
  let html = "";
  let list = null;
  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const line of lines) {
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)/);
    const unordered = line.match(/^\s*[-*]\s+(.+)/);
    if (ordered || unordered) {
      const nextList = ordered ? "ol" : "ul";
      if (list !== nextList) { closeList(); list = nextList; html += `<${list}>`; }
      html += `<li>${inlineMarkdown((ordered || unordered)[1])}</li>`;
      continue;
    }
    closeList();
    if (!line.trim()) continue;
    if (/^@@CODE\d+@@$/.test(line.trim())) html += line.trim();
    else if (line.startsWith("### ")) html += `<h4>${inlineMarkdown(line.slice(4))}</h4>`;
    else if (line.startsWith("## ")) html += `<h3>${inlineMarkdown(line.slice(3))}</h3>`;
    else html += `<p>${inlineMarkdown(line)}</p>`;
  }
  closeList();
  return html.replace(/@@CODE(\d+)@@/g, (_, index) => codeBlocks[Number(index)] || "");
}

function sourceCards(sources) {
  if (!sources?.length) return "";
  return `<div class="sources"><p class="sources-title">参考笔记 · ${sources.length} 条</p><div class="source-list">${sources.map((source) => `
    <a class="source-card" href="${escapeHtml(source.url)}" target="_blank">
      <strong><span class="source-number">${source.number}</span>${escapeHtml(source.title)}</strong>
      <small>${escapeHtml(source.section)}${source.heading ? ` · ${escapeHtml(source.heading)}` : ""}</small>
    </a>`).join("")}</div></div>`;
}

function messageElement(message, options = {}) {
  const article = document.createElement("article");
  article.className = `message ${message.role}`;
  const assistant = message.role === "assistant";
  if (assistant && message.sources) sourceMap = message.sources;
  article.innerHTML = `
    <div class="avatar" aria-hidden="true">${assistant ? "瑜" : "我"}</div>
    <div><div class="message-label">${assistant ? "知识库助手" : "你"}</div>
      <div class="message-body${options.typing ? " typing" : ""}">${renderMarkdown(message.content || "")}</div>
      ${assistant ? sourceCards(message.sources) : ""}
    </div>`;
  return article;
}

function renderConversation() {
  const session = currentSession();
  elements.messages.replaceChildren();
  const hasMessages = Boolean(session?.messages.length);
  elements.welcome.hidden = hasMessages;
  elements.title.textContent = session?.title || "问问我的知识库";
  if (hasMessages) {
    for (const message of session.messages) elements.messages.append(messageElement(message));
    scrollBottom(false);
  }
}

function renderHistory() {
  elements.history.replaceChildren();
  if (!sessions.length) {
    elements.history.innerHTML = '<p class="history-empty">对话会保存在这台设备上，方便你继续追问。</p>';
    return;
  }
  for (const session of sessions) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `history-item${session.id === currentId ? " active" : ""}`;
    button.innerHTML = `<span aria-hidden="true">◌</span><span class="history-title">${escapeHtml(session.title)}</span><span class="history-delete" title="删除">×</span>`;
    button.addEventListener("click", (event) => {
      if (event.target.closest(".history-delete")) {
        sessions = sessions.filter((item) => item.id !== session.id);
        if (currentId === session.id) currentId = sessions[0]?.id || null;
        saveSessions(); renderConversation(); return;
      }
      currentId = session.id; renderHistory(); renderConversation(); closeSidebar();
    });
    elements.history.append(button);
  }
}

function scrollBottom(smooth = true) {
  requestAnimationFrame(() => elements.conversation.scrollTo({ top: elements.conversation.scrollHeight, behavior: smooth ? "smooth" : "auto" }));
}

function resizePrompt() {
  elements.prompt.style.height = "auto";
  elements.prompt.style.height = `${Math.min(elements.prompt.scrollHeight, 160)}px`;
}

function setBusy(busy) {
  elements.prompt.disabled = busy;
  elements.send.hidden = busy;
  elements.stop.hidden = !busy;
}

async function ask(prompt) {
  const session = ensureSession(prompt);
  const history = session.messages.map(({ role, content }) => ({ role, content }));
  session.messages.push({ role: "user", content: prompt });
  elements.welcome.hidden = true;
  elements.messages.append(messageElement(session.messages.at(-1)));

  const assistant = { role: "assistant", content: "", sources: [] };
  const assistantNode = messageElement(assistant, { typing: true });
  elements.messages.append(assistantNode);
  const body = assistantNode.querySelector(".message-body");
  scrollBottom(); setBusy(true); saveSessions();
  controller = new AbortController();

  try {
    const response = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, history }), signal: controller.signal,
    });
    if (!response.ok || !response.body) throw new Error(`连接失败（${response.status}）`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n"); buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === "sources") { assistant.sources = event.sources; sourceMap = event.sources; }
        if (event.type === "delta") {
          assistant.content += event.delta;
          body.innerHTML = renderMarkdown(assistant.content);
          scrollBottom();
        }
        if (event.type === "error") throw new Error(event.message);
      }
      if (done) break;
    }
    body.classList.remove("typing");
    assistantNode.children[1].insertAdjacentHTML("beforeend", sourceCards(assistant.sources));
    session.messages.push(assistant);
    sessions = [session, ...sessions.filter((item) => item.id !== session.id)];
    saveSessions();
  } catch (error) {
    body.classList.remove("typing");
    if (error.name === "AbortError") {
      if (assistant.content) session.messages.push(assistant);
      else assistantNode.remove();
    } else {
      body.innerHTML = `<div class="error-note">${escapeHtml(error.message || "暂时无法回答，请稍后重试。")}</div>`;
    }
  } finally {
    controller = null; setBusy(false); elements.prompt.focus(); saveSessions();
  }
}

async function submitPrompt() {
  const prompt = elements.prompt.value.trim();
  if (!prompt || controller) return;
  elements.prompt.value = ""; resizePrompt();
  await ask(prompt);
}

async function loadStatus() {
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    if (!response.ok) throw new Error();
    const status = await response.json();
    elements.connection.classList.add("ready");
    elements.connection.querySelector("span:last-child").textContent = `${status.notes} 篇笔记 · ${status.chunks} 个知识片段`;
    elements.mode.textContent = status.mode === "ai" ? `AI · ${status.model}` : "仅检索模式";
    elements.mode.title = status.mode === "ai" ? "AI 综合回答已启用" : "添加 OPENAI_API_KEY 后启用 AI 综合回答";
  } catch {
    elements.connection.classList.add("error");
    elements.connection.querySelector("span:last-child").textContent = "知识库服务未连接";
    elements.mode.textContent = "未连接";
  }
}

function closeSidebar() { elements.sidebar.classList.remove("open"); elements.scrim.classList.remove("open"); }

elements.composer.addEventListener("submit", (event) => { event.preventDefault(); submitPrompt(); });
elements.prompt.addEventListener("input", resizePrompt);
elements.prompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) { event.preventDefault(); submitPrompt(); }
});
elements.stop.addEventListener("click", () => controller?.abort());
elements.newChat.addEventListener("click", () => { currentId = null; renderHistory(); renderConversation(); closeSidebar(); elements.prompt.focus(); });
elements.menu.addEventListener("click", () => { elements.sidebar.classList.add("open"); elements.scrim.classList.add("open"); });
elements.scrim.addEventListener("click", closeSidebar);
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => ask(button.dataset.prompt)));

renderHistory(); renderConversation(); resizePrompt(); loadStatus();
