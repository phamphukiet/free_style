import { html } from "lit";

export function taskDetailTemplate(host) {
  if (!host.task) return html`<div class="td-panel"></div>`;
  return html`
    <div class="td-panel" @click=${(e) => e.stopPropagation()}>
      <div class="td-header">
        <strong>${host.task.title}</strong>
        <button
          class="td-close-btn"
          @click=${() => host.dispatchEvent(new CustomEvent("close"))}
        >
          ×
        </button>
      </div>
      <div class="td-body">
        <div class="td-desc">
          ${host.task.description || "(Không có mô tả)"}
        </div>
        ${host.task.result
          ? html`<div class="td-desc">
              Kết quả v${host.task.result.version}: ${host.task.result.summary}
            </div>`
          : ""}
        <div class="td-history">
          ${host.task.history.map(
            (h) =>
              html`<div>
                ${new Date(h.at).toLocaleString()} — ${h.from ?? "?"} → ${h.to}
                (${h.actor})${h.reason ? `: ${h.reason}` : ""}
              </div>`,
          )}
        </div>
        <div class="td-chat">
          ${host.messages.map(
            (m) => html`<div class="td-msg ${m.role}">${m.content}</div>`,
          )}
        </div>
      </div>
      <div class="td-input-row">
        <input
          class="td-input"
          placeholder="Nhắn cho agent..."
          .value=${host.chatInput}
          @input=${(e) => (host.chatInput = e.target.value)}
          @keydown=${(e) => e.key === "Enter" && host.handleSend()}
        />
        <button class="td-send-btn" @click=${() => host.handleSend()}>
          Gửi
        </button>
      </div>
    </div>
  `;
}
