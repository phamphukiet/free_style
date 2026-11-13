// ext-page.js
// Trang settings "Extension (lập trình)": tạo ext, vào chế độ code, danh sách ext, code mẫu.

import { LitElement, unsafeCSS } from "lit";
import { extPageTemplate } from "./ext-page.template.js";
import styles from "./ext-page.css?inline";
import "../ext-sample/ext-sample.js";
import "../ext-item/ext-item.js";
import {
  listLanguages,
  createExtension,
  onExtensionsChanged,
} from "../render/ext-bridge.js";
import { openInEditor, attempt } from "../render/ext-actions.js";
import { enterMode } from "../render/ext-mode.js";

class ExtPageElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    items: { state: true },
    // fields: { state: true },
    sample: { state: true },
    showSample: { state: true },
  };

  constructor() {
    super();
    this.items = [];
    // this.fields = [];
    this.sample = "";
    this.showSample = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    this.loadSample();
    this._offExt = onExtensionsChanged(this.reload);
  }

  disconnectedCallback() {
    this._offExt?.();
    this._offSet?.();
    super.disconnectedCallback();
  }

  reload = () =>
    attempt(async () => {
      [this.items, this.fields] = await Promise.all([
        listExtensions(),
      ]);
    });

  // Mẫu auto save do backend cung cấp (runtime js), chỉ để hiển thị.
  loadSample() {
    return attempt(async () => {
      const langs = await listLanguages();
      this.sample = langs.find((l) => l.id === "js")?.sample ?? "";
    });
  }

  handleToggleSample() {
    this.showSample = !this.showSample;
  }

  handleEnterMode() {
    return attempt(enterMode);
  }

  // Tạo xong: vào chế độ code và mở luôn file của ext mới.
  handleCreate() {
    const input = this.shadowRoot.getElementById("ext-name");
    return attempt(async () => {
      const created = await createExtension({ name: input.value });
      input.value = "";
      await enterMode();
      openInEditor({ file: created.file });
    });
  }

  render() {
    return extPageTemplate(this);
  }
}

customElements.define("module-ext-page", ExtPageElement);
