import React from "react";
import { ContainerApi } from "../../AdminModule/apis";
import { Container } from "../../AdminModule/models";

interface GlobalState {
    status: "LOADED" | "LOADING" | "ERROR";
    container?: Container;
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
            } = await ContainerApi.myContainer<Container>();
            if (error === null && response) {
                // @TODO: remove this
                // eslint-disable-next-line no-console
                console.log(response, "response");
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
