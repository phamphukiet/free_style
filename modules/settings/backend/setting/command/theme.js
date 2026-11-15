// theme.js
// Lệnh áp dụng theme từ bảng 6 màu. Ext gọi: commands.settings.applyTheme({ bg, ... }).
// Chạy ở main, đi qua tool "settings" nên vẫn validate + lưu + phát effect như user đổi tay.

const {
  getCapability,
} = require("../../../../../shared/core/capability-registry.js");

const THEME_ID = "appearance.theme";
const KEYS = ["bg", "bgElevated", "text", "textMuted", "accent", "border"];
const HEX = /^[0-9a-f]{6}$/;

function seedOf(args) {
  const seed = Object.fromEntries(
    KEYS.map((key) => [key, String(args[key]).replace("#", "").toLowerCase()]),
  );
  const bad = KEYS.filter((key) => !HEX.test(seed[key]));
  if (bad.length > 0) throw new Error(`màu sai: ${bad.join(", ")}`);
  return seed;
}

function addPresetOnce({ tool, presetId, seed }) {
  try {
    tool.execute({
      action: "addPreset",
      id: THEME_ID,
      presetId,
      label: `Ext ${seed.accent}`,
      data: seed,
    });
  } catch (error) {
    if (!String(error.message).includes("đã tồn tại")) throw error;
  }
}

function applyTheme(args) {
  const tool = getCapability({ kind: "tool", id: "settings" });
  if (!tool) throw new Error("Module settings chưa sẵn sàng");
  const seed = seedOf(args);
  const presetId = `ext-${seed.accent}`;
  addPresetOnce({ tool, presetId, seed });
  tool.execute({ action: "set", id: THEME_ID, value: presetId });
  return true;
}

module.exports = {
  applyTheme: {
    label: "Áp dụng theme từ bảng 6 màu hex",
    runIn: "main",
    args: Object.fromEntries(KEYS.map((key) => [key, "string"])),
    run: applyTheme,
  },
};
