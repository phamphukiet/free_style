// file-limit.js
// Lấy giới hạn MB theo provider — optional: nếu modules/api bị xoá hoặc
// provider không đăng ký handler, trả về giá trị mặc định thay vì crash.

const DEFAULT_FILE_LIMIT_MB = 100;

export async function getFileLimitMB(providerId) {
  if (!providerId || !window.api?.providers?.getFileLimit) {
    return DEFAULT_FILE_LIMIT_MB;
  }
  try {
    const result = await window.api.providers.getFileLimit(providerId);
    return typeof result === "number" ? result : DEFAULT_FILE_LIMIT_MB;
  } catch {
    return DEFAULT_FILE_LIMIT_MB; // provider bị xoá / không có handler
  }
}
