// parse-inline.js
// Tách markdown inline (code, đậm, nghiêng, gạch, link) thành node dữ liệu.
// Không sinh HTML — dựng giao diện nằm ở markdown.template.js.

// Nhóm: 1 code | 2,3 đậm | 4 gạch | 5,6 link [chữ](url) | 7,8 nghiêng | 9 url trần
const INLINE =
  /`([^`\n]+)`|\*\*(.+?)\*\*|(?<!\w)__(.+?)__(?!\w)|~~(.+?)~~|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s](?:[^*]*[^*\s])?)\*|(?<!\w)_([^_\s](?:[^_]*[^_\s])?)_(?!\w)|(https?:\/\/[^\s<>)]*[^\s<>).,;:!?])/g;

const wrap = (type, source) => ({ type, children: parseInline(source) });

function toNode(m) {
  const [, code, boldA, boldB, del, label, href, emA, emB, url] = m;
  if (code !== undefined) return { type: "code", value: code };
  if (del !== undefined) return wrap("del", del);
  if (label !== undefined)
    return { type: "link", href, children: parseInline(label) };
  const strong = boldA ?? boldB;
  if (strong !== undefined) return wrap("strong", strong);
  const em = emA ?? emB;
  if (em !== undefined) return wrap("em", em);
  return { type: "link", href: url, children: [{ type: "text", value: url }] };
}

export function parseInline(text) {
  const nodes = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last)
      nodes.push({ type: "text", value: text.slice(last, m.index) });
    nodes.push(toNode(m));
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push({ type: "text", value: text.slice(last) });
  return nodes;
}
