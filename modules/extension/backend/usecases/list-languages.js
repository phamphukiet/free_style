// list-languages.js — ngôn ngữ hỗ trợ kèm code mẫu (UI hiển thị để user copy).

function createListLanguages({ codeStore }) {
  return function listLanguages() {
    return codeStore.languages().map((lang) => ({
      ...lang,
      sample: codeStore.sampleOf({ language: lang.id }),
    }));
  };
}

module.exports = { createListLanguages };
