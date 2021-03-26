import _merge from "lodash/merge";
import { axios, i18n } from "./config";
import { registeredModules } from "./module-register";
import appModuleTranslations from "./translations";
import appNavigation from "./navigation";
import { ModuleConfigInterface, ModuleRouter } from "./models";
import { AppNavigationItemProps } from "./components/AppNavigationItem";

let i18Resources = appModuleTranslations;

const appRouters: ModuleRouter[] = [];
const appNavigations: AppNavigationItemProps[] = [...appNavigation];

// all registered modules' navigation and routing injecting within AppModule
registeredModules.forEach(
    ({ routers, translations, navigation }: ModuleConfigInterface) => {
        i18Resources = _merge(i18Resources, translations);
        if (routers) appRouters.push(...routers);
        if (navigation) appNavigations.push(...navigation);
    }
);

// initialize global packages and libraries
i18n.init(i18Resources);
axios.init();

export { appRouters, appNavigations };
