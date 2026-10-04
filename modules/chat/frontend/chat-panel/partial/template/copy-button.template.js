// copy-button.template.js
import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import copyIcon from "lucide-static/icons/copy.svg?raw";
import checkIcon from "lucide-static/icons/check.svg?raw";
import { copyWithFeedback } from "../markdown/copy-action.js";

export function copyButtonTemplate(text, label) {
  return html`
    <button
      class="md-copy"
      type="button"
      title=${label}
      aria-label=${label}
      @click=${(e) => copyWithFeedback(e.currentTarget, text)}
    >
      <span class="md-ico md-ico-copy">${unsafeSVG(copyIcon)}</span>
      <span class="md-ico md-ico-done">${unsafeSVG(checkIcon)}</span>
      <span class="md-done-label">Đã chép</span>
    </button>
  `;
}
