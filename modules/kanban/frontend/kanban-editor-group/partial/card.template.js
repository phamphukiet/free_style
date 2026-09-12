import { html } from "lit";

export function cardTemplate(host, task) {
  const agentName =
    (host.agents.find((a) => a.id === task.agentId) || {}).name || task.agentId;
  return html`
    <div
      class="kb-card"
      draggable="true"
      @dragstart=${(e) => e.dataTransfer.setData("text/task-id", task.id)}
      @click=${() => host.handleSelectTask(task.id)}
    >
      <div class="kb-card-title">${task.title}</div>
      <div class="kb-card-meta">
        ${task.agentId ? `Agent: ${agentName}` : "Chưa gán agent"}
        ${task.result ? ` · v${task.result.version}` : ""}
      </div>
      ${task.columnId === "result"
        ? html`
            <div class="kb-card-actions">
              <button
                class="kb-btn approve"
                @click=${(e) => {
                  e.stopPropagation();
                  host.handleApprove(task.id);
                }}
              >
                Duyệt
              </button>
              <button
                class="kb-btn reject"
                @click=${(e) => {
                  e.stopPropagation();
                  const reason = window.prompt("Lý do từ chối?") || "";
                  host.handleReject(task.id, reason);
                }}
              >
                Từ chối
              </button>
            </div>
          `
        : ""}
    </div>
  `;
}
