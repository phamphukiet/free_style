// Viết MỘT LẦN: handler cho target "xterm.options" và "xterm.theme".
// Thêm setting terminal mới chỉ cần sửa backend/setting/, không đụng file này.

import { registerEffectHandler } from "@shared/setting/effect.js";
import {
  getTerminalTheme,
  onTerminalThemeChange,
} from "@shared/setting/terminal-theme.js";
import { PALETTES } from "./palettes.js";

const hosts = new Set();
const options = {};
let baseId = "dark";

// Thứ tự ưu tiên: palette gốc (terminal.colorTheme) < layer của setting khác.
function resolveOptions() {
  const base = PALETTES[baseId] ?? PALETTES.dark;
  return { ...options, theme: { ...base, ...getTerminalTheme() } };
}

const pushAll = () =>
  hosts.forEach((host) => host.applyOptions(resolveOptions()));

export function bindTerminal({ host }) {
  hosts.add(host);
  host.applyOptions(resolveOptions());
  return () => hosts.delete(host);
}

registerEffectHandler({
  target: "xterm.options",
  handler: ({ payload }) => {
    Object.assign(options, payload);
    pushAll();
  },
});

registerEffectHandler({
  target: "xterm.theme",
  handler: ({ payload }) => {
    baseId = payload.base;
    pushAll();
  },
});

onTerminalThemeChange(pushAll);
