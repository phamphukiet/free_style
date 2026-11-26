// logged.js
// Bọc execute của tool "settings": mỗi lần gọi ghi 1 dòng. Không dùng run vì lỗi
// phải ném tiếp cho caller (eachTarget, executor của chat) tự xử lý.

const { createLog } = require("../../../../shared/log");

const defaultLog = createLog({ filename: __filename });
const describe = ({ action, id, query }) =>
  [action, id ?? query].filter(Boolean).join(" ");

/** @param {{ execute: Function, log?: object }} args */
function withLog({ execute, log = defaultLog }) {
  return (args = {}) => {
    log.say({ task: "Execute", message: describe(args) });
    return execute(args);
  };
}

module.exports = { withLog };
