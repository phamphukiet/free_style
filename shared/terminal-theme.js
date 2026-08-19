// terminal-theme.js
// Registry TỔNG QUÁT cho theme xterm.js — bất kỳ setting nào (source/root/**)
// muốn ảnh hưởng màu Terminal chỉ cần tự gọi setTerminalLayer(key, {...})
// trong chính xxx-apply.js của nó. Không setting nào cần sửa file này.
// Mỗi TerminalManager tự subscribe qua onTerminalThemeChange() để áp dụng
// real-time — registry không cần biết Terminal tồn tại bao nhiêu instance.

const layers = {}; // { [settingId]: Partial<xterm ITheme> }
const listeners = new Set();

function merge() {
  return Object.assign({}, ...Object.values(layers));
}

function notify() {
  const theme = merge();
  listeners.forEach((cb) => cb(theme));
}

export function setTerminalLayer(key, layer) {
  layers[key] = layer || {};
  notify();
}

export function clearTerminalLayer(key) {
  delete layers[key];
  notify();
}

export function getTerminalTheme() {
  return merge();
}

export function onTerminalThemeChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
