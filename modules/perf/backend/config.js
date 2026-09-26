// config.js
// Bật/tắt RIÊNG từng level. Tắt 1 dòng = tắt đúng 1 cơ chế, không ảnh hưởng level khác.
module.exports = {
  dedupeTurn: true,
  cacheCrossTurn: true,
  todo: true,
  continuation: false, // xem ghi chú trong backend/index.js trước khi bật
};
