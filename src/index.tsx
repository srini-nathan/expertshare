import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { LocationProvider } from "@reach/router";
import App from "./AppModule/app";
import AuthProvider from "./SecurityModule/contexts/AuthContext";
import "./AppModule/config/app-env";

ReactDOM.render(
    <React.StrictMode>
        <LocationProvider>
            <RecoilRoot>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </RecoilRoot>
        </LocationProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
