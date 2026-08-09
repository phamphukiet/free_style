import { LitElement, unsafeCSS } from "lit";
import { stSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class StSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    definitions: { state: true },
    query: { state: true },
    selectedId: { state: true },
  };

  constructor() {
    super();
    this.definitions = [];
    this.query = "";
    this.selectedId = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadSchema();
    this._onSchemaChanged = () => this.loadSchema();
    this._unsub = window.api.settings.onSchemaChanged(this._onSchemaChanged);
  }

  disconnectedCallback() {
    this._unsub?.();
    super.disconnectedCallback();
  }

  async loadSchema() {
    this.definitions = await window.api.settings.getSchema();
  }

  handleSelect(id) {
    this.selectedId = id;
    window.dispatchEvent(
      new CustomEvent("settings:select-item", { detail: { id } }),
    );
  }

  render() {
    return stSidebarTemplate(this);
  }
}

customElements.define("module-st-sidebar", StSidebarElement);
