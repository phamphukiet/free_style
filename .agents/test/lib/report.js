// report.js
// Trách nhiệm duy nhất: in kết quả test ra console theo format đồng nhất.

function printResult(result) {
  const status = result.ok ? "PASS" : "FAIL";
  console.log(`[${status}] ${result.name} (${result.durationMs}ms)`);
  for (const note of result.notes || []) console.log(`   - ${note}`);
  if (!result.ok) console.log(`   ! ${result.error}`);
}

function printSummary(results) {
  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log("----------------------------------------");
  console.log(`Tổng: ${results.length} | Đạt: ${passed} | Lỗi: ${failed}`);
  return { total: results.length, passed, failed };
}

module.exports = { printResult, printSummary };
