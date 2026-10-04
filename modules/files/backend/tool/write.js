// Trách nhiệm duy nhất: ghi / xoá nhiều file trong 1 lần gọi. Kiểm tra TOÀN BỘ lô
// trước khi đụng vào đĩa; sau đó lỗi fs được báo riêng từng mục.

const path = require("path");
const fs = require("fs");
const { getProjectRoot, resolveChildPath } = require("./paths");
const {
  toPaths,
  toFiles,
  assertUnique,
  runEach,
  summarize,
} = require("./batch");

function writeOne({ full, content }) {
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const existed = fs.existsSync(full);
  fs.writeFileSync(full, content, "utf-8");
  return { action: existed ? "ghi đè" : "tạo" };
}

function write(args) {
  const root = getProjectRoot();
  const targets = toFiles(args).map((f) => ({
    ...f,
    full: resolveChildPath(root, f.path),
  }));
  assertUnique(
    targets.map((t) => t.full),
    "đường dẫn",
  );
  return summarize(
    "ghi",
    runEach(targets, (t) => t.path, writeOne),
  );
}

function removeOne({ full }) {
  fs.rmSync(full, { recursive: true, force: true });
  return {};
}

function remove(args) {
  const root = getProjectRoot();
  const targets = toPaths(args).map((rel) => ({
    rel,
    full: resolveChildPath(root, rel),
  }));
  assertUnique(
    targets.map((t) => t.full),
    "đường dẫn",
  );
  const missing = targets.filter((t) => !fs.existsSync(t.full));
  if (missing.length > 0) {
    throw new Error(`Không tồn tại: ${missing.map((t) => t.rel).join(", ")}.`);
  }
  if (!args.confirmed) {
    return {
      needsConfirmation: true,
      message: `Xác nhận xoá ${targets.map((t) => `"${t.rel}"`).join(", ")}? Nếu người dùng đồng ý, gọi lại với confirmed=true.`,
    };
  }
  return summarize(
    "xoá",
    runEach(targets, (t) => t.rel, removeOne),
  );
}

module.exports = { write, remove };
