import { html } from "lit";

// Giá trị option có thể là số ([2, 5, 30]) nhưng DOM trả chuỗi: map ngược để engine nhận đúng kiểu.
const pick = ({ field, raw }) =>
  field.options.find((o) => String(o.value) === raw)?.value;

function inputTemplate({ field, onCommit }) {
  switch (field.type) {
    case "boolean":
      return html`<input
        type="checkbox"
        .checked=${!!field.value}
        @change=${(e) => onCommit(e.target.checked)}
      />`;
    case "select":
      return html`<select
        class="field-input"
        @change=${(e) => onCommit(pick({ field, raw: e.target.value }))}
      >
        ${field.options.map(
          (o) =>
            html`<option value=${o.value} ?selected=${o.value === field.value}>
              ${o.label}
            </option>`,
        )}
      </select>`;
    case "number":
      return html`<input
        type="number"
        class="field-input"
        .value=${field.value}
        @change=${(e) => onCommit(Number(e.target.value))}
      />`;
    default:
      return html`<input
        type="text"
        class="field-input"
        .value=${field.value}
        @change=${(e) => onCommit(e.target.value)}
      />`;
  }
}

export function fieldTemplate({ field, onCommit }) {
  return html`
    <div class="field-row">
      <div class="field-info">
        <div class="field-label">${field.label}</div>
        ${field.description
          ? html`<div class="field-desc">${field.description}</div>`
          : ""}
      </div>
      ${inputTemplate({ field, onCommit })}
    </div>
  `;
}
