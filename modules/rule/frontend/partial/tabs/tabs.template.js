import { html } from "lit";

export function rlTabsTemplate(host) {
  return html`
    <div class="rl-tab-bar">
      <button
        class="rl-tab-home ${!host.activeRuleId ? "active" : ""}"
        title="Dashboard"
        @click=${() => host.handleGoDashboard()}
      >
        ⌂
      </button>
      ${host.openTabs.map(
        (t) => html`
          <div
            class="rl-tab ${t.id === host.activeRuleId ? "active" : ""}"
            @click=${() => host.handleSelectTab(t.id)}
          >
            <span class="rl-tab-label">${t.name}</span>
            <button
              class="rl-tab-close-btn"
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
