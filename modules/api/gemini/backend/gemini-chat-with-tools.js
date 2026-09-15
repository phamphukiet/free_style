const { toGeminiTool } = require("./gemini-tool-schema");

const MAX_STEPS = 4;

const LOOP_GUIDE = "";
  // "Quy tắc dùng tool: sau mỗi kết quả, tự đánh giá ngay trong lượt đó. " +
  // 'Nếu đã đủ để hoàn thành yêu cầu, trả lời text bắt đầu bằng "HOÀN THÀNH:" và dừng, ' +
  // "không gọi thêm tool. Nếu cần hỏi người dùng để làm rõ, trả lời text bắt đầu bằng " +
  // '"CẦN HỎI:" và dừng. Chỉ gọi tool tiếp khi chắc chắn còn việc rõ ràng phải làm. ' +
  // "Không đọc lại file/folder đã đọc trong cùng lượt này.";

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

    console.log(
      `[gemini-tools] step ${step + 1}/${MAX_STEPS} → gửi request${isLastStep ? " (bước cuối, ép trả text)" : ""}`,
    );

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.log(
        `[gemini-tools] step ${step + 1}: lỗi HTTP ${response.status}`,
      );
      throw new Error(
        err?.error?.message || `Lỗi API Gemini (${response.status})`,
      );
    }
    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const call = parts.find((p) => p.functionCall);
    if (!call) {
      const text =
        parts.map((p) => p.text || "").join("") || "(không có phản hồi)";
      console.log(
        `[gemini-tools] step ${step + 1}: model trả TEXT (dừng loop) → "${text.slice(0, 80)}${text.length > 80 ? "..." : ""}"`,
      );
      return text;
    }
    console.log(
      `[gemini-tools] step ${step + 1}: model gọi tool "${call.functionCall.name}" args=${JSON.stringify(call.functionCall.args || {})}`,
    );
    contents.push({ role: "model", parts: [call] });

    let result;
    try {
      result = await executeToolCall(
        call.functionCall.name,
        call.functionCall.args || {},
      );
      console.log(
        `[gemini-tools] step ${step + 1}: tool trả kết quả OK${result?._cacheNote ? " (từ cache)" : result?._dedupeNote ? " (dedupe trùng)" : ""}`,
      );
    } catch (error) {
      result = { error: error.message };
      console.log(`[gemini-tools] step ${step + 1}: lỗi`, error.message);
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

  console.log(
    `[gemini-tools] hết ${MAX_STEPS} step, chưa có text trả lời cuối`,
  );
  return "(không có phản hồi)";
}

module.exports = { chatWithTools };
