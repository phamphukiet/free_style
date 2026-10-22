// preload.js
// Cầu nối DUY NHẤT giữa renderer và main process.
// Renderer không có quyền dùng Node.js/OS trực tiếp (contextIsolation: true),
// nên mọi API cần expose ra cho renderer phải đi qua file này.

const { contextBridge, ipcRenderer } = require("electron");
const channels = {
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  DIALOG_OPEN_FOLDER: "dialog:open-folder",
  STATE_LOAD_LAST_FOLDER: "state:load-last-folder",
  FS_READ_DIRECTORY: "fs:read-directory",
  FS_CREATE_FILE: "fs:create-file",
  FS_CREATE_FOLDER: "fs:create-folder",
  FS_RENAME: "fs:rename",
  FS_DELETE: "fs:delete",
  FS_COPY: "fs:copy",
  MODULES_ACTIVE: "modules:active",
  TERMINAL_CREATE: "terminal:create",
  TERMINAL_WRITE: "terminal:write",
  TERMINAL_RESIZE: "terminal:resize",
  TERMINAL_KILL: "terminal:kill",
  TERMINAL_DATA: "terminal:data",
  CREDENTIALS_SAVE: "credentials:save",
  CREDENTIALS_LOAD: "credentials:load",
  CREDENTIALS_DELETE: "credentials:delete",
};
const invokeStorage = (channel) => (payload) =>
  ipcRenderer.invoke(channel, payload);

const invokeSetting = async (channel, ...args) => {
  const result = await ipcRenderer.invoke(channel, ...args);
  if (!result?.ok) throw new Error(result?.error || "Lỗi settings");
  return result.data;
};

