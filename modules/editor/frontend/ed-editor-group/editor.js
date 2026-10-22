import { LitElement } from "lit";
import { editorTemplate } from "./editor.template.js";
import { mountEditor } from "../mount.js";
import { readFile, writeFile } from "../bridge.js";
import { registry } from "@modules/registry.js";
import * as monaco from "monaco-editor";
import { bindEditor } from "../effects.js";
const modelOptions = ({ tabSize, insertSpaces }) => ({ tabSize, insertSpaces });

const LANGS = {
  js: "javascript",
  ts: "typescript",
  json: "json",
  html: "html",
  css: "css",
  py: "python",
  md: "markdown",
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
    this.models = new Map();
    this._options = {}; // option hiện hành từ effect "monaco.options"  }
  }
  createRenderRoot() {
    return this;
  }

  async firstUpdated() {
    const mountPoint = this.querySelector("#editor-mount");
    this.instance = mountEditor(mountPoint);
    window.addEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind = bindEditor({ host: this });

    registry.registerConfigConsumer("editor-save-trigger", () => {
      this.models.forEach(({ model, path: p }, path) => {
        const entry = this.models.get(path);
        if (entry.dirty) {
          writeFile(path, model.getValue());
          entry.dirty = false;
        }
      });
    });
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind?.();
    super.disconnectedCallback();
  }

  applyOptions(options) {
    this._options = options;
    this.instance?.updateOptions(options);
    this.models.forEach(({ model }) =>
      model.updateOptions(modelOptions(options)),
    );
  }

  async getOrCreateModel(path) {
    if (this.models.has(path)) return this.models.get(path).model;
    const content = await readFile(path);
    const model = monaco.editor.createModel(content, detectLang(path));
model.updateOptions(modelOptions(this._options));    const entry = { model, saveTimeout: null };
    model.onDidChangeContent(() => {
      entry.dirty = true; // chỉ đánh dấu, không tự ghi nữa
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

  render() {
    return editorTemplate();
  }
}

customElements.define("module-editor", EditorElement);
