// apply-loader.js
// Tự động nạp mọi "*-apply.js" (logic JS) và mọi "*.inject.css" (CSS toàn cục)
// nằm trong backend/sources/<origin>/<module>/ — đây là NƠI DUY NHẤT biết
// đường dẫn sources. Setting mới chỉ cần đặt đúng tên file, không cần
// import ở workbench.css, part nào, hay module nào khác.

const applyModules = import.meta.glob("../backend/sources/*/*/*-apply.js", {
  eager: true,
});
const cssModules = import.meta.glob("../backend/sources/*/*/*.inject.css", {
  eager: true,
});

export const loadedApplies = Object.keys(applyModules);
export const loadedInjectedCss = Object.keys(cssModules);
