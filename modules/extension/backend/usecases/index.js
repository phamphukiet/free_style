// index.js (usecases)
// Lắp usecase từ port. Chỉ nhận port, không biết adapter nào.

const { createLifecycle } = require("./lifecycle");
const { createListExtensions } = require("./list-extensions");
const { createListLanguages } = require("./list-languages");
const { createListCommands } = require("./list-commands");
const { createCreateExtension } = require("./create-extension");
const { createSaveCode } = require("./save-code");
const { createOnCodeChanged } = require("./on-code-changed");
const { createSetEnabled } = require("./set-enabled");
const { createRemoveExtension } = require("./remove-extension");
const { createOnSettingChanged } = require("./on-setting-changed");
const { createHandleCrash } = require("./handle-crash");
const { createSyncExtensions } = require("./sync-extensions");
const { createCatalog } = require("../domain/catalog");
const { createSetValue } = require("./set-value");

/** @param {{ repo, codeStore, runner, settings, commandBus, broadcast: Function, reserved: Set<string> }} ports */
function createUsecases({
  repo,
  codeStore,
  runner,
  settings,
  commandBus,
  broadcast,
  reserved,
}) {
  const catalog = createCatalog();
  const lifecycle = createLifecycle({
    repo,
    codeStore,
    runner,
    settings,
    catalog,
  });
  const handleCrash = createHandleCrash({
    repo,
    lifecycle,
    settings,
    broadcast,
  });
  const save = createSaveCode({
    repo,
    codeStore,
    lifecycle,
    catalog,
    broadcast,
  });

  return {
    handleCrash,
    save,
    list: createListExtensions({ repo, codeStore, runner, catalog, settings }),
    setValue: createSetValue({ catalog, settings, broadcast }),
    languages: createListLanguages({ codeStore }),
    root: () => codeStore.rootDir,
    commands: createListCommands({ commandBus }),
    create: createCreateExtension({
      repo,
      codeStore,
      catalog,
      reserved,
      broadcast,
    }),
    setEnabled: createSetEnabled({ repo, lifecycle, broadcast }),
    remove: createRemoveExtension({
      repo,
      codeStore,
      lifecycle,
      settings,
      catalog,
      broadcast,
    }),
    onSettingChanged: createOnSettingChanged({
      runner,
      lifecycle,
      handleCrash,
    }),
    onCodeChanged: createOnCodeChanged({ repo, saveCode: save, settings }),
    sync: createSyncExtensions({ repo, codeStore, lifecycle, broadcast }),
  };
}

module.exports = { createUsecases };
