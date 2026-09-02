import { LitElement, unsafeCSS } from "lit";
import { chatPanelTemplate } from "./chat-panel.template.js";
import styles from "./chat-panel.css?inline";
import metricsStyles from "./partial/styles/metrics.css?inline";
import sessionsStyles from "./partial/styles/sessions.css?inline";
import inputStyles from "./partial/styles/input.css?inline";
import messagesStyles from "./partial/styles/messages.css?inline";
import { registry } from "@modules/registry.js";
import * as agentLoader from "./partial/agent/agent-loader.js";
import * as keyLoader from "./partial/keys/key-loader.js";
import * as sessionHandler from "./partial/session/session-handler.js";
import * as selectionHandler from "./partial/session/selection-handler.js";
import { handleSend } from "./partial/send/send-handler.js";

class ChatPanelElement extends LitElement {
  static styles = [
    unsafeCSS(styles),
    unsafeCSS(metricsStyles),
    unsafeCSS(sessionsStyles),
    unsafeCSS(inputStyles),
    unsafeCSS(messagesStyles),
  ];

  static properties = {
    agents: { state: true },
    selectedAgentId: { state: true },
    keys: { state: true },
    models: { state: true },
    selectedKeyRef: { state: true },
    selectedModel: { state: true },
    sessions: { state: true },
    sessionId: { state: true },
    messages: { state: true },
    tokenUsed: { state: true },
    tokenLimit: { state: true },
    projectBytes: { state: true },
    projectLimit: { state: true },
    inputValue: { state: true },
    sending: { state: true },
  };

  constructor() {
    super();
    this.agents = [];
    this.selectedAgentId = "";
    this.keys = [];
    this.models = [];
    this.selectedKeyRef = "";
    this.selectedModel = "";
    this.sessions = [];
    this.sessionId = "";
    this.messages = [];
    this.tokenUsed = 0;
    this.tokenLimit = 0;
    this.projectBytes = 0;
    this.projectLimit = 0;
    this.inputValue = "";
    this.sending = false;
    this._projectFolder = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.init();
    registry.on("providers:changed", () => keyLoader.loadKeys(this));
    window.addEventListener(
      "workbench:credentials-changed",
      this._onCredChanged,
    );
    window.addEventListener("agents:changed", this._onAgentsChanged);
    window.addEventListener("workbench:folder-opened", this._onFolderOpened);
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:credentials-changed",
      this._onCredChanged,
    );
    window.removeEventListener("agents:changed", this._onAgentsChanged);
    window.removeEventListener("workbench:folder-opened", this._onFolderOpened);
    super.disconnectedCallback();
  }
  _onCredChanged = () => keyLoader.loadKeys(this);
  _onAgentsChanged = () => agentLoader.loadAgents(this);
  _onFolderOpened = (e) => {
    this._projectFolder = e?.detail?.folderPath || this._projectFolder;
    this.refreshProjectSize();
  };

  // async init() {
  //   await Promise.all([agentLoader.loadAgents(this), keyLoader.loadKeys(this), sessionHandler.loadSessions(this)]);
  //   await this.restoreSelection();
  //   const folder = await window.api.state?.loadLastFolder?.();
  //   if (folder) {
  //     this._projectFolder = folder;
  //     this.refreshProjectSize();
  //   }
  // }

  async init() {
    await Promise.all([
      agentLoader.loadAgents(this),
      keyLoader.loadKeys(this),
      sessionHandler.loadSessions(this),
    ]);
    await this.restoreSelection();
  }

  handleSelectAgent(id) {
    agentLoader.handleSelectAgent(this, id);
  }
  handleSelectKey(ref) {
    keyLoader.handleSelectKey(this, ref);
  }
  handleSelectModel(model) {
    keyLoader.handleSelectModel(this, model);
  }
  handleNewSession() {
    sessionHandler.handleNewSession(this);
  }
  handleSelectSession(id) {
    sessionHandler.handleSelectSession(this, id);
  }
  handleDeleteSession(id) {
    sessionHandler.handleDeleteSession(this, id);
  }
  handleSend() {
    handleSend(this);
  }

  async refreshProjectSize() {
    if (!this._projectFolder) return;
    this.projectBytes =
      (await window.api.chat.projectSize(this._projectFolder)) || 0;
  }

  _scrollToBottom() {
    const el = this.shadowRoot?.querySelector(".chat-messages");
    if (el) el.scrollTop = el.scrollHeight;
  }

  async restoreSelection() {
    await selectionHandler.restoreSelection(this);
  }
  saveSelection() {
    selectionHandler.saveSelection(this);
  }

  render() {
    return chatPanelTemplate(this);
  }
}

customElements.define("module-chat-panel", ChatPanelElement);