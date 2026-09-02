import { LitElement, unsafeCSS } from "lit";
import { orgGroupTemplate } from "./org-group.template.js";
import ownStyles from "./org-group.css?inline";
import sharedStyles from "../index/group-item.css?inline";
import { makeOrgHandlers } from "./org-group-handlers.js";

class OrgGroupElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    org: { state: true },
    presets: { state: true },
    orgCollapsed: { state: true },
    orgCreating: { state: true },
    orgNewParentId: { state: true },
    selectedRoleId: { state: true },
    orgEditingId: { state: true },
    orgMenuOpen: { state: true },
    orgMenuX: { state: true },
    orgMenuY: { state: true },
    orgMenuTargetId: { state: true },
  };

  constructor() {
    super();
    this.org = null;
    this.presets = [];
    this.orgCollapsed = false;
    this.orgCreating = false;
    this.orgNewParentId = "manager";
    this.selectedRoleId = "";
    this.orgEditingId = "";
    this.orgMenuOpen = false;
    this.orgMenuX = 0;
    this.orgMenuY = 0;
    this.orgMenuTargetId = "";
    Object.assign(this, makeOrgHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOrg();
    this.loadPresets();
    window.addEventListener("org:changed", this.loadOrg);
    window.addEventListener("workbench:folder-opened", this._onFolderOpened);
  }

  disconnectedCallback() {
    window.removeEventListener("org:changed", this.loadOrg);
    window.removeEventListener("workbench:folder-opened", this._onFolderOpened);
    window.removeEventListener("click", this.handleOrgOutsideClick);
    super.disconnectedCallback();
  }

  _onFolderOpened = () => {
    this.loadOrg();
    this.loadPresets();
  };

  render() {
    return orgGroupTemplate(this);
  }
}

customElements.define("ag-group-org", OrgGroupElement);
