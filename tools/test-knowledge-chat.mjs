import assert from "node:assert/strict";
import { startKnowledgeChatServer, rankChunks, tokenize } from "./knowledge-chat-server.mjs";

const originalApiKey = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;

assert(tokenize("C++ 虚函数如何实现").includes("c++"));
assert(tokenize("C++ 虚函数如何实现").includes("虚函"));

const sample = [
  { id: "virtual", note: { id: "virtual.md", title: "虚函数实现", tags: ["C++"], sectionLabel: "计算机科学" }, heading: "vtable", text: "虚函数表保存函数地址", searchable: "虚函数实现 c++ vtable 虚函数表保存函数地址" },
  { id: "camera", note: { id: "camera.md", title: "相机标定", tags: ["视觉"], sectionLabel: "计算机科学" }, heading: "标定", text: "相机内参和外参", searchable: "相机标定 视觉 相机内参和外参" },
];
assert.equal(rankChunks(sample, "C++ 虚函数")[0].note.id, "virtual.md");

const { server, url } = await startKnowledgeChatServer({ port: 0 });
try {
  const status = await fetch(url.replace(/\/chat$/, "/api/status")).then((response) => response.json());
  assert.equal(status.ready, true);
  assert(status.notes > 0);

  const chatResponse = await fetch(url.replace(/\/chat$/, "/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "虚函数是怎么实现的？", history: [] }),
  });
  const events = (await chatResponse.text()).trim().split("\n").map((line) => JSON.parse(line));
  assert.equal(events[0].type, "sources");
  assert(events[0].sources.some((source) => source.title.includes("虚函数")));
  assert(events.some((event) => event.type === "done"));
} finally {
  await new Promise((resolve) => server.close(resolve));
  if (originalApiKey) process.env.OPENAI_API_KEY = originalApiKey;
}

console.log("Knowledge chat tests passed.");
