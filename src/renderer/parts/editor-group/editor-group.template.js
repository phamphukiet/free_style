// editor-group.template.js
import { html, unsafeStatic } from "lit/static-html.js";
import styles from "./editor-group.css?inline";

export function editorGroupTemplate(host, emptyTagName) {
  if (host.openFiles.length === 0) {
    if (emptyTagName) {
      const tag = unsafeStatic(emptyTagName);
      return html`
        <style>
          ${styles}
        </style>
        <${tag}></${tag}>
      `;
    }
    return html`
      <style>
        ${styles}
      </style>
      <div class="editor-empty">Chưa có file nào được mở</div>
    `;
  }

  return html`
    <style>
      ${styles}
    </style>
    <div class="editor-tab-bar">
      ${host.openFiles.map(
        (file) => html`
          <div
            class="editor-tab ${file.path === host.activePath ? "active" : ""}"
            @click=${() => host.handleSelectTab(file.path)}
          >
            <span class="tab-label">${file.name}</span>
            <button
              class="tab-close-btn"
              @click=${(e) => {
                e.stopPropagation();
                host.handleCloseFile(file.path);
              }}
            >
              &times;
            </button>
          </div>
        `,
      )}
    </div>
    <div class="editor-container">
      <module-editor .path=${host.activePath}></module-editor>
    </div>
  `;
}
