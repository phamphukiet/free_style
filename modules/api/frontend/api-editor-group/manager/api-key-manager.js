import { LitElement } from "lit";
import { apiKeyManagerTemplate } from "./api-key-manager.template.js";
import { registry } from "../../../../registry.js";
import "../edit_key/api-key-editor.js";

class ApiKeyManagerElement extends LitElement {
  static properties = {
    providerId: { type: String },
    keys: { state: true },
    isCreating: { state: true },
    editingKey: { state: true },
  };

  constructor() {
    super();
    this.providerId = "";
    this.keys = [];
    this.isCreating = false;
    this.editingKey = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.providerId) {
      await this.loadKeys();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("providerId") && this.providerId) {
      this.isCreating = false;
      this.loadKeys();
    }
  }

  async loadKeys() {
    const keys = await window.api.credentials.list(this.providerId);
    this.keys = keys || [];
  }

  notifyCredentialsChanged() {
    window.dispatchEvent(new CustomEvent("workbench:credentials-changed"));
  }

  async handleCreate() {
    const creatorView = registry.getProviderCreatorView(this.providerId);
    if (creatorView) {
      this.isCreating = true;
      return;
    }

    // Fallback cho logic cũ
    const keyData = await window.api.providers.createKey(this.providerId);
    if (keyData) {
      const success = await window.api.credentials.save(
        this.providerId,
        keyData,
      );
      if (success) {
        await this.loadKeys();
        this.notifyCredentialsChanged();
      } else {
        alert("Lỗi khi lưu API Key");
      }
    }
  }

  handleCancelCreate() {
    this.isCreating = false;
  }

  handleEditCancel() {
    this.editingKey = null;
  }

  async handleEditUpdated() {
    this.editingKey = null;
    await this.loadKeys();
    this.notifyCredentialsChanged();
  }

  async handleKeyCreated() {
    this.isCreating = false;
    await this.loadKeys();
    this.notifyCredentialsChanged();
  }

  async handleDelete(keyId) {
    if (window.confirm("Bạn có chắc chắn muốn xoá API Key này không?")) {
      const success = await window.api.credentials.delete(
        this.providerId,
        keyId,
      );
      if (success) {
        await this.loadKeys();
        this.notifyCredentialsChanged();
      }
    }
  }

  async handleEdit(keyObj) {
    this.editingKey = keyObj;
  }

  render() {
    return apiKeyManagerTemplate(this);
  }
}

customElements.define("api-key-manager", ApiKeyManagerElement);
