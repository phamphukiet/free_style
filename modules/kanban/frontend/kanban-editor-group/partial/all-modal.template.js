import { html } from "lit";

export function ALLModalTemplate(host, allALLTasks) {
  return html`
    <div
      style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:200;"
      @click=${() => host.toggleALLModal()}
    >
      <div
        style="background:var(--bg-secondary,#252526);border:1px solid var(--border,#333);border-radius:8px;padding:16px;max-width:480px;width:90%;max-height:70vh;overflow-y:auto;"
        @click=${(e) => e.stopPropagation()}
      >
        <h3 style="margin-top:0;">Toàn bộ ALL (${allALLTasks.length})</h3>
        ${allALLTasks.map(
          (t) => html`
            <div
              style="padding:8px;border-bottom:1px solid var(--border,#333);cursor:pointer;"
              @click=${() => {
                host.toggleALLModal();
                host.handleSelectTask(t.id);
              }}
            >
              ${t.title}
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
