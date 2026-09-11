import { html } from "lit";

export function wfTabsTemplate(host) {
  return html`
    <div class="wf-tab-bar">
      <button
        class="wf-tab-home ${!host.activeWorkflowId ? "active" : ""}"
        title="Dashboard"
        @click=${() => host.handleGoDashboard()}
      >
        ⌂
      </button>
      ${host.openTabs.map(
        (t) => html`
          <div
            class="wf-tab ${t.id === host.activeWorkflowId ? "active" : ""}"
            @click=${() => host.handleSelectTab(t.id)}
          >
            <span class="wf-tab-label">${t.name}</span>
            <button
              class="wf-tab-close-btn"
              @click=${(e) => {
                e.stopPropagation();
                host.handleCloseTab(t.id);
              }}
            >
              &times;
            </button>
          </div>
        `,
      )}
    </div>
  `;
}
