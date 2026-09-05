import { LitElement, unsafeCSS } from "lit";
import { orgGroupTemplate } from "./org-group.template.js";
import ownStyles from "./org-group.css?inline";
import sharedStyles from "../index/group-item.css?inline";
import { makeOrgHandlers } from "./org-group-handlers.js";

class OrgGroupElement extends LitElement {
  static styles = [unsafeCSS(sharedStyles), unsafeCSS(ownStyles)];
  static properties = {
    orgs: { state: true },
    activeOrgId: { state: true },
    selectedOrgId: { state: true },
    orgCollapsed: { state: true },
    orgCreatingOrg: { state: true },
    newOrgName: { state: true },
    newOrgPresetId: { state: true },
  };

  constructor() {
    super();
    this.orgs = [];
    this.activeOrgId = "";
    this.selectedOrgId = "";
    this.orgCollapsed = false;
    this.orgCreatingOrg = false;
    this.newOrgName = "";
    this.newOrgPresetId = "";
    Object.assign(this, makeOrgHandlers(this));
  }

  connectedCallback() {
    super.connectedCallback();
    // window.api.org.listPresets().then((p) => (this.orgPresets = p));
    this.loadOrgs();
    window.addEventListener("org:changed", this.loadOrgs);
    window.addEventListener("agents:changed", this.loadOrgs);
  }

  disconnectedCallback() {
    window.removeEventListener("org:changed", this.loadOrgs);
    window.removeEventListener("agents:changed", this.loadOrgs);
    super.disconnectedCallback();
  }

  render() {
    return orgGroupTemplate(this);
  }
}

customElements.define("ag-group-org", OrgGroupElement);
