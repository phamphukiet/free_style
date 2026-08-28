// gemini-client.js
// Trách nhiệm duy nhất: gọi Google Gemini API (generateContent + listModels).

async function chatCompletion(apiKey, message, model, systemPrompt = "") {
  const modelId = model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  const body = { contents: [{ parts: [{ text: message }] }] };
  if (systemPrompt)
    body.systemInstruction = { parts: [{ text: systemPrompt }] };

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
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "(không có phản hồi)"
  );
}

// Gemini không trả timestamp tạo model như OpenAI, nên dùng số version
// trong id (VD: "gemini-2.5-flash" → 2.5) làm proxy độ mới để sắp xếp.
function extractVersion(id) {
  const match = id.match(/gemini-(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

async function listModels(apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Lỗi API Gemini (${response.status})`,
    );
  }

  const data = await response.json();
  return (data.models || [])
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => ({
      id: m.name.replace("models/", ""),
      version: extractVersion(m.name),
    }))
    .sort((a, b) => b.version - a.version || b.id.localeCompare(a.id)); // mới nhất trước, cùng version thì so tên
}

// Gemini yêu cầu type viết HOA (STRING, OBJECT...), còn tool-spec.js dùng
// JSON Schema chuẩn (chữ thường) để giữ tính di động sang provider khác.
function toGeminiSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const { type, properties, items, ...rest } = schema;
  const converted = { ...rest };
  if (type) converted.type = type.toUpperCase();
  if (properties) {
    converted.properties = Object.fromEntries(
      Object.entries(properties).map(([k, v]) => [k, toGeminiSchema(v)]),
    );
  }
  if (items) converted.items = toGeminiSchema(items);
  return converted;
}

function toGeminiTool(specs) {
  return {
    functionDeclarations: specs.map((spec) => ({
      name: spec.name,
      description: spec.description,
      parameters: toGeminiSchema(spec.parameters),
    })),
  };
}

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

    contents.push({
      role: "model",
      parts: [{ functionCall: call.functionCall }],
    });

    let result;
    try {
      result = await executeToolCall(
        call.functionCall.name,
        call.functionCall.args || {},
      );
    } catch (error) {
      result = { error: error.message };
    }

    // Gemini yêu cầu role "tool" (không phải "function") và response phải là
    // plain object — không được là array hay primitive.
    const responseObj =
      result !== null &&
      typeof result === "object" &&
      !Array.isArray(result)
        ? result
        : { result };
    contents.push({
      role: "tool",
      parts: [
        {
          functionResponse: {
            name: call.functionCall.name,
            response: responseObj,
          },
        },
      ],
    });
  }

  return "Đã vượt quá số lần gọi lệnh cho phép.";
}

module.exports = { chatCompletion, listModels, chatWithTools };
