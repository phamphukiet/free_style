// registry.js
// Nơi đăng ký các thành phần giao diện (UI parts) từ các module.
// Giúp nới lỏng sự phụ thuộc (loose coupling) giữa các thành phần.

class Registry {
  constructor() {
    this.activitybarItems = []; // { id, icon, title }
    this.sidebarViews = {};     // { [id]: tagName }
    this.emptyEditorViews = []; // [tagName]
    this.providers = [];        // { id, name, abbr, group, color, textColor, desc, tags }
    this.listeners = {};        // { eventName: [callbacks] }
  }

  // --- Events ---
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  // --- Activitybar ---
  registerActivitybarItem(item) {
    this.activitybarItems.push(item);
    this.emit("activitybar:changed", this.activitybarItems);
  }
  
  getActivitybarItems() {
    return this.activitybarItems;
  }

  // --- Sidebar ---
  registerSidebarView(id, tagName) {
    this.sidebarViews[id] = tagName;
  }
  
  getSidebarView(id) {
    return this.sidebarViews[id];
  }

  // --- Empty Editor ---
  registerEmptyEditorView(tagName) {
    this.emptyEditorViews.push(tagName);
  }
  
  getEmptyEditorView() {
    return this.emptyEditorViews[0]; // Hiện tại chỉ hỗ trợ 1 view mặc định
  }

  // --- Providers ---
  registerProvider(provider) {
    this.providers.push(provider);
    this.emit("providers:changed", this.providers);
  }

  getProviders() {
    return this.providers;
  }
}

// Singleton pattern
export const registry = new Registry();
