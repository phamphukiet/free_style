// theme-ai.js
// Cho AI "sáng tạo" theme mới bằng seed 6 màu (dễ điền), lưu thành 1 preset
// cho "appearance.theme" — CÙNG cơ chế nút "+ Mẫu" (commands.addPreset),
// chỉ khác là AI tự gọi qua tool-calling. Việc giải nén seed → đủ biến CSS
// làm ở theme-apply.js (nơi thực sự set CSS variable) — file này không lặp
// lại logic đó, chỉ lưu + set giá trị (đúng quyền "chỉ đổi tham số" của root).

const aiBridge = require("../../../backend/ai-bridge");
const commands = require("../../../backend/commands");
const { notifyChanged } = require("../../../backend/notify");

const SEED_KEYS = ["bg", "bgElevated", "text", "textMuted", "accent", "border"];

aiBridge.registerAction(
  "createTheme",
  ({ id, label, params }) => {
    const seed = params || {};
    if (!id || !label) throw new Error("createTheme cần id và label");
    const missing = SEED_KEYS.filter((k) => !seed[k]);
    if (missing.length) throw new Error(`params thiếu: ${missing.join(", ")}`);

    const value = JSON.stringify({ id, ...seed });
    commands.addPreset("appearance.theme", { value, label });
    commands.setValue("appearance.theme", value);
    notifyChanged("appearance.theme", value);
    return { id, label, applied: true };
  },
  `createTheme: tạo + áp dụng ngay theme màu mới cho "appearance.theme" khi ` +
    `3 mẫu có sẵn (dark/light/monokai) không hợp yêu cầu. Gọi với id, label, ` +
    `params:{${SEED_KEYS.join(",")}} — mỗi giá trị là mã hex KHÔNG "#", chọn ` +
    `màu phù hợp mô tả (VD "chống ánh sáng xanh" → tông ấm vàng/cam/nâu, tránh xanh dương).`,
);

module.exports = {};
