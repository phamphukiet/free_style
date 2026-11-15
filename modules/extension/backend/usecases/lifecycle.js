// lifecycle.js
// Vòng đời chạy 1 ext: đọc thông tin từ code, bật (publish setting + chạy), tắt, chạy lại.
// Dùng chung cho usecase bật/tắt, lưu code, crash, đổi setting.

const { expandSettings } = require("../domain/expand-settings");
const { clearError } = require("../domain/extension");

/** @param {{ repo, codeStore, runner, settings, catalog }} deps */
function createLifecycle({ repo, codeStore, runner, settings, catalog }) {
  const started = new Map(); // id -> JSON giá trị setting lúc chạy

  const valuesOf = ({ id, manifest }) =>
    settings.read({ extId: id, definitions: manifest.settings });

  async function inspect({ id, record }) {
    const { language } = record;
    const code = await codeStore.read({ id, language });
    try {
      const info = await runner.inspect({ language, code });
      const manifest = expandSettings({
        extId: id,
        name: info.name,
        settings: info.settings,
      });
      catalog.set({
        id,
        info: { name: info.name || id, manifest, error: null, code },
      });
      return { code, manifest };
    } catch (error) {
      const name = catalog.get({ id })?.name ?? id;
      catalog.set({
        id,
        info: { name, manifest: null, error: error.message, code },
      });
      throw error;
    }
  }

  async function launch({ id, record, code, manifest }) {
    const values = valuesOf({ id, manifest });
    try {
      await runner.start({
        id,
        language: record.language,
        code,
        settings: values,
      });
    } catch (error) {
      await deactivate({ id });
      throw error;
    }
    started.set(id, JSON.stringify(values));
    if (record.lastError) repo.save({ id, record: clearError({ record }) });
  }

  async function activate({ id }) {
    const record = repo.get({ id });
    const { code, manifest } = await inspect({ id, record });
    await launch({ id, record, code, manifest });
  }

  // Chạy lại với thông tin đã có, không nạp lại manifest.
  async function restart({ id }) {
    const record = repo.get({ id });
    const manifest = catalog.get({ id })?.manifest;
    if (!manifest) return activate({ id });
    const code = await codeStore.read({ id, language: record.language });
    return launch({ id, record, code, manifest });
  }

  async function deactivate({ id }) {
    started.delete(id);
    await runner.stop({ id });
  }

  // Event đổi setting phát cả khi mới publish: chỉ chạy lại khi giá trị thật sự khác.
  function needsRestart({ id }) {
    const manifest = catalog.get({ id })?.manifest;
    if (!manifest) return false;
    return JSON.stringify(valuesOf({ id, manifest })) !== started.get(id);
  }

  return { inspect, activate, restart, deactivate, needsRestart };
}

module.exports = { createLifecycle };
