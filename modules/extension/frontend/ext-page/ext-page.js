// ext-page.js
// Trang settings "Extension (lập trình)": danh sách ext user viết + Lập trình / Run / Code mẫu.

import { LitElement, unsafeCSS } from "lit";
import { extPageTemplate } from "./ext-page.template.js";
import styles from "./ext-page.css?inline";
import "../ext-sample/ext-sample.js";
import {
  listExtensions,
  listLanguages,
  createExtension,
  removeExtension,
  onExtensionsChanged,
} from "../ext-bridge.js";
import {
  openInEditor,
  startExtension,
  stopExtension,
  attempt,
} from "../ext-actions.js";

class ExtPageElement extends LitElement {
  static styles = unsafeCSS(styles);
  static properties = {
    items: { state: true },
    sample: { state: true },
    showSample: { state: true },
  };

  constructor() {
    super();
    this.items = [];
    this.sample = "";
    this.showSample = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.reload();
    this.loadSample();
    this._off = onExtensionsChanged(this.reload);
  }

  disconnectedCallback() {
    this._off?.();
    super.disconnectedCallback();
  }

  reload = () =>
    attempt(async () => {
      this.items = await listExtensions();
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

  handleCreate() {
    const input = this.shadowRoot.getElementById("ext-name");
    return attempt(async () => {
      await createExtension({ name: input.value });
      input.value = "";
    });
  }

  handleCode(item) {
    openInEditor({ file: item.file });
  }

  handleRun(item) {
    const task = item.status === "running" ? stopExtension : startExtension;
    return attempt(() => task(item));
  }

  handleRemove(item) {
    if (!window.confirm(`Xoá "${item.name}"?`)) return;
    return attempt(() => removeExtension({ id: item.id }));
  }

  render() {
    return extPageTemplate(this);
  }
}

customElements.define("module-ext-page", ExtPageElement);
