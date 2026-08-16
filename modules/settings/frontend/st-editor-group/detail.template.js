import { html } from "lit";
import { valueInputTemplate } from "./value-input.template.js";
import { createFormTemplate } from "./create-form.template.js";

export function detailTemplate(host) {
  const items = host.allItems.filter((s) => s.group === host.activeGroup);

  return html`
    <button class="st-back-btn" @click=${() => host.handleBack()}>
      &larr; Tất cả setting
    </button>
    <h2 class="st-detail-title">${host.activeGroup}</h2>

    <div class="st-item-list">
      ${items.map(
        (item) => html`
          <div class="st-item-row">
            <div class="st-item-info">
              <div class="st-item-label">${item.label}</div>
              <div class="st-item-id">${item.id}</div>
            </div>
            ${valueInputTemplate(host, item)}
            ${item.origin === "root" && item.type === "select"
              ? html`<button
                  class="st-mini-btn"
                  @click=${() => host.handleAddPreset(item)}
                >
                  + Mẫu
                </button>`
              : ""}
            ${item.origin === "create"
              ? html`
                  <button
                    class="st-mini-btn"
                    @click=${() => host.handleEdit(item)}
                  >
                    Sửa
                  </button>
                  <button
                    class="st-mini-btn st-danger"
                    @click=${() => host.handleDelete(item)}
                  >
                    Xoá
                  </button>
                `
              : ""}
          </div>
        `,
      )}
      ${items.length === 0
        ? html`<div class="st-empty">Chưa có setting trong nhóm này</div>`
        : ""}
    </div>

    ${host.creating
      ? createFormTemplate(host)
      : html`<button
          class="st-add-btn"
          @click=${() => host.handleStartCreate()}
        >
          + Thêm setting mới
        </button>`}
  `;
}
