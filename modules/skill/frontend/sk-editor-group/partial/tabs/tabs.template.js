import { html, unsafeCSS } from "lit";

const cssMods = import.meta.glob("./*.css", { eager: true, query: "?inline", import: "default" });
const stylesHtml = Object.values(cssMods).map(s => html`<style>${unsafeCSS(s)}</style>`);

export function skillTabsTemplate(host) {
  return html`
    ${stylesHtml}
    <div class="sk-tab-bar">
      <button
        class="sk-tab-home ${!host.activeSkillId ? "active" : ""}"
        title="Dashboard"
        @click=${() => host.handleGoDashboard()}
      >
        ⌂
      </button>
      ${host.openTabs.map(
        (t) => html`
          <div
            class="sk-tab ${t.id === host.activeSkillId ? "active" : ""}"
            @click=${() => host.handleSelectTab(t.id)}
          >
            <span class="sk-tab-label">${t.name}</span>
            <button
              class="sk-tab-close-btn"
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
