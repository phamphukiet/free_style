import { LitElement, unsafeCSS } from "lit";
import { kanbanEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";

class KanbanEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    tasks: { state: true },
    agents: { state: true },
    newTaskTitle: { state: true },
    newTaskAgentId: { state: true },
    selectedTaskId: { state: true },
    showALLModal: { state: true },
  };

  constructor() {
    super();
    this.tasks = [];
    this.agents = [];
    this.newTaskTitle = "";
    this.newTaskAgentId = "";
    this.selectedTaskId = "";
    this.showALLModal = false;
    Object.assign(this, getEditorHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    this.loadAgents();
    window.addEventListener("kanban:changed", this.reload);
    window.addEventListener("workbench:folder-opened", this.reload);
  }

  disconnectedCallback() {
    window.removeEventListener("kanban:changed", this.reload);
    window.removeEventListener("workbench:folder-opened", this.reload);
    super.disconnectedCallback();
  }

  render() {
    return kanbanEditorTemplate(this);
  }
}

customElements.define("module-kanban-editor-group", KanbanEditorGroupElement);
