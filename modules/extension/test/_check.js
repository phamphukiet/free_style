// _check.js
// Đồ nghề in kết quả cho các file test: step (tiêu đề bước), check (✅/❌), waitFor, done (tổng kết).

let failed = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function step(title) {
  console.log(`\n▶ ${title}`);
}

// ok = true → ✅. ok = false → ❌ kèm detail (nếu có) để biết sai ở đâu.
function check(label, ok, detail = "") {
  if (!ok) failed++;
  const note = !ok && detail ? `  → ${detail}` : "";
  console.log(`  ${ok ? "✅" : "❌"} ${label}${note}`);
}

// Chờ điều kiện đúng. Trả true nếu đúng kịp, false nếu hết giờ (không ném lỗi).
async function waitFor(condition, { timeout = 3000, interval = 50 } = {}) {
  const end = Date.now() + timeout;
  while (!condition()) {
    if (Date.now() > end) return false;
    await sleep(interval);
  }
  return true;
}

function done() {
  console.log(
    failed === 0 ? "\n🎉 Tất cả đều đạt" : `\n💥 Có ${failed} mục chưa đạt`,
  );
  process.exitCode = failed === 0 ? 0 : 1;
}

module.exports = { step, check, waitFor, done, sleep };
