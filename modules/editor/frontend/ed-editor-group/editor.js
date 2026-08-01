import { LitElement } from "lit";
import { editorTemplate } from "./editor.template.js";
import { mountEditor } from "../mount.js";
import { readFile, writeFile } from "../bridge.js";
import * as monaco from "monaco-editor";

class EditorElement extends LitElement {
  static properties = { path: { type: String } };

  constructor() {
    super(); this.path = ""; this.instance = null; this.saveTimeout = null;
  }

  createRenderRoot() { return this; }

  firstUpdated() {
    const mountPoint = this.querySelector("#editor-mount");
    this.instance = mountEditor(mountPoint);
    this.instance.onDidChangeModelContent(() => {
      if (!this.path) return;
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        writeFile(this.path, this.instance.getValue());
      }, 800);
    });
  }

  async willUpdate(changedProperties) {
    if (changedProperties.has("path") && this.path && this.instance) {
      const content = await readFile(this.path);
      this.instance.setValue(content);
      
      const ext = this.path.split(".").pop().toLowerCase();
      const langs = {
        js: "javascript", ts: "typescript", json: "json",
        html: "html", css: "css", py: "python", md: "markdown"
      };
      const model = this.instance.getModel();
      if (model) monaco.editor.setModelLanguage(model, langs[ext] || "plaintext");
    }
  }

  disconnectedCallback() {
    clearTimeout(this.saveTimeout);
    super.disconnectedCallback();
  }

  render() { return editorTemplate(); }
}

customElements.define("module-editor", EditorElement);
