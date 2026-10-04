// batch.js
// Trách nhiệm duy nhất: chuẩn hoá đầu vào dạng lô cho tool files và gom kết quả
// theo từng mục. Vẫn nhận `path`/`content` đơn cũ như lô 1 phần tử.

const isValidFile = (f) => Boolean(f?.path) && typeof f.content === "string";

function toPaths(args) {
  const raw = args.paths ?? args.path;
  const paths = [].concat(raw ?? []).filter((p) => typeof p === "string" && p);
  if (paths.length === 0) throw new Error("Thiếu tham số paths.");
  return paths;
}

function toFiles(args) {
  const legacy = args.path ? [{ path: args.path, content: args.content }] : [];
  const files = args.files ?? legacy;
  const valid =
    Array.isArray(files) && files.length > 0 && files.every(isValidFile);
  if (!valid) {
    throw new Error("files phải là mảng {path, content}, content là chuỗi.");
  }
  return files;
}

// Truyền đường dẫn ĐÃ resolve để "a/b" và "./a/b" bị nhận ra là trùng.
function assertUnique(list, what) {
  const hasDup = list.some((item, i) => list.indexOf(item) !== i);
  if (hasDup) throw new Error(`Lô có ${what} bị trùng.`);
}

// Chạy từng mục độc lập: lỗi 1 mục không làm hỏng cả lô.
function runEach(items, label, fn) {
  return items.map((item) => {
    try {
      return { path: label(item), ok: true, ...fn(item) };
    } catch (error) {
      return { path: label(item), ok: false, error: error.message };
    }
  });
}

function summarize(verb, results) {
  const ok = results.filter((r) => r.ok).length;
  return { message: `Đã ${verb} ${ok}/${results.length} mục.`, results };
}

module.exports = { toPaths, toFiles, assertUnique, runEach, summarize };
