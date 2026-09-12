import { html } from "lit";
import { COLUMNS } from "../columns.js";
import { columnTemplate } from "./partial/column.template.js";
import { ALLModalTemplate } from "./partial/ALL-modal.template.js";
import "../task-detail/task-detail.js";

const VISIBLE_LIMIT = 3;

export function kanbanEditorTemplate(host) {
  const tasksOf = (colId) =>
    host.tasks
      .filter((t) => t.columnId === colId)
      .sort((a, b) => b.order - a.order);

  return html`
    <div class="kb-new-task-row">
      <input
        class="kb-new-task-input"
        placeholder="Task mới..."
        .value=${host.newTaskTitle}
        @input=${(e) => (host.newTaskTitle = e.target.value)}
        @keydown=${(e) => e.key === "Enter" && host.handleCreateTask()}
      />
      <select
        class="kb-new-task-input"
        style="flex:0 0 140px;"
        .value=${host.newTaskAgentId}
        @change=${(e) => (host.newTaskAgentId = e.target.value)}
      >
        <option value="">-- Agent --</option>
        ${host.agents.map(
          (a) => html`<option value=${a.id}>${a.name}</option>`,
        )}
      </select>
      <button class="kb-new-task-btn" @click=${() => host.handleCreateTask()}>
        + Thêm
      </button>
    </div>

    <div class="kb-board">
      ${COLUMNS.map((col) => {
        const all = tasksOf(col.id);
        const visible = col.id === "ALL" ? all.slice(0, VISIBLE_LIMIT) : all;
        return columnTemplate(host, col, visible, all.length);
      })}
    </div>

    ${host.showALLModal ? ALLModalTemplate(host, tasksOf("ALL")) : ""}
    ${host.selectedTaskId
      ? html`<kanban-task-detail
          .taskId=${host.selectedTaskId}
          @close=${() => host.handleCloseDetail()}
          @changed=${() => host.reload()}
        ></kanban-task-detail>`
      : ""}
  `;
}
