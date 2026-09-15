// resume.js
// Khi 1 lượt gọi AI hết step budget giữa chừng, tự gọi thêm lượt kế tiếp
// với CÙNG sessionId — nhờ level_02_cache, lượt sau không khám phá lại từ đầu,
// step budget dồn hết cho việc thật còn thiếu.

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
  console.log("[level_04_continuation] bắt đầu lượt gốc");
  let content = await toolSend(apiKey, firstMessage, model, buildOpts());
  let attempts = 0;

  while (needsContinuation(content) && attempts < MAX_RESUME) {
    attempts++;
    console.log(
      `[level_04_continuation] chưa xong (không có HOÀN THÀNH:/CẦN HỎI:) → tự resume lần ${attempts}/${MAX_RESUME}`,
    );
    content = await toolSend(
      apiKey,
      buildContinueMessage(content),
      model,
      buildOpts(),
    );
  }

  if (needsContinuation(content)) {
    console.log(
      `[level_04_continuation] vẫn dở sau ${MAX_RESUME} lần resume, trả về nguyên trạng`,
    );
  } else {
    console.log(`[level_04_continuation] hoàn tất sau ${attempts} lần resume`);
  }

  return {
    content,
    resumedTimes: attempts,
    incomplete: needsContinuation(content),
  };
}

module.exports = { runWithContinuation, MAX_RESUME };
