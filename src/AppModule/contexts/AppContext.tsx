import React from "react";
import { ContainerTypes } from "./types";
import { Container } from "../../AdminModule/models";

export interface AppState {
    isLoading: boolean;
    container: Container | null;
}

const initialState: AppState = {
    isLoading: false,
    container: null,
};

interface Action {
    type: ContainerTypes;
    payload: Container | null;
}

export const AppContext = React.createContext<AppState | any>(initialState);

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case ContainerTypes.LOADING:
            return {
                ...state,
                isLoading: true,
            };

        case ContainerTypes.SUCCESS:
            return {
                isLoading: false,
                container: action.payload,
            };
        case ContainerTypes.ERROR:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
}
type Props = {
    children: JSX.Element;
};
export default function AppProvider({ children }: Props): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}
