import { html } from "lit";
import { orgListTemplate } from "./partial/org-list.template.js";
import { createOrgRow } from "./partial/create-org-row.template.js";

export function orgGroupTemplate(host) {
  return html`${orgListTemplate(host)}${createOrgRow(host)}`;
}
