const { toGeminiTool } = require("./gemini-tool-schema");
const { fetchWithRetry } = require("./retry");
const { DEFAULT_MODEL, generateContentUrl, MAX_STEPS } = require("./const");

async function runOneCall(call, executeToolCall, step) {
  const { name, args = {} } = call.functionCall;
  try {
    const result = await executeToolCall(name, args);
    console.log(
      `[gemini-tools] step ${step + 1}: tool "${name}" trả kết quả OK${result?._cacheNote ? " (từ cache)" : result?._dedupeNote ? " (dedupe trùng)" : ""}`,
    );
    return { functionResponse: { name, response: result } };
  } catch (error) {
    console.log(
      `[gemini-tools] step ${step + 1}: tool "${name}" lỗi`,
      error.message,
    );
    return { functionResponse: { name, response: { error: error.message } } };
  }
}

async function chatWithTools(
  apiKey,
  message,
  model,
  { systemPrompt, toolSpecs, executeToolCall } = {},
) {
  const url = generateContentUrl(model || DEFAULT_MODEL, apiKey);
  const tools = [toGeminiTool(toolSpecs)];
  const contents = [{ role: "user", parts: [{ text: message }] }];
  const fullPrompt = [systemPrompt].filter(Boolean).join("\n\n");
  const systemInstruction = fullPrompt
    ? { parts: [{ text: fullPrompt }] }
    : undefined;

  for (let step = 0; step < MAX_STEPS; step++) {
    const body = { contents, systemInstruction, tools };
    console.log(`[gemini-tools] step ${step + 1}/${MAX_STEPS} → gửi request`);

    const response = await fetchWithRetry(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      `step ${step + 1}`,
    );
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
    const calls = parts.filter((p) => p.functionCall);
    if (calls.length === 0) {
      const text =
        parts.map((p) => p.text || "").join("") || "(không có phản hồi)";
      console.log(
        `[gemini-tools] step ${step + 1}: model trả TEXT (dừng loop) → "${text.slice(0, 80)}${text.length > 80 ? "..." : ""}"`,
      );
      return text;
    }
    console.log(
      `[gemini-tools] step ${step + 1}: model gọi ${calls.length} tool: ${calls.map((c) => c.functionCall.name).join(", ")}`,
    );
    contents.push({ role: "model", parts: calls });

    const responseParts = await Promise.all(
      calls.map((call) => runOneCall(call, executeToolCall, step)),
    );
    contents.push({ role: "user", parts: responseParts });
  }

  console.log(
    `[gemini-tools] hết ${MAX_STEPS} step, chưa có text trả lời cuối`,
  );
  return "(không có phản hồi)";
}

module.exports = { chatWithTools };
