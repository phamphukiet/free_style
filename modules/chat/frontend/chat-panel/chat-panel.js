import { LitElement, unsafeCSS } from "lit";
import { chatPanelTemplate } from "./chat-panel.template.js";
import styles from "./chat-panel.css?inline";
import { registry } from "@modules/registry.js";

class ChatPanelElement extends LitElement {
  static styles = unsafeCSS(styles);

  static properties = {
    modules: { state: true },
    keys: { state: true },
    messages: { state: true },
    selectedModuleId: { state: true },
    selectedKeyRef: { state: true },
    inputValue: { state: true },
    sending: { state: true },
  };

  constructor() {
    super();
    this.modules = [];
    this.keys = [];
    this.messages = [];
    this.selectedModuleId = "";
    this.selectedKeyRef = "";
    this.inputValue = "";
    this.sending = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadModules();
    this.loadKeys();
    registry.on("activitybar:changed", () => this.loadModules());
    registry.on("providers:changed", () => this.loadKeys());
  }

  loadModules() {
    this.modules = registry.getActivitybarItems();
  }

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

  handleSelectModule(id) {
    this.selectedModuleId = id;
  }

  handleSelectKey(ref) {
    this.selectedKeyRef = ref;
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
        moduleId: this.selectedModuleId || null,
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