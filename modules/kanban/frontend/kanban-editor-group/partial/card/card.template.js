import { html } from "lit";
import { agentColor } from "../agent-color.js";

export function cardTemplate(host, task) {
  const agentName =
    (host.agents.find((a) => a.id === task.agentId) || {}).name || task.agentId;
  const color = agentColor(task.agentId);

  return html`
    <div
      class="kb-card ${task.running ? "running" : ""}"
      style="border-left: 3px solid ${color}"
      draggable="true"
      @dragstart=${(e) => e.dataTransfer.setData("text/task-id", task.id)}
      @click=${() => host.handleSelectTask(task.id)}
    >
      <div class="kb-card-title">${task.title}</div>
      <div class="kb-card-meta">
        ${task.agentId ? `Agent: ${agentName}` : "Chưa gán agent"}
        ${task.result ? ` · v${task.result.version}` : ""}
      </div>

      <div class="kb-card-actions">
        <button
          class="kb-btn run"
          ?disabled=${task.running || task.columnId === "done"}
          @click=${(e) => {
            e.stopPropagation();
            host.handleRun(task.id);
          }}
        >
          ${task.running
            ? html`<span class="kb-spinner"></span> Đang chạy...`
            : "▶ Chạy"}
        </button>
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
                  host.handleReject(task.id);
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
