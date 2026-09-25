// prompt.test.js — gửi prompt "prompt" thẳng vào chat backend (không qua UI),
// ghi nhận phản hồi hoặc lỗi phát sinh. Chạy độc lập: `node prompt.test.js`
// hoặc require("./prompt.test.js").run() từ nơi khác.

const path = require("path");
const { runCase, assert } = require("../lib/kit");
const { withElectronMock } = require("../lib/with-electron-mock");
const HANDLER_PATH = path.resolve(
  __dirname,
  "../../../modules/chat/backend/send/handle-send.js",
);

async function callPrompt(note) {
  return withElectronMock(async () => {
    delete require.cache[require.resolve(HANDLER_PATH)]; // đảm bảo load lại dưới mock

    let handleSend;
    try {
      ({ handleSend } = require(HANDLER_PATH));
    } catch (error) {
      note(`${error.message}`);
    }

    assert(
      typeof handleSend === "function",
      "handle-send.js thiếu export handleSend()",
    );

    const reply = await handleSend(
      { message: "hello", sessionId: null, agentId: null },
      () => {},
    );

    assert(
      reply && typeof reply === "object",
      "handleSend() không trả về object",
    );
    assert("ok" in reply, 'Phản hồi thiếu field "ok"');

    if (reply.ok) {
      note(`Chat trả lời OK: ${String(reply.content).slice(0, 100)}`);
    } else {
      note(`Chat từ chối/lỗi: [${reply.error?.code}] ${reply.error?.message}`);
    }

    return reply;
  });
}

async function run() {
  return runCase(".agents/test/chat/prompt.test.js", callPrompt);
}

if (require.main === module) {
  run().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  });
}

module.exports = { run };
