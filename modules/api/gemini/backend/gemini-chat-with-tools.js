const { toGeminiTool } = require("./gemini-tool-schema");

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
  const systemInstruction = systemPrompt
    ? { parts: [{ text: systemPrompt }] }
    : undefined;

  for (let step = 0; step < 4; step++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, tools, systemInstruction }),
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

    if (!call)
      return parts.map((p) => p.text || "").join("") || "(không có phản hồi)";

    contents.push({ role: "model", parts: [call] });

    let result;
    try {
      result = await executeToolCall(
        call.functionCall.name,
        call.functionCall.args || {},
      );
    } catch (error) {
      result = { error: error.message };
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

  return "Đã vượt quá số lần gọi lệnh cho phép.";
}

module.exports = { chatWithTools };
