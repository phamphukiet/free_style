// tar-utils.js
// Parser TAR tối giản (chỉ đọc) — đủ dùng để giải nén tarball npm (.tgz sau
// khi gunzip) mà không cần thêm dependency ngoài.

function readString(buf, start, len) {
  const slice = buf.subarray(start, start + len);
  const end = slice.indexOf(0);
  return slice.toString("utf-8", 0, end === -1 ? len : end);
}

function readOctal(buf, start, len) {
  const str = readString(buf, start, len).trim();
  return str ? parseInt(str, 8) : 0;
}

function parseTar(buf) {
  const files = [];
  let offset = 0;
  while (offset + 512 <= buf.length) {
    const header = buf.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break; // 2 block rỗng liên tiếp = hết file

    const name = readString(header, 0, 100);
    const prefix = readString(header, 345, 155); // ustar long name
    const size = readOctal(header, 124, 12);
    const typeflag = String.fromCharCode(header[156]);
    const fullName = prefix ? `${prefix}/${name}` : name;

    offset += 512;
    if (typeflag === "0" || typeflag === "\0") {
      files.push({
        relPath: fullName,
        content: Buffer.from(buf.subarray(offset, offset + size)),
      });
    }
    offset += Math.ceil(size / 512) * 512;
  }
  return files;
}

module.exports = { parseTar };
