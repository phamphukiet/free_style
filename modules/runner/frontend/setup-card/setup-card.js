// modules/runner/frontend/setup-card/setup-card.js
import { LitElement, unsafeCSS } from "lit";
import { setupCardTemplate } from "./setup-card.template.js";
import styles from "./setup-card.css?inline";

class RunnerSetupCardElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    info: { state: true }, // { languageId, label, sizeMB } | null
    phase: { state: true }, // "ask" | "installing" | "done" | "error"
    percent: { state: true },
    message: { state: true },
  };

  constructor() {
    super();
    this.info = null;
    this.phase = "ask";
    this.percent = 0;
    this.message = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("runner:need-setup", this.handleNeedSetup);
    this._unsubProgress = window.api.runner.onProgress(this.handleProgress);
  }

  disconnectedCallback() {
    window.removeEventListener("runner:need-setup", this.handleNeedSetup);
    this._unsubProgress?.();
    super.disconnectedCallback();
  }

  handleNeedSetup = (e) => {
    if (this.phase === "installing") return;
    Object.assign(this, {
      info: e.detail,
      phase: "ask",
      percent: 0,
      message: "",
    });
  };

  handleProgress = (p) => {
    if (p.languageId !== this.info?.languageId) return;
    this.percent = p.percent;
    this.message = p.phase === "extract" ? "đang giải nén..." : "";
  };

  async handleInstall() {
    Object.assign(this, { phase: "installing", percent: 0, message: "" });
    const result = await window.api.runner.install(this.info.languageId);
    this.phase = result.ok ? "done" : "error";
    this.message = result.ok ? "" : result.message;
  }

  handleClose() {
    this.info = null;
  }

  render() {
    return setupCardTemplate(this);
  }
}

customElements.define("runner-setup-card", RunnerSetupCardElement);
