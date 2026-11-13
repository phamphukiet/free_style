// ext-sample.js
// Khối code mẫu chỉ đọc + nút Copy cho người mới.

import { LitElement, unsafeCSS } from "lit";
import { extSampleTemplate } from "./ext-sample.template.js";
import styles from "./ext-sample.css?inline";
import { toast } from "../render/ext-actions.js";

class ExtSampleElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    code: { type: String },
    copied: { state: true },
  };

  constructor() {
    super();
    this.code = "";
    this.copied = false;
  }

  async handleCopy() {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copied = true;
      setTimeout(() => (this.copied = false), 1500);
    } catch (error) {
      toast(`Không copy được: ${error.message}`);
    }
  }

  render() {
    return extSampleTemplate(this);
  }
}

customElements.define("ext-sample", ExtSampleElement);
