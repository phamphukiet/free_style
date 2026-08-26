// add-platform.js
// "Thêm nền tảng" = bật 1 adapter đã biết (github, npm...) — không còn nhận
// URL tuỳ ý. Muốn tải 1 skill cụ thể từ nguồn không có adapter → dùng
// "Nhập link skill" (import-link, tải thẳng 1 file, không cần search).

const platformsStore = require("./platforms-store");
const { matchAdapter } = require("./platforms");

async function addPlatform(raw) {
  const adapter = matchAdapter(raw.trim());
  if (!adapter) {
    throw new Error(
      'Chưa hỗ trợ nền tảng này. Hiện chỉ có: "github", "npm". Muốn tải 1 skill cụ thể từ nguồn khác, dùng "Nhập link skill".',
    );
  }
  return platformsStore.save({ ...adapter.definition });
}

module.exports = { addPlatform };
