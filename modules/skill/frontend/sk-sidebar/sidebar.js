import { LitElement, unsafeCSS } from "lit";
import { skSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class SkSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    query: { state: true },
    sortBy: { state: true },
    results: { state: true },
    selectedId: { state: true },
  };

  constructor() {
    super();
    this.query = "";
    this.sortBy = "rating";
    this.results = [];
    this.selectedId = "";
    this.search();
  }

  async search() {
    this.results = await window.api.skill.search(this.query, this.sortBy);
  }

  handleQueryInput(e) {
    this.query = e.target.value;
    clearTimeout(this._t);
    this._t = setTimeout(() => this.search(), 300); // debounce, tránh gọi mạng mỗi keystroke
  }

  handleSortChange(sortBy) {
    this.sortBy = sortBy;
    this.search();
  }

  handleSelect(id) {
    this.selectedId = id;
    window.dispatchEvent(new CustomEvent("skills:select", { detail: { id } }));
  }

  render() {
    return skSidebarTemplate(this);
  }
}

customElements.define("module-sk-sidebar", SkSidebarElement);
