import { Resource } from "i18next";

export interface ModuleConfig {
    id: string;
    translations: Resource;
    router?: JSX.Element;
    navigation?: any[];
}

export default ModuleConfig;
