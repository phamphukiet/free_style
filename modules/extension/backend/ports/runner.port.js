// runner.port.js
// Hợp đồng chạy code ext. Bản thật: adapters/worker/worker-runner.js.

/**
 * @typedef {Object} Runner
 * @property {(args: { language: string, code: string }) => Promise<{ name?: string, settings?: object }>} inspect
 *   Nạp code, KHÔNG gọi run(). Ném lỗi nếu code sai.
 * @property {(args: { id: string, language: string, code: string, settings: object }) => Promise<void>} start
 *   Thay worker cũ (nếu có). Resolve khi run() đã chạy xong phần đồng bộ.
 * @property {(args: { id: string }) => Promise<void>} stop
 * @property {() => Promise<void>} stopAll
 * @property {(args: { id: string }) => boolean} isRunning
 * @property {(args: { listener: (e: { id: string, message: string }) => void }) => { dispose: () => void }} onCrash
 */
module.exports = {};
