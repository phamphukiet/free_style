// gemini-tools.js
// Trách nhiệm duy nhất: chat CÓ tool-calling cho Gemini. toolSpecs đầu vào
// theo JSON Schema chữ thường (files/skill/rule tool-bridge) -> đổi sang
// dạng Gemini cần (type viết HOA) qua toGeminiSchema().

const { callGemini, extractText } = require("./gemini-client.js");
const { MAX_STEPS } = require("./const.js");

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
  const tools = toolSpecs.length
    ? [{ functionDeclarations: toDeclarations(toolSpecs) }]
    : undefined;

  for (let step = 0; step < MAX_STEPS; step++) {
    const body = { contents, tools };
    if (systemPrompt)
      body.systemInstruction = { parts: [{ text: systemPrompt }] };
    const data = await callGemini(apiKey, model, body);
    const parts = data.candidates?.[0]?.content?.parts || [];
    const call = parts.find((p) => p.functionCall);

    if (!call) return extractText(data); // model trả lời thẳng, không gọi tool

    contents.push({ role: "model", parts });
    const result = await executeToolCall(
      call.functionCall.name,
      call.functionCall.args || {},
    );
    contents.push({
      role: "function",
      parts: [
        {
          functionResponse: {
            name: call.functionCall.name,
            response: { result },
          },
        },
      ],
    });
  }
  return "(đã vượt quá số bước gọi tool cho phép)";
}

module.exports = { chatWithTools };
