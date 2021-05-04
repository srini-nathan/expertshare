import React, { FC, useEffect, useState, useRef } from "react";
import { ListGroup, ListGroupItem, Nav, Navbar } from "react-bootstrap";
import { Link } from "@reach/router";
import { AppIcon } from "../../components/AppIcon";
import {
    AppNavigationDropDown,
    AppNavigationItem,
    AppNavigationSubMenuItem,
    AppSubNavigationItemProps,
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
        AppNavigationItemProps[] | AppSubNavigationItemProps[]
    >([]);
    const [
        activeMenuItem,
        setActiveMenuItem,
    ] = useState<AppNavigationItemProps>({
        label: "",
        path: "",
        icon: {
            name: "",
        },
    });
    const [subMenuItems] = useState<AppSubNavigationItemProps[]>([
        {
            label: "General Settings",
            path: "/admin/settings",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "3D Setings",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Email",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Tags",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Categories",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Rooms",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Session Colors",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Design",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Users",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Sponsers",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Forms",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Exporter",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Importer",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
        {
            label: "Jobs Queue",
            path: "#",
            isActive: false,
            icon: {
                name: "",
            },
        },
    ]);
    const [showSubMenuItems, isSubMenuItems] = useState<boolean>(false);
    const { width, height } = useWindowSize();
    const logoHolder = useRef<HTMLDivElement>(null);
    const bottomMenu = useRef<HTMLAnchorElement>(null);

    const getMenuItemsHeight = () => {
        let logoHeight = 0;
        let bottomMenuHeight = 0;

        if (logoHolder && logoHolder.current)
            logoHeight = logoHolder.current.clientHeight;

        if (bottomMenu && bottomMenu.current)
            bottomMenuHeight = bottomMenu.current.clientHeight;
        return height - logoHeight - bottomMenuHeight - 58;
    };
    const updateScreenSize = () => {
        if (width > 767) {
            let numberOfMenusToShow = 0;

            numberOfMenusToShow = Math.floor(getMenuItemsHeight() / 58 - 1);
            const oItems = [];
            for (
                let i = numberOfMenusToShow;
                i < (showSubMenuItems ? subMenuItems.length : items.length);
                i += 1
            ) {
                oItems.push(showSubMenuItems ? subMenuItems[i] : items[i]);
            }
            setOverflowItems(oItems);
        }
    };
    useEffect(() => {
        updateScreenSize();
    }, [width, height, showSubMenuItems]);

    const renderMenu = () => {
        if (showSubMenuItems) {
            return (
                <>
                    <AppNavigationItem
                        label={activeMenuItem.label}
                        path={activeMenuItem.path}
                        icon={activeMenuItem.icon}
                        className="active main-menu "
                    />
                    {subMenuItems
                        .filter((e) => !overflowItems.includes(e))
                        .map(({ label, path, icon }) => {
                            return (
                                <AppNavigationSubMenuItem
                                    label={label}
                                    path={path}
                                    key={label}
                                    icon={icon}
                                    className="main-menu sub-menu"
                                />
                            );
                        })}
                </>
            );
        }
        return (
            <>
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
            </>
        );
    };
    const renderMoreMenu = () => {
        return (
            overflowItems.length > 0 && (
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
                            {overflowItems.map(
                                (
                                    e:
                                        | AppNavigationItemProps
                                        | AppSubNavigationItemProps
                                ) => {
                                    if (e)
                                        return showSubMenuItems ? (
                                            <AppNavigationSubMenuItem
                                                label={e.label}
                                                path={e.path}
                                                key={e.label}
                                                icon={e.icon}
                                            />
                                        ) : (
                                            <AppNavigationItem
                                                label={e.label}
                                                path={e.path}
                                                icon={e.icon}
                                                key={e.label}
                                            />
                                        );
                                    return "";
                                }
                            )}
                        </ListGroup>
                    </div>
                </ListGroupItem>
            )
        );
    };
    return (
        <aside
            className={
                "left-sidebar d-block navbar-expand-md sidebar col-sm-12 col-md-3 col-xl-2 p-0"
            }
        >
            <Navbar className="row m-0 p-0 mb-md-4 d-block" expand="lg">
                <div className="col-md-12">
                    <div className="logo-holder row">
                        <div
                            ref={logoHolder}
                            className="main-logo-container  m-0 p-md-4"
                        >
                            <a href="#" className="main-logo col-xl-9"></a>
                        </div>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100">
                        <ListGroup>
                            {renderMenu()}
                            {renderMoreMenu()}
                            <ListGroupItem
                                ref={bottomMenu}
                                className={`bottom-menu p-0`}
                            >
                                <ListGroup>
                                    <ListGroupItem
                                        className={`nav-item pt-2 pr-3 pl-3 p-2`}
                                    >
                                        <div
                                            onClick={() => {
                                                setActiveMenuItem({
                                                    label: "Administration",
                                                    path: "#",
                                                    icon: {
                                                        name: "Settings",
                                                    },
                                                });
                                                isSubMenuItems(
                                                    !showSubMenuItems
                                                );
                                            }}
                                            className="nav-link"
                                        >
                                            <div className="nav-icon">
                                                <AppIcon
                                                    name={
                                                        showSubMenuItems
                                                            ? "ArrowLeft"
                                                            : "Settings"
                                                    }
                                                />
                                            </div>
                                            <span>
                                                {showSubMenuItems
                                                    ? "Back to Menu"
                                                    : "Administration"}
                                            </span>
                                        </div>
                                    </ListGroupItem>
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
