// modules/runner/backend/runtime/install.js
// Trách nhiệm duy nhất: tải gói runtime từ URL cố định trong plugin rồi giải nén.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const { spawn } = require("child_process");
const { runtimeDir, managedExe } = require("./resolve");

// Dùng bsdtar của Windows (có từ Win10 1803) bằng đường dẫn tuyệt đối: tar của
// Git (GNU tar) có thể đứng trước trong PATH và KHÔNG giải nén được .zip.
const TAR = path.join(
  process.env.SystemRoot || "C:\\Windows",
  "System32",
  "tar.exe",
);

async function download(spec, dest, onPercent) {
  const res = await fetch(spec.url);
  if (!res.ok) throw new Error(`Tải thất bại (HTTP ${res.status})`);
  const total = Number(res.headers.get("content-length")) || 0;
  const hash = crypto.createHash("sha256");
  let got = 0;
  let last = -1;

  async function* measure(source) {
    for await (const chunk of source) {
      hash.update(chunk);
      got += chunk.length;
      const pct = total ? Math.round((got / total) * 100) : 0;
      if (pct !== last) onPercent((last = pct));
      yield chunk;
    }
  }
  await pipeline(
    Readable.fromWeb(res.body),
    measure,
    fs.createWriteStream(dest),
  );

  if (spec.sha256 && hash.digest("hex") !== spec.sha256.toLowerCase())
    throw new Error("Sai mã SHA256 — đã huỷ cài đặt để đảm bảo an toàn.");
}

function extract(archive, destDir, strip) {
  const args = ["-xf", archive, "-C", destDir];
  if (strip) args.push("--strip-components", String(strip));
  return new Promise((resolve, reject) => {
    const proc = spawn(TAR, args, { windowsHide: true });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("error", reject);
    proc.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Giải nén lỗi: ${stderr.trim()}`)),
    );
  });
}

async function installRuntime(lang, onProgress) {
  const spec = lang.download?.[process.platform];
  if (!spec)
    throw new Error(
      `${lang.label}: chưa hỗ trợ tự cài trên ${process.platform}.`,
    );

  const dir = runtimeDir(lang.id);
  fs.rmSync(dir, { recursive: true, force: true }); // cài lại luôn từ sạch
  fs.mkdirSync(dir, { recursive: true });
  const archive = path.join(dir, "_download.tmp");

  try {
    await download(spec, archive, (percent) =>
      onProgress({ phase: "download", percent }),
    );
    onProgress({ phase: "extract", percent: 100 });
    await extract(archive, dir, spec.strip);
    fs.rmSync(archive, { force: true });
    (spec.cleanup || []).forEach((f) =>
      fs.rmSync(path.join(dir, f), { force: true }),
    );
    if (!fs.existsSync(managedExe(lang)))
      throw new Error(
        "Cài xong nhưng không thấy file chạy — kiểm tra lại cấu hình gói tải.",
      );
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true }); // không để lại bản cài dở
    throw error;
  }
}

module.exports = { installRuntime };