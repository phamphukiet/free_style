// openai-client.js
// Trách nhiệm duy nhất: gọi OpenAI Chat Completions API.
// Dùng chung cho chatgpt và codex (khác nhau ở tên model).

async function chatCompletion(apiKey, message, model, systemPrompt = "") {
  const messages = systemPrompt
    ? [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ]
    : [{ role: "user", content: message }];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Lỗi API OpenAI (${response.status})`,
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "(không có phản hồi)";
}

// Lọc model dùng được cho chat completions, loại bỏ embedding/whisper/tts/dall-e...
function isChatModel(id) {
  const excluded = ["embedding", "whisper", "tts", "dall-e", "moderation", "davinci-002", "babbage-002", "audio", "realtime", "transcribe"];
  if (excluded.some((x) => id.includes(x))) return false;
  return id.startsWith("gpt-") || id.startsWith("o1") || id.startsWith("o3") || id.startsWith("o4") || id.startsWith("chatgpt-");
}

async function listModels(apiKey) {
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Lỗi API OpenAI (${response.status})`);
  }

  const data = await response.json();
  return (data.data || [])
    .filter((m) => isChatModel(m.id))
    .sort((a, b) => b.created - a.created) // mới nhất trước
    .map((m) => ({ id: m.id, created: m.created }));
}

module.exports = { chatCompletion, listModels };
