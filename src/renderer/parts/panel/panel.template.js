import { html } from "lit";

// Giai đoạn 1: chừa rỗng. Giai đoạn 2 sẽ mount xterm vào #panel-mount.
export function panelTemplate() {
  return html`<div id="panel-mount"></div>`;
}
