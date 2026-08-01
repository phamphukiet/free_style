import { html } from "lit";
import styles from "./editor.css?inline";

export function editorTemplate() {
  return html`
    <style>${styles}</style>
    <div id="editor-mount"></div>
  `;
}
