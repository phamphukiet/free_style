// group-registry.js
// Registry cục bộ cho các group hiển thị trong ag-sidebar (agent, org, ...).
// Thêm group mới: tạo thư mục riêng trong group/, gọi registerSidebarGroup(tagName)
// trong index.js của group đó, rồi import side-effect vào group/index.js.
// Xóa 1 group: xóa thư mục group đó + xóa dòng import tương ứng trong group/index.js
// — sidebar.js KHÔNG cần sửa gì.

const tags = [];

export function registerSidebarGroup(tagName) {
  tags.push(tagName);
}

export function getSidebarGroups() {
  return tags;
}
