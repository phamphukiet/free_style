import { LitElement, unsafeCSS } from "lit";
import { skEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { loadAgentsOptional } from "./partial/agents-optional.js";

class SkEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    openTabs: { state: true },
    activeSkillId: { state: true },
    skill: { state: true },
    agents: { state: true },
    checkedAgentIds: { state: true },
    installing: { state: true },
    showInstallForm: { state: true },
    answers: { state: true },
    pinnedSkills: { state: true },
  };

  constructor() {
    super();
    this.openTabs = [];
    this.activeSkillId = "";
    this.skill = null;
    this.agents = [];
    this.checkedAgentIds = [];
    this.installing = false;
    this.showInstallForm = false;
    this.answers = {};
    this.pinnedSkills = [];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("skills:select", this.handleSelect);
    window.addEventListener("skills:changed", this.loadPinned);
    loadAgentsOptional().then((agents) => (this.agents = agents));
    this.loadPinned();
  }

  disconnectedCallback() {
    window.removeEventListener("skills:select", this.handleSelect);
    window.removeEventListener("skills:changed", this.loadPinned);
    super.disconnectedCallback();
  }

  loadPinned = async () => {
    this.pinnedSkills = await window.api.skill.listPinned();
  };

  handleSelect = async (e) => {
    const skill = await window.api.skill.catalogGet(e.detail.id);
    if (!skill) return;
    if (!this.openTabs.some((t) => t.id === skill.id))
      this.openTabs = [...this.openTabs, { id: skill.id, name: skill.name }];
    this.activeSkillId = skill.id;
    this.skill = skill;
    this.checkedAgentIds = skill.agentIds || [];
    this.showInstallForm = false;
    this.answers = {};
  };

  handleSelectTab = async (id) => {
    this.activeSkillId = id;
    this.skill = await window.api.skill.catalogGet(id);
    this.checkedAgentIds = this.skill?.agentIds || [];
  };

  handleCloseTab(id) {
    const idx = this.openTabs.findIndex((t) => t.id === id);
    this.openTabs = this.openTabs.filter((t) => t.id !== id);
    if (this.activeSkillId !== id) return;
    if (this.openTabs.length === 0) {
      this.activeSkillId = "";
      this.skill = null;
      return;
    }
    const next = this.openTabs[Math.min(idx, this.openTabs.length - 1)];
    this.handleSelectTab(next.id);
  }

  handleGoDashboard() {
    this.activeSkillId = "";
    this.skill = null;
  }

  async handleTogglePin() {
    if (!this.skill) return;
    this.skill = await window.api.skill.togglePin(this.skill.id);
    this.openTabs = this.openTabs.map((t) =>
      t.id === this.skill.id ? { ...t, name: this.skill.name } : t,
    );
    window.dispatchEvent(new CustomEvent("skills:changed"));
  }

  toggleAgent(id) {
    this.checkedAgentIds = this.checkedAgentIds.includes(id)
      ? this.checkedAgentIds.filter((a) => a !== id)
      : [...this.checkedAgentIds, id];
  }

  async handleSaveAgents() {
    await window.api.skill.assignAgents(this.skill.id, this.checkedAgentIds);
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
