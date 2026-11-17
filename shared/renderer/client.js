// client.js
// Renderer: đăng ký handler cho lệnh runIn:"renderer", báo id cho main (handshake),
// nhận request và trả kết quả theo requestId. Main/preload vắng thì im lặng.
// Cố ý KHÔNG replay: handler chỉ chạy khi main gửi request.

const handlers = new Map(); // id -> handler(args) => data
let started = false;
let scheduled = false;

const api = () => window.api?.command;
const toPlain = (data) => JSON.parse(JSON.stringify(data ?? null)); // IPC cần clone được

function announce() {
  scheduled = false;
  api()
    ?.announce([...handlers.keys()])
    .catch(() => {});
}

function scheduleAnnounce() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(announce);
}

async function handleRequest({ requestId, id, args }) {
  const reply = (payload) =>
    api()
      ?.respond({ requestId, ...payload })
      .catch(() => {});
  const handler = handlers.get(id);
  if (!handler)
    return reply({ ok: false, error: `Không có handler cho "${id}".` });
  try {
    reply({ ok: true, data: toPlain(await handler(args)) });
  } catch (error) {
    reply({ ok: false, error: error.message });
  }
}

function start() {
  if (started || !api()?.onRequest) return;
  started = true;
  api().onRequest(handleRequest);
}

/** @param {{ id: string, handler: (args: object) => any }} input */
export function registerCommandHandler({ id, handler }) {
  handlers.set(id, handler);
  start();
  scheduleAnnounce();
  return () => {
    handlers.delete(id);
    scheduleAnnounce();
  };
}
