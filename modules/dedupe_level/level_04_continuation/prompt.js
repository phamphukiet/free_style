// prompt.js
// Trách nhiệm duy nhất: sinh hướng dẫn bắt buộc model đánh dấu điểm dừng
// (HOÀN THÀNH/CẦN HỎI), để policy.js phân biệt "xong thật" vs "bị cắt
// giữa chừng do hết step budget". Chỉ module continuation biết marker này —
// provider (gemini-chat-with-tools.js) không cần biết, module tháo rời
// không ảnh hưởng nơi khác.

const { DONE_PREFIX, ASK_PREFIX } = require("./policy");

function buildContinuationGuide() {
  return (
    `Nếu trả lời cuối cùng đã HOÀN TẤT yêu cầu, bắt đầu bằng "${DONE_PREFIX}". ` +
    `Nếu cần hỏi lại người dùng trước khi tiếp tục, bắt đầu bằng "${ASK_PREFIX}". ` +
    `Nếu còn việc chưa gọi hết tool cần thiết, đừng thêm 2 tiền tố trên — ` +
    `hệ thống sẽ tự giao tiếp tục ở lượt kế mà không mất tiến độ (nhờ cache xuyên turn).`
  );
}

module.exports = { buildContinuationGuide };
