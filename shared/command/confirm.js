// confirm.js
// Hộp thoại xác nhận của hệ điều hành, hiển thị lệnh và tham số THẬT (không phải mô tả của model).
// Mặc định nút Từ chối. Hết hạn thì tự huỷ. Lỗi/đóng hộp thoại = từ chối.

const { dialog } = require("electron");
const { CONFIRM_TIMEOUT_MS } = require("./spec");
const { resolveWindow } = require("./window");

const BUTTONS = ["Cho phép", "Từ chối"];
const DENY = 1;
const MAX_ARGS_CHARS = 800;
const WHO = { ai: "AI", ext: "Extension" };

const clip = (text) =>
  text.length > MAX_ARGS_CHARS
    ? `${text.slice(0, MAX_ARGS_CHARS)}… (${text.length} ký tự)`
    : text;

function buildOptions({ cmd, args, caller, reason, signal }) {
  const detail = [
    `Lệnh: ${cmd.id}`,
    `Rủi ro: ${cmd.risk ?? "?"}`,
    `Lý do hỏi: ${reason}`,
    "",
    "Tham số thật:",
    clip(JSON.stringify(args ?? {}, null, 2)),
  ].join("\n");
  return {
    type: "warning",
    title: "Xác nhận lệnh",
    message: `${WHO[caller?.kind] ?? "Người gọi"} muốn: ${cmd.label}`,
    detail,
    buttons: BUTTONS,
    defaultId: DENY,
    cancelId: DENY,
    noLink: true,
    signal,
  };
}

const show = ({ win, options }) =>
  win ? dialog.showMessageBox(win, options) : dialog.showMessageBox(options);

/** @returns {Promise<{ approved: boolean, expired?: boolean }>} */
async function ask({ cmd, args, caller, reason }) {
  const win = resolveWindow({ windowId: caller?.windowId });
  if (!win && caller?.windowId != null) return { approved: false }; // cửa sổ gọi đã đóng
  const controller = new AbortController();
  let timer;
  const expiry = new Promise((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve({ response: DENY, expired: true });
    }, CONFIRM_TIMEOUT_MS);
  });
  try {
    const options = buildOptions({
      cmd,
      args,
      caller,
      reason,
      signal: controller.signal,
    });
    const answer = await Promise.race([show({ win, options }), expiry]);
    return {
      approved: answer.response === 0 && !answer.expired,
      expired: Boolean(answer.expired),
    };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { ask };