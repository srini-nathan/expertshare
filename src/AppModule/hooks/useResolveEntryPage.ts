import { Configuration } from "../../AdminModule/models";
import { useGlobalData } from "../contexts";
import { parseConfiguration } from "../utils";

export function useResolveEntryPage() {
    const { container } = useGlobalData();
    const getPath = (): string => {
        const configuration: Configuration = parseConfiguration(container);
        if (configuration.isA3dEnable) {
            return "/a3d";
        }

        return "/event";
    };
    return { getPath };
}
