import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { LocationProvider } from "@reach/router";
import App from "./AppModule/app";
import AuthProvider from "./SecurityModule/contexts/AuthContext";
import "./AppModule/config/app-env";
import { GlobalProvider } from "./AppModule/contexts";

ReactDOM.render(
    <React.StrictMode>
        <LocationProvider>
            <RecoilRoot>
                <GlobalProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </GlobalProvider>
            </RecoilRoot>
        </LocationProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
