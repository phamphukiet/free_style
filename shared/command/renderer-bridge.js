// renderer-bridge.js
// Phía main của lệnh runIn:"renderer": handshake (renderer báo id nó xử lý được),
// request/response theo correlation id, timeout, chống phản hồi giả (phải đúng cửa sổ).
// Không replay: không có handler thì fail ngay.

const crypto = require("crypto");
const { resolveWindow } = require("./window");
const { CHANNEL, RENDERER_TIMEOUT_MS } = require("./spec");

const MAX_IDS = 200;
const cleanIds = (ids) =>
  (Array.isArray(ids) ? ids : [])
    .filter((id) => typeof id === "string" && id.length <= 100)
    .slice(0, MAX_IDS);

function createBridge({ timeoutMs = RENDERER_TIMEOUT_MS } = {}) {
  const announced = new Map(); // windowId -> Set<id>
  const watched = new Set(); // windowId đã gắn listener
  const pending = new Map(); // requestId -> { windowId, resolve, reject, timer }

  function rejectPending({ windowId, reason }) {
    pending.forEach((entry, requestId) => {
      if (entry.windowId !== windowId) return;
      clearTimeout(entry.timer);
      pending.delete(requestId);
      entry.reject(new Error(reason));
    });
  }

  function forget({ windowId }) {
    announced.delete(windowId);
    rejectPending({ windowId, reason: "Cửa sổ đã đóng hoặc tải lại." });
  }

  function watch({ sender }) {
    const windowId = sender.id;
    if (watched.has(windowId)) return;
    watched.add(windowId);
    sender.on("did-start-loading", () => forget({ windowId })); // reload: bỏ handler cũ
    sender.once("destroyed", () => {
      watched.delete(windowId);
      forget({ windowId });
    });
  }

  function announce({ sender, ids }) {
    watch({ sender });
    announced.set(sender.id, new Set(cleanIds(ids)));
  }

  const targetOf = ({ windowId }) =>
    resolveWindow({ windowId })?.webContents ?? null;
  const hasHandler = ({ target, id }) =>
    Boolean(target) && announced.get(target.id)?.has(id) === true;

  const isAvailable = ({ id, windowId }) =>
    hasHandler({ target: targetOf({ windowId }), id });

  function request({ id, args, windowId }) {
    const target = targetOf({ windowId });
    if (!hasHandler({ target, id })) {
      return Promise.reject(new Error("UI không khả dụng cho lệnh này."));
    }
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error(`UI không phản hồi sau ${timeoutMs / 1000}s.`));
      }, timeoutMs);
      pending.set(requestId, { windowId: target.id, resolve, reject, timer });
      try {
        target.send(CHANNEL.request, { requestId, id, args });
      } catch (error) {
        clearTimeout(timer);
        pending.delete(requestId);
        reject(error);
      }
    });
  }

  // senderId do main gán từ event.sender, không tin giá trị renderer gửi.
  function respond({ senderId, requestId, ok, data, error }) {
    const entry = pending.get(requestId);
    if (!entry || entry.windowId !== senderId) return false;
    pending.delete(requestId);
    clearTimeout(entry.timer);
    if (ok === true) entry.resolve(data);
    else entry.reject(new Error(String(error || "UI báo lỗi.")));
    return true;
  }

  return { announce, respond, isAvailable, request };
}

module.exports = { createBridge };
