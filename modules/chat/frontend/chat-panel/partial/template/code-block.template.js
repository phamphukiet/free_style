// code-block.template.js
import { html } from "lit";
import { copyButtonTemplate } from "./copy-button.template.js";

export function codeBlockTemplate({ lang, text }) {
  return html`
    <figure class="md-codeblock">
      <figcaption class="md-codebar">
        <span class="md-lang">${lang || "text"}</span>
        ${copyButtonTemplate(text, "Sao chép mã")}
      </figcaption>
      <pre class="md-pre"><code>${text}</code></pre>
    </figure>
  `;
}
