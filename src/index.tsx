import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./AppModule/app";
import AuthProvider from "./AppModule/Authentication/context/AuthContext";
import setupAxiosInterceptors from "./Settings/Config/asiox-interceptor-config";

setupAxiosInterceptors(() => {});
ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <AuthProvider>
                <App />
            </AuthProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
);
