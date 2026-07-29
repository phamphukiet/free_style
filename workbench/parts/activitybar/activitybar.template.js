import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { classMap } from "lit/directives/class-map.js";
import filesIcon from "lucide-static/icons/files.svg?raw";
import searchIcon from "lucide-static/icons/search.svg?raw";
import gitBranchIcon from "lucide-static/icons/git-branch.svg?raw";
import blocksIcon from "lucide-static/icons/blocks.svg?raw";

const ITEMS = [
  { id: "explorer", icon: filesIcon },
  { id: "search", icon: searchIcon },
  { id: "git", icon: gitBranchIcon },
  { id: "extensions", icon: blocksIcon },
];

export function activitybarTemplate(host) {
  return html`
    ${ITEMS.map(
      (item) => html`
        <button
          class=${classMap({
            "activitybar-icon": true,
            active: host.activeId === item.id,
          })}
          @click=${() => host.handleIconClick(item.id)}
        >
          ${unsafeSVG(item.icon)}
        </button>
      `,
    )}
  `;
}
