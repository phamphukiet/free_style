// modules/runner/backend/ipc.js
// Trách nhiệm duy nhất: IPC cho runner. Logic thật ở languages/ và runtime/.
const { ipcMain } = require("electron");
const languages = require("./languages");
const { resolveRuntime } = require("./runtime/resolve");
const { installRuntime } = require("./runtime/install");

const installing = new Set(); // chống bấm cài 2 lần cùng 1 ngôn ngữ

async function describe(filePath) {
  if (typeof filePath !== "string") return { status: "unsupported" };
  const lang = languages.byFile(filePath);
  if (!lang) return { status: "unsupported" };
  if (lang.mode !== "terminal") return { status: lang.mode, label: lang.label };

  const runtime = await resolveRuntime(lang);
  if (runtime)
    return {
      status: "ready",
      exe: runtime.exe,
      args: lang.buildArgs(filePath),
    };

  const spec = lang.download?.[process.platform];
  return {
    status: spec ? "needs-setup" : "manual",
    languageId: lang.id,
    label: lang.label,
    sizeMB: spec?.sizeMB,
  };
}

async function install(event, languageId) {
  const lang = languages.byId(languageId);
  if (!lang) return { ok: false, message: "Ngôn ngữ không tồn tại." };
  if (installing.has(languageId))
    return { ok: false, message: "Đang cài đặt, vui lòng đợi." };

  installing.add(languageId);
  const send = (info) => {
    if (!event.sender.isDestroyed())
      event.sender.send("runner:progress", { languageId, ...info });
  };
  try {
    await installRuntime(lang, send);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error.message };
  } finally {
    installing.delete(languageId);
  }
}

function registerRunnerIpc() {
  ipcMain.handle("runner:resolve", (event, filePath) => describe(filePath));
  ipcMain.handle("runner:install", install);
}

module.exports = { registerRunnerIpc };