// result.js
// Dạng kết quả thống nhất { ok, message, data } / { ok:false, code, error } + caller công khai cho audit.

const fail = ({ cmd, code, error }) => ({
  ok: false,
  code,
  error: `${cmd.id}: ${error}`,
});

function toResult(data) {
  const message =
    typeof data?.message === "string" ? data.message : "Đã chạy xong.";
  return { ok: true, message, data: data === undefined ? null : data };
}

const publicCaller = (caller) => ({
  kind: caller?.kind,
  agentId: caller?.agentId,
  sessionId: caller?.sessionId,
  extId: caller?.extId,
});

module.exports = { fail, toResult, publicCaller };
