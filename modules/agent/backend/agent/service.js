// service.js
// Hợp đồng công khai của module agent cho module khác (capability kind "service", id "agents").
// Chỉ ĐỌC: muốn ghi phải đi qua IPC/tool của agent. Không export store ra ngoài.
// Bên dùng khai báo phần mình cần: getService({ id: "agents", needs: ["get"], fallback }).

const store = require("./store");

/** @param {{ store: { get: Function, list: Function } }} deps */
function createAgentService({ store }) {
  return {
    // TẠM: nhận cả chuỗi id cho caller cũ chưa chuyển. Xóa nhánh này khi grep sạch.
    get: (arg) => store.get({ id: typeof arg === "string" ? arg : arg?.id }),
    list: () => store.list(),
  };
}

module.exports = {
  createAgentService,
  agentService: createAgentService({ store }),
};
