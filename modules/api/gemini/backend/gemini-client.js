// gemini-client.js
// Trách nhiệm duy nhất: gọi Google Gemini API (generateContent + listModels).

async function chatCompletion(apiKey, message, model) {
  const modelId = model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
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

module.exports = { chatCompletion, listModels };
