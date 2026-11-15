// command-bus.port.js
// Hợp đồng liệt kê và chạy command do module khác công bố. Bản thật: adapters/commands/command-bus.js.

/**
 * @typedef {Object} CommandBus
 * @property {() => Array<{ module: string, name: string, label: string, args: object, runIn: string }>} list
 * @property {(args: { module: string, name: string, args?: object }) => Promise<any>} run
 */
module.exports = {};
