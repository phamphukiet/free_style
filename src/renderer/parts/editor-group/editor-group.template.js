import { html } from "lit";
import styles from "./editor-group.css?inline";

export function editorGroupTemplate(host) {
  if (!host.hasFile) {
    return html`
      <style>${styles}</style>
      <div class="editor-empty">Chưa có file nào được mở</div>
    `;
  }

  return html`
    <style>${styles}</style>
    <div class="editor-tab-bar">
      <div class="editor-tab active">
        <span class="tab-label">${host.activeFileName}</span>
        <button class="tab-close-btn" @click=${() => host.handleCloseFile()}>&times;</button>
      </div>
    </div>
    <div class="editor-container">
      <module-editor .path=${host.activeFilePath}></module-editor>
    </div>
  `;
}
