import { LitElement, unsafeCSS } from "lit";
import { wfSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";
import sectionStyles from "../partial/section/section.css?inline";
import { getSidebarHandlers } from "./sidebar-handlers.js";

class WfSidebarElement extends LitElement {
  static styles = [unsafeCSS(styles), unsafeCSS(sectionStyles)];
  static properties = {
    selectedId: { state: true },
    pinnedWorkflows: { state: true },
    projectWorkflows: { state: true },
    collapsedSections: { state: true },
  };

  constructor() {
    super();
    this.selectedId = "";
    this.pinnedWorkflows = [];
    this.projectWorkflows = [];
    this.collapsedSections = {};
    Object.assign(this, getSidebarHandlers(this));
    this.loadPinned();
    this.loadProject();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workflows:changed", this.loadAll);
    window.addEventListener("workbench:folder-opened", this.loadProject);
  }

  disconnectedCallback() {
    window.removeEventListener("workflows:changed", this.loadAll);
    window.removeEventListener("workbench:folder-opened", this.loadProject);
    super.disconnectedCallback();
  }

  get sections() {
    return [
      {
        id: "project",
        title: "Trong Project",
        emptyText: "Chưa có workflow nào trong project này",
        items: this.projectWorkflows.map((w) => ({ id: w.id, label: w.name })),
      },
      {
        id: "pinned",
        title: "Đã ghim",
        emptyText: "Chưa ghim workflow nào",
        items: this.pinnedWorkflows.map((w) => ({
          id: w.id,
          label: `★ ${w.name}`,
        })),
      },
    ];
  }

  render() {
    return wfSidebarTemplate(this);
  }
}

customElements.define("module-wf-sidebar", WfSidebarElement);
