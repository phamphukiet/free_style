// mode-handler.js
// Đổi tab activitybar → đổi chế độ, mở lại session gần nhất của chế độ đó (chưa có thì để trống,
// session mới chỉ tạo khi user gửi tin). Không đụng vào ô đang gõ dở.

import { handleSelectSession } from "../session/session-handler.js";

async function applyTab(host, tabId) {
  host.mode = host.modeMap[tabId] ?? "";
  if (!host.mode) return;
  const mine = host.visibleSessions;
  if (mine.some((s) => s.id === host.sessionId)) return;
  if (mine.length > 0) return handleSelectSession(host, mine[0].id);
  host.sessionId = "";
  host.messages = [];
  host.tokenUsed = 0;
}

export async function loadModeMap(host) {
  host.modeMap = (await window.api.chat.modes()) || {};
  await applyTab(host, host.tabId);
}

export function handleTabChange(host, tabId) {
  host.tabId = tabId;
  return applyTab(host, tabId);
}
