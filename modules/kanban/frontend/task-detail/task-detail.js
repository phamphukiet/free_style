import { LitElement, unsafeCSS } from "lit";
import { taskDetailTemplate } from "./task-detail.template.js";
import styles from "./task-detail.css?inline";

class KanbanTaskDetailElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    taskId: { type: String },
    task: { state: true },
    messages: { state: true },
    chatInput: { state: true },
    sending: { state: true },
  };

  constructor() {
    super();
    this.taskId = "";
    this.task = null;
    this.messages = [];
    this.chatInput = "";
    this.sending = false;
  }

  updated(changed) {
    if (changed.has("taskId") && this.taskId) this.load();
  }

  async load() {
    this.task = await window.api.kanban.getTask(this.taskId);
    this.messages = await window.api.kanban.chatList(this.taskId);
  }

  async handleSend() {
    const content = this.chatInput.trim();
    if (!content || this.sending) return;
    this.chatInput = "";
    this.sending = true;
    this.messages = await window.api.kanban.chatSend(this.taskId, content);
    this.sending = false;
    this.dispatchEvent(new CustomEvent("changed"));
  }

  render() {
    return taskDetailTemplate(this);
  }
}

customElements.define("kanban-task-detail", KanbanTaskDetailElement);
