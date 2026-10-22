// service.js
// Hợp đồng công khai CHỈ ĐỌC cho module main khác (capability service "settings").
// Dùng: getService({ id: "settings", needs: ["get"], fallback }).

function createSettingsService({ engine }) {
  return {
    get({ id, fallback } = {}) {
      try {
        return engine.inspect({ id }).value;
      } catch {
        return fallback;
      }
    },
    inspect: ({ id }) => engine.inspect({ id }),
    onDidChange: ({ listener }) => engine.onDidChange({ listener }),
  };
}

module.exports = { createSettingsService };
