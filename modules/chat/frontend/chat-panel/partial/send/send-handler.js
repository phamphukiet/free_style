// send-handler.js
import { handleNewSession } from "../session/session-handler.js";

function toast(message) {
  window.dispatchEvent(
    new CustomEvent("workbench:toast", { detail: { message } }),
  );
}

function callSend(host, message, sessionId) {
  const [providerId, keyId] = host.selectedKeyRef.split(":");
  return window.api.chat.send({
    message,
    sessionId,
    agentId: host.selectedAgentId || null,
    providerId: providerId || null,
    keyId: keyId || null,
    model: host.selectedModel || null,
  });
}

function onSuccess(host, sessionId, reply) {
  if (reply.notice) toast(reply.notice);
  if (host.sessionId !== sessionId) return; // đã đổi session, không nhét nhầm
  host.messages = [
    ...host.messages,
    { role: "assistant", content: reply.content },
  ];
  host.tokenUsed += reply.tokenUsed || 0;
}

function onFail(host, sessionId, content, message) {
  toast(message);
  if (host.sessionId !== sessionId) return;
  host.messages = host.messages.slice(0, -1); // gỡ tin chưa được lưu
  host.inputValue ||= content; // trả lại nội dung để gửi lại
}

export async function handleSend(host) {
  const content = host.inputValue.trim();
  if (!content || host.sending) return;
  if (!host.sessionId) await handleNewSession(host);

  const sessionId = host.sessionId;
  host.messages = [...host.messages, { role: "user", content }];
  host.inputValue = "";
  host.sending = true;
  await host.updateComplete;
  host._scrollToBottom();

  try {
    const reply = await callSend(host, content, sessionId);
    if (reply?.ok) onSuccess(host, sessionId, reply);
    else
      onFail(
        host,
        sessionId,
        content,
        reply?.error?.message || "Gửi thất bại.",
      );
  } catch (error) {
    onFail(host, sessionId, content, error.message);
  } finally {
    host.sending = false;
    await host.updateComplete;
    host._scrollToBottom();
  }
}
