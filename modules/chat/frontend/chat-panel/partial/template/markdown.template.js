// markdown.template.js
// AST markdown -> Lit template. Không dùng unsafeHTML: text đi qua binding của
// Lit nên tự escape, agent trả HTML/script cũng không thực thi được.

import { html } from "lit";
import { parseBlocks } from "../markdown/parse-blocks.js";
import { parseInline } from "../markdown/parse-inline.js";
import { codeBlockTemplate } from "./code-block.template.js";

const SAFE_URL = /^https?:\/\//;
const cache = new WeakMap(); // message -> { content, result }

function openExternal(event, href) {
  event.preventDefault();
  window.api?.system?.openExternal(href);
}

function textNodes(value) {
  return value
    .split("\n")
    .flatMap((part, i) => (i === 0 ? [part] : [html`<br />`, part]));
}

function linkNode(node) {
  if (!SAFE_URL.test(node.href)) return inline(node.children);
  return html`<a
    class="md-link"
    href=${node.href}
    title=${node.href}
    @click=${(e) => openExternal(e, node.href)}
    >${inline(node.children)}</a
  >`;
}

const INLINE = {
  text: (n) => textNodes(n.value),
  code: (n) => html`<code class="md-code-inline">${n.value}</code>`,
  strong: (n) => html`<strong>${inline(n.children)}</strong>`,
  em: (n) => html`<em>${inline(n.children)}</em>`,
  del: (n) => html`<del>${inline(n.children)}</del>`,
  link: linkNode,
};

const inline = (nodes) => nodes.map((n) => INLINE[n.type](n));
const renderInline = (source) => inline(parseInline(source));

function listNode(block) {
  const items = block.items.map(
    (children) => html`<li class="md-li">${blocks(children)}</li>`,
  );
  return block.ordered
    ? html`<ol class="md-list" start=${block.start}>
        ${items}
      </ol>`
    : html`<ul class="md-list">
        ${items}
      </ul>`;
}

function tableNode({ head, align, rows }) {
  const cls = (i) => `md-al-${align[i] || "left"}`;
  const th = (c, i) => html`<th class=${cls(i)}>${renderInline(c)}</th>`;
  const td = (c, i) => html`<td class=${cls(i)}>${renderInline(c)}</td>`;
  return html`
    <div class="md-table-wrap">
      <table class="md-table">
        <thead>
          <tr>
            ${head.map(th)}
          </tr>
        </thead>
        <tbody>
          ${rows.map(
            (row) =>
              html`<tr>
                ${row.map(td)}
              </tr>`,
          )}
        </tbody>
      </table>
    </div>
  `;
}

const BLOCK = {
  paragraph: (b) => html`<p class="md-p">${renderInline(b.text)}</p>`,
  heading: (b) =>
    html`<div class="md-h md-h${b.level}" role="heading" aria-level=${b.level}>
      ${renderInline(b.text)}
    </div>`,
  hr: () => html`<hr class="md-hr" />`,
  quote: (b) =>
    html`<blockquote class="md-quote">${blocks(b.blocks)}</blockquote>`,
  list: listNode,
  table: tableNode,
  code: codeBlockTemplate,
};

const blocks = (nodes) => nodes.map((b) => BLOCK[b.type](b));

export function renderMarkdown(message) {
  const content = String(message.content ?? "");
  const hit = cache.get(message);
  if (hit?.content === content) return hit.result;
  const result = blocks(parseBlocks(content));
  cache.set(message, { content, result });
  return result;
}
