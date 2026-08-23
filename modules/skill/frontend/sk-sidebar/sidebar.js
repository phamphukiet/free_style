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
    selectedId: { state: true },
    pinnedSkills: { state: true },
  };

  constructor() {
    super();
    this.query = "";
    this.sortBy = "rating";
    this.results = [];
    this.selectedId = "";
    this.pinnedSkills = [];
    this.search();
    this.loadPinned();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("skills:changed", this.loadPinned);
  }

  disconnectedCallback() {
    window.removeEventListener("skills:changed", this.loadPinned);
    super.disconnectedCallback();
  }

  loadPinned = async () => {
    this.pinnedSkills = await window.api.skill.listPinned();
  };
  
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
