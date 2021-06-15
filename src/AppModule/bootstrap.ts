import { axios, i18n } from "./config";
import { registeredModules } from "./module-register";
import appNavigation from "./navigation";
import appRouter from "./routers";
import { ModuleConfig, ModuleRouter } from "./models";
import { AppNavigationItemProps } from "./components/AppNavigationItem";

const appRouters: ModuleRouter[] = [...appRouter];
const appNavigations: AppNavigationItemProps[] = [...appNavigation];

// all registered modules' navigation and routing injecting within AppModule
registeredModules.forEach(
    ({ routers, navigation }: ModuleConfig<AppNavigationItemProps>) => {
        if (routers) appRouters.push(...routers);
        if (navigation) appNavigations.push(...navigation);
    }
);

// initialize global packages and libraries
i18n.init({});
axios.init();

export { appRouters, appNavigations };
