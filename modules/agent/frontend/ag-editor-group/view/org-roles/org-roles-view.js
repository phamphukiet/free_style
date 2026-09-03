import { LitElement, unsafeCSS } from "lit";
import { orgRolesViewTemplate } from "./org-roles-view.template.js";
import ownStyles from "./org-roles-view.css?inline";
import sharedStyles from "../index/shared/view-form.css?inline";

class OrgRolesViewElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    contextId: { type: String }, // orgId
    org: { state: true },
    instanceCounts: { state: true },
    editingRoleId: { state: true },
    editingOrgName: { state: true },
    newRoleName: { state: true },
  };

  constructor() {
    super();
    this.contextId = "";
    this.org = null;
    this.instanceCounts = {};
    this.editingRoleId = "";
    this.editingOrgName = false;
    this.newRoleName = "";
    this._loadedFor = "";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("org:changed", this.handleOrgChanged);
  }
  disconnectedCallback() {
    window.removeEventListener("org:changed", this.handleOrgChanged);
    super.disconnectedCallback();
  }

  willUpdate(changed) {
    if (changed.has("contextId") && this.contextId !== this._loadedFor) {
      this._loadedFor = this.contextId;
      this.load();
    }
  }

  handleOrgChanged = () => {
    if (this.contextId) this.load();
  };

  async load() {
    if (!this.contextId) return;
    this.org = await window.api.org.get(this.contextId);
    this.editingOrgName = false;
    this.editingRoleId = "";
    const counts = {};
    (this.org?.instances || []).forEach(
      (i) => (counts[i.roleId] = (counts[i.roleId] || 0) + 1),
    );
    this.instanceCounts = counts;
  }

  async handleRenameOrg(name) {
    this.editingOrgName = false;
    if (!name.trim() || name.trim() === this.org.name) return;
    await window.api.org.rename(this.contextId, name.trim());
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleAddRole() {
    const name = this.newRoleName.trim();
    if (!name) return;
    this.newRoleName = "";
    await window.api.org.addRole(this.contextId, name, "manager");
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleRenameRole(id, name) {
    this.editingRoleId = "";
    const role = this.org.roles.find((r) => r.id === id);
    if (!name.trim() || name.trim() === role?.name) return;
    await window.api.org.renameRole(this.contextId, id, name.trim());
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleChangeParent(id, parentId) {
    await window.api.org.updateRoleParent(this.contextId, id, parentId);
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleChangeMaxCount(id, value) {
    await window.api.org.updateRoleMaxCount(
      this.contextId,
      id,
      value ? Number(value) : null,
    );
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleDeleteRole(id) {
    if (!window.confirm("Xoá vai trò này?")) return;
    await window.api.org.removeRole(this.contextId, id);
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleSaveAsNew() {
    const name = window.prompt("Tên org mới:", `${this.org.name} (copy)`);
    if (name === null) return;
    await window.api.org.saveAsNew(this.contextId, name);
    window.dispatchEvent(new CustomEvent("org:changed"));
  }

  async handleDeleteOrg() {
    if (!window.confirm(`Xoá org "${this.org.name}"? Không thể hoàn tác.`))
      return;
    await window.api.org.delete(this.contextId);
    window.dispatchEvent(new CustomEvent("org:changed"));
    window.dispatchEvent(
      new CustomEvent("org:select-org", { detail: { orgId: "" } }),
    );
  }

  render() {
    return orgRolesViewTemplate(this);
  }
}

customElements.define("ag-view-org-roles", OrgRolesViewElement);
