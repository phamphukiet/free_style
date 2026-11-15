// repository.port.js
// Hợp đồng lưu TRẠNG THÁI ext (không gồm code). Bản thật: adapters/storage/extension-repo.js.

/**
 * @typedef {{ language: string, enabled: boolean, crashes: number,
 *   lastError: { message: string, at: number } | null, createdAt: number }} ExtensionRecord
 *
 * @typedef {Object} ExtensionRepository
 * @property {() => Record<string, ExtensionRecord>} all
 * @property {(args: { id: string }) => ExtensionRecord | null} get
 * @property {(args: { id: string, record: ExtensionRecord }) => void} save
 * @property {(args: { id: string }) => void} remove
 */
module.exports = {};
