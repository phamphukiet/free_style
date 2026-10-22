import { html } from "lit";
import { valueInputTemplate } from "./value-input.template.js";
import { presetFormTemplate } from "./preset-form.template.js";

function rowTemplate(host, item) {
  return html`
    <div class="st-item-row ${item.modified ? "st-modified" : ""}">
      <div class="st-item-info">
        <div class="st-item-label">${item.label}</div>
        <div class="st-item-id">${item.id}</div>
        ${item.description
          ? html`<div class="st-item-desc">${item.description}</div>`
          : ""}
      </div>
      ${valueInputTemplate(host, item)}
      ${item.type === "select"
        ? html`<button
            class="st-mini-btn"
            @click=${() => host.handleStartPreset(item)}
          >
            + Mẫu
          </button>`
        : ""}
      ${item.modified
        ? html`<button
            class="st-mini-btn"
            title="Đặt lại"
            @click=${() => host.handleReset(item)}
          >
            ↺
          </button>`
        : ""}
    </div>
  `;
}

export function detailTemplate(host) {
  const items = host.allItems.filter((s) => s.group === host.activeGroup);
  return html`
    <button class="st-back-btn" @click=${() => host.handleBack()}>
      &larr; Tất cả setting
    </button>
    <h2 class="st-detail-title">${host.activeGroup}</h2>
    <div class="st-item-list">
      ${items.map((item) => rowTemplate(host, item))}
      ${items.length === 0
        ? html`<div class="st-empty">Chưa có setting trong nhóm này</div>`
        : ""}
    </div>
    ${host.presetTarget ? presetFormTemplate(host) : ""}
  `;
}
