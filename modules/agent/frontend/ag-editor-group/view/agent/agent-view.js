import { LitElement, unsafeCSS } from "lit";
import { agentViewTemplate } from "./agent-view.template.js";
import ownStyles from "./agent-view.css?inline";
import sharedStyles from "../index/shared/view-form.css?inline";
import { loadKeys } from "../index/shared/editor-keys.js";
import { loadCurrentProjectBytes } from "./partial/project-size.js";
import {
  handleKeyChange,
  loadModels,
  syncFileLimit,
} from "./partial/agent-model-loader.js";

class AgentViewElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    contextId: { type: String }, // agentId, do editor.js truyền vào
    editName: { state: true },
    keys: { state: true },
    selectedKeyRef: { state: true },
    models: { state: true },
    selectedModel: { state: true },
    saved: { state: true },
    currentBytes: { state: true },
    fileLimitMB: { state: true },
  };

  constructor() {
    super();
    this.contextId = "";
    this.editName = "";
    this.keys = [];
    this.selectedKeyRef = "";
    this.models = [];
    this.selectedModel = "";
    this.saved = false;
    this.currentBytes = 0;
    this.fileLimitMB = 100;
    this._requestToken = 0;
    this._loadedFor = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("workbench:folder-opened", this.handleFolderOpened);
    this._keysReady = loadKeys().then((keys) => (this.keys = keys));
    loadCurrentProjectBytes().then((b) => (this.currentBytes = b));
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:folder-opened",
      this.handleFolderOpened,
    );
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has("contextId") && this.contextId !== this._loadedFor) {
      this._loadedFor = this.contextId;
      this.loadAgent();
    }
  }

  handleFolderOpened = async () => {
    this.currentBytes = await loadCurrentProjectBytes();
  };

  async loadAgent() {
    const token = ++this._requestToken;
    if (!this.contextId) return;
    await this._keysReady;
    const agent = await window.api.agent.get(this.contextId);
    if (token !== this._requestToken) return;

    this.editName = agent?.name || "";
    this.selectedKeyRef =
      agent?.providerId && agent?.keyId
        ? `${agent.providerId}:${agent.keyId}`
        : "";
    this.selectedModel = agent?.model || "";
    this.models = [];
    if (this.selectedKeyRef) await loadModels(this, token);
    await syncFileLimit(this);
  }

  handleKeyChange(ref) {
    return handleKeyChange(this, ref);
  }

  handleNameInput(e) {
    this.editName = e.target.value;
  }

  async handleSave() {
    const [providerId, keyId] = this.selectedKeyRef.split(":");
    await window.api.agent.save({
      id: this.contextId,
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
    return agentViewTemplate(this);
  }
}

customElements.define("ag-view-agent", AgentViewElement);
