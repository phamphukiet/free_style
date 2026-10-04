// read.js
// Trách nhiệm duy nhất: đọc nội dung nhiều file trong 1 lần gọi, chung 1 ngân sách byte.

const fs = require("fs");
const { getProjectRoot, resolveSafePath } = require("./paths");
const { toPaths, runEach } = require("./batch");

const MAX_READ_BYTES = 200 * 1024; // ngân sách chung cả lô, tránh tràn context AI

function readOne(full, budget) {
  const stat = fs.statSync(full);
  if (stat.isDirectory()) throw new Error("Là thư mục, không phải file.");
  if (stat.size > MAX_READ_BYTES) {
    const kb = (stat.size / 1024).toFixed(0);
    throw new Error(
      `File quá lớn (${kb}KB), giới hạn ${MAX_READ_BYTES / 1024}KB.`,
    );
  }
  if (stat.size > budget.left) {
    return {
      ok: false,
      skipped: true,
      error: "Hết ngân sách đọc của lượt này, hãy đọc riêng file này.",
    };
  }
  budget.left -= stat.size;
  return { content: fs.readFileSync(full, "utf-8") };
}

function read(args) {
  const root = getProjectRoot();
  const budget = { left: MAX_READ_BYTES };
  const rels = [...new Set(toPaths(args))];
  const results = runEach(
    rels,
    (rel) => rel,
    (rel) => readOne(resolveSafePath(root, rel), budget),
  );
  return { results };
}

module.exports = { read };
