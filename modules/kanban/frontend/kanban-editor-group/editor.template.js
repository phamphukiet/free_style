import { html } from "lit";
import { COLUMNS } from "../columns.js";
import { columnTemplate } from "./partial/column.template.js";
import { ALLModalTemplate } from "./partial/ALL-modal.template.js";
import { agentColor } from "./partial/agent-color.js";
import "./partial/task-detail/task-detail.js";

const VISIBLE_LIMIT = 3;

export function kanbanEditorTemplate(host) {
  const byAgent = (t) =>
    !host.filterAgentId || t.agentId === host.filterAgentId;
  const tasksOf = (colId) =>
    host.tasks
      .filter((t) => t.columnId === colId && byAgent(t))
      .sort((a, b) => b.order - a.order);

  return html`
    <div class="kb-toolbar-row">
      <button class="kb-new-task-btn" @click=${() => host.handleOpenCreate()}>
        + Task mới
      </button>
      <select
        class="kb-new-task-input kb-filter-select"
        .value=${host.filterAgentId}
        @change=${(e) => host.handleFilterChange(e.target.value)}
      >
        <option value="">Tất cả agent</option>
        ${host.agents.map(
          (a) =>
            html`<option value=${a.id} style="color:${agentColor(a.id)}">
              ${a.name}
            </option>`,
        )}
      </select>
    </div>

    <div class="kb-board">
      ${COLUMNS.map((col) => {
        const all = tasksOf(col.id);
        const visible = col.id === "ALL" ? all.slice(0, VISIBLE_LIMIT) : all;
        return columnTemplate(host, col, visible, all.length);
      })}
    </div>

    ${host.showALLModal ? ALLModalTemplate(host, tasksOf("ALL")) : ""}
    ${host.showCreateModal
      ? html`<kanban-create-task-modal
          .agents=${host.agents}
          @submit=${(e) => host.handleCreateSubmit(e.detail)}
          @cancel=${() => host.handleCloseCreate()}
        ></kanban-create-task-modal>`
      : ""}
    ${host.selectedTaskId
      ? html`<kanban-task-detail
          .taskId=${host.selectedTaskId}
          @close=${() => host.handleCloseDetail()}
          @changed=${() => host.reload()}
        ></kanban-task-detail>`
      : ""}
  `;
}
