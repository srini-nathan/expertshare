import React from "react";
import { ContainerApi } from "../../AdminModule/apis/ContainerApi";
import { GenerateApi } from "../../AdminModule/apis/GenerateApi";
import { I18nMap, MyContainer } from "../../AdminModule/models";

interface GlobalState {
    status: "LOADED" | "LOADING" | "ERROR";
    container?: MyContainer;
    i18nData?: I18nMap;
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
                            if (isDefault) {
                                // @TODO: add hook or something, don't use direct localstorage here
                                localStorage.setItem("es_local", locale);
                            }

                            const { data } = await GenerateApi.getTranslations(
                                id,
                                locale
                            );
                            i18nData[locale] = data;
                        })
                    );
                }
                // @TODO: remove this
                // eslint-disable-next-line no-console
                console.log(response, i18nData, "response");
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
