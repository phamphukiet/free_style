// agent-reply.js
const { getChatProvider } = require("../../chat/backend/providers-registry");
const { resolveKey } = require("../../chat/backend/send/resolve");
const { buildHistoryPrompt } = require("../../chat/backend/send/history");
const agentStore = require("../../agent/backend/agent/store");
const { getMessages, appendMessage } = require("./chat-store");

async function replyAsAgent(task) {
  const agent = agentStore.get(task.agentId);
  if (!agent?.providerId) throw new Error("Task chưa gán agent hợp lệ.");

  const apiKey = resolveKey(agent.providerId, agent.keyId);
  if (!apiKey) throw new Error(`Chưa có API key cho "${agent.providerId}".`);

  const sendMessage = getChatProvider(agent.providerId);
  if (!sendMessage)
    throw new Error(`Provider "${agent.providerId}" chưa hỗ trợ chat.`);

  const history = getMessages(task.id);
  const systemPrompt = [
    `Bạn đang phụ trách task Kanban "${task.title}". Mô tả: ${task.description || "(không có)"}.`,
    "Nếu kết quả trước đó vừa bị từ chối, hãy chủ động hỏi rõ điểm cần chỉnh sửa hoặc đề xuất hướng sửa.",
    buildHistoryPrompt(history),
  ]
    .filter(Boolean)
    .join("\n\n");

  const lastUserMsg = history[history.length - 1]?.content || "";
  const raw = await sendMessage(apiKey, lastUserMsg, agent.model, systemPrompt);
  const content = typeof raw === "object" ? (raw.content ?? raw) : raw;
  appendMessage(task.id, { role: "assistant", content });
  return content;
}

module.exports = { replyAsAgent };
