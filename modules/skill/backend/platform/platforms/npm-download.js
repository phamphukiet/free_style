// npm-download.js
// Tải NGUYÊN package npm (tarball .tgz) thay vì đoán 1 file qua unpkg.
const zlib = require("zlib");
const { parseTar } = require("../tar-utils");

async function fetchPackageMeta(pkgName) {
  const res = await fetch(`https://registry.npmjs.org/${pkgName}`);
  if (!res.ok) throw new Error(`Không đọc được metadata npm (${res.status})`);
  return res.json();
}

// Tarball npm luôn gói trong thư mục gốc "package/" — bỏ prefix khi ghi ra project.
const stripPackagePrefix = (relPath) => relPath.replace(/^package\//, "");

async function downloadNpmFiles(skill) {
  const pkgName = skill.id.replace(/^npm:/, "");
  const meta = await fetchPackageMeta(pkgName);
  const version = skill.version || meta["dist-tags"]?.latest;
  const tarballUrl = meta.versions?.[version]?.dist?.tarball;
  if (!tarballUrl) throw new Error("Không tìm thấy tarball của package này.");

  const res = await fetch(tarballUrl);
  if (!res.ok) throw new Error(`Tải tarball lỗi (${res.status})`);
  const tarBuf = zlib.gunzipSync(Buffer.from(await res.arrayBuffer()));

  return parseTar(tarBuf)
    .filter((f) => f.relPath)
    .map((f) => ({
      relPath: stripPackagePrefix(f.relPath),
      content: f.content,
    }));
}

module.exports = { downloadNpmFiles };
