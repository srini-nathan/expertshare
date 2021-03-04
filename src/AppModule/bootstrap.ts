import _merge from "lodash/merge";
import { i18n } from "./config";
import registeredModules from "./module-register";
import appModuleTranslations from "./translations";
import appNavigation from "./navigation";
import ModuleConfig from "../SharedModule/models/ModuleConfig";

let i18Resources = appModuleTranslations;

const moduleRouters: JSX.Element[] = [];
const navigations: any[] = [...appNavigation];

registeredModules.forEach(
    ({ router, translations, navigation }: ModuleConfig) => {
        i18Resources = _merge(i18Resources, translations);
        if (router) moduleRouters.push(router);
        if (navigation) navigations.push(...navigation);
    }
);

i18n.init(i18Resources);

export { moduleRouters, navigations };
