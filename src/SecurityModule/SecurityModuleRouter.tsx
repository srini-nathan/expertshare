import React, { FC, PropsWithChildren } from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { IndexPage, LoginPage, RegisterPage } from "./pages";

const SecurityModuleRouter: FC<
    PropsWithChildren<RouteComponentProps>
> = (): JSX.Element => {
    return (
        <Router>
            <IndexPage default />
            <LoginPage path={"/login"}></LoginPage>
            <RegisterPage path={"/register"}></RegisterPage>
        </Router>
    );
};

export default SecurityModuleRouter;
