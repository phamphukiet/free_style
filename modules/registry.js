// registry.js
// Nơi đăng ký các thành phần giao diện (UI parts) từ các module.
// Giúp nới lỏng sự phụ thuộc (loose coupling) giữa các thành phần.

class Registry {
  constructor() {
    this.activitybarItems = []; // { id, icon, title }
    this.sidebarViews = {};     // { [id]: tagName }
    this.emptyEditorViews = {}; // { [id]: tagName }
    this.providerEditorViews = {}; // { [id]: tagName }
    this.providerCreatorViews = {}; // { [id]: tagName }
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
  registerEmptyEditorView(id, tagName) {
    this.emptyEditorViews[id] = tagName;
  }
  
  getEmptyEditorView(id) {
    return this.emptyEditorViews[id];
  }

  // --- Providers ---
  registerProvider(provider) {
    this.providers.push(provider);
    this.emit("providers:changed", this.providers);
  }

  getProviders() {
    return this.providers;
  }

  // --- Provider Editor Views ---
  registerProviderEditorView(id, tagName) {
    this.providerEditorViews[id] = tagName;
  }

  getProviderEditorView(id) {
    return this.providerEditorViews[id];
  }

  // --- Provider Creator Views ---
  registerProviderCreatorView(id, tagName) {
    this.providerCreatorViews[id] = tagName;
  }

  getProviderCreatorView(id) {
    return this.providerCreatorViews[id];
  }
}

// Singleton pattern
export const registry = new Registry();
