// messages.template.js
// Toàn bộ vùng tin nhắn: empty state, tin user (text thuần), tin assistant (markdown),
// typing indicator. CSS nạp qua <style> trong template (cùng cách editor-group
// đang làm) nên không phải sửa chat-panel.js.

import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import chatIcon from "lucide-static/icons/message-square.svg?raw";
import messageCss from "../styles/messages.css?inline";
import markdownCss from "../styles/markdown.css?inline";
import codeBlockCss from "../styles/code-block.css?inline";
import { renderMarkdown } from "./markdown.template.js";
import { copyButtonTemplate } from "./copy-button.template.js";

const STYLES = [messageCss, markdownCss, codeBlockCss].join("\n");

const EMPTY = html`
  <div class="chat-empty">
    <span class="chat-empty-icon">${unsafeSVG(chatIcon)}</span>
    <span class="chat-empty-title">Bắt đầu trò chuyện</span>
    <span class="chat-empty-hint">Đặt câu hỏi hoặc giao việc cho agent.</span>
  </div>
`;

const TYPING = html`
  <div
    class="chat-message assistant chat-typing"
    role="status"
    aria-live="polite"
  >
    <span class="chat-dots" aria-hidden="true">
      <span class="chat-dot"></span><span class="chat-dot"></span
      ><span class="chat-dot"></span>
    </span>
    <span class="chat-typing-label">Đang xử lý</span>
  </div>
`;

function messageTemplate(m) {
  if (m.role === "user") {
    return html`<div class="chat-message user">${m.content}</div>`;
  }
  return html`
    <div class="chat-message assistant">
      <div class="chat-md">${renderMarkdown(m)}</div>
      <div class="chat-msg-actions">
        ${copyButtonTemplate(String(m.content ?? ""), "Sao chép phản hồi")}
      </div>
    </div>
  `;
}

export function messagesTemplate(host) {
  return html`
    <style>
      ${STYLES}
    </style>
    <div class="chat-messages" role="log" aria-live="polite">
      ${host.messages.length === 0
        ? EMPTY
        : host.messages.map((m) => messageTemplate(m))}
      ${host.sending ? TYPING : ""}
    </div>
  `;
}
