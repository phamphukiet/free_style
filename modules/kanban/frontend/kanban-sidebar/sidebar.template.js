import { html } from "lit";
import { COLUMNS } from "../columns.js";

export function kanbanSidebarTemplate(host) {
  const countOf = (colId) =>
    host.tasks.filter((t) => t.columnId === colId).length;
  return html`
    <div class="kb-side-title">Board</div>
    ${COLUMNS.map((c) => {
      const count = countOf(c.id);
      const pending = c.id === "result" && count > 0;
      return html`
        <div class="kb-side-row ${pending ? "pending" : ""}">
          <span>${c.label}</span>
          <span class="kb-side-count">${count}</span>
        </div>
      `;
    })}
  `;
}
