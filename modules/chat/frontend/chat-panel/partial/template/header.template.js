// header.template.js
import { html } from "lit";

export function headerTemplate(host) {
  const hasAgents = host.agents.length > 0;
  
  if (hasAgents) {
    return html`
      <div class="chat-header">
        <select
          class="chat-select"
          .value=${host.selectedAgentId}
          @change=${(e) => host.handleSelectAgent(e.target.value)}
        >
          <option value="">-- Chọn agent --</option>
          ${host.agents.map((a) => html`<option value=${a.id}>${a.name}</option>`)}
        </select>
      </div>
    `;
  }

  return html`
    <div class="chat-header">
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
  `;
}
