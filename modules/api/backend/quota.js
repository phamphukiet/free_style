// quota.js
// Trách nhiệm duy nhất: nhận biết lỗi hết hạn mức (HTTP 429) của Gemini từ body lỗi
// chuẩn google.rpc, phân loại và dựng thông báo. Mọi thông tin lấy từ phản hồi của API.

class QuotaError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = "QuotaError";
    this.code = "QUOTA_EXCEEDED";
    this.kind = kind; // "no_access" | "daily" | "minute" | "unknown"
  }
}

const findDetail = (body, type) =>
  (body?.error?.details || []).find((d) => d["@type"]?.endsWith(type));

function classify(violations) {
  const ids = violations.map((v) => v.quotaId || "");
  if (violations.some((v) => v.quotaValue === "0")) return "no_access";
  if (ids.some((id) => id.includes("PerDay"))) return "daily"; // ưu tiên: chờ phút cũng vô ích
  if (ids.some((id) => id.includes("PerMinute"))) return "minute";
  return "unknown";
}

function retrySeconds(body) {
  const delay = findDetail(body, "RetryInfo")?.retryDelay; // VD "34s"
  const inMessage = /retry in ([\d.]+)s/i.exec(body?.error?.message || "")?.[1];
  const seconds = parseFloat(delay ?? inMessage);
  return Number.isFinite(seconds) ? Math.ceil(seconds) : 0;
}

function describe(kind, model, seconds) {
  const wait = seconds ? ` Thử lại sau ~${seconds}s.` : "";
  return {
    no_access: `Model "${model}" không có hạn mức ở gói API hiện tại (hạn mức = 0). Đổi model hoặc bật thanh toán.`,
    daily: `Hết hạn mức NGÀY của "${model}". Reset lúc 0h giờ Pacific (~14–15h VN). Đổi key cùng project không có tác dụng.`,
    minute: `Vượt hạn mức PHÚT (request hoặc token) của "${model}".${wait}`,
    unknown: `Gemini báo vượt hạn mức (phút/ngày/chi tiêu).${wait}`,
  }[kind];
}

function toQuotaError(body) {
  const violations = findDetail(body, "QuotaFailure")?.violations || [];
  const kind = classify(violations);
  const model = violations[0]?.quotaDimensions?.model || "model hiện tại";
  return new QuotaError(describe(kind, model, retrySeconds(body)), kind);
}

// Giữa vòng lặp, tool đã chạy -> trả kết quả dở dang thay vì ném lỗi. Ngược lại trả null.
function partialOnQuota(error, executed) {
  if (error.code !== "QUOTA_EXCEEDED" || executed === 0) return null;
  return {
    content: `${error.message}\n\nĐã chạy ${executed} lần gọi tool trước khi dừng; các thay đổi đó vẫn có hiệu lực.`,
    stopReason: "quota",
    quotaKind: error.kind,
  };
}

module.exports = { QuotaError, toQuotaError, partialOnQuota };
