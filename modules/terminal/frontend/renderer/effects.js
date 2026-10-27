// Viết MỘT LẦN: handler cho target "xterm.options" và "xterm.theme".
// Thêm setting terminal mới chỉ cần sửa backend/setting/, không đụng file này.

import { registerEffectHandler } from "@shared/setting/effect.js";
import { PALETTES } from "./palettes.js";

const hosts = new Set();
const options = {};
let baseId = "dark";
const DEFAULT_ID = "dark";

function resolveOptions() {
  const base = PALETTES[baseId] ?? PALETTES[DEFAULT_ID] ?? {};
  return { ...options, theme: { ...base } };
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
