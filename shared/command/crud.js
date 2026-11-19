// crud.js
// Dựng lệnh CRUD cho bus từ BẢNG KHAI BÁO. Module chỉ mô tả: tên lệnh → { risk, label, args?, call }.
// Mức risk lấy từ spec.js và dùng luôn làm aiAccess (cùng thang), nên policy/xác nhận/audit
// do bus lo: exec và destructive luôn hỏi người dùng, risk sai bị validate.js báo.

const { RISKS } = require("./spec");
const { getCapability, getService } = require("../core/capability-registry.js");

const missing = (id) => new Error(`Module "${id}" chưa sẵn sàng.`);

/** Trả hàm lấy service theo hợp đồng `needs`; thiếu thì ném lỗi (bus bọc thành FAILED). */
function requireService({ id, needs }) {
  return () => {
    const api = getService({ id, needs, fallback: null });
    if (!api) throw missing(id);
    return api;
  };
}

/** Giống requireService nhưng lấy capability kind "tool" (dùng khi module chỉ có tool, chưa có service). */
function requireTool({ id }) {
  return () => {
    const tool = getCapability({ kind: "tool", id });
    if (!tool) throw missing(id);
    return tool;
  };
}

// Tham số object trong bus không có kiểu "any" → giá trị tuỳ kiểu đi qua chuỗi JSON.
function parseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function toCommand({ getApi, spec }) {
  const { risk, label, args, call, aiAccess = risk } = spec;
  return {
    runIn: "main",
    risk,
    aiAccess,
    label,
    args,
    run: (given = {}) => call(getApi(), given),
  };
}

/**
 * @param {{ getApi: () => object, table: Record<string, {
 *   risk: typeof RISKS[number], label: string, args?: object,
 *   aiAccess?: string, call: (api: object, args: object) => any }> }} input
 */
function defineCommands({ getApi, table }) {
  return Object.fromEntries(
    Object.entries(table).map(([name, spec]) => [
      name,
      toCommand({ getApi, spec }),
    ]),
  );
}

module.exports = {
  defineCommands,
  requireService,
  requireTool,
  parseJson,
  RISKS,
};
