import { dashboardTemplate } from "./dashboard.template.js";
import { detailTemplate } from "./detail.template.js";
import { html } from "lit";

export function stEditorTemplate(host) {
  if (host.pageTag) return html`<slot></slot>`;
  return host.activeGroup ? detailTemplate(host) : dashboardTemplate(host);
}