function getExposedApi() {
  return {
    storage: {
      get: invokeStorage("storage:get"),
      inspect: invokeStorage("storage:inspect"),
      set: invokeStorage("storage:set"),
      delete: invokeStorage("storage:delete"),
      move: invokeStorage("storage:move"),
      keys: invokeStorage("storage:keys"),
      entries: invokeStorage("storage:entries"),
      watch: invokeStorage("storage:watch"),
      onChanged: (callback) => {
        const listener = (event, detail) => callback(detail);
        ipcRenderer.on("storage:changed", listener);
        return () => ipcRenderer.removeListener("storage:changed", listener);
      },
    },
    window: {
      minimize: () => ipcRenderer.send(channels.WINDOW_MINIMIZE),
      maximize: () => ipcRenderer.send(channels.WINDOW_MAXIMIZE),
      close: () => ipcRenderer.send(channels.WINDOW_CLOSE),
    },
    dialog: {
      openFolder: () => ipcRenderer.invoke(channels.DIALOG_OPEN_FOLDER),
    },
    state: {
      loadLastFolder: () => ipcRenderer.invoke(channels.STATE_LOAD_LAST_FOLDER),
    },
    fs: {
      readDirectory: (folderPath) =>
        ipcRenderer.invoke(channels.FS_READ_DIRECTORY, folderPath),
      createFile: (path) => ipcRenderer.invoke(channels.FS_CREATE_FILE, path),
      createFolder: (path) =>
        ipcRenderer.invoke(channels.FS_CREATE_FOLDER, path),
      rename: (oldPath, newPath) =>
        ipcRenderer.invoke(channels.FS_RENAME, oldPath, newPath),
      copy: (src, dest) => ipcRenderer.invoke(channels.FS_COPY, src, dest),
      delete: (path) => ipcRenderer.invoke(channels.FS_DELETE, path),
      readFile: (filePath) => ipcRenderer.invoke("fs:read-file", filePath),
      writeFile: (filePath, content) =>
        ipcRenderer.invoke("fs:write-file", filePath, content),
    },
    terminal: {
      // shellType: 'powershell' | 'cmd'. Backend sẽ tự map ra path thật.
      create: (shellType, cwd) =>
        ipcRenderer.invoke(channels.TERMINAL_CREATE, shellType, cwd),
      write: (data) => ipcRenderer.send(channels.TERMINAL_WRITE, data),
      resize: (cols, rows) =>
        ipcRenderer.send(channels.TERMINAL_RESIZE, cols, rows),
      kill: () => ipcRenderer.send(channels.TERMINAL_KILL),
      // onData: đăng ký callback nhận output từ pty, trả về hàm huỷ đăng ký
      onData: (callback) => {
        const listener = (event, chunk) => callback(chunk);
        ipcRenderer.on(channels.TERMINAL_DATA, listener);
        return () =>
          ipcRenderer.removeListener(channels.TERMINAL_DATA, listener);
      },
    },
    runner: {
      resolve: (filePath) => ipcRenderer.invoke("runner:resolve", filePath),
      install: (languageId) => ipcRenderer.invoke("runner:install", languageId),
      onProgress: (callback) => {
        const listener = (event, info) => callback(info);
        ipcRenderer.on("runner:progress", listener);
        return () => ipcRenderer.removeListener("runner:progress", listener);
      },
    },
    credentials: {
      list: (serviceId) => ipcRenderer.invoke("credentials:list", serviceId),
      save: (serviceId, keyData) =>
        ipcRenderer.invoke("credentials:save", serviceId, keyData),
      load: (serviceId) => ipcRenderer.invoke("credentials:load", serviceId),
      delete: (serviceId, keyId) =>
        ipcRenderer.invoke("credentials:delete", serviceId, keyId),
    },
    providers: {
      createKey: (providerId) =>
        ipcRenderer.invoke(`api:create-key:${providerId}`),
      validateKey: (providerId, keyData) =>
        ipcRenderer.invoke(`api:validate-key:${providerId}`, keyData),
      listModels: (providerId, apiKey) =>
        ipcRenderer.invoke(`api:list-models:${providerId}`, apiKey),
      getFileLimit: (providerId) =>
        ipcRenderer.invoke(`api:file-limit:${providerId}`),
    },
    chat: {
      send: (payload) => ipcRenderer.invoke("chat:send", payload),
      saveSelection: (selection) =>
        ipcRenderer.invoke("chat:save-selection", selection),
      loadSelection: () => ipcRenderer.invoke("chat:load-selection"),
      sessionList: () => ipcRenderer.invoke("chat:session-list"),
      sessionGet: (id) => ipcRenderer.invoke("chat:session-get", id),
      sessionSave: (s) => ipcRenderer.invoke("chat:session-save", s),
      sessionDelete: (id) => ipcRenderer.invoke("chat:session-delete", id),
      projectSize: (folderPath) =>
        ipcRenderer.invoke("chat:project-size", folderPath),
    },
    settings: {
      list: () => invokeSetting("settings:list"),
      listGroups: () => invokeSetting("settings:list-groups"),
      getAll: () => invokeSetting("settings:get-all"),
      get: (id) => invokeSetting("settings:get", id),
      inspect: (id) => invokeSetting("settings:inspect", id),
      set: (payload) => invokeSetting("settings:set", payload), // { id, value, scope? }
      reset: (payload) => invokeSetting("settings:reset", payload), // { id, scope? }
      addPreset: (payload) => invokeSetting("settings:add-preset", payload), // { id, option }
      removePreset: (payload) =>
        invokeSetting("settings:remove-preset", payload),
      getEffects: () => invokeSetting("settings:get-effects"),
      errors: () => invokeSetting("settings:errors"),
      importVscode: (opts) => invokeSetting("settings:import-vscode", opts),
      linkFile: (opts) => invokeSetting("settings:link-file", opts),
      unlinkFile: () => invokeSetting("settings:unlink-file"),
      linkStatus: () => invokeSetting("settings:link-status"),
      onChanged: (callback) => {
        const listener = (event, detail) => callback(detail);
        ipcRenderer.on("settings:changed", listener);
        return () => ipcRenderer.removeListener("settings:changed", listener);
      },
      onEffects: (callback) => {
        const listener = (event, batch) => callback(batch);
        ipcRenderer.on("settings:effects", listener);
        return () => ipcRenderer.removeListener("settings:effects", listener);
      },
    },
    agent: {
      list: () => ipcRenderer.invoke("agent:list"),
      get: (id) => ipcRenderer.invoke("agent:get", id),
      save: (agent, ctx) => ipcRenderer.invoke("agent:save", agent, ctx),
      delete: (id) => ipcRenderer.invoke("agent:delete", id),
    },
    skill: {
      platformsList: () => ipcRenderer.invoke("skill:platforms-list"),
      platformTest: (endpoint) =>
        ipcRenderer.invoke("skill:platform-test", endpoint),
      platformSave: (platform) =>
        ipcRenderer.invoke("skill:platform-save", platform),
      search: (query, sortBy, platformId) =>
        ipcRenderer.invoke("skill:search", query, sortBy, platformId),
      catalogGet: (id) => ipcRenderer.invoke("skill:catalog-get", id),
      catalogUpsert: (skill) =>
        ipcRenderer.invoke("skill:catalog-upsert", skill),
      catalogDelete: (id) => ipcRenderer.invoke("skill:catalog-delete", id),
      assignAgents: (id, agentIds) =>
        ipcRenderer.invoke("skill:assign-agents", id, agentIds),
      listByAgent: (agentId) =>
        ipcRenderer.invoke("skill:list-by-agent", agentId),
      install: (skill, answers) =>
        ipcRenderer.invoke("skill:install", skill, answers),
      uninstall: (skillId) => ipcRenderer.invoke("skill:uninstall", skillId),
      listInstalled: () => ipcRenderer.invoke("skill:list-installed"),
      togglePin: (id) => ipcRenderer.invoke("skill:toggle-pin", id),
      syncPinned: () => ipcRenderer.invoke("skill:sync-pinned"),
      listPinned: () => ipcRenderer.invoke("skill:list-pinned"),
      addFromLink: (url) => ipcRenderer.invoke("skill:add-from-link", url),
      listProject: () => ipcRenderer.invoke("skill:list-project"),
      addPlatform: (input) => ipcRenderer.invoke("skill:add-platform", input),
      platformRename: (id, name) =>
        ipcRenderer.invoke("skill:platform-rename", id, name),
    },
    system: {
      openExternal: (url) => ipcRenderer.invoke("system:open-external", url),
    },
    rule: {
      list: () => ipcRenderer.invoke("rule:list"),
      catalogGet: (id) => ipcRenderer.invoke("rule:catalog-get", id),
      catalogUpsert: (rule) => ipcRenderer.invoke("rule:catalog-upsert", rule),
      catalogDelete: (id) => ipcRenderer.invoke("rule:catalog-delete", id),
      assignAgents: (id, agentIds) =>
        ipcRenderer.invoke("rule:assign-agents", id, agentIds),
      togglePin: (id) => ipcRenderer.invoke("rule:toggle-pin", id),
      toggleEnabled: (id) => ipcRenderer.invoke("rule:toggle-enabled", id),
      listPinned: () => ipcRenderer.invoke("rule:list-pinned"),
      listProject: () => ipcRenderer.invoke("rule:list-project"),
      syncPinned: () => ipcRenderer.invoke("rule:sync-pinned"),
      install: (rule) => ipcRenderer.invoke("rule:install", rule),
      uninstall: (id) => ipcRenderer.invoke("rule:uninstall", id),
      onAiChanged: (callback) => {
        const listener = (event, info) => callback(info);
        ipcRenderer.on("rule:ai-changed", listener);
        return () => ipcRenderer.removeListener("rule:ai-changed", listener);
      },
    },
    kanban: {
      listTasks: () => ipcRenderer.invoke("kanban:list-tasks"),
      getTask: (id) => ipcRenderer.invoke("kanban:get-task", id),
      createTask: (data) => ipcRenderer.invoke("kanban:create-task", data),
      moveTask: (taskId, toColumnId) =>
        ipcRenderer.invoke("kanban:move-task", taskId, toColumnId),
      approveTask: (taskId) =>
        ipcRenderer.invoke("kanban:approve-task", taskId),
      rejectTask: (taskId) => ipcRenderer.invoke("kanban:reject-task", taskId),
      listAgents: () => ipcRenderer.invoke("kanban:list-agents"),
      updateTask: (taskId, patch) =>
        ipcRenderer.invoke("kanban:update-task", taskId, patch),
      deleteTask: (taskId) => ipcRenderer.invoke("kanban:delete-task", taskId),
      runTask: (taskId) => ipcRenderer.invoke("kanban:run-task", taskId),
      onChanged: (callback) => {
        const listener = () => callback();
        ipcRenderer.on("kanban:changed", listener);
        return () => ipcRenderer.removeListener("kanban:changed", listener);
      },
    },
    modules: {
      active: () => ipcRenderer.invoke(channels.MODULES_ACTIVE),
    },
  };
}

contextBridge.exposeInMainWorld("api", getExposedApi());