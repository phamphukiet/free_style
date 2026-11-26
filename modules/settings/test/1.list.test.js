// 1.list.test.js
// Kịch bản: user gõ cả câu, model đưa nguyên câu vào list → không khớp.
// So sánh list KHÔNG agent và list CÓ agent đơn giản hóa.
// Chạy (ở thư mục gốc project):  node modules/settings/test/1.list.test.js

const PROMPT = "chuyển theme sang đen";
const { API_KEY } = require("../../../secrets.local.js");
const MODEL = "gemini-3.5-flash";
// =========================================================

const { createWorld } = require("./_env");
const { createSettingsTool } = require("../backend/ai/tool");
const { createSimplifier } = require("../../../shared/command/simplify.js");
const {
  chatCompletion,
} = require("../../api/key/gemini/backend/gemini-client");
const { step, say, json } = require("./_show");

const size = (value) => JSON.stringify(value).length;

// Bọc chatCompletion để ghi lại câu agent trả về.
const makeAsk =
  ({ apiKey, record }) =>
  async ({ system, text }) => {
    record.raw = await chatCompletion(apiKey, text, MODEL, system);
    return record.raw;
  };

async function main() {
  const world = createWorld();
  try {
    step("1. Dữ liệu thật đang có");
    say(`tổng số setting: ${world.engine.list().length}`);

    step(`2. list: query = "${PROMPT}"`);
    const plain = await world.tool.execute({ action: "list", query: PROMPT });
    json(plain);
    say(`độ dài gửi cho model: ${size(plain)} ký tự`);

    step("3. list agent:");
        const apiKey = API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) return say("chưa có API_KEY → bỏ qua bước này");
    const record = {};
    const simplify = createSimplifier({ ask: makeAsk({ apiKey, record }) });
    const tool = createSettingsTool({ engine: world.engine, simplify });
    const smart = await tool.execute({ action: "list", query: PROMPT });
    say(
      `agent trả về: ${record.raw ?? "(không được gọi: list đã khớp thẳng, hoặc lỗi — xem dòng [Error])"}`,
    );
    json(smart);
    say(`độ dài gửi cho model: ${size(smart)} ký tự`);
  } catch (error) {
    console.error("\n💥 Test dừng vì lỗi bất ngờ:", error.stack);
    process.exitCode = 1;
  } finally {
    await world.cleanup();
  }
}

main();
