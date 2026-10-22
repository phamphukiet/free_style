// terminal-theme.js — target "terminal.theme": đẩy vào registry trung lập, Terminal tự nghe.
import { registerEffectHandler } from "@shared/setting/effect.js";
import { setTerminalLayer } from "@shared/terminal-theme.js";

registerEffectHandler({
  target: "terminal.theme",
  handler: ({ source, payload }) => setTerminalLayer(source, payload),
});
