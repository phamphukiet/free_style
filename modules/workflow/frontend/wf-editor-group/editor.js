import { LitElement, unsafeCSS } from "lit";
import { wfEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import tabsStyles from "./partial/tabs/tabs.css?inline";
import dashboardStyles from "./partial/dashboard/dashboard.css?inline";
import stepsStyles from "./partial/steps/steps.css?inline";
import runStyles from "./partial/run/run.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";

class WfEditorGroupElement extends LitElement {
  static styles = [
    unsafeCSS(styles),
    unsafeCSS(tabsStyles),
    unsafeCSS(dashboardStyles),
    unsafeCSS(stepsStyles),
    unsafeCSS(runStyles),
  ];
  static properties = {
    openTabs: { state: true },
    activeWorkflowId: { state: true },
    workflow: { state: true },
    allWorkflows: { state: true },
    pinnedWorkflows: { state: true },
    editName: { state: true },
    editDescription: { state: true },
    editSteps: { state: true },
    saving: { state: true },
    saved: { state: true },
    run: { state: true },
  };

  constructor() {
    super();
    this.openTabs = [];
    this.activeWorkflowId = "";
    this.workflow = null;
    this.allWorkflows = [];
    this.pinnedWorkflows = [];
    this.editName = "";
    this.editDescription = "";
    this.editSteps = [];
    this.saving = false;
    this.saved = false;
    this.run = null;
    this._creating = false;
    this._deleting = false;
    Object.assign(this, getEditorHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workflows:select", this.handleSelect);
    window.addEventListener("workflows:changed", this.loadDashboard);
    this.loadDashboard();
  }

  disconnectedCallback() {
    window.removeEventListener("workflows:select", this.handleSelect);
    window.removeEventListener("workflows:changed", this.loadDashboard);
    super.disconnectedCallback();
  }

  render() {
    return wfEditorTemplate(this);
  }
}

customElements.define("module-wf-editor-group", WfEditorGroupElement);
