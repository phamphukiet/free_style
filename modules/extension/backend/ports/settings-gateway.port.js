// settings-gateway.port.js
// Hợp đồng nối với module settings: đăng ký/gỡ setting của ext, đọc giá trị, theo dõi thay đổi.
// Bản thật: adapters/settings/setting-source.js + setting-values.js.

/**
 * @typedef {Object} SettingsGateway
 * @property {(args: { id: string, manifest: object }) => void} publish
 * @property {(args: { id: string }) => void} retract
 * @property {(args: { extId: string, definitions: Array<{ id: string, default: any }> }) => object} read
 *   Trả { key: giá trị hiệu lực }, thiếu service thì dùng default.
 * @property {(args: { extId: string }) => void} removeAll   xóa mọi giá trị đã lưu của ext
 * @property {(args: { listener: (e: { ids: string[] }) => void }) => { dispose: () => void }} onChange
 */
module.exports = {};
