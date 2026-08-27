import { LitElement, unsafeCSS } from "lit";
import { rlSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import sectionStyles from "../partial/section/section.css?inline";
import { getSidebarHandlers } from "./sidebar-handlers.js";

class RlSidebarElement extends LitElement {
  static styles = [unsafeCSS(styles), unsafeCSS(sectionStyles)];
  static properties = {
    selectedId: { state: true },
    pinnedRules: { state: true },
    projectRules: { state: true },
    collapsedSections: { state: true },
  };

  constructor() {
    super();
    this.selectedId = "";
    this.pinnedRules = [];
    this.projectRules = [];
    this.collapsedSections = {};
    Object.assign(this, getSidebarHandlers(this));
    this.loadPinned();
    this.loadProject();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("rules:changed", this.loadAll);
    window.addEventListener("workbench:folder-opened", this.loadProject);
  }

  disconnectedCallback() {
    window.removeEventListener("rules:changed", this.loadAll);
    window.removeEventListener("workbench:folder-opened", this.loadProject);
    super.disconnectedCallback();
  }

  get sections() {
    return [
      {
        id: "project",
        title: "Trong Project",
        emptyText: "Chưa có rule nào trong project này",
        items: this.projectRules.map((r) => ({ id: r.id, label: r.name })),
      },
      {
        id: "pinned",
        title: "Đã ghim",
        emptyText: "Chưa ghim rule nào",
        items: this.pinnedRules.map((r) => ({
          id: r.id,
          label: `★ ${r.name}`,
        })),
      },
    ];
  }

  render() {
    return rlSidebarTemplate(this);
  }
}

customElements.define("module-rl-sidebar", RlSidebarElement);
