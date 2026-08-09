import { LitElement, unsafeCSS } from "lit";
import { stEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";

class StEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    definitions: { state: true },
    values: { state: true },
    highlightId: { state: true },
  };

  constructor() {
    super();
    this.definitions = [];
    this.values = {};
    this.highlightId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAll();
    this._onSelect = (e) => this.scrollToSetting(e.detail.id);
    this._onChanged = (e) => this.applyChange(e);
    window.addEventListener("settings:select-item", this._onSelect);
    this._unsubChanged = window.api.settings.onChanged(this._onChanged);
  }

  disconnectedCallback() {
    window.removeEventListener("settings:select-item", this._onSelect);
    this._unsubChanged?.();
    super.disconnectedCallback();
  }

  async loadAll() {
    this.definitions = await window.api.settings.getSchema();
    this.values = await window.api.settings.getAll();
  }

  applyChange(detail) {
    this.values = { ...this.values, [detail.id]: detail.value };
  }

  async handleChange(id, value) {
    await window.api.settings.set(id, value);
    this.values = { ...this.values, [id]: value };
  }

  async scrollToSetting(id) {
    this.highlightId = id;
    await this.updateComplete;
    this.shadowRoot
      .getElementById(`setting-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (this.highlightId === id) this.highlightId = "";
    }, 1200);
  }

  render() {
    return stEditorTemplate(this);
  }
}

customElements.define("module-st-editor-group", StEditorGroupElement);
