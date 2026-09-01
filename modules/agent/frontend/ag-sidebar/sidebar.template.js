import { html, unsafeStatic } from "lit/static-html.js";

export function sidebarTemplate(groupTags) {
  return html`${groupTags.map((tag) => {
    const t = unsafeStatic(tag);
    return html`<${t}></${t}>`;
  })}`;
}
