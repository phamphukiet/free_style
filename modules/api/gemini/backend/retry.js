// retry.js
// Trách nhiệm duy nhất: retry với backoff khi Gemini trả 503/429 (quá tải tạm thời).

const RETRYABLE_STATUS = new Set([503, 429]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, label = "") {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    if (!RETRYABLE_STATUS.has(response.status) || attempt === MAX_RETRIES) {
      return response; // lỗi không retry được (hoặc hết lượt) — trả về để nơi gọi tự đọc body & throw
    }
    const delay = BASE_DELAY_MS * 2 ** attempt;
    console.log(
      `[gemini-retry] ${label} lỗi HTTP ${response.status}, thử lại lần ${attempt + 1}/${MAX_RETRIES} sau ${delay}ms`,
    );
    await sleep(delay);
  }
}

module.exports = { fetchWithRetry };
