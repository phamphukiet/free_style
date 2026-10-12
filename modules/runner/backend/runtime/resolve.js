// modules/runner/backend/runtime/resolve.js
// Trách nhiệm duy nhất: tìm file chạy của 1 ngôn ngữ (PATH máy → bản app tự cài).
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { app } = require("electron");

const runtimeDir = (id) => path.join(app.getPath("userData"), "runtimes", id);
const managedExe = (lang) => path.join(runtimeDir(lang.id), lang.exeName);

// Bỏ stub Microsoft Store (WindowsApps): gõ "python" sẽ mở Store thay vì chạy.
function findOnPath(command) {
  const finder = process.platform === "win32" ? "where" : "which";
  return new Promise((resolve) => {
    execFile(finder, [command], { windowsHide: true }, (err, stdout) => {
      if (err) return resolve(null);
      const hit = stdout
        .split(/\r?\n/)
        .map((s) => s.trim())
        .find((p) => p && !p.includes("\\WindowsApps\\"));
      resolve(hit || null);
    });
  });
}

async function resolveRuntime(lang) {
  const system = await findOnPath(lang.systemCommand);
  if (system) return { source: "system", exe: system };
  const managed = managedExe(lang);
  if (fs.existsSync(managed)) return { source: "managed", exe: managed };
  return null;
}

module.exports = { resolveRuntime, runtimeDir, managedExe };
