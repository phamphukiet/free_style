import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import appWindowIcon from "lucide-static/icons/app-window.svg?raw";
import minusIcon from "lucide-static/icons/minus.svg?raw";
import squareIcon from "lucide-static/icons/square.svg?raw";
import xIcon from "lucide-static/icons/x.svg?raw";

export function titlebarTemplate(host) {
  let dropdown;
  if (host.menuOpen) {
    dropdown = html`
      <div class="titlebar-menu-dropdown">
        <button @click=${() => host.handleOpenFolder()}>Open Folder</button>
      </div>
    `;
  } else {
    dropdown = html``;
  }

  return html`
    <div class="titlebar-left">
      <span class="titlebar-icon">${unsafeSVG(appWindowIcon)}</span>
      <div class="titlebar-menu">
        <button
          class="titlebar-menu-btn"
          @click=${() => host.handleToggleFileMenu()}
        >
          File
        </button>
        ${dropdown}
      </div>
      <span class="titlebar-title">${host.title}</span>
    </div>
    <div class="titlebar-controls">
      <button class="titlebar-btn" @click=${() => host.handleMinimize()}>
        ${unsafeSVG(minusIcon)}
      </button>
      <button class="titlebar-btn" @click=${() => host.handleMaximize()}>
        ${unsafeSVG(squareIcon)}
      </button>
      <button
        class="titlebar-btn titlebar-btn-close"
        @click=${() => host.handleClose()}
      >
        ${unsafeSVG(xIcon)}
      </button>
    </div>
  `;
}