// client.js
// Renderer: đọc/ghi/theo dõi setting qua window.api.settings.
// Module settings vắng (bị đóng băng) → trả fallback, không ném lỗi.

const api = () => window.api?.settings;

export async function getSettings() {
  try {
    return (await api().getAll()) || {};
  } catch {
    return {};
  }
}

export async function getSetting({ id, fallback }) {
  try {
    const value = await api().get(id);
    return value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
}

export function setSetting({ id, value, scope }) {
  return api().set({ id, value, scope });
}

const isMatch = ({ id, prefix }, changedId) =>
  id ? changedId === id : changedId.startsWith(prefix);

// apply nhận { id, value }. Trả về hàm huỷ đăng ký.
export function watchSetting({ id, prefix = "", apply }) {
  const off = api()?.onChanged?.((detail) => {
    if (isMatch({ id, prefix }, detail.id)) apply(detail);
  });
  return off || (() => {});
}
