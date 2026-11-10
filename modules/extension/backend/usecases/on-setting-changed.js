// on-setting-changed.js — UC7: user đổi setting → ext đang chạy được chạy lại với giá trị mới.

function createOnSettingChanged({ runner, lifecycle, handleCrash }) {
  const ownersOf = (ids) => new Set(ids.map((id) => id.split(".")[0]));

  return async function onSettingChanged({ ids }) {
    for (const id of ownersOf(ids)) {
      if (!runner.isRunning({ id }) || !lifecycle.needsRestart({ id }))
        continue;
      await lifecycle
        .restart({ id })
        .catch((error) => handleCrash({ id, message: error.message }));
    }
  };
}

module.exports = { createOnSettingChanged };
