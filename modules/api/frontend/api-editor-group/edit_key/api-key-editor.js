import { LitElement } from "lit";
import { apiKeyEditorTemplate } from "./api-key-editor.template.js";

class ApiKeyEditorElement extends LitElement {
  static properties = {
    providerId: { type: String },
    keyObj: { type: Object },
    editName: { state: true },
    copyStatus: { state: true }
  };

  constructor() {
    super();
    this.providerId = "";
    this.keyObj = null;
    this.editName = "";
    this.copyStatus = ""; // "" | "Đã copy!"
  }

  updated(changedProperties) {
    if (changedProperties.has("keyObj") && this.keyObj) {
      if (this.editName === "") {
        this.editName = this.keyObj.name;
      }
    }
  }

  handleNameInput(e) {
    this.editName = e.target.value;
  }

  async handleCopy() {
    if (this.keyObj && this.keyObj.value) {
      try {
        await navigator.clipboard.writeText(this.keyObj.value);
        this.copyStatus = "Đã copy!";
        setTimeout(() => {
          this.copyStatus = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  }

  async handleSave() {
    if (!this.editName.trim()) {
      alert("Tên không được để trống.");
      return;
    }

    if (this.editName.trim() === this.keyObj.name) {
      // Không có gì thay đổi
      this.dispatchEvent(new CustomEvent("updated"));
      return;
    }

    const updatedKey = { ...this.keyObj, name: this.editName.trim() };
    const success = await window.api.credentials.save(this.providerId, updatedKey);
    if (success) {
      this.dispatchEvent(new CustomEvent("updated"));
    } else {
      alert("Lỗi khi cập nhật API Key");
    }
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  render() {
    return apiKeyEditorTemplate(this);
  }
}

customElements.define("api-key-editor", ApiKeyEditorElement);
