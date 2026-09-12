import { html } from "lit";
import { cardTemplate } from "./card.template.js";

export function columnTemplate(host, col, tasks, totalCount) {
  return html`
    <div class="kb-column">
      <div class="kb-column-header">
        <span>${col.label}</span>
        <span
          >${totalCount}${col.limit !== Infinity ? `/${col.limit}` : ""}</span
        >
      </div>
      <div
        class="kb-column-body"
        @dragover=${(e) => e.preventDefault()}
        @drop=${(e) => {
          e.preventDefault();
          const taskId = e.dataTransfer.getData("text/task-id");
          if (taskId) host.handleDrop(taskId, col.id);
        }}
      >
        ${tasks.map((t) => cardTemplate(host, t))}
      </div>
      ${col.id === "ALL" && totalCount > tasks.length
        ? html`<button
            class="kb-more-btn"
            @click=${() => host.toggleALLModal()}
          >
            Xem tất cả (${totalCount})
          </button>`
        : ""}
    </div>
  `;
}
