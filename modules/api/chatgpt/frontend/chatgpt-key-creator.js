import { LitElement } from "lit";
import { chatgptKeyCreatorTemplate } from "./chatgpt-key-creator.template.js";

class ChatgptKeyCreatorElement extends LitElement {
  static properties = {
    providerId: { type: String },
    keyName: { state: true },
    keyValue: { state: true },
    isValidating: { state: true },
    statusMessage: { state: true },
    statusType: { state: true }, // 'success' | 'error' | ''
  };

  constructor() {
    super();
    this.providerId = "";
    this.keyName = "ChatGPT Key";
    this.keyValue = "";
    this.isValidating = false;
    this.statusMessage = "";
    this.statusType = "";
  }

  handleNameInput(e) {
    this.keyName = e.target.value;
  }

  handleKeyInput(e) {
    this.keyValue = e.target.value;
  }

  async handleSave() {
    if (!this.keyValue.trim()) {
      this.statusMessage = "Vui lòng nhập API Key.";
      this.statusType = "error";
      return;
    }

    this.isValidating = true;
    this.statusMessage = "Đang kiểm tra kết nối với OpenAI...";
    this.statusType = "";

    try {
      const response = await window.api.providers.validateKey(this.providerId, {
        name: this.keyName.trim(),
        value: this.keyValue.trim()
      });

      if (response && response.success) {
        this.statusMessage = "Kết nối thành công! Đang lưu key...";
        this.statusType = "success";
        
        // Save the key
        const saved = await window.api.credentials.save(this.providerId, {
          name: this.keyName.trim(),
          value: this.keyValue.trim()
        });

        if (saved) {
          this.dispatchEvent(new CustomEvent("created"));
        } else {
          this.statusMessage = "Lỗi khi lưu key vào hệ thống.";
          this.statusType = "error";
          this.isValidating = false;
        }
      } else {
        this.statusMessage = response?.message || "Kiểm tra thất bại. Key không hợp lệ.";
        this.statusType = "error";
        this.isValidating = false;
      }
    } catch (error) {
      this.statusMessage = "Đã xảy ra lỗi kết nối.";
      this.statusType = "error";
      this.isValidating = false;
    }
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  render() {
    return chatgptKeyCreatorTemplate(this);
  }
}

customElements.define("chatgpt-key-creator", ChatgptKeyCreatorElement);
