import { LitElement, unsafeCSS } from "lit";
import { rlEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import tabsStyles from "../partial/tabs/tabs.css?inline";
import dashboardStyles from "../partial/dashboard/dashboard.css?inline";
import { getEditorHandlers } from "./editor-handlers.js";

class RlEditorGroupElement extends LitElement {
  static styles = [
    unsafeCSS(styles),
    unsafeCSS(tabsStyles),
    unsafeCSS(dashboardStyles),
  ];
  static properties = {
    openTabs: { state: true },
    activeRuleId: { state: true },
    rule: { state: true },
    allRules: { state: true },
    pinnedRules: { state: true },
    agents: { state: true },
    checkedAgentIds: { state: true },
    editName: { state: true },
    editContent: { state: true },
    saving: { state: true },
    saved: { state: true },
  };

  constructor() {
    super();
    this.openTabs = [];
    this.activeRuleId = "";
    this.rule = null;
    this.allRules = [];
    this.pinnedRules = [];
    this.agents = [];
    this.checkedAgentIds = [];
    this.editName = "";
    this.editContent = "";
    this.saving = false;
    this.saved = false;
    Object.assign(this, getEditorHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("rules:select", this.handleSelect);
    window.addEventListener("rules:changed", this.loadDashboard);
    import("../partial/agents-optional.js")
      .then((m) =>
        m.loadAgentsOptional().then((agents) => (this.agents = agents)),
      )
      .catch(() => {});
    this.loadDashboard();
  }

  disconnectedCallback() {
    window.removeEventListener("rules:select", this.handleSelect);
    window.removeEventListener("rules:changed", this.loadDashboard);
    super.disconnectedCallback();
  }

  render() {
    return rlEditorTemplate(this);
  }
}

customElements.define("module-rl-editor-group", RlEditorGroupElement);
