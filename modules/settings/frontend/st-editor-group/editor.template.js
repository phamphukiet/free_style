import { html } from "lit";

function renderControl(host, def, value) {
  if (def.type === "enum") {
    return html`
      <select
        class="st-select"
        .value=${value}
        @change=${(e) => host.handleChange(def.id, e.target.value)}
      >
        ${(def.options || []).map(
          (opt) => html`<option value=${opt.value}>${opt.label}</option>`,
        )}
      </select>
    `;
  }
  return html`<span>Kiểu setting "${def.type}" chưa hỗ trợ hiển thị.</span>`;
}

export function stEditorTemplate(host) {
  const groups = [...new Set(host.definitions.map((d) => d.group))];

  return html`
    <div class="st-page-title">Settings</div>
    ${groups.map(
      (group) => html`
        <div class="st-group-title">${group}</div>
        ${host.definitions
          .filter((d) => d.group === group)
          .map(
            (d) => html`
              <div
                id=${`setting-${d.id}`}
                class="st-row ${host.highlightId === d.id ? "highlight" : ""}"
              >
                <div class="st-row-label">${d.label}</div>
                ${d.description
                  ? html`<div class="st-row-desc">${d.description}</div>`
                  : ""}
                ${renderControl(host, d, host.values[d.id])}
              </div>
            `,
          )}
      `,
    )}
  `;
}
