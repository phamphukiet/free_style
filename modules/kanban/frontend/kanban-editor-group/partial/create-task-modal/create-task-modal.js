import { LitElement, unsafeCSS } from "lit";
import { createTaskModalTemplate } from "./create-task-modal.template.js";
import ownStyles from "./create-task-modal.css?inline";
import formStyles from "../task_form/task-form-fields.css?inline";

const MANAGER_ID = "manager";

class CreateTaskModalElement extends LitElement {
  static styles = [unsafeCSS(ownStyles), unsafeCSS(formStyles)];
  static properties = {
    agents: { type: Array },
    formTitle: { state: true },
    formAgentId: { state: true },
    formDescription: { state: true },
  };

  constructor() {
    super();
    this.agents = [];
    this.formTitle = "";
    this.formAgentId = MANAGER_ID;
    this.formDescription = "";
  }

  handleSubmit() {
    const title = this.formTitle.trim();
    if (!title) return;
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: {
          title,
          agentId: this.formAgentId || MANAGER_ID,
          description: this.formDescription.trim(),
        },
      }),
    );
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  render() {
    return createTaskModalTemplate(this);
  }
}

customElements.define("kanban-create-task-modal", CreateTaskModalElement);
