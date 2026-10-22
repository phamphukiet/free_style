// monaco-theme.js — target "monaco.theme": mỗi source (id setting) là 1 layer của Monaco.
import { registerEffectHandler } from "@shared/setting/effect.js";
import { setThemeLayer } from "@shared/monaco-theme.js";

registerEffectHandler({
  target: "monaco.theme",
  handler: ({ source, payload }) => setThemeLayer(source, payload),
});