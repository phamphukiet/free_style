// session.template.js
import { html } from "lit";

export function sessionTemplate(host) {
  return html`
    <div class="chat-session-bar">
      <select
        class="chat-select chat-session-select"
        .value=${host.sessionId}
        @change=${(e) => host.handleSelectSession(e.target.value)}
      >
        <option value="">-- Chọn session --</option>
        ${host.sessions.map(
          (s) =>
            html`<option value=${s.id}>
              ${s.title || "Session " + s.id.slice(0, 6)}
            </option>`,
        )}
      </select>
      <button
        class="chat-icon-btn"
        title="Session mới"
        @click=${() => host.handleNewSession()}
      >+</button>
      ${host.sessionId
        ? html`<button
            class="chat-icon-btn chat-del-btn"
            title="Xóa session"
            @click=${() => host.handleDeleteSession(host.sessionId)}
          >×</button>`
        : ""}
    </div>
  `;
}
