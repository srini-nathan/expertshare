import React, { FC, useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Nav, Navbar } from "react-bootstrap";
import { Link } from "@reach/router";
import { AppIcon } from "../../components/AppIcon";
import {
    AppNavigationDropDown,
    AppNavigationItem,
    AppNavigationItemProps,
} from "../../components/AppNavigationItem";
import "./assets/scss/style.scss";
import FooterLogo from "./assets/images/expertshare_logo_footer.svg";
import { useWindowSize } from "../../hooks";

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    const [overflowItems, setOverflowItems] = useState<
        AppNavigationItemProps[]
    >([]);
    const { width, height } = useWindowSize();
    const mainItems = document.getElementsByClassName("main-menu");
    const getMenuItemsHeight = () => {
        const logoHolder = document.getElementsByClassName(
            "logo-holder"
        )[0] as HTMLElement;
        const bottomMenu = document.getElementsByClassName(
            "bottom-menu"
        )[0] as HTMLElement;

        return height - logoHolder.offsetHeight - bottomMenu.offsetHeight - 20;
    };
    const updateScreenSize = () => {
        if (width > 767) {
            let itemHeight = 0;
            let numberOfMenusToShow = 0;

            if (mainItems.length > 0) {
                itemHeight = (mainItems[0] as HTMLElement).offsetHeight;
            }

            numberOfMenusToShow = Math.floor(
                getMenuItemsHeight() / itemHeight - 1
            );
            const oItems = [];
            for (let i = numberOfMenusToShow; i < mainItems.length; i += 1) {
                oItems.push(items[i]);
            }
            setOverflowItems(oItems);
        }
    };
    useEffect(() => {
        updateScreenSize();
    }, [width, height]);

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
                            <ListGroupItem className={`bottom-menu p-0`}>
                                <ListGroup>
                                    <ListGroupItem
                                        className={`nav-item pt-2 pr-3 pl-3 p-2`}
                                    >
                                        <AppNavigationDropDown
                                            className="language"
                                            label="English"
                                            iconClassName="languages en"
                                            subDropDownItems={[
                                                {
                                                    label: "German",
                                                    iconClassName:
                                                        "languages de",
                                                    path: "#",
                                                },
                                            ]}
                                        />
                                    </ListGroupItem>
                                    <ListGroupItem
                                        className={`nav-item pt-2 pr-3 pl-3 p-2`}
                                    >
                                        <Link to={"#"} className="nav-link">
                                            <div className="nav-icon">
                                                <AppIcon name="Settings" />
                                            </div>
                                            <span>Administration</span>
                                        </Link>
                                    </ListGroupItem>
                                    <ListGroupItem
                                        className={`nav-item pt-2 pr-3 pl-3 p-2`}
                                    >
                                        <Link to={"#"} className="nav-link">
                                            <div className="nav-icon img-container">
                                                <i className="profile-picture"></i>
                                            </div>
                                            <span>Account</span>
                                        </Link>
                                    </ListGroupItem>

                                    <ListGroupItem
                                        className={`nav-item pt-2 pr-3 pl-3 p-2`}
                                    >
                                        <Link
                                            to={"#"}
                                            className="nav-link copyright"
                                        >
                                            <span>
                                                Virtual event platform by
                                                <img src={FooterLogo} />
                                            </span>
                                        </Link>
                                    </ListGroupItem>
                                </ListGroup>
                            </ListGroupItem>
                        </ListGroup>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </aside>
    );
};

export default AppNavigation;
