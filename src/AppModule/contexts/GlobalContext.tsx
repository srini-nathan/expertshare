import React from "react";
import { sortBy } from "lodash";
import { useSetRecoilState } from "recoil";
import { GenerateApi } from "../../AdminModule/apis/GenerateApi";
import { ContainerApi } from "../../AdminModule/apis/ContainerApi";
import {
    I18nMap,
    Language,
    MyContainer,
    Navigation,
} from "../../AdminModule/models";
import i18n from "../config/i18n";
import { CONTAINER_LOCALE } from "../config/app-env";
import { appContainerNavigation, appMyContainer } from "../atoms";
import { useAssetHelper } from "../hooks/useAssetHelper";
import { useDomHelper } from "../hooks/useDomHelper";
import { CONSTANTS } from "../../config";
import { FileTypeInfo } from "../models";
import { parseDesign } from "../utils";

interface GlobalState {
    status: "LOADED" | "LOADING" | "ERROR";
    container?: MyContainer;
    languages?: Language[];
    activeLanguages?: Language[];
    defaultLanguage?: Language;
    navigation?: Navigation[];
    activeNavigation?: Navigation[];
}
const {
    Upload: {
        FILETYPEINFO: { FILETYPEINFO_DESIGN_CONFIGURATION },
    },
} = CONSTANTS;
const Global = React.createContext<GlobalState | null>(null);

export const useGlobalData = (): GlobalState => {
    const context = React.useContext(Global);
    if (context === null) {
        throw new Error("useGlobalData must be used within a GlobalProvider");
    }

    return context;
};

export const GlobalProvider: React.FC = (props) => {
    const [state, setState] = React.useState<GlobalState>({
        status: "LOADING",
    });
    const setNavigation = useSetRecoilState(appContainerNavigation);
    const setMyContainer = useSetRecoilState(appMyContainer);
    const { buildPath } = useAssetHelper();
    const { setFavicon, setStyle } = useDomHelper();

    React.useEffect(() => {
        setState({
            status: "LOADING",
        });
        (async (): Promise<void> => {
            const {
                error,
                response,
            } = await ContainerApi.myContainer<MyContainer>();
            if (error === null && response) {
                const { languages, id, navigation } = response;
                const i18nData: I18nMap = {};
                if (languages) {
                    await Promise.all(
                        languages.map(async ({ locale, isDefault }) => {
                            const { data } = await GenerateApi.getTranslations(
                                id,
                                locale
                            );
                            i18nData[locale] = data;
                            i18n.addResourceBundle(locale, "AppModule", data);

                            if (isDefault) {
                                localStorage.setItem(CONTAINER_LOCALE, locale);
                            }
                        })
                    ).catch((e) => {
                        // eslint-disable-next-line no-console
                        console.error(e);
                    });
                }
                await GenerateApi.getStyle(response.id).then(({ data }) => {
                    setStyle(data);
                });

                setNavigation(sortBy(navigation, [(n) => n.ord]));
                setMyContainer(response);
                const designConfiguration = parseDesign(response);
                const { genImageFavicon } = designConfiguration;
                const favicon = buildPath(
                    response,
                    FILETYPEINFO_DESIGN_CONFIGURATION as FileTypeInfo,
                    genImageFavicon
                );
                setFavicon(favicon);
                setState({
                    status: "LOADED",
                    container: response,
                    languages: sortBy(languages, [(l) => !l.isDefault]),
                    defaultLanguage: languages?.find((l) => l.isDefault),
                    activeLanguages: languages?.filter((l) => l.isActive),
                    navigation: sortBy(navigation, [(n) => n.ord]),
                    activeNavigation: sortBy(
                        navigation?.filter((n) => n.isActive),
                        [(n) => n.ord]
                    ),
                });
            } else {
                setState({ status: "ERROR" });
            }
        })();
    }, [setState]);

    return <Global.Provider value={state}>{props.children}</Global.Provider>;
};
