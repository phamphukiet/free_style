import { LitElement } from "lit";
import { apiKeyManagerTemplate } from "./api-key-manager.template.js";

import { registry } from "../../../../registry.js";

class ApiKeyManagerElement extends LitElement {
  static properties = {
    providerId: { type: String },
    keys: { state: true },
    isCreating: { state: true },
  };

  constructor() {
    super();
    this.providerId = "";
    this.keys = [];
    this.isCreating = false;
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
      } else {
        alert("Lỗi khi lưu API Key");
      }
    }
  }

  handleCancelCreate() {
    this.isCreating = false;
  }

  async handleKeyCreated() {
    this.isCreating = false;
    await this.loadKeys();
  }

  async handleEdit(keyObj) {
    const newName = window.prompt("Nhập tên mới cho API Key:", keyObj.name);
    if (newName && newName.trim() !== "" && newName !== keyObj.name) {
      const updatedKey = { ...keyObj, name: newName.trim() };
      const success = await window.api.credentials.save(
        this.providerId,
        updatedKey,
      );
      if (success) {
        await this.loadKeys();
      }
    }
  }

  async handleDelete(keyId) {
    if (window.confirm("Bạn có chắc chắn muốn xoá API Key này không?")) {
      const success = await window.api.credentials.delete(
        this.providerId,
        keyId,
      );
      if (success) {
        await this.loadKeys();
      }
    }
  }

  render() {
    return apiKeyManagerTemplate(this);
  }
}

customElements.define("api-key-manager", ApiKeyManagerElement);
