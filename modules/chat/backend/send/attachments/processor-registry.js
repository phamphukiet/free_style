// processor-registry.js
// Registry PLUGIN cho xử lý file đính kèm chat — dựng khung sẵn cho tính
// năng upload sau này. Thêm loại file mới -> tạo file trong processors/
// tự gọi registerProcessor(), KHÔNG sửa file này.

const processors = {}; // { [kind]: handleFn }

function registerProcessor(kind, handleFn) {
  processors[kind] = handleFn;
}

function getProcessor(kind) {
  return processors[kind] || null;
}

module.exports = { registerProcessor, getProcessor };