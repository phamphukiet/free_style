// crash-policy.js
// Quyết định tự tắt ext khi lỗi.

const MAX_CRASHES = 3;

/** @param {{ record: object, message: string, max?: number, now?: number }} args */
function applyCrash({ record, message, max = MAX_CRASHES, now = Date.now() }) {
  const crashes = record.crashes + 1;
  const disabled = crashes >= max;
  return {
    disabled,
    record: {
      ...record,
      crashes,
      enabled: !disabled && record.enabled,
      lastError: { message, at: now },
    },
  };
}

module.exports = { MAX_CRASHES, applyCrash };
