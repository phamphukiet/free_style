import { html } from "lit";

const partialTemplates = import.meta.glob("./partial/**/*.template.js", {
  eager: true,
});
const sectionTemplate =
  partialTemplates["./partial/section/section.template.js"]?.sectionTemplate ||
  (() => html``);

export function skSidebarTemplate(host) {
  const [projectSection, pinnedSection] = host.sections;
  return html`
    ${sectionTemplate(host, projectSection)}
    ${sectionTemplate(host, pinnedSection)}
  `;
}
