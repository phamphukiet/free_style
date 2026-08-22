// connector.js
// Trách nhiệm duy nhất: giao tiếp mạng với nền tảng skill — test kết nối
// trước khi cho lưu vào dropdown, và tìm kiếm skill trên nền tảng đó.
// Quy ước tối thiểu mọi nền tảng phải hỗ trợ: GET {endpoint}/search?q=...

function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Kết nối quá thời gian chờ")), ms),
    ),
  ]);
}

async function testConnection(endpoint) {
  try {
    const res = await withTimeout(fetch(endpoint));
    if (!res.ok)
      return {
        success: false,
        message: `Nền tảng phản hồi lỗi (${res.status})`,
      };
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Chuẩn hoá kết quả nền tảng về đúng shape catalog dùng — nền tảng thiếu
// field nào thì để null, KHÔNG throw, để 1 nền tảng lỗi không chặn nền tảng khác.
function normalize(raw, platformId) {
  return {
    id: raw.id || raw.sourceUrl,
    platformId,
    name: raw.name || "(không tên)",
    sourceUrl: raw.sourceUrl || raw.url,
    version: raw.version || null,
    rating: typeof raw.rating === "number" ? raw.rating : null,
    downloads: typeof raw.downloads === "number" ? raw.downloads : null,
    installOptions: Array.isArray(raw.installOptions)
      ? raw.installOptions
      : null,
    contentUrl: raw.contentUrl || raw.sourceUrl,
  };
}

async function searchOnPlatform(platform, query) {
  try {
    const res = await withTimeout(
      fetch(`${platform.endpoint}/search?q=${encodeURIComponent(query)}`),
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items || [];
    return items.map((raw) => normalize(raw, platform.id));
  } catch (error) {
    console.warn(`[skill] Nền tảng "${platform.name}" lỗi:`, error.message);
    return []; // 1 nền tảng lỗi không được làm hỏng cả kết quả tìm kiếm
  }
}

module.exports = { testConnection, searchOnPlatform };
