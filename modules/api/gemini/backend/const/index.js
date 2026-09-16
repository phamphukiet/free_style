const DEFAULT_MODEL = "gemini-2.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const MAX_STEPS = 4;

function generateContentUrl(model, apiKey) {
  return `${API_BASE}/models/${model || DEFAULT_MODEL}:generateContent?key=${apiKey}`;
}

function listModelsUrl(apiKey) {
  return `${API_BASE}/models?key=${apiKey}`;
}

module.exports = {
  DEFAULT_MODEL,
  API_BASE,
  MAX_STEPS,
  generateContentUrl,
  listModelsUrl,
};
