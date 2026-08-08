import { html } from "lit";

export function chatPanelTemplate(host) {
  return html`
    <div class="chat-selectors">
      <select
        class="chat-select"
        .value=${host.selectedKeyRef}
        @change=${(e) => host.handleSelectKey(e.target.value)}
      >
        <option value="">-- API Key --</option>
        ${host.keys.map(
          (k) =>
            html`<option value=${`${k.providerId}:${k.id}`}>
              ${k.providerName} · ${k.name}
            </option>`,
        )}
      </select>
      <select
        class="chat-select"
        .value=${host.selectedModel}
        ?disabled=${host.models.length === 0}
        @change=${(e) => host.handleSelectModel(e.target.value)}
      >
        <option value="">
          ${host.models.length === 0 ? "-- Chọn key trước --" : "-- Model --"}
        </option>
        ${host.models.map((m) => html`<option value=${m.id}>${m.id}</option>`)}
      </select>
    </div>

    <div class="chat-messages">
      ${host.messages.length === 0
        ? html`<div class="chat-empty">Chưa có tin nhắn nào</div>`
        : host.messages.map(
            (m) => html`<div class="chat-message ${m.role}">${m.content}</div>`,
          )}
    </div>

    <div class="chat-input-row">
      <textarea
        class="chat-input"
        rows="2"
        placeholder="Nhập tin nhắn..."
        .value=${host.inputValue}
        @input=${(e) => (host.inputValue = e.target.value)}
        @keydown=${(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
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
        Gửi
      </button>
    </div>
  `;
}