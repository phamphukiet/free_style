// gemini-client.js
// Trách nhiệm duy nhất: gọi Gemini generateContent (không tool) + listModels.
// Chat CÓ tool nằm ở gemini-tools.js, không lặp code gọi API ở đây.

const { generateContentUrl, listModelsUrl } = require("./const.js");

async function callGemini(apiKey, model, body) {
  const res = await fetch(generateContentUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Lỗi API Gemini (${res.status})`);
  }
  return res.json();
}

function extractText(data) {
  const parts = data.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("") || "(không có phản hồi)";
}

async function chatCompletion(apiKey, message, model, systemPrompt = "") {
  const body = { contents: [{ role: "user", parts: [{ text: message }] }] };
  if (systemPrompt)
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  const data = await callGemini(apiKey, model, body);
  return extractText(data);
}

async function listModels(apiKey) {
  const res = await fetch(listModelsUrl(apiKey));
  if (!res.ok) return [];
  const data = await res.json();
  return (data.models || [])
    .filter((m) =>
      (m.supportedGenerationMethods || []).includes("generateContent"),
    )
    .map((m) => ({ id: m.name.replace("models/", ""), name: m.displayName }));
}

module.exports = { callGemini, extractText, chatCompletion, listModels };
