import { LitElement, unsafeCSS } from "lit";
import { remapViewTemplate } from "./remap-view.template.js";
import ownStyles from "./remap-view.css?inline";
import sharedStyles from "../shared/view-form.css?inline";
import {
  getRemapPending,
  clearRemapPending,
} from "../../../ag-sidebar/group/org/partial/remap-state.js";

class RemapViewElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    contextId: { type: String }, // presetId, do editor.js truyền vào
    diff: { state: true },
    mapping: { state: true },
  };

  constructor() {
    super();
    this.contextId = "";
    this.diff = null;
    this.mapping = {};
  }

  willUpdate(changed) {
    if (changed.has("contextId") && this.contextId) {
      this.diff = getRemapPending();
      this.mapping = {};
    }
  }

  handleMapChange(oldRoleId, newRoleId) {
    this.mapping = { ...this.mapping, [oldRoleId]: newRoleId || null };
  }

  async handleAutoArrange() {
    const { oldRoles, newRoles } = this.diff;
    this.mapping = await window.api.org.autoArrangeMapping(oldRoles, newRoles);
  }

  async handleConfirm() {
    await window.api.org.applyPresetChange(this.diff.presetId, this.mapping);
    this.finish();
  }

  handleCancel() {
    this.finish();
  }

  finish() {
    clearRemapPending();
    window.dispatchEvent(new CustomEvent("org:changed"));
    window.dispatchEvent(
      new CustomEvent("org:select-role", { detail: { roleId: "" } }),
    );
  }

  render() {
    return remapViewTemplate(this);
  }
}

customElements.define("ag-view-remap", RemapViewElement);
