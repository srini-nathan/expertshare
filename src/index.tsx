import React from "react";
import ReactDOM from "react-dom";
import App from "./AppModule/app";
import AuthProvider from "./AppModule/Authentication/context/AuthContext";
import "./AppModule/config/app-env";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
