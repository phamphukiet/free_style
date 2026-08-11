const commands = require("./component-tokens.commands");
const { ALLOWED_SUFFIXES } = require("./component-tokens.suffixes");
const { notifyChanged } = require("../../../../core/notify");

// id dùng để lọc event ở component-tokens-apply.js — phải khớp tay giữa
// 2 file này vì backend (CJS) và renderer apply script (ESM) không share
// được hằng số qua import (khác module system, khác process).
const COMPONENT_TOKENS_ID = "workbench.componentTokens";

const actions = {
  override_component_token: ({ selector, token, value }) => {
    const result = commands.setOverride(selector, token, value);
    notifyChanged(COMPONENT_TOKENS_ID, result);
    return result;
  },
  reset_component_token: ({ selector, token }) => {
    const result = commands.resetOverride(selector, token);
    notifyChanged(COMPONENT_TOKENS_ID, result);
    return result;
  },
  get_component_tokens: () => commands.getAllAsCssVars(),
};

function getHint() {
  return (
    `Đổi màu riêng 1 component: action="override_component_token" ` +
    `selector="<tên-thẻ-kebab-case, VD: editor-group>", token="<${ALLOWED_SUFFIXES.join("|")}>", value="#hex". ` +
    `Xoá override: action="reset_component_token" selector=... token=... (bỏ token để xoá cả selector).`
  );
}

module.exports = { actions, getHint };
