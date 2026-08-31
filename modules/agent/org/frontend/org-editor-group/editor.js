import { LitElement, unsafeCSS } from "lit";
import { orgEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import * as h from "./editor-handlers.js";

class OrgEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    org: { state: true },
    presets: { state: true },
    roleId: { state: true },
    instances: { state: true },
    agents: { state: true },
  };

  constructor() {
    super();
    this.org = null;
    this.presets = [];
    this.roleId = "";
    this.instances = [];
    this.agents = [];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("org:select-role", this.handleSelectRole);
    window.addEventListener("workbench:folder-opened", this.reload);
    this.reload();
  }

  disconnectedCallback() {
    window.removeEventListener("org:select-role", this.handleSelectRole);
    window.removeEventListener("workbench:folder-opened", this.reload);
    super.disconnectedCallback();
  }

  reload = async () => {
    this.org = await window.api.org.get();
    this.presets = await window.api.org.listPresets();
    this.agents = (await window.api.agent?.list?.()) || [];
    if (this.roleId) await this.loadInstances();
  };

  handleSelectRole = async (e) => {
    this.roleId = e.detail.roleId;
    await this.loadInstances();
  };

  async loadInstances() {
    this.instances = this.roleId
      ? await window.api.org.listInstances(this.roleId)
      : [];
  }

  get role() {
    return this.org?.roles.find((r) => r.id === this.roleId) || null;
  }

  async handleSelectPreset(presetId) {
    await h.selectPreset(this, presetId);
  }
  async handleAddInstance() {
    await h.addInstance(this);
  }
  async handleRemoveInstance(id) {
    await h.removeInstance(this, id);
  }

  render() {
    return orgEditorTemplate(this);
  }
}

customElements.define("module-org-editor-group", OrgEditorGroupElement);
