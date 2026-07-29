import { html } from "lit";

export function sidebarTemplate(host) {
  return html`
    <div class="sidebar-title">EXPLORER</div>
    <ul class="sidebar-list">
      ${host.items.map((item) => html`<li>${item}</li>`)}
    </ul>
  `;
}
