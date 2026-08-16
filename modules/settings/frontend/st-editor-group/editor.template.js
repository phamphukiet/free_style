import { dashboardTemplate } from "./dashboard.template.js";
import { detailTemplate } from "./detail.template.js";

export function stEditorTemplate(host) {
  return host.activeGroup ? detailTemplate(host) : dashboardTemplate(host);
}
