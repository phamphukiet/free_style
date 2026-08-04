// panel.template.js
// Chỉ chứa markup — không có logic, không có state.
// host được truyền vào để bind event handler từ panel.js.

import { html, svg } from "lit";

// SVG icons (inline để không phụ thuộc lucide-static trong Shadow DOM)
const iconPlus = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
</svg>`;

const iconTrash = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
</svg>`;

const iconClear = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M18 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>
  <polyline points="16 2 22 8 12 18 6 18 6 12 16 2"/>
</svg>`;

const iconMaximize = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
</svg>`;

const iconX = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
</svg>`;

export function panelTemplate(host) {
  return html`
    <div class="panel-tab-bar">
      <div class="panel-tabs">
        <div class="panel-tab active">TERMINAL</div>
      </div>

      <div class="panel-toolbar">
        <!-- Shell selector -->
        <select
          class="shell-select"
          .value=${host.shellType}
          @change=${(e) => host.handleShellChange(e.target.value)}
        >
          <option value="powershell">PowerShell</option>
          <option value="cmd">Command Prompt</option>
        </select>

        <div class="toolbar-sep"></div>

        <!-- New terminal -->
        <button
          class="toolbar-btn"
          title="New Terminal"
          @click=${() => host.handleNew()}
        >${iconPlus}</button>

        <!-- Clear terminal -->
        <button
          class="toolbar-btn"
          title="Clear Terminal"
          @click=${() => host.handleClear()}
        >${iconClear}</button>

        <!-- Kill process -->
        <button
          class="toolbar-btn"
          title="Kill Terminal"
          @click=${() => host.handleKill()}
        >${iconTrash}</button>

        <div class="toolbar-sep"></div>

        <!-- Close panel -->
        <button
          class="toolbar-btn"
          title="Close Panel"
          @click=${() => host.handleClose()}
        >${iconX}</button>
      </div>
    </div>

    <!-- xterm.js sẽ được mount vào đây sau khi connectedCallback -->
    <div class="terminal-area" id="terminal-area"></div>
  `;
}
