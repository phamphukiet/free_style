import { LitElement, unsafeCSS } from "lit";
import { chatPanelTemplate } from "./chat-panel.template.js";
import styles from "./chat-panel.css?inline";
import { registry } from "@modules/registry.js";

class ChatPanelElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    keys: { state: true },
    models: { state: true },
    messages: { state: true },
    selectedKeyRef: { state: true },
    selectedModel: { state: true },
    inputValue: { state: true },
    sending: { state: true },
  };

  constructor() {
    super();
    this.keys = [];
    this.models = [];
    this.messages = [];
    this.selectedKeyRef = "";
    this.selectedModel = "";
    this.inputValue = "";
    this.sending = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadKeys();
    registry.on("providers:changed", () => this.loadKeys());
    window.addEventListener(
      "workbench:credentials-changed",
      this.handleCredentialsChanged,
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "workbench:credentials-changed",
      this.handleCredentialsChanged,
    );
    super.disconnectedCallback();
  }

  handleCredentialsChanged = () => {
    this.loadKeys();
  };

  async loadKeys() {
    const providers = registry.getProviders();
    const lists = await Promise.all(
      providers.map(async (p) => {
        const keys = await window.api.credentials.list(p.id);
        return keys.map((k) => ({
          ...k,
          providerId: p.id,
          providerName: p.name,
        }));
      }),
    );
    this.keys = lists.flat();
  }

  async handleSelectKey(ref) {
    this.selectedKeyRef = ref;
    this.selectedModel = "";
    this.models = [];

    const [providerId, keyId] = ref.split(":");
    const keyObj = this.keys.find(
      (k) => k.providerId === providerId && k.id === keyId,
    );
    if (!keyObj || !window.api.providers.listModels) return;

    const result = await window.api.providers.listModels(
      providerId,
      keyObj.value,
    );
    if (Array.isArray(result)) {
      this.models = result;
      if (result.length > 0) this.selectedModel = result[0].id;
    }
  }

  handleSelectModel(model) {
    this.selectedModel = model;
  }

  async handleSend() {
    const content = this.inputValue.trim();
    if (!content || this.sending) return;

    this.messages = [...this.messages, { role: "user", content }];
    this.inputValue = "";
    this.sending = true;

    const [providerId, keyId] = this.selectedKeyRef.split(":");
    try {
      const reply = await window.api.chat.send({
        message: content,
        providerId: providerId || null,
        keyId: keyId || null,
        model: this.selectedModel || null,
      });
      this.messages = [
        ...this.messages,
        { role: "assistant", content: reply?.content || "(không có phản hồi)" },
      ];
    } catch (error) {
      this.messages = [
        ...this.messages,
        { role: "assistant", content: "Lỗi: " + error.message },
      ];
    } finally {
      this.sending = false;
    }
  }

  render() {
    return chatPanelTemplate(this);
  }
}

customElements.define("module-chat-panel", ChatPanelElement);