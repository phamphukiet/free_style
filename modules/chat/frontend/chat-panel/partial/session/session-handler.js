// session-handler.js
import { syncAgentLimits } from "../agent/agent-loader.js";

export async function loadSessions(host) {
  host.sessions = await window.api.chat.sessionList();
}

export async function handleNewSession(host) {
  const s = await window.api.chat.sessionSave({
    agentId: host.selectedAgentId,
    title: "Cuộc trò chuyện mới",
    messages: [],
    tokenUsed: 0,
  });
  host.sessions = await window.api.chat.sessionList();
  await handleSelectSession(host, s.id);
}

export async function handleSelectSession(host, id) {
  host.sessionId = id;
  const s = await window.api.chat.sessionGet(id);
  host.messages = s?.messages || [];
  host.tokenUsed = s?.tokenUsed || 0;
  syncAgentLimits(host);
  await host.updateComplete;
  host._scrollToBottom();
}

export async function handleDeleteSession(host, id) {
  await window.api.chat.sessionDelete(id);
  host.sessions = await window.api.chat.sessionList();
  if (host.sessionId === id) {
    host.sessionId = "";
    host.messages = [];
    host.tokenUsed = 0;
  }
}
