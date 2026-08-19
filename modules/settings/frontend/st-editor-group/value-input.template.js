import { html } from "lit";

export function valueInputTemplate(host, item) {
  const onCommit = (v) => host.handleValueChange(item, v);

  if (item.type === "boolean") {
    return html`<input
      type="checkbox"
      .checked=${!!item.value}
      @change=${(e) => onCommit(e.target.checked)}
    />`;
  }
  if (item.type === "select") {
    return html`
      <select class="st-select" @change=${(e) => onCommit(e.target.value)}>
        ${item.options.map(
          (o) =>
            html`<option value=${o.value} ?selected=${o.value === item.value}>
              ${o.label}
            </option>`,
        )}
      </select>
    `;
  }
  if (item.type === "number") {
    return html`<input
      type="number"
      class="st-input"
      .value=${item.value}
      @change=${(e) => onCommit(Number(e.target.value))}
    />`;
  }
  return html`<input
    type="text"
    class="st-input"
    .value=${item.value}
    @change=${(e) => onCommit(e.target.value)}
  />`;
}
