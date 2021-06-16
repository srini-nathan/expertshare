/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useEffect, useState, useRef } from "react";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import {
    ListGroup,
    ListGroupItem,
    Accordion,
    Nav,
    Navbar,
} from "react-bootstrap";
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
import {
    AuthContext,
    logoutAction,
} from "../../../SecurityModule/contexts/AuthContext";
import {
    useWindowSize,
    useWindowLocation,
    useBuildAssetPath,
    useIsGranted,
    useAuthState,
    useUserLocale,
} from "../../hooks";
import { CONSTANTS } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";
import { errorToast, isGranted } from "../../utils";
import { LanguageApi } from "../../../AdminModule/apis";
import { Language } from "../../../AdminModule/models";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD, Role } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

const {
    ROLE: { ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_OPERATOR },
} = Role;

interface AppNavigationProps {
    items: AppNavigationItemProps[];
}

const AppNavigation: FC<AppNavigationProps> = ({ items }) => {
    const { dispatch, state } = React.useContext(AuthContext);
    const { role, containerId } = useAuthState();
    const { user } = state;
    const { locale, setLocale, containerLocale } = useUserLocale();
    const [overflowItems, setOverflowItems] = useState<
        AppNavigationItemProps[] | AppSubNavigationItemProps[]
    >([]);
    const { t } = useTranslation();
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user.imageName
    );
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);

    const style = user.imageName
        ? {
              backgroundImage: `url(${profilePicturePath})`,
              backgroundSize: "cover",
          }
        : {
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${placeholder})`,
          };

    const [subMenuItems] = useState<AppSubNavigationItemProps[]>([
        {
            label: "navigation:administration.settings",
            path: "/admin/settings",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        // {
        //     label: "navigation:administration.design",
        //     path: "/admin/design",
        //     icon: {
        //         name: "",
        //     },
        //     isVisible: isGranted(role, ROLE_OPERATOR),
        // },
        {
            label: "navigation:administration.users",
            path: "/admin/users",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_ADMIN),
        },
        {
            label: "navigation:administration.userGroups",
            path: "/admin/user-groups",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_ADMIN),
        },
        {
            label: "navigation:administration.userFields",
            path: "/admin/user-fields",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        {
            label: "navigation:administration.emailTemplates",
            path: "/admin/email-templates",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        {
            label: "navigation:administration.languages",
            path: "/admin/languages",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        {
            label: "navigation:administration.tranlsations",
            path: "/admin/translations",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        {
            label: "navigation:administration.clients",
            path: "/admin/clients",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_SUPER_ADMIN),
        },
        {
            label: "navigation:administration.layout3D",
            path: "/admin/layout3d",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_ADMIN),
        },
        {
            label: "navigation:administration.containers",
            path: "/admin/containers",
            icon: {
                name: "",
            },
            isVisible:
                !isGranted(role, ROLE_SUPER_ADMIN) &&
                isGranted(role, ROLE_ADMIN),
        },
        {
            label: "navigation:administration.sessionCategory",
            path: "/admin/session-categories",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
        {
            label: "navigation:administration.rooms",
            path: "/admin/rooms",
            icon: {
                name: "",
            },
            isVisible: isGranted(role, ROLE_OPERATOR),
        },
    ]);
    const [showSubMenuItems, isSubMenuItems] = useState<boolean>(false);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [userLocale, setUserLocale] = useState<Language>();

    const [showMore, isShowMore] = useState<boolean>(false);
    const { width, height } = useWindowSize();
    const { location } = useWindowLocation();
    const logoHolder = useRef<HTMLDivElement>(null);
    const bottomMenu = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (locale === "") {
            if (user.locale) {
                setLocale(user.locale);
            } else {
                setLocale(containerLocale);
            }
        }
    });

    const handleLogoutEvent = async (): Promise<void> => {
        await logoutAction(dispatch);
    };

    const getMenuItemsHeight = () => {
        let logoHeight = 0;
        let bottomMenuHeight = 0;

        if (logoHolder && logoHolder.current)
            logoHeight = logoHolder.current.clientHeight;

        if (bottomMenu && bottomMenu.current)
            bottomMenuHeight = bottomMenu.current.clientHeight;
        return height - logoHeight - bottomMenuHeight - 66;
    };
    const getMenuHeightStyle = () => {
        if (width > 767) {
            let logoHeight = 0;
            let bottomMenuHeight = 0;

            if (logoHolder && logoHolder.current)
                logoHeight = logoHolder.current.clientHeight;

            if (bottomMenu && bottomMenu.current)
                bottomMenuHeight = bottomMenu.current.clientHeight;
            return {
                height: `calc(100% - ${logoHeight + bottomMenuHeight + 30}px)`,
            };
        }
        return {};
    };
    const updateScreenSize = () => {
        if (width > 767) {
            const numberOfMenusToShow = Math.floor(getMenuItemsHeight() / 66);
            const oItems = [];
            for (let i = numberOfMenusToShow; i < items.length; i += 1) {
                oItems.push(items[i]);
            }
            setOverflowItems(oItems);
        }
    };
    useEffect(() => {
        updateScreenSize();
    }, [width, height, showSubMenuItems]);

    useEffect(() => {
        if (subMenuItems.some((e) => e && e.path === location)) {
            isSubMenuItems(true);
        }
    }, []);
    useEffect(() => {
        if (
            overflowItems.some(
                (e: AppNavigationItemProps | AppSubNavigationItemProps) =>
                    e && e.path === location
            )
        ) {
            isShowMore(true);
        }
    }, [overflowItems]);
    useEffect(() => {
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setLanguages(response.items);
                    const ul = response.items.find((e) => e.locale === locale);
                    setUserLocale(ul);
                }
            }
        );
    }, []);
    const renderMoreMenu = () => {
        return (
            overflowItems.length > 0 && (
                <Accordion activeKey={showMore ? "0" : ""}>
                    <Accordion.Collapse eventKey="0">
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
                    </Accordion.Collapse>
                    {/* @ts-ignore */}
                    <Accordion.Toggle
                        as={ListGroupItem}
                        className={`nav-item py-2 px-lg-4`}
                        eventKey="0"
                    >
                        <div
                            onClick={() => isShowMore(!showMore)}
                            className="nav-link show-more"
                        >
                            <div className="nav-icon">
                                <AppIcon name="Menu" />
                            </div>
                            <span>{!showMore ? "More" : "Less"}</span>
                        </div>
                    </Accordion.Toggle>
                </Accordion>
            )
        );
    };
    const renderMenu = () => {
        if (showSubMenuItems) {
            return (
                <>
                    <AppNavigationItem
                        label={"navigation:administration"}
                        path={""}
                        icon={{ name: "Settings" }}
                        className="active main-menu "
                    />
                    {subMenuItems
                        .filter(({ isVisible }) => {
                            return isVisible;
                        })
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
                {renderMoreMenu()}
            </>
        );
    };
    return (
        <aside
            className={
                "left-sidebar left-container d-block navbar-expand-md sidebar"
            }
        >
            <Navbar className="row m-0 p-0 mb-md-4 d-block" expand="lg">
                <div className="col-md-12">
                    <div className="logo-holder row">
                        <div
                            ref={logoHolder}
                            className="main-logo-container m-0 my-2 p-md-4"
                        >
                            <a href="#" className="main-logo col-xl-9"></a>
                        </div>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100">
                        <ListGroup>
                            <div
                                className="main-menu-container"
                                style={getMenuHeightStyle()}
                            >
                                {renderMenu()}
                            </div>
                            <ListGroupItem
                                ref={bottomMenu}
                                className={`bottom-menu p-0`}
                            >
                                <ListGroup>
                                    <ListGroupItem
                                        className={`seperator  p-0 mx-4`}
                                    ></ListGroupItem>
                                    {isGrantedControl && (
                                        <>
                                            <ListGroupItem
                                                className={`nav-item py-2 px-lg-4`}
                                            >
                                                <div
                                                    onClick={() => {
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
                                                                    ? "ChevronLeft"
                                                                    : "Settings"
                                                            }
                                                            className={
                                                                showSubMenuItems
                                                                    ? "btn-secondary back-to-menu"
                                                                    : ""
                                                            }
                                                        />
                                                    </div>
                                                    <span>
                                                        {showSubMenuItems
                                                            ? t(
                                                                  "navigation:backToApp"
                                                              )
                                                            : t(
                                                                  "navigation:administration"
                                                              )}
                                                    </span>
                                                </div>
                                            </ListGroupItem>
                                            <ListGroupItem
                                                className={`seperator  p-0 mx-4`}
                                            ></ListGroupItem>
                                        </>
                                    )}

                                    <ListGroupItem
                                        className={`nav-item collapseable p-0`}
                                    >
                                        <AppNavigationDropDown
                                            action={() => {
                                                setTimeout(() => {
                                                    updateScreenSize();
                                                }, 300);
                                            }}
                                            className="language"
                                            label={
                                                userLocale
                                                    ? userLocale?.name
                                                    : ""
                                            }
                                            iconClassName={`languages ${userLocale?.locale}`}
                                            subDropDownItems={languages
                                                .filter((e) => e.isActive)
                                                .filter((e) => e !== userLocale)
                                                .map((e) => {
                                                    return {
                                                        label: e.name,
                                                        iconClassName: `languages ${e.locale}`,
                                                        action: () => {
                                                            setUserLocale(e);
                                                            setLocale(e.locale);
                                                        },
                                                    };
                                                })}
                                        />
                                    </ListGroupItem>
                                    <ListGroupItem
                                        className={`seperator  p-0 mx-4`}
                                    ></ListGroupItem>
                                    <ListGroupItem
                                        className={`nav-item collapseable p-0`}
                                    >
                                        <AppNavigationDropDown
                                            action={() => {
                                                setTimeout(() => {
                                                    updateScreenSize();
                                                }, 300);
                                            }}
                                            label={
                                                user?.firstName &&
                                                user?.lastName
                                                    ? `${user?.firstName} ${user?.lastName}`
                                                    : "Account"
                                            }
                                            style={style}
                                            iconClassName="profile-picture"
                                            subDropDownItems={[
                                                {
                                                    label: t(
                                                        "navigation:profile"
                                                    ),
                                                    path: "/my-profile",
                                                    icon: "User",
                                                },
                                                {
                                                    label: t(
                                                        "navigation:logOut"
                                                    ),
                                                    action: handleLogoutEvent,
                                                    icon: "SignOut",
                                                },
                                            ]}
                                        />
                                    </ListGroupItem>

                                    <ListGroupItem className={`px-0 py-1`}>
                                        <Link
                                            to={"#"}
                                            className="nav-link text-center copyright"
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
