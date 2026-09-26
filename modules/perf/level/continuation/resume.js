// resume.js
const { needsContinuation } = require("./policy");

const MAX_RESUME = 2;

function buildContinueMessage(prevContent) {
  return [
    "Lượt trước bạn dừng giữa chừng (hết ngân sách bước) với nội dung sau:",
    typeof prevContent === "string" ? prevContent : JSON.stringify(prevContent),
    "",
    'Tiếp tục hoàn thành yêu cầu ban đầu. Nếu đã xong, trả lời bắt đầu bằng "HOÀN THÀNH:". Nếu cần hỏi thêm, bắt đầu bằng "CẦN HỎI:".',
  ].join("\n");
}

async function runWithContinuation(
  toolSend,
  apiKey,
  model,
  buildOpts,
  firstMessage,
) {
  let content = await toolSend(apiKey, firstMessage, model, buildOpts());
  let attempts = 0;

  while (needsContinuation(content) && attempts < MAX_RESUME) {
    attempts++;
    content = await toolSend(
      apiKey,
      buildContinueMessage(content),
      model,
      buildOpts(),
    );
  }

  return {
    content,
    resumedTimes: attempts,
    incomplete: needsContinuation(content),
  };
}

module.exports = { runWithContinuation, MAX_RESUME };