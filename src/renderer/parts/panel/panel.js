// panel.js
import { LitElement, unsafeCSS } from "lit";
import { panelTemplate } from "./panel.template.js";
import panelStyles from "./panel.css?inline";
import xtermStyles from "xterm/css/xterm.css?inline";
import { TerminalManager } from "./terminal-manager.js";

class PanelElement extends LitElement {
  static styles = [unsafeCSS(xtermStyles), unsafeCSS(panelStyles)];

  static properties = {
    shellType: { type: String },
    visible: { type: Boolean },
  };

  constructor() {
    super();
    this.shellType = "powershell";
    this.visible = true;
  }

  render() {
    return panelTemplate(this);
  }

  firstUpdated() {
    const area = this.shadowRoot.getElementById("terminal-area");
    if (area) {
      this._termManager = new TerminalManager(area, this.shellType);
    }
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
    this.visible = false;
    this.style.display = "none";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._termManager?.dispose();
  }
}

customElements.define("workbench-panel", PanelElement);
