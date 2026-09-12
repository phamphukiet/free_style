import { LitElement, unsafeCSS } from "lit";
import { kanbanEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";
import "./partial/create-task-modal/create-task-modal.js";

class KanbanEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    tasks: { state: true },
    agents: { state: true },
    filterAgentId: { state: true },
    showCreateModal: { state: true },
    selectedTaskId: { state: true },
    showALLModal: { state: true },
  };

  constructor() {
    super();
    this.tasks = [];
    this.agents = [];
    this.filterAgentId = "";
    this.showCreateModal = false;
    this.selectedTaskId = "";
    this.showALLModal = false;
    Object.assign(this, getEditorHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    this.loadAgents();
    this._unsubChanged = window.api.kanban.onChanged(this.reload);
    window.addEventListener("workbench:folder-opened", this.reload);
  }

  disconnectedCallback() {
    this._unsubChanged?.();
    window.removeEventListener("workbench:folder-opened", this.reload);
    super.disconnectedCallback();
  }

  render() {
    return kanbanEditorTemplate(this);
  }
}

customElements.define("module-kanban-editor-group", KanbanEditorGroupElement);