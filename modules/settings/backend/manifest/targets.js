// targets.js
// Whitelist target effect mà EXTENSION được dùng. Module built-in không bị giới hạn.
// Thêm target mới: thêm tên vào đây + 1 handler ở frontend (registerEffectHandler).

const TARGETS = [
  "monaco.options",
  "monaco.theme",
  "css.vars",
  "terminal.theme",
];

const isAllowedTarget = ({ target }) => TARGETS.includes(target);

module.exports = { TARGETS, isAllowedTarget };