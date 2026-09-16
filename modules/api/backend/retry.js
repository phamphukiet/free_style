const { RETRYABLE_STATUS, MAX_RETRIES, BASE_DELAY_MS } = require("./const");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, label = "") {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    if (!RETRYABLE_STATUS.has(response.status) || attempt === MAX_RETRIES) {
      return response;
    }
    const delay = BASE_DELAY_MS * 2 ** attempt;
    console.log(
      `[api-retry] ${label} lỗi HTTP ${response.status}, thử lại lần ${attempt + 1}/${MAX_RETRIES} sau ${delay}ms`,
    );
    await sleep(delay);
  }
}

module.exports = { fetchWithRetry };
