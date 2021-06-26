import React from "react";
import { SessionType } from "./types";

export interface SessionState {
    isLive: boolean;
    streamType: string;
    streamUrl: string;
}
const initialState: SessionState = {
    isLive: false,
    streamType: "",
    streamUrl: "",
};

interface Action {
    type: SessionType;
    payload: SessionState;
}

export const SessionContext = React.createContext<SessionState | any>(
    initialState
);

function reducer(state: SessionState, action: Action): SessionState {
    // eslint-disable-next-line no-console
    console.log(action);
    switch (action.type) {
        case SessionType.REMOVE:
            return initialState;

        case SessionType.LOAD:
            return action.payload;
        default:
            return state;
    }
}
type Props = {
    children: JSX.Element;
};
export default function SessionProvider({ children }: Props): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <SessionContext.Provider value={{ state, dispatch }}>
            {children}
        </SessionContext.Provider>
    );
}
