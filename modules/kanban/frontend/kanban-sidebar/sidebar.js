import { LitElement, unsafeCSS } from "lit";
import { kanbanSidebarTemplate } from "./sidebar.template.js";
import styles from "./sidebar.css?inline";

class KanbanSidebarElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = { tasks: { state: true } };

  constructor() {
    super();
    this.tasks = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    window.addEventListener("kanban:changed", this.reload);
    window.addEventListener("workbench:folder-opened", this.reload);
  }

  disconnectedCallback() {
    window.removeEventListener("kanban:changed", this.reload);
    window.removeEventListener("workbench:folder-opened", this.reload);
    super.disconnectedCallback();
  }

  reload = async () => {
    this.tasks = await window.api.kanban.listTasks();
  };

  render() {
    return kanbanSidebarTemplate(this);
  }
}

customElements.define("module-kanban-sidebar", KanbanSidebarElement);
