import { html } from "lit";
import styles from "./editor-group.css?inline";

export function editorGroupTemplate(host) {
  return html`
    <style>
      ${styles}
    </style>
    <div class="panes-row">
      ${host.panes.map(
        (p, i) => html`
          <workbench-editor-pane
            .paneId=${p.id}
            ?isActive=${p.id === host.activePaneId}
            ?showDivider=${i > 0}
          ></workbench-editor-pane>
        `,
      )}
    </div>
  `;
}
