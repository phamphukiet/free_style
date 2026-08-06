import { html } from "lit";

export function chatPanelTemplate(host) {
  return html`
    <div class="chat-selectors">
      <select
        class="chat-select"
        .value=${host.selectedModuleId}
        @change=${(e) => host.handleSelectModule(e.target.value)}
      >
        <option value="">-- Module --</option>
        ${host.modules.map(
          (m) => html`<option value=${m.id}>${m.title || m.id}</option>`,
        )}
      </select>
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
