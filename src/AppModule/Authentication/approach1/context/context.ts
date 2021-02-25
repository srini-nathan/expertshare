import React, { useReducer } from "react";
import AuthReducer, { AuthenticationState, initialState } from "../reducer/authentication";

const AuthStateContext:React.Context<any> = React.createContext(null);
const AuthDispatchContext = React.createContext(null);

export function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
        throw new Error("useAuthState must be within a AuthProvider");
    }
    return context;
}

export function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error("useAuthDispatch must be used within a AuthProvider");
    }
    return context;
}

export const AuthProvider:React.FC = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider  value={user}>
    <AuthDispatchContext.Provider value={dispatch}>
      {children}
      </AuthDispatchContext.Provider>
      </AuthStateContext.Provider>
  );
};