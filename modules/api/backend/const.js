const CHANNEL = {
  createKey: (id) => `api:create-key:${id}`,
  validateKey: (id) => `api:validate-key:${id}`,
  listModels: (id) => `api:list-models:${id}`,
  fileLimit: (id) => `api:file-limit:${id}`,
};

module.exports = { CHANNEL };
