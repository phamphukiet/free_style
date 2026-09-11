function toGeminiSchema(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const { type, properties, items, ...rest } = schema;
  const converted = { ...rest };
  if (type) converted.type = type.toUpperCase();
  if (properties) {
    converted.properties = Object.fromEntries(
      Object.entries(properties).map(([k, v]) => [k, toGeminiSchema(v)]),
    );
  }
  if (items) converted.items = toGeminiSchema(items);
  return converted;
}

function toGeminiTool(specs) {
  return {
    functionDeclarations: specs.map((spec) => ({
      name: spec.name,
      description: spec.description,
      parameters: toGeminiSchema(spec.parameters),
    })),
  };
}

module.exports = { toGeminiSchema, toGeminiTool };
