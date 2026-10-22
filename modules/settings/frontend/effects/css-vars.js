// css-vars.js — target "css.vars": set biến CSS lên :root (đổi màu mọi part tức thì).
import { registerEffectHandler } from "@shared/setting/effect.js";

registerEffectHandler({
  target: "css.vars",
  handler: ({ payload }) => {
    const style = document.documentElement.style;
    Object.entries(payload).forEach(([key, value]) => {
      if (key.startsWith("--") && typeof value === "string")
        style.setProperty(key, value);
    });
  },
});
