import React, { FC, useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { AppIcon } from "../../components/AppIcon";
import {
    AppNavigationItem,
    AppNavigationItemProps,
} from "../../components/AppNavigationItem";
import "./assets/scss/style.scss";

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    const [overflowItems, setOverflowItems] = useState<
        AppNavigationItemProps[]
    >([]);
    const getScreenHeight = () => {
        const logoHolder = document.getElementsByClassName(
            " logo-holder"
        )[0] as HTMLElement;
        const hasWindow = typeof window !== "undefined";

        const screenHight =
            (hasWindow ? window.innerHeight : 0) - logoHolder.offsetHeight;
        return screenHight;
    };
    const updateScreenSize = () => {
        const mainItems = document.getElementsByClassName("main-menu");

        let itemHeight = 0;
        let numberOfMenusToShow = 0;

        if (mainItems.length > 0) {
            itemHeight = (mainItems[0] as HTMLElement).offsetHeight;
        }

        numberOfMenusToShow = Math.floor(getScreenHeight() / itemHeight - 1);
        const oItems = [];
        for (let i = numberOfMenusToShow; i < mainItems.length; i += 1) {
            oItems.push(items[i]);
        }
        setOverflowItems(oItems);
    };
    useEffect(() => {
        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);
    }, []);

    return (
        <aside
            className={
                "left-sidebar d-block navbar-expand-md sidebar col-sm-12 col-md-3 col-xl-2 p-0"
            }
        >
            <div className="m-0 mb-md-4 logo-holder">
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
                {items
                    .filter((e) => !overflowItems.includes(e))
                    .map(({ label, path, icon }) => {
                        return (
                            <AppNavigationItem
                                label={label}
                                path={path}
                                icon={icon}
                                key={label}
                                className="main-menu"
                            />
                        );
                    })}
                {overflowItems.length > 0 && (
                    <ListGroupItem
                        className={`nav-item item-more dropright pt-2 pr-3 pl-3 p-2 `}
                    >
                        <div className="nav-link show-more">
                            <div className="nav-icon">
                                <AppIcon name="Menu" />
                            </div>
                            <span>More</span>
                        </div>
                        <div className="more-menu">
                            <ListGroup>
                                {overflowItems.map((e) => {
                                    return e ? (
                                        <AppNavigationItem
                                            label={e.label}
                                            path={e.path}
                                            icon={e.icon}
                                            key={e.label}
                                        />
                                    ) : (
                                        ""
                                    );
                                })}
                            </ListGroup>
                        </div>
                    </ListGroupItem>
                )}
            </ListGroup>
        </aside>
    );
};

export default AppNavigation;
