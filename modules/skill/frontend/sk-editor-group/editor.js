import { LitElement, unsafeCSS } from "lit";
import { skEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { loadAgentsOptional } from "./partial/agents-optional.js";

class SkEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    skillId: { state: true },
    skill: { state: true },
    agents: { state: true },
    checkedAgentIds: { state: true },
    installing: { state: true },
    showInstallForm: { state: true },
    answers: { state: true },
  };

  constructor() {
    super();
    this.skillId = "";
    this.skill = null;
    this.agents = [];
    this.checkedAgentIds = [];
    this.installing = false;
    this.showInstallForm = false;
    this.answers = {};
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("skills:select", this.handleSelect);
    loadAgentsOptional().then((agents) => (this.agents = agents));
  }

  disconnectedCallback() {
    window.removeEventListener("skills:select", this.handleSelect);
    super.disconnectedCallback();
  }

  handleSelect = async (e) => {
    this.skillId = e.detail.id;
    this.skill = await window.api.skill.catalogGet(this.skillId);
    this.checkedAgentIds = this.skill?.agentIds || [];
    this.showInstallForm = false;
    this.answers = {};
  };

  toggleAgent(id) {
    this.checkedAgentIds = this.checkedAgentIds.includes(id)
      ? this.checkedAgentIds.filter((a) => a !== id)
      : [...this.checkedAgentIds, id];
  }

  async handleSaveAgents() {
    await window.api.skill.assignAgents(this.skillId, this.checkedAgentIds);
  }

  handleInstallClick() {
    if (this.skill?.installOptions?.length) {
      this.showInstallForm = true;
      return;
    }
    this.runInstall({});
  }

  handleAnswerInput(key, value) {
    this.answers = { ...this.answers, [key]: value };
  }

  async runInstall(answers) {
    this.installing = true;
    const result = await window.api.skill.install(this.skill, answers);
    this.installing = false;
    this.showInstallForm = false;
    if (!result.installed) alert("Cài skill lỗi: " + result.message);
  }

  render() {
    return skEditorTemplate(this);
  }
}

customElements.define("module-sk-editor-group", SkEditorGroupElement);
