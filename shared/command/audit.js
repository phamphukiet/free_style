// audit.js
// Nhật ký chỉ ghi thêm (JSONL) ở <global>/audit/command.jsonl, quay vòng ở 2MB.
// KHÔNG ghi args, chỉ ghi băm; lỗi ghi không bao giờ làm hỏng lệnh.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { registry } = require("../storage");

const MAX_BYTES = 2 * 1024 * 1024;
const FILE_MODE = 0o600;

const fileOf = () =>
  path.join(registry.getGlobalDir(), "audit", "command.jsonl");

function hashArgs(args) {
  try {
    const text = JSON.stringify(args ?? null);
    return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
  } catch {
    return "unhashable";
  }
}

function rotateIfBig({ file }) {
  try {
    if (fs.statSync(file).size > MAX_BYTES) fs.renameSync(file, `${file}.1`);
  } catch {
    /* chưa có file */
  }
}

/** @param {{ caller, id, risk?, decision, outcome, ms?, args?, error? }} entry */
function record(entry) {
  try {
    const { args, ...rest } = entry;
    const file = fileOf();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    rotateIfBig({ file });
    const line = JSON.stringify({
      t: new Date().toISOString(),
      ...rest,
      argsHash: hashArgs(args),
    });
    fs.appendFileSync(file, `${line}\n`, { mode: FILE_MODE });
  } catch (error) {
    console.error("[command/audit] ghi lỗi:", error.message);
  }
}

module.exports = { record };
