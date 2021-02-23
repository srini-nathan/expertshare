import _merge from "lodash/merge";
import { i18n } from "./config";
import registeredModules from "./module-register";
import appModuleTranslations from "./translations";
import ModuleConfig from "../SharedModule/models/ModuleConfig";

let i18Resources = appModuleTranslations;

const moduleRouters: JSX.Element[] = [];

registeredModules.forEach((module: ModuleConfig) => {
    i18Resources = _merge(i18Resources, module.translations);
    if (module.router) moduleRouters.push(module.router);
});

i18n.init(i18Resources);

export { moduleRouters };
