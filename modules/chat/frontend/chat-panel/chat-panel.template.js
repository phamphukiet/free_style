// chat-panel.template.js
import { html } from "lit";
import { headerTemplate } from "./partial/template/header.template.js";
import { sessionTemplate } from "./partial/template/session.template.js";
import { metricsTemplate } from "./partial/template/metrics.template.js";
import { messagesTemplate } from "./partial/template/messages.template.js";

export function chatPanelTemplate(host) {
  return html`
    <!-- ===== HEADER ===== -->
    ${headerTemplate(host)}

    <!-- ===== SESSION BAR ===== -->
    ${sessionTemplate(host)}

    <!-- ===== METRICS BARS ===== -->
    ${metricsTemplate(host)}

    <!-- ===== MESSAGES ===== -->
    ${messagesTemplate(host)}

    <!-- ===== INPUT ===== -->
    <div class="chat-input-row">
      <textarea
        class="chat-input"
        rows="2"
        placeholder="Nhập tin nhắn..."
        .value=${host.inputValue}
        @input=${(e) => (host.inputValue = e.target.value)}
        @keydown=${(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
            e.preventDefault();
            host.handleSend();
          }
        }}
      ></textarea>
      <button
        class="chat-send-btn"
        ?disabled=${!host.inputValue.trim() || host.sending}
        @click=${() => host.handleSend()}
      >
        ${host.sending ? "..." : "Gửi"}
      </button>
    </div>
  `;
}
