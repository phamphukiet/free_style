import { html } from "lit";
import { fieldTemplate } from "../ext-field/ext-field.template.js";

export function extItemTemplate(host) {
  const { item, open } = host;
  const fields = item.fields;
  const body =
    open && fields.length > 0
      ? html`<div class="item-body">
          ${fields.map((field) =>
            fieldTemplate({
              field,
              onCommit: (value) => host.handleChange(field, value),
            }),
          )}
        </div>`
      : "";

  return html`
    <div class="item-head">
      <div class="item-info" @click=${() => host.handleToggleOpen()}>
        <div class="item-name">${item.name}</div>
        <div class="item-id">${item.id}</div>
      </div>
      <input
        type="checkbox"
        class="item-switch"
        .checked=${item.enabled}
        @change=${(e) => host.handleToggle(e)}
      />
      <button class="item-btn" @click=${() => host.handleRemove()}>Xoá</button>
    </div>
    ${body}
  `;
}
