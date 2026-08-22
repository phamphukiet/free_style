import { LitElement, unsafeCSS } from "lit";
import { agEditorTemplate } from "./editor.template.js";
import styles from "./editor.css?inline";
import { getSelectedAgent } from "../ag-sidebar/partial/agent-selection.js";
import { loadKeys, fetchModels } from "./partial/editor-keys.js";
import { loadCurrentProjectBytes } from "./partial/project-size.js";
import { getFileLimitMB } from "./partial/file-limit.js";

class AgEditorGroupElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    agentId: { state: true },
    editName: { state: true },
    keys: { state: true },
    selectedKeyRef: { state: true },
    models: { state: true },
    selectedModel: { state: true },
    saved: { state: true },
    projectLimitMB: { state: true },
    currentBytes: { state: true },
    fileLimitMB: { state: true },
  };

  constructor() {
    super();
    this.agentId = "";
    this.editName = "";
    this.keys = [];
    this.selectedKeyRef = "";
    this.models = [];
    this.selectedModel = "";
    this.saved = false;
    this._requestToken = 0;
    this.projectLimitMB = "";
    this.currentBytes = 0;
    this.fileLimitMB = 100;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("agents:select", this.handleAgentSelect);
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
    loadKeys().then((keys) => {
      this.keys = keys;
      const current = getSelectedAgent();
      if (current) this.handleAgentSelect({ detail: { agentId: current } });
    });
    loadCurrentProjectBytes().then((b) => (this.currentBytes = b));
  }

  disconnectedCallback() {
    window.removeEventListener("agents:select", this.handleAgentSelect);
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    super.disconnectedCallback();
  }

  handleFolderOpened = async () => {
    this.currentBytes = await loadCurrentProjectBytes();
  };

  handleAgentSelect = async (e) => {
    const token = ++this._requestToken;
    this.agentId = e.detail.agentId;
    if (!this.agentId) return;

    const agent = await window.api.agent.get(this.agentId);
    if (token !== this._requestToken) return;

    this.editName = agent?.name || "";
    this.selectedKeyRef =
      agent?.providerId && agent?.keyId
        ? `${agent.providerId}:${agent.keyId}`
        : "";
    this.selectedModel = agent?.model || "";
    this.projectLimitMB = agent?.projectLimit
      ? Math.round(agent.projectLimit / 1048576)
      : "";
    this.models = [];
    if (this.selectedKeyRef) await this._loadModels(token);
    await this._syncFileLimit();
  };

  async handleKeyChange(ref) {
    const token = ++this._requestToken;
    this.selectedKeyRef = ref;
    this.selectedModel = "";
    this.models = [];
    if (ref) await this._loadModels(token);
    await this._syncFileLimit();
  }

  async _loadModels(token = this._requestToken) {
    const result = await fetchModels(
      this.keys,
      this.selectedKeyRef,
      token,
      () => this._requestToken,
    );
    if (result === null) return; // cancelled
    this.models = result;
    if (!this.selectedModel && result.length > 0)
      this.selectedModel = result[0].id;
    await this.updateComplete;
    const sel = this.shadowRoot?.querySelector(".ag-model-select");
    if (sel) sel.value = this.selectedModel;
  }

  handleNameInput(e) {
    this.editName = e.target.value;
  }

  handleProjectLimitInput(e) {
    this.projectLimitMB = e.target.value;
  }

  async handleSave() {
    const [providerId, keyId] = this.selectedKeyRef.split(":");
    await window.api.agent.save({
      id: this.agentId,
      name: this.editName.trim() || "Agent",
      providerId: providerId || "",
      keyId: keyId || "",
      model: this.selectedModel || "",
    });
    this.saved = true;
    window.dispatchEvent(new CustomEvent("agents:changed"));
    setTimeout(() => (this.saved = false), 1500);
  }

  render() {
    return agEditorTemplate(this);
  }

  async _syncFileLimit() {
    const [providerId] = this.selectedKeyRef.split(":");
    this.fileLimitMB = await getFileLimitMB(providerId);
  }
}

customElements.define("module-ag-editor-group", AgEditorGroupElement);
