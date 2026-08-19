// monaco-theme.js
// Registry TỔNG QUÁT — không biết và không cần biết có bao nhiêu setting đóng góp.
// Setting nào muốn ảnh hưởng theme Monaco (base sáng/tối, rules tô màu token...)
// chỉ cần tự gọi setThemeLayer(key, {...}) trong chính file xxx-apply.js của nó.
// Thêm setting mới KHÔNG BAO GIỜ cần sửa file này.

import * as monaco from "monaco-editor";

const layers = {}; // { [settingId]: { base?, rules? } } — key tự do, mỗi setting 1 key riêng

function render() {
  const merged = Object.values(layers).reduce(
    (acc, layer) => ({
      base: layer.base || acc.base,
      rules: layer.rules ? [...acc.rules, ...layer.rules] : acc.rules,
    }),
    { base: "vs-dark", rules: [] },
  );
  monaco.editor.defineTheme("workbench-theme", {
    base: merged.base,
    inherit: true,
    rules: merged.rules,
    colors: {},
  });
  monaco.editor.setTheme("workbench-theme");
}

// key: đặt trùng id setting cho dễ trace (VD "appearance.theme", "syntax.palette").
// layer: { base?: 'vs' | 'vs-dark', rules?: monaco.editor.ITokenThemeRule[] }
export function setThemeLayer(key, layer) {
  layers[key] = layer || {};
  render();
}

export function clearThemeLayer(key) {
  delete layers[key];
  render();
}
