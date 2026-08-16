// modules/terminal/frontend/tm-panel/panel.js
// Trách nhiệm duy nhất: toàn bộ UI + logic panel Terminal (tab bar, toolbar, xterm).
// Tự chứa hoàn toàn — src/renderer/parts/panel KHÔNG biết class này tồn tại.
// Đóng panel: dispatch CustomEvent 'panel:close' (bubbles+composed) thay vì
// gọi ngược lên cha, để 2 bên không cần import lẫn nhau.

import { LitElement, unsafeCSS } from "lit";
import { tmPanelTemplate } from "./panel.template.js";
import panelStyles from "./panel.css?inline";
import xtermStyles from "xterm/css/xterm.css?inline";
import { TerminalManager } from "../terminal-manager.js";

class TmPanelElement extends LitElement {
  static styles = [unsafeCSS(xtermStyles), unsafeCSS(panelStyles)];

  static properties = {
    shellType: { type: String },
  };

  constructor() {
    super();
    this.shellType = "powershell";
  }

  firstUpdated() {
    const area = this.shadowRoot.getElementById("terminal-area");
    if (area) this._termManager = new TerminalManager(area, this.shellType);
  }

  handleShellChange(shellType) {
    this.shellType = shellType;
    this._termManager?.changeShell(shellType);
  }

  handleNew() {
    this._termManager?.changeShell(this.shellType);
  }

  handleClear() {
    this._termManager?.clear();
  }

  handleKill() {
    this._termManager?.kill();
  }

  handleClose() {
    this.dispatchEvent(
      new CustomEvent("panel:close", { bubbles: true, composed: true }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._termManager?.dispose();
  }

  render() {
    return tmPanelTemplate(this);
  }
}

customElements.define("module-terminal-panel", TmPanelElement);
