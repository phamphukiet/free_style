// send-handler.js
import { handleNewSession } from "../session/session-handler.js";

export async function handleSend(host) {
  const content = host.inputValue.trim();
  if (!content || host.sending) return;
  if (!host.sessionId) await handleNewSession(host);

  host.messages = [...host.messages, { role: "user", content }];
  host.inputValue = "";
  host.sending = true;
  await host.updateComplete;
  host._scrollToBottom();

  const [providerId, keyId] = host.selectedKeyRef.split(":");
  try {
    const reply = await window.api.chat.send({
      message: content,
      agentId: host.selectedAgentId || null,
      providerId: providerId || null,
      keyId: keyId || null,
      model: host.selectedModel || null,
      sessionId: host.sessionId,
    });
    const assistantText = reply?.content || "(không có phản hồi)";
    host.messages = [...host.messages, { role: "assistant", content: assistantText }];
    if (reply?.tokenUsed) host.tokenUsed += reply.tokenUsed;
  } catch (error) {
    host.messages = [...host.messages, { role: "assistant", content: "Lỗi: " + error.message }];
  } finally {
    host.sending = false;
    await host.updateComplete;
    host._scrollToBottom();
  }
}
