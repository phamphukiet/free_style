// set-enabled.js — UC4: bật/tắt. Tắt: dừng code, ẩn setting (giá trị user đã đặt vẫn giữ).
// Bật thất bại: ext quay về Tắt kèm lý do.

const { withEnabled, withError } = require("../domain/extension");
const { needRecord } = require("./need-record");

/** @param {{ repo, lifecycle, broadcast: Function }} deps */
function createSetEnabled({ repo, lifecycle, broadcast }) {
  return async function setEnabled({ id, enabled }) {
    const record = needRecord({ repo, id });
    repo.save({ id, record: withEnabled({ record, enabled }) });
    try {
      if (enabled) await lifecycle.activate({ id });
      else await lifecycle.deactivate({ id });
    } catch (error) {
      const off = withEnabled({ record, enabled: false });
      repo.save({
        id,
        record: withError({ record: off, message: error.message }),
      });
      throw error;
    } finally {
      broadcast();
    }
  };
}

module.exports = { createSetEnabled };
