// ext-bridge.js
// Bọc window.api.extension (preload) — nơi duy nhất frontend ext gọi backend.

const api = () => window.api.extension;

export const listExtensions = () => api().list();
export const listLanguages = () => api().languages();
export const createExtension = ({ name }) => api().create({ name });
export const setEnabled = ({ id, enabled }) =>
  api().setEnabled({ id, enabled });
export const removeExtension = ({ id }) => api().remove({ id });
export const onExtensionsChanged = (listener) => api().onChanged(listener);
