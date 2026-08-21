// registry.js
// Nơi đăng ký các thành phần giao diện (UI parts) từ các module.
// Giúp nới lỏng sự phụ thuộc (loose coupling) giữa các thành phần.

class Registry {
  constructor() {
    this.activitybarItems = []; // { id, icon, title }
    this.bottomActivitybarItems = []; // icon ghim cuối thanh (VD: Settings)
    this.sidebarViews = {}; // { [id]: tagName }
    this.emptyEditorViews = {}; // { [id]: tagName }
    this.providerEditorViews = {}; // { [id]: tagName }
    this.providerCreatorViews = {}; // { [id]: tagName }
    this.providers = []; // { id, name, abbr, group, color, textColor, desc, tags }
    this.listeners = {}; // { eventName: [callbacks] }
    this.rightSidebarView = null; // tagName duy nhất, khác sidebarViews (đa view theo id)
    this.panelView = null;
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
    const target =
      item.placement === "bottom"
        ? this.bottomActivitybarItems
        : this.activitybarItems;
    target.push(item);
    this.emit("activitybar:changed", {
      top: this.activitybarItems,
      bottom: this.bottomActivitybarItems,
    });
  }

  getActivitybarItems() {
    return this.activitybarItems;
  }

  getBottomActivitybarItems() {
    return this.bottomActivitybarItems;
  }

  // --- Sidebar ---
  registerSidebarView(id, tagName) {
    this.sidebarViews[id] = tagName;
  }

  getSidebarView(id) {
    return this.sidebarViews[id];
  }

  // --- Right Sidebar ---
  registerRightSidebarView(tagName) {
    this.rightSidebarView = tagName;
  }

  getRightSidebarView() {
    return this.rightSidebarView;
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

  // --- Panel ---
  registerPanelView(tagName) {
    this.panelView = tagName;
  }

  getPanelView() {
    return this.panelView;
  }
}

// Singleton pattern
export const registry = new Registry();
