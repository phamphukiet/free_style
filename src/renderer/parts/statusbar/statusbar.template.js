import { html } from "lit";

export function statusbarTemplate(host) {
  return html`
    <span>${host.branch}</span>
    <span>${host.encoding}</span>
    <span>${host.language}</span>
    <span class="statusbar-right">${host.cursorPosition}</span>
  `;
}
