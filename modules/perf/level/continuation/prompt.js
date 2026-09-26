// prompt.js
const { DONE_PREFIX, ASK_PREFIX } = require("./policy");

function buildContinuationGuide() {
  return (
    `Nếu trả lời cuối cùng đã HOÀN TẤT yêu cầu, bắt đầu bằng "${DONE_PREFIX}". ` +
    `Nếu cần hỏi lại người dùng trước khi tiếp tục, bắt đầu bằng "${ASK_PREFIX}". ` +
    `Nếu còn việc chưa gọi hết tool cần thiết, đừng thêm 2 tiền tố trên — ` +
    `hệ thống sẽ tự giao tiếp tục ở lượt kế mà không mất tiến độ.`
  );
}

module.exports = { buildContinuationGuide };
