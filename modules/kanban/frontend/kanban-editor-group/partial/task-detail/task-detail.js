import { LitElement, unsafeCSS } from "lit";
import { taskDetailTemplate } from "./task-detail.template.js";
import styles from "./task-detail.css?inline";
import formStyles from "../kanban-editor-group/partial/task-form-fields.css?inline";

class KanbanTaskDetailElement extends LitElement {
  static styles = [unsafeCSS(styles), unsafeCSS(formStyles)];
  static properties = {
    taskId: { type: String },
    agents: { state: true },
    formTitle: { state: true },
    formAgentId: { state: true },
    formDescription: { state: true },
    saving: { state: true },
  };

  constructor() {
    super();
    this.taskId = "";
    this.agents = [];
    this.formTitle = "";
    this.formAgentId = "";
    this.formDescription = "";
    this.saving = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.agents = await window.api.kanban.listAgents();
    if (this.taskId) await this.load();
  }

  updated(changed) {
    if (changed.has("taskId") && this.taskId) this.load();
  }

  async load() {
    const task = await window.api.kanban.getTask(this.taskId);
    if (!task) return;
    this.formTitle = task.title;
    this.formAgentId = task.agentId || "";
    this.formDescription = task.description || "";
  }

  async handleSave() {
    this.saving = true;
    await window.api.kanban.updateTask(this.taskId, {
      title: this.formTitle.trim(),
      agentId: this.formAgentId,
      description: this.formDescription.trim(),
    });
    this.saving = false;
    this.dispatchEvent(new CustomEvent("changed"));
  }

  async handleDelete() {
    if (!window.confirm("Xoá task này?")) return;
    await window.api.kanban.deleteTask(this.taskId);
    this.dispatchEvent(new CustomEvent("changed"));
    this.dispatchEvent(new CustomEvent("close"));
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  render() {
    return taskDetailTemplate(this);
  }
}

customElements.define("kanban-task-detail", KanbanTaskDetailElement);
