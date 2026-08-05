import { LitElement, unsafeCSS } from "lit";
import { apiEditorTemplate } from "./api-editor.template.js";

class ApiEditorElement extends LitElement {
  static properties = {
    apiKey: { type: String },
    isSaved: { type: Boolean },
  };

  constructor() {
    super();
    this.apiKey = "";
    this.isSaved = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadKey();
  }

  async loadKey() {
    const key = await window.api.credentials.load("chatgpt");
    if (key) {
      this.apiKey = key;
      this.isSaved = true;
    }
  }

  handleInput(e) {
    this.apiKey = e.target.value;
    this.isSaved = false;
  }

  async handleSave() {
    if (!this.apiKey.trim()) return;
    const success = await window.api.credentials.save("chatgpt", this.apiKey);
    if (success) {
      this.isSaved = true;
    } else {
      alert("Lưu key thất bại");
    }
  }

  async handleDelete() {
    const success = await window.api.credentials.delete("chatgpt");
    if (success) {
      this.apiKey = "";
      this.isSaved = false;
    }
  }

  render() {
    return apiEditorTemplate(this);
  }
}

customElements.define("module-api-chatgpt", ApiEditorElement);
