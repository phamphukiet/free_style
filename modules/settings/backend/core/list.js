// target-registry.js
// Mỗi component tự đăng ký 1 lần khi được viết ra (giống registerConfigConsumer,
// nhưng đây khai báo QUYỀN được trỏ tới, không phải nhận lệnh JS).
// custom.actions.js BẮT BUỘC phải tra cứu file này trước khi tạo/sửa bất kỳ setting nào.

const targets = new Map(); // key: "selector::point" -> { type, validate }

function registerTarget(selector, point, spec) {
  // spec = { type: "color" | "toggle" | "text" | "enum", validate: fn }
  targets.set(`${selector}::${point}`, spec);
}

function getTarget(selector, point) {
  return targets.get(`${selector}::${point}`);
}

function listTargets() {
  return Array.from(targets.keys());
}

module.exports = { registerTarget, getTarget, listTargets };
