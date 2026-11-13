// ext-bridge.js
// Bọc window.api (preload) — nơi duy nhất frontend ext gọi backend.

const api = () => window.api.extension;

export const listLanguages = () => api().languages();
export const getRoot = () => api().root();
export const createExtension = ({ name }) => api().create({ name });
export const setEnabled = ({ id, enabled }) => api().setEnabled({ id, enabled });
export const removeExtension = ({ id }) => api().remove({ id });
export const onExtensionsChanged = (listener) => api().onChanged(listener);

// Setting do ext khai báo: lọc theo origin ở frontend, không đụng backend settings.
export const listExtSettings = async () =>
  (await settings().list()).filter((item) => item.origin === "extension");
export const setExtValue = ({ id, key, value }) => api().setValue({ id, key, value });