import React from "react";
import { ContainerTypes } from "./types";

export interface States {
    [key: string]: any;
}

const initialState: States = {
    isLoading: false,
    ContainerState: null,
};
interface Action {
    type: ContainerTypes;
    payload: States;
}
export const AppContext = React.createContext<States | any>(initialState);

function reducer(state: States, action: Action): States {
    switch (action.type) {
        case ContainerTypes.LOADING:
            return {
                ...state,
                isLoading: true,
            };

        case ContainerTypes.SUCCESS:
            return {
                ...state,
                isLoading: false,
                ContainerState: action.payload,
            };
        case ContainerTypes.ERROR:
            return {
                isLoading: false,
                ...state,
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
