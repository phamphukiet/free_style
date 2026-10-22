// resolver.js
// Giá trị hiệu lực: default < global < workspace. Tầng sai kiểu bị bỏ qua.
// Setting scope "global" bỏ qua tầng workspace.

const { validateValue } = require("./validate");

const ORDER = { global: ["global"], any: ["workspace", "global"] };

function inspect({ def, layers }) {
  const order = ORDER[def.scope] || ORDER.any;
  const hit = order.find(
    (scope) =>
      layers[scope] !== undefined &&
      !validateValue({ def, value: layers[scope] }),
  );
  return {
    default: def.default,
    global: layers.global,
    workspace: def.scope === "global" ? undefined : layers.workspace,
    value: hit ? layers[hit] : def.default,
    scope: hit || "default",
  };
}

module.exports = { inspect };