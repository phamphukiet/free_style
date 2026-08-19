// syntax-apply.js
// Áp dụng "syntax.palette" cho CẢ Monaco lẫn Terminal — nhưng chỉ khai báo
// màu ĐÚNG 1 LẦN trong colorMap. ROLE_MAP là nơi duy nhất định nghĩa 1 vai trò
// màu (VD "string") ánh xạ sang tên field bên Monaco VÀ bên xterm cùng lúc —
// không còn 2 hàm tách rời suy đoán riêng như trước.
//
// Terminal (modules/terminal) hoàn toàn KHÔNG biết tới file này hay tới
// "syntax.palette": nó chỉ nghe shared/terminal-theme.js (registry trung lập).
// Xoá cả thư mục 002_syntax/ → registry rỗng → Terminal tự dùng PALETTES mặc
// định của chính nó, không lỗi, không cần sửa gì ở modules/terminal.

import { setThemeLayer } from "@shared/monaco-theme.js";
import {
  setTerminalLayer,
  clearTerminalLayer,
} from "@shared/terminal-theme.js";

const BUILT_IN = {
  classic: {
    base: "dark",
    background: "1e1e1e",
    foreground: "cccccc",
    cursor: "aeafad",
    comment: "6a9955",
    string: "ce9178",
    number: "b5cea8",
    keyword: "569cd6",
    identifier: "9cdcfe",
    type: "4ec9b0",
    delimiter: "d4d4d4",
    regexp: "d16969",
  },
  pastel: {
    base: "light",
    background: "ffffff",
    foreground: "1e1e1e",
    cursor: "1e1e1e",
    comment: "6b7280",
    string: "b45309",
    number: "166534",
    keyword: "1d4ed8",
    identifier: "a21caf",
    type: "0e7490",
    delimiter: "374151",
    regexp: "be123c",
  },
  vivid: {
    base: "dark",
    background: "272822",
    foreground: "f8f8f2",
    cursor: "f8f8f0",
    comment: "5c6773",
    string: "ffb454",
    number: "a0ff54",
    keyword: "ff54a0",
    identifier: "54ffe0",
    type: "54a0ff",
    delimiter: "ffffff",
    regexp: "ff5454",
  },
};

const ROLE_MAP = {
  background: { terminal: "background" },
  foreground: { terminal: "foreground" },
  cursor: { terminal: "cursor" },
  comment: { monaco: "comment", terminal: "brightBlack" },
  string: { monaco: "string", terminal: "green" },
  number: { monaco: "number", terminal: "yellow" },
  keyword: { monaco: "keyword", terminal: "blue" },
  identifier: { monaco: "identifier", terminal: "cyan" },
  type: { monaco: "type", terminal: "magenta" },
  delimiter: { monaco: "delimiter" },
  regexp: { monaco: "regexp", terminal: "red" },
};

function resolveColorMap(rawValue) {
  if (rawValue && rawValue.trim().startsWith("{")) {
    try {
      return JSON.parse(rawValue);
    } catch {
      console.warn("[syntax] JSON bảng màu không hợp lệ, dùng classic.");
    }
  }
  return BUILT_IN[rawValue] || BUILT_IN.classic;
}

// Duyệt colorMap ĐÚNG 1 LẦN, tách ra 2 kết quả theo ROLE_MAP — không có hàm
// suy đoán riêng nào khác nữa.
function deriveTargets(colorMap) {
  const monacoRules = [];
  const terminalTheme = {};

  for (const [role, hex] of Object.entries(colorMap)) {
    if (role === "base" || typeof hex !== "string") continue;
    const mapping = ROLE_MAP[role];
    if (!mapping) continue; // vai trò lạ (do user tự đặt trong JSON) → bỏ qua an toàn

    const value = hex.replace("#", "");
    if (mapping.monaco)
      monacoRules.push({ token: mapping.monaco, foreground: value });
    if (mapping.terminal) terminalTheme[mapping.terminal] = `#${value}`;
  }

  return { monacoRules, terminalTheme };
}

function applyTheme(paletteValue) {
  const colorMap = resolveColorMap(paletteValue);
  const declaredBase =
    colorMap.base === "light"
      ? "vs"
      : colorMap.base === "dark"
        ? "vs-dark"
        : undefined;
  const { monacoRules, terminalTheme } = deriveTargets(colorMap);

  setThemeLayer("syntax.palette", { base: declaredBase, rules: monacoRules });
  setTerminalLayer("syntax.palette", terminalTheme);
}

async function loadAndApply() {
  if (!window.api?.settings?.get) return; // module settings không có mặt — bỏ qua êm
  try {
    applyTheme(await window.api.settings.get("syntax.palette"));
  } catch (e) {
    console.warn("[syntax] Không áp dụng được bảng màu:", e.message);
  }
}

loadAndApply();
window.api?.settings?.onChanged?.((detail) => {
  if (detail.id !== "syntax.palette") return;
  applyTheme(detail.value);
});

export {};
