// effects.js
// Viết MỘT LẦN: handler cho target "monaco.options". Thêm setting editor mới
// chỉ cần sửa backend/setting/, không đụng file này.

import { registerEffectHandler } from "@shared/setting/effect.js";

const hosts = new Set();
const merged = {};

export function bindEditor({ host }) {
  hosts.add(host);
  host.applyOptions({ ...merged });
  return () => hosts.delete(host);
}

registerEffectHandler({
  target: "monaco.options",
  handler: ({ payload }) => {
    Object.assign(merged, payload);
    hosts.forEach((host) => host.applyOptions({ ...merged }));
  },
});