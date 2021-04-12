import React, { FC } from "react";
import { ListGroup } from "react-bootstrap";
import {
    AppNavigationItem,
    AppNavigationItemProps,
} from "../../components/AppNavigationItem";
import "./assets/scss/style.scss";

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    return (
        <aside className={"left-sidebar d-block navbar-expand-md sidebar p-0"}>
            <div className="m-0 mb-md-4">
                <div className="main-logo-container p-md-4">
                    <a href="#" className="main-logo col-xl-9"></a>
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon icon icon-menu" />
                </button>
            </div>
            <ListGroup>
                {items.map(({ label, path, icon }) => {
                    return (
                        <AppNavigationItem
                            label={label}
                            path={path}
                            icon={icon}
                            key={label}
                        />
                    );
                })}
            </ListGroup>
        </aside>
    );
};

export default AppNavigation;
