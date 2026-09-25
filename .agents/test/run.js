// run.js
// Chạy tổng: nạp mọi *.test.js, gọi run() từng file, in báo cáo.
// Có thể `node .agents/test/run.js` (terminal) HOẶC require("./run.js").runAll()
// từ nơi khác (không cần terminal).

const { discoverTestFiles } = require("./lib/discover");
const { printResult, printSummary } = require("./lib/report");

async function runAll({ verbose = true } = {}) {
  const files = discoverTestFiles();
  const results = [];

  for (const file of files) {
    let mod;
    try {
      mod = require(file);
    } catch (error) {
      results.push({
        name: file,
        ok: false,
        durationMs: 0,
        error: `Không load được file: ${error.message}`,
      });
      continue;
    }
    if (typeof mod.run !== "function") {
      results.push({
        name: file,
        ok: false,
        durationMs: 0,
        error: 'File test thiếu export "run()"',
      });
      continue;
    }
    const result = await mod.run();
    results.push(result);
    if (verbose) printResult(result);
  }

  return { results, summary: printSummary(results) };
}

if (require.main === module) {
  runAll().then(({ summary }) => {
    process.exitCode = summary.failed > 0 ? 1 : 0;
  });
}

module.exports = { runAll };
