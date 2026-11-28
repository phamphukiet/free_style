// outcome.js
// Hàm thuần: kết quả kiểm tra → bước kế tiếp. Lỗi không bao giờ thành "không có kết quả".
//   resolve: tìm đối tượng rồi chạy | retry: hỏi lại agent | chat: chuyển chat tự do

function outcomeOf({ result, attempt, maxRetry }) {
  if (result.ok) return { action: "resolve", reason: "valid" };
  if (result.kind === "none") return { action: "chat", reason: "null-command" };
  if (result.kind === "infra") {
    return {
      action: "chat",
      reason: `infra ${result.message}`,
      notice: `Bộ lọc lệnh tạm không dùng được: ${result.message}. Đã chuyển sang chat tự do.`,
    };
  }
  if (attempt < maxRetry) {
    return { action: "retry", reason: "fixable", message: result.message };
  }
  return {
    action: "chat",
    reason: `invalid-reply ${result.message}`,
    notice: "Chưa hiểu yêu cầu thành lệnh, đã chuyển sang chat tự do.",
  };
}

module.exports = { outcomeOf };
