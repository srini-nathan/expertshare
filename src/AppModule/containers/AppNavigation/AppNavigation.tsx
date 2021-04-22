import React, { FC, useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Navbar, Nav } from "react-bootstrap";
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
            "logo-holder"
        )[0] as HTMLElement;
        const hasWindow = typeof window !== "undefined";

        const screenHight =
            (hasWindow ? window.innerHeight : 0) - logoHolder.offsetHeight;
        return screenHight;
    };

    const getScreenWidth = () => {
        const hasWindow = typeof window !== "undefined";
        return hasWindow ? window.innerWidth : 0;
    };
    const updateScreenSize = () => {
        /* eslint-disable no-console */
        if (getScreenWidth() > 767) {
            const mainItems = document.getElementsByClassName("main-menu");

            let itemHeight = 0;
            let numberOfMenusToShow = 0;

            if (mainItems.length > 0) {
                itemHeight = (mainItems[0] as HTMLElement).offsetHeight;
            }

            numberOfMenusToShow = Math.floor(
                getScreenHeight() / itemHeight - 1
            );
            console.log(numberOfMenusToShow, itemHeight, getScreenHeight());
            const oItems = [];
            for (let i = numberOfMenusToShow; i < mainItems.length; i++) {
                oItems.push(items[i]);
            }
            setOverflowItems(oItems);

            /* eslint-enable no-console */
        }
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
            <Navbar className="row m-0 p-0 mb-md-4 d-block" expand="lg">
                <div className="col-md-12">
                    <div className="logo-holder row">
                        <div className="main-logo-container  m-0 p-md-4">
                            <a href="#" className="main-logo col-xl-9"></a>
                        </div>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100">
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
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <nav
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            ></nav>
        </aside>
    );
};

export default AppNavigation;
