// view-registry.js
// Registry cục bộ cho các view hiển thị trong ag-editor-group (agent, org, ...).
// Thêm view mới: tạo thư mục riêng trong view/, gọi registerEditorView(id, tagName)
// trong index.js của view đó, rồi import side-effect vào view/index.js.
// Xóa 1 view: xóa thư mục view đó + xóa dòng import tương ứng trong view/index.js
// — editor.js KHÔNG cần sửa gì, tự hiện empty state khi id không có tag.

const views = {}; // { [id]: tagName }

export function registerEditorView(id, tagName) {
  views[id] = tagName;
}

export function getEditorView(id) {
  return views[id] || null;
}
