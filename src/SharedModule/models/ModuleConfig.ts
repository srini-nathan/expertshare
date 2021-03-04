import { Resource } from "i18next";

export default interface ModuleConfig {
    id: string;
    translations: Resource;
    router?: JSX.Element;
    navigation?: any[];
}
