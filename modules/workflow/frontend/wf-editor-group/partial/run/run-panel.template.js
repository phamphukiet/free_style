import { html } from "lit";

export function runPanelTemplate(host) {
  return html`
    <div class="wf-run-panel">
      <h3>Chạy workflow</h3>
      ${!host.run
        ? html`<button class="wf-btn" @click=${() => host.handleStartRun()}>
            ▶ Bắt đầu chạy
          </button>`
        : html`
            <div class="wf-run-status">
              Bước ${host.run.currentIndex} / ${host.editSteps.length}
              ${host.run.currentIndex >= host.editSteps.length
                ? " — Hoàn tất"
                : ""}
            </div>
            <button
              class="wf-btn"
              ?disabled=${host.run.currentIndex >= host.editSteps.length}
              @click=${() => host.handleRunNext()}
            >
              Chạy bước tiếp theo
            </button>
            <div class="wf-run-results">
              ${host.run.stepResults.map(
                (r, i) => html`
                  <div class="wf-run-result-item">
                    <strong>${i + 1}. ${r.tool}</strong>
                    <pre>${JSON.stringify(r.result, null, 2)}</pre>
                  </div>
                `,
              )}
            </div>
          `}
    </div>
  `;
}
