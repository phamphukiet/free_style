// kit.js
// Khung tối giản dùng chung cho mọi test: đo thời gian, bắt lỗi, chuẩn hoá kết quả.
// Không phụ thuộc file test nào — test nào xoá cũng không ảnh hưởng file này.

async function runCase(name, fn) {
  const startedAt = Date.now();
  const notes = [];
  const note = (msg) => notes.push(msg);

  try {
    const detail = await fn(note);
    return {
      name,
      ok: true,
      durationMs: Date.now() - startedAt,
      notes,
      detail: detail ?? null,
    };
  } catch (error) {
    return {
      name,
      ok: false,
      durationMs: Date.now() - startedAt,
      notes,
      error: error.message,
    };
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion thất bại");
}

module.exports = { runCase, assert };
