// connector.js
// Chỉ gọi adapter search THẬT (đăng ký ở platforms/index.js) — không còn
// test/fetch URL tuỳ ý theo quy ước /search?q=, vì đa số website là trang
// HTML chứ không phải API JSON (bug gốc: skills.sh).

const { getAdapter } = require("./platforms");

async function searchOnPlatform(platform, query) {
  const adapter = getAdapter(platform.type);
  if (!adapter) return []; // dữ liệu cũ còn sót platform lạ → bỏ qua an toàn
  try {
    return await adapter.search(query);
  } catch (error) {
    console.warn(`[skill] Nền tảng "${platform.name}" lỗi:`, error.message);
    return [];
  }
}

module.exports = { searchOnPlatform };
