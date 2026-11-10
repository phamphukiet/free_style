// code-store.port.js
// Hợp đồng đọc/ghi FILE CODE của user + thông tin ngôn ngữ.
// Bản thật: adapters/files/code-store.js (+ code-watcher.js cho watch).

/**
 * @typedef {Object} CodeStore
 * @property {() => Array<{ id: string, label: string }>} languages
 * @property {(args: { language: string }) => string} sampleOf        code mẫu để hiển thị
 * @property {(args: { id: string, language: string }) => string} fileOf  đường dẫn tuyệt đối
 * @property {() => string[]} listIds
 * @property {(args: { id: string }) => string} detectLanguage
 * @property {(args: { id: string, language: string }) => Promise<void>} createEmpty
 * @property {(args: { id: string, language: string }) => Promise<string>} read
 * @property {(args: { id: string, language: string, code: string }) => Promise<void>} write
 * @property {(args: { id: string }) => Promise<void>} remove
 * @property {(args: { listener: (e: { id: string }) => void }) => { dispose: () => void }} watch
 */
module.exports = {};
