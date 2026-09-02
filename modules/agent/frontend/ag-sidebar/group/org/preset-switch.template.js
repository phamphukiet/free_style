// preset-switch.template.js
import { html } from "lit";

export function presetSwitchTemplate(host) {
  const isSolo = host.org.presetId === "solo";

  if (isSolo) {
    return html`
      <div class="org-preset-row">
        <span class="org-current-label">Đang dùng: Solo (mặc định)</span>
        <select
          class="org-preset-select"
          .value=${""}
          @change=${(e) => {
            if (e.target.value) host.handleSelectPreset(e.target.value);
          }}
        >
          <option value="">-- Đổi sang mô hình khác --</option>
          ${host.presets.map(
            (p) => html`<option value=${p.id}>${p.name}</option>`,
          )}
        </select>
      </div>
    `;
  }

  return html`
    <div class="org-preset-row">
      <select
        class="org-preset-select"
        .value=${host.org.presetId}
        @change=${(e) => host.handleSelectPreset(e.target.value)}
      >
        ${host.presets.map(
          (p) => html`<option value=${p.id}>${p.name}</option>`,
        )}
      </select>
    </div>
  `;
}
