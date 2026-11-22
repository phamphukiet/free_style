// fold.js: chữ thường + bỏ dấu, để so khớp tên không phân biệt dấu.
const fold = (text) =>
  String(text ?? "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

module.exports = { fold };
