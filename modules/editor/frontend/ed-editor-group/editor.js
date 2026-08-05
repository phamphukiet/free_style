import { LitElement } from "lit";
import { editorTemplate } from "./editor.template.js";
import { mountEditor } from "../mount.js";
import { readFile, writeFile } from "../bridge.js";
import * as monaco from "monaco-editor";

const LANGS = {
  js: "javascript", ts: "typescript", json: "json",
  html: "html", css: "css", py: "python", md: "markdown",
};

function detectLang(path) {
  const ext = path.split(".").pop().toLowerCase();
  return LANGS[ext] || "plaintext";
}

class EditorElement extends LitElement {
  static properties = { path: { type: String } };

  constructor() {
    super();
    this.path = "";
    this.instance = null;
    this.models = new Map(); // path -> { model, saveTimeout }
  }

  createRenderRoot() { return this; }

  firstUpdated() {
    const mountPoint = this.querySelector("#editor-mount");
    this.instance = mountEditor(mountPoint);
    window.addEventListener("workbench:close-file", this.handleFileClosed);
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:close-file", this.handleFileClosed);
    super.disconnectedCallback();
  }

  handleFileClosed = (e) => {
    const entry = this.models.get(e.detail.filePath);
    if (!entry) return;
    clearTimeout(entry.saveTimeout);
    entry.model.dispose();
    this.models.delete(e.detail.filePath);
  };

  async getOrCreateModel(path) {
    if (this.models.has(path)) return this.models.get(path).model;
    const content = await readFile(path);
    const model = monaco.editor.createModel(content, detectLang(path));
    const entry = { model, saveTimeout: null };
    model.onDidChangeContent(() => {
      clearTimeout(entry.saveTimeout);
      entry.saveTimeout = setTimeout(() => writeFile(path, model.getValue()), 800);
    });
    this.models.set(path, entry);
    return model;
  }

  async updated(changedProperties) {
    if (!changedProperties.has("path") || !this.path || !this.instance) return;
    const targetPath = this.path;
    const model = await this.getOrCreateModel(targetPath);
    if (this.path !== targetPath) return;
    this.instance.setModel(model);
  }

  render() { return editorTemplate(); }
}

customElements.define("module-editor", EditorElement);