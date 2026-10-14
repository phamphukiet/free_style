// Quy ước scope → thư mục, điều kiện sẵn sàng, đường dẫn file legacy.

const fs = require("fs");
const path = require("path");
const { DIR_NAME } = require("./home");

const SCOPES = ["global", "workspace"];

const isValidScope = ({ scope }) => SCOPES.includes(scope);
const workspaceDir = ({ workspaceFolder }) =>
  path.join(workspaceFolder, DIR_NAME);
const sameDir = (a, b) =>
  path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();

function resolveDir({ scope, globalDir, workspaceFolder }) {
  return scope === "global" ? globalDir : workspaceDir({ workspaceFolder });
}

// workspace chỉ sẵn sàng khi project còn tồn tại và không trùng thư mục global
// (mở đúng thư mục home làm project thì 2 tầng sẽ ghi chung 1 file).
function isReady({ scope, globalDir, workspaceFolder }) {
  if (scope === "global") return true;
  if (!workspaceFolder || !fs.existsSync(workspaceFolder)) return false;
  return !sameDir(workspaceDir({ workspaceFolder }), globalDir);
}

/** @typedef {{ file: string, from?: "userData" }} Legacy */
// legacy.from === "userData": nhập 1 lần từ thư mục userData cũ (chỉ cho tầng global).
function resolveLegacyFile({ legacy, scope, dir }) {
  if (!legacy) return undefined;
  if (legacy.from !== "userData") return path.join(dir, legacy.file);
  if (scope !== "global") return undefined;
  const userData = require("electron").app.getPath("userData");
  return path.join(userData, legacy.file);
}

module.exports = {
  SCOPES,
  isValidScope,
  resolveDir,
  isReady,
  resolveLegacyFile,
};
