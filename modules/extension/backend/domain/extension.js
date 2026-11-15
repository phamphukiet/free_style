// extension.js
// Entity ext: dựng record, đổi trạng thái, suy ra status hiển thị. Thuần JS.

const DEFAULT_LANGUAGE = "js";

/** @param {{ language: string, now?: number }} args */
function buildRecord({ language, now = Date.now() }) {
  return {
    language,
    enabled: false,
    crashes: 0,
    lastError: null,
    createdAt: now,
  };
}

const clearError = ({ record }) => ({ ...record, lastError: null });
const clearFailure = ({ record }) => ({
  ...record,
  crashes: 0,
  lastError: null,
});
const withEnabled = ({ record, enabled }) => ({
  ...clearFailure({ record }),
  enabled,
});
const withError = ({ record, message, now = Date.now() }) => ({
  ...record,
  lastError: { message, at: now },
});

/** @returns {"error"|"running"|"off"} */
function statusOf({ error, running }) {
  if (error) return "error";
  return running ? "running" : "off";
}

module.exports = {
  DEFAULT_LANGUAGE,
  buildRecord,
  clearError,
  clearFailure,
  withEnabled,
  withError,
  statusOf,
};
