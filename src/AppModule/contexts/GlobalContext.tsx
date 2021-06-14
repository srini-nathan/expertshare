import React from "react";
import { ContainerApi } from "../../AdminModule/apis/ContainerApi";
import { GenerateApi } from "../../AdminModule/apis/GenerateApi";
import { I18nMap, MyContainer } from "../../AdminModule/models";
import i18n from "../config/i18n";
import { CONTAINER_LOCALE } from "../config/app-env";

interface GlobalState {
    status: "LOADED" | "LOADING" | "ERROR";
    container?: MyContainer;
}

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
                const { languages, id } = response;
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
                    );
                }
                setState({
                    status: "LOADED",
                    container: response,
                });
            } else {
                setState({ status: "ERROR" });
            }
        })();
    }, [setState]);

    return <Global.Provider value={state}>{props.children}</Global.Provider>;
};
