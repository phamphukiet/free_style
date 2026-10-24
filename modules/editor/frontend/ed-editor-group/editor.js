import { LitElement } from "lit";
import { editorTemplate } from "./editor.template.js";
import {
  mountEditor,
  acquireModel,
  releaseModel,
  applyModelOptions,
} from "../mount.js";
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
  static properties = { path: { type: String }, paneId: { type: String } };

  constructor() {
    super();
    this.path = "";
    this.paneId = "";
    this.instance = null;
    this.held = new Set();
    this._options = {};
  }

  firstUpdated() {
    this.instance = mountEditor(this.querySelector("#editor-mount"));
    window.addEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind = bindEditor({ host: this });
  }

  disconnectedCallback() {
    window.removeEventListener("workbench:close-file", this.handleFileClosed);
    this._unbind?.();
    this.held.forEach((path) => releaseModel({ path, host: this }));
    this.held.clear();
    this.instance?.dispose();
    super.disconnectedCallback();
  }

  handleFileClosed = (e) => {
    const { filePath, paneId } = e.detail;
    if (paneId !== this.paneId || !this.held.delete(filePath)) return;
    releaseModel({ path: filePath, host: this });
  };

  applyOptions(options) {
    this._options = options;
    this.instance?.updateOptions(options);
    applyModelOptions(modelOptions(options));
  }

  async getOrCreateModel(path) {
    const model = await acquireModel({ path, host: this });
    this.held.add(path);
    model.updateOptions(modelOptions(this._options));
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
