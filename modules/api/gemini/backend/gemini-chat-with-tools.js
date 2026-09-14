const { toGeminiTool } = require("./gemini-tool-schema");

const MAX_STEPS = 4;

const LOOP_GUIDE =
  "Quy tắc dùng tool: sau mỗi kết quả, tự đánh giá ngay trong lượt đó. " +
  'Nếu đã đủ để hoàn thành yêu cầu, trả lời text bắt đầu bằng "HOÀN THÀNH:" và dừng, ' +
  "không gọi thêm tool. Nếu cần hỏi người dùng để làm rõ, trả lời text bắt đầu bằng " +
  '"CẦN HỎI:" và dừng. Chỉ gọi tool tiếp khi chắc chắn còn việc rõ ràng phải làm. ' +
  "Không đọc lại file/folder đã đọc trong cùng lượt này.";

async function chatWithTools(
  apiKey,
  message,
  model,
  { systemPrompt, toolSpecs, executeToolCall } = {},
) {
  const modelId = model || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  const tools = [toGeminiTool(toolSpecs)];
  const contents = [{ role: "user", parts: [{ text: message }] }];
  const fullPrompt = [systemPrompt, LOOP_GUIDE].filter(Boolean).join("\n\n");
  const systemInstruction = fullPrompt
    ? { parts: [{ text: fullPrompt }] }
    : undefined;

  for (let step = 0; step < MAX_STEPS; step++) {
    const isLastStep = step === MAX_STEPS - 1;
    const body = { contents, systemInstruction };
    if (!isLastStep) body.tools = tools; // bước cuối: ép trả lời text, không cho gọi tool nữa

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err?.error?.message || `Lỗi API Gemini (${response.status})`,
      );
    }
    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const call = parts.find((p) => p.functionCall);
      console.log(
        `[gemini-tools][${callId}] bắt đầu lượt mới`,
        new Error().stack,
      );
    if (!call)
      return parts.map((p) => p.text || "").join("") || "(không có phản hồi)";

    console.log(
      `[gemini-tools][${callId}] step ${step}: gọi "${call.functionCall.name}"`,
      call.functionCall.args,
    );
    contents.push({ role: "model", parts: [call] });

    let result;
    try {
      result = await executeToolCall(
        call.functionCall.name,
        call.functionCall.args || {},
      );
    } catch (error) {
      result = { error: error.message };
      console.log(`[gemini-tools] step ${step}: lỗi`, error.message);
    }

    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: { name: call.functionCall.name, response: result },
        },
      ],
    });
  }

  return "(không có phản hồi)"; // không còn tới được đây — bước cuối luôn ép trả text
}

module.exports = { chatWithTools };
