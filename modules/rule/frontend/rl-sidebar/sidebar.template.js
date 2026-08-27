import { html } from "lit";
import { sectionTemplate } from "../partial/section/section.template.js";

export function rlSidebarTemplate(host) {
  const [projectSection, pinnedSection] = host.sections;
  return html`
    ${sectionTemplate(host, projectSection)}
    ${sectionTemplate(host, pinnedSection)}
  `;
}
