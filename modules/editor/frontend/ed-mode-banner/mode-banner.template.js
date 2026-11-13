import { html } from "lit";

export function modeBannerTemplate(host) {
  return html`
    <span class="banner-label">${host.label}</span>
    <button class="banner-exit" @click=${() => host.handleExit()}>Thoát</button>
  `;
}
