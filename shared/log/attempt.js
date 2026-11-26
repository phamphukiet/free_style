// attempt.js
// Chạy run, bắt lỗi đồng bộ lẫn bất đồng bộ (Promise reject). Lỗi → báo onError rồi trả fallback.
// Không bao giờ ném lỗi ra ngoài; run luôn chạy, không phụ thuộc việc log có bật hay không.

const isThenable = (value) => typeof value?.then === "function";

/** @param {{ run: Function, fallback?: any, onError: (error: any) => void }} args */
function attempt({ run, fallback, onError }) {
  const recover = (error) => {
    onError(error);
    return fallback;
  };
  try {
    const result = run();
    return isThenable(result) ? result.catch(recover) : result;
  } catch (error) {
    return recover(error);
  }
}

module.exports = { attempt };
