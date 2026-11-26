// sink.js
// Nơi ghi log. Tách riêng để test thay bằng sink giả.

const consoleSink = {
  say: (text) => console.log(text),
  fail: (text) => console.error(text),
};

module.exports = { consoleSink };
