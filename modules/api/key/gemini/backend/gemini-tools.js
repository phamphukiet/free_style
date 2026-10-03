// gemini-tools.js
// Trách nhiệm duy nhất: chat CÓ tool-calling cho Gemini. toolSpecs đầu vào
// theo JSON Schema chữ thường (files/skill/rule tool-bridge) -> đổi sang
// dạng Gemini cần (type viết HOA) qua toGeminiSchema().

const { callGemini, extractText } = require("./gemini-client.js");
// Thay dòng import MAX_STEPS bằng:
const { partialOnQuota } = require("./quota.js");
const {
  runCalls,
  toResponseParts,
  createProgressTracker,
  stalledResult,
} = require("./tool-steps.js");

// --- log chẩn đoán (xoá khối này + các dòng "// LOG" là gỡ sạch) ---
const clip = (v, n = 300) => {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  if (!s || s.length <= n) return s;
  return `${s.slice(0, Math.floor(n * 0.6))} … ${s.slice(-Math.floor(n * 0.4))} (${s.length} ký tự)`;
};

function logStep(step, data, parts) {
  const calls = parts.filter((p) => p.functionCall).map((p) => p.functionCall);
  const text = parts.map((p) => p.text || "").join("");
  console.log(
    `[gemini] step ${step} <- finish=${data.candidates?.[0]?.finishReason ?? "NONE"}`,
    `| calls(${calls.length})=${calls.length ? clip(calls) : "-"}`,
    `| text=${clip(text, 200) || "-"}`,
    data.promptFeedback ? `| feedback=${clip(data.promptFeedback)}` : "",
  );
}

function toGeminiSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const out = { ...schema, type: (schema.type || "object").toUpperCase() };
  if (schema.properties) {
    out.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [k, toGeminiSchema(v)]),
    );
  }
  if (schema.items) out.items = toGeminiSchema(schema.items);
  return out;
}

function toDeclarations(toolSpecs) {
  return toolSpecs.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: toGeminiSchema(t.parameters),
  }));
}

async function chatWithTools(apiKey, message, model, opts = {}) {
  const { systemPrompt = "", toolSpecs = [], executeToolCall } = opts;
  const contents = [{ role: "user", parts: [{ text: message }] }];
  console.log(
    `[gemini] >> model=${model} tools=[${toolSpecs.map((t) => t.name)}] msg=${clip(message)} | system=${clip(systemPrompt, 500)}`,
  );
  const tools = toolSpecs.length
    ? [{ functionDeclarations: toDeclarations(toolSpecs) }]
    : undefined;
  const tracker = createProgressTracker();
  let executed = 0;

  for (let step = 0; ; step++) {
    const body = { contents, tools };
    if (systemPrompt)
      body.systemInstruction = { parts: [{ text: systemPrompt }] };

    let data;
    try {
      data = await callGemini(apiKey, model, body);
    } catch (error) {
      const partial = partialOnQuota(error, executed);
      if (partial) return partial;
      throw error;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    logStep(step, data, parts);
    const calls = parts.filter((p) => p.functionCall);
    if (calls.length === 0) return extractText(data);

    contents.push({ role: "model", parts });
    const done = await runCalls(calls, executeToolCall);
    done.forEach((c) => console.log(`[gemini] step ${step} tool ${c.name} -> ${clip(c.result)}`));
    executed += done.length;
    if (tracker.isStalled(done)) return stalledResult(executed);
    contents.push({ role: "function", parts: toResponseParts(done) });
  }
}

module.exports = { chatWithTools };
