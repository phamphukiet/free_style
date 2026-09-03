import { LitElement, unsafeCSS } from "lit";
import { activatePreviewTemplate } from "./activate-preview-view.template.js";
import ownStyles from "./activate-preview-view.css?inline";
import sharedStyles from "../index/shared/view-form.css?inline";

class ActivatePreviewViewElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    contextId: { type: String }, // orgId
    preview: { state: true },
  };

  constructor() {
    super();
    this.contextId = "";
    this.preview = null;
    this._loadedFor = "";
  }

  willUpdate(changed) {
    if (changed.has("contextId") && this.contextId !== this._loadedFor) {
      this._loadedFor = this.contextId;
      this.load();
    }
  }

  async load() {
    if (!this.contextId) return;
    this.preview = await window.api.org.previewActivate(this.contextId);
  }

  async handleConfirm() {
    const orgId = this.contextId;
    await window.api.org.confirmActivate(orgId);
    window.dispatchEvent(new CustomEvent("agents:changed"));
    window.dispatchEvent(new CustomEvent("org:changed"));
    window.dispatchEvent(
      new CustomEvent("org:select-org", { detail: { orgId } }),
    );
  }

  handleCancel() {
    window.dispatchEvent(
      new CustomEvent("org:activate-preview", { detail: { orgId: "" } }),
    );
  }

  render() {
    return activatePreviewTemplate(this);
  }
}

customElements.define("ag-view-activate-preview", ActivatePreviewViewElement);
