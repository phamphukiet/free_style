// agents-optional.js
// Optional dependency sang modules/agent — xoá module agent không được
// làm module rule crash, chỉ mất phần gán agent.

export async function loadAgentsOptional() {
  try {
    if (!window.api.agent?.list) return [];
    const list = await window.api.agent.list();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
