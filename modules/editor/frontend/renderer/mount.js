import "../monaco/save.js"; // side-effect: đăng ký config consumer
export { mountEditor } from "../monaco/create.js";
export {
  acquireModel,
  releaseModel,
  applyModelOptions,
} from "../monaco/model-store.js";
