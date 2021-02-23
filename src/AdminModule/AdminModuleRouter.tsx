import React, { FC, PropsWithChildren } from "react";
import { Link, RouteComponentProps, Router } from "@reach/router";
import { useTranslation } from "react-i18next";
import { IndexPage, DesignPage, SettingPage } from "./pages";

const AdminModuleRouter: FC<PropsWithChildren<RouteComponentProps>> = (
    props
): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t("AdminModule:global.name")}</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/admin">Home</Link>
                    </li>
                    <li>
                        <Link to="/admin/design">Design</Link>
                    </li>
                    <li>
                        <Link to="/admin/setting">Settings</Link>
                    </li>
                </ul>
            </nav>
            <Router>
                <IndexPage default path={"/"}></IndexPage>
                <DesignPage path={"/design"}></DesignPage>
                <SettingPage path={"/setting"}></SettingPage>
            </Router>
            {props.children}
        </div>
    );
};

export default AdminModuleRouter;
