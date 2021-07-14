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
import { useRecoilValue } from "recoil";
import { Link, navigate, useLocation } from "@reach/router";
import { AppIcon } from "../../components/AppIcon";
import {
    AppNavigationDropDown,
    AppNavigationItem,
    AppNavigationSubMenuItem,
    AppSubNavigationItemProps,
    AppNavigationItemProps,
} from "../../components/AppNavigationItem";
import { useGlobalData } from "../../contexts";
import "./assets/scss/style.scss";
// import FooterLogo from "./assets/images/expertshare_logo_bw_footer.svg";
import {
    AuthContext,
    logoutAction,
} from "../../../SecurityModule/contexts/AuthContext";
import {
    useWindowSize,
    useBuildAssetPath,
    useIsGranted,
    useAuthState,
    useUserLocale,
} from "../../hooks";
import { CONSTANTS } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";
import { errorToast, isGranted } from "../../utils";
import { LanguageApi, UserApi } from "../../../AdminModule/apis";
import { Language, PUser } from "../../../AdminModule/models";
import { FileTypeInfo } from "../../models";
import {
    AppDashboardLayoutOptions,
    appDashboardLayoutOptions,
} from "../../atoms";

const { Upload: UPLOAD, Role } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

const {
    ROLE: { ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_OPERATOR, ROLE_SUPPORT },
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
    const {
        navPosition: menuLocation,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);
    const [navOpen, isNavOpen] = useState<boolean>(false);
    const { container } = useGlobalData();

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
            isVisible:
                isGranted(role, ROLE_ADMIN) || isGranted(role, ROLE_SUPPORT),
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
        {
            label: "navigation:administration.infopage",
            path: "/admin/info-pages",
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
    const location = useLocation();
    const logoHolder = useRef<HTMLDivElement>(null);
    const bottomMenu = useRef<HTMLDivElement>(null);

    const [showMenu, setShowMenu] = useState<boolean>(false);
    useEffect(() => {
        if (!navOpen) {
            setShowMenu(false);
        }
    }, [navOpen]);

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
                height: `calc(100vh - ${logoHeight + bottomMenuHeight + 30}px)`,
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
        if (subMenuItems.some((e) => e && e.path === location.pathname)) {
            isSubMenuItems(true);
        }
    }, []);
    useEffect(() => {
        if (
            overflowItems.some(
                (e: AppNavigationItemProps | AppSubNavigationItemProps) =>
                    e && e.path === location.pathname
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

    useEffect(() => {
        if (locale && languages) {
            const ul = languages.find((e) => e.locale === locale);
            setUserLocale(ul);
        }
    }, [locale, languages]);

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
                                        return showSubMenuItems &&
                                            menuLocation !== "bottom" ? (
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
    const renderSubMenu = () => {
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
                                onClick={() => isNavOpen(!navOpen)}
                            />
                        );
                    })}
            </>
        );
    };

    const getTitle = () => {
        let title = "Info Page";
        if (
            container &&
            container.configuration &&
            (container.configuration as any).translations
        ) {
            title =
                ((container.configuration as any).translations.find(
                    (e: any) => e.locale === locale
                ) &&
                    (container.configuration as any).translations.find(
                        (e: any) => e.locale === locale
                    ).infoPageNavigationTitle) ||
                "Info Page";
        }
        return title;
    };
    const renderMenu = () => {
        if (showSubMenuItems && (menuLocation === "left" || width < 768)) {
            return renderSubMenu();
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
                                onClick={() => isNavOpen(!navOpen)}
                            />
                        );
                    })}
                {container &&
                    container.configuration &&
                    (container.configuration as any).isInfoPageEnable && (
                        <AppNavigationItem
                            label={getTitle()}
                            path={"/info-page"}
                            onClick={() => isNavOpen(!navOpen)}
                            icon={{
                                name: "fak fa-publicationsv2-cs",
                            }}
                            className="main-menu"
                        />
                    )}
                <ListGroupItem
                    className={`nav-item py-2 collapseable px-lg-4`}
                    onClick={() => isNavOpen(!navOpen)}
                >
                    <a
                        target="_blank"
                        href={`https://www.credit-suisse.com/microsites/cssw-event-support/${locale}.html`}
                        className="nav-link"
                    >
                        <div className="nav-icon">
                            <i className="fak fa-userguide-cs" />
                        </div>
                        <span>{t("navigation:userGuide")}</span>
                    </a>
                </ListGroupItem>
                {location.pathname.includes("a3d") ? (
                    <AppNavigationItem
                        label={"navigation:2dview"}
                        path={"/event"}
                        icon={{
                            name: "fak fa-3d-cs",
                        }}
                        className="main-menu"
                        onClick={() => isNavOpen(!navOpen)}
                    />
                ) : (
                    <AppNavigationItem
                        label={"navigation:3dview"}
                        path={"/a3d"}
                        icon={{
                            name: "fak fa-3d-cs",
                        }}
                        className="main-menu"
                        onClick={() => isNavOpen(!navOpen)}
                    />
                )}

                {renderMoreMenu()}
            </>
        );
    };

    const updateProfile = async (formData: PUser) => {
        return UserApi.updateProfile<PUser, PUser>(user.id, formData);
    };

    return (
        <aside
            className={`${menuLocation}-sidebar left-container d-block navbar-expand-md sidebar`}
        >
            <Navbar
                className="row m-0 p-0 mb-md-4 d-block"
                expand="lg"
                onToggle={isNavOpen}
                expanded={navOpen}
            >
                <div className="col-md-12">
                    <div className="logo-holder row">
                        <div
                            ref={logoHolder}
                            className="main-logo-container my-0 my-lg-2 p-md-4 p-xl-2"
                        >
                            <Link to="/" className="main-logo col-xl-9"></Link>
                        </div>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    </div>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100">
                        <ListGroup>
                            <div
                                className="main-menu-container"
                                style={
                                    menuLocation !== "bottom"
                                        ? getMenuHeightStyle()
                                        : {}
                                }
                            >
                                {renderMenu()}
                            </div>
                            <ListGroupItem
                                className={`bottom-menu p-0 ${
                                    showMenu ? "show" : ""
                                }`}
                            >
                                <ListGroup ref={bottomMenu}>
                                    {menuLocation === "bottom" && width > 768 && (
                                        <ListGroupItem className={`px-0 py-1`}>
                                            <a
                                                href="https://expertshare.live"
                                                className="nav-link text-center copyright"
                                                target="_blank"
                                            >
                                                <span>
                                                    Virtual event platform by
                                                    <svg
                                                        width="607"
                                                        height="133"
                                                        viewBox="0 0 607 133"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M206.047 76.51L209.113 79.43C206.631 82.1553 204.198 84.102 201.813 85.27C199.477 86.3893 196.825 86.949 193.856 86.949C188.697 86.949 184.585 85.27 181.519 81.912C178.453 78.554 176.92 74.1253 176.92 68.626C176.92 63.0293 178.429 58.5033 181.446 55.048C184.463 51.544 188.43 49.792 193.345 49.792C198.163 49.792 201.959 51.3007 204.733 54.318C207.556 57.3353 208.967 61.399 208.967 66.509C208.967 67.1417 208.918 67.896 208.821 68.772H181.811C181.957 72.7627 183.028 76.1207 185.023 78.846C187.018 81.5713 189.963 82.934 193.856 82.934C196.143 82.934 198.139 82.4717 199.842 81.547C201.594 80.6223 203.662 78.9433 206.047 76.51ZM193.345 53.734C190.23 53.734 187.651 54.7317 185.607 56.727C183.612 58.6737 182.395 61.472 181.957 65.122H204.149C204.052 61.618 203.054 58.844 201.156 56.8C199.258 54.756 196.654 53.734 193.345 53.734ZM241.705 86H236.303L226.083 70.816L215.717 86H210.388L223.163 67.604L211.337 50.741H216.739L226.083 64.319L235.281 50.741H240.537L228.93 67.385L241.705 86ZM261.777 49.865C266.303 49.865 270.026 51.5927 272.946 55.048C275.866 58.5033 277.326 62.932 277.326 68.334C277.326 73.7847 275.866 78.2377 272.946 81.693C270.026 85.1483 266.303 86.876 261.777 86.876C256.18 86.876 252.116 84.832 249.586 80.744V99.14H244.768V50.741H249.294V56.654C251.922 52.128 256.083 49.865 261.777 49.865ZM261.339 82.788C264.648 82.788 267.3 81.4497 269.296 78.773C271.34 76.0963 272.362 72.6167 272.362 68.334C272.362 64.0513 271.364 60.5717 269.369 57.895C267.373 55.2183 264.697 53.88 261.339 53.88C257.737 53.88 254.842 55.1697 252.652 57.749C250.462 60.3283 249.367 63.8567 249.367 68.334C249.367 72.7627 250.462 76.291 252.652 78.919C254.89 81.4983 257.786 82.788 261.339 82.788ZM309.55 76.51L312.616 79.43C310.134 82.1553 307.701 84.102 305.316 85.27C302.98 86.3893 300.328 86.949 297.359 86.949C292.201 86.949 288.088 85.27 285.022 81.912C281.956 78.554 280.423 74.1253 280.423 68.626C280.423 63.0293 281.932 58.5033 284.949 55.048C287.966 51.544 291.933 49.792 296.848 49.792C301.666 49.792 305.462 51.3007 308.236 54.318C311.059 57.3353 312.47 61.399 312.47 66.509C312.47 67.1417 312.422 67.896 312.324 68.772H285.314C285.46 72.7627 286.531 76.1207 288.526 78.846C290.521 81.5713 293.466 82.934 297.359 82.934C299.647 82.934 301.642 82.4717 303.345 81.547C305.097 80.6223 307.166 78.9433 309.55 76.51ZM296.848 53.734C293.734 53.734 291.154 54.7317 289.11 56.727C287.115 58.6737 285.898 61.472 285.46 65.122H307.652C307.555 61.618 306.557 58.844 304.659 56.8C302.761 54.756 300.158 53.734 296.848 53.734ZM330.9 50.376C332.554 50.376 334.404 50.7167 336.448 51.398L335.499 55.267C333.893 54.7803 332.36 54.537 330.9 54.537C328.369 54.537 326.325 55.6077 324.768 57.749C323.21 59.8417 322.432 62.713 322.432 66.363V86H317.614V50.741H322.14V56.216C322.918 54.4153 324.062 53.004 325.571 51.982C327.128 50.9113 328.904 50.376 330.9 50.376ZM360.727 81.547L361.603 85.343C359.364 86.1703 357.052 86.584 354.668 86.584C351.65 86.584 349.46 85.9027 348.098 84.54C346.735 83.1287 346.054 81.0603 346.054 78.335V54.318H339.338V50.741H346.054V38.404H350.872V50.741H360.946V54.318H350.872V77.678C350.872 79.43 351.212 80.671 351.894 81.401C352.575 82.131 353.719 82.496 355.325 82.496C356.979 82.496 358.78 82.1797 360.727 81.547ZM381.371 47.456C384.631 47.456 387.478 47.894 389.912 48.77C392.345 49.646 394.851 51.1547 397.431 53.296L392.321 59.501C390.179 57.7977 388.281 56.654 386.627 56.07C385.021 55.4373 383.196 55.121 381.152 55.121C379.254 55.121 377.721 55.4617 376.553 56.143C375.433 56.8243 374.874 57.7247 374.874 58.844C374.874 60.158 375.944 61.1313 378.086 61.764C379.108 62.056 380.933 62.494 383.561 63.078C388.963 64.2947 392.71 65.7303 394.803 67.385C396.944 69.0397 398.015 71.5703 398.015 74.977C398.015 78.6757 396.579 81.6443 393.708 83.883C390.836 86.073 386.943 87.168 382.028 87.168C378.426 87.168 375.239 86.6327 372.465 85.562C369.739 84.4913 366.917 82.6663 363.997 80.087L369.472 73.955C372.197 76.1937 374.436 77.6537 376.188 78.335C377.94 79.1137 379.959 79.503 382.247 79.503C384.193 79.503 385.751 79.1623 386.919 78.481C388.135 77.7997 388.744 76.8263 388.744 75.561C388.744 73.9063 387.503 72.714 385.021 71.984C384.68 71.9353 383.901 71.765 382.685 71.473C381.517 71.181 380.47 70.9377 379.546 70.743C374.241 69.575 370.615 68.188 368.669 66.582C366.771 64.9273 365.822 62.4453 365.822 59.136C365.822 55.8267 367.209 53.0527 369.983 50.814C372.805 48.5753 376.601 47.456 381.371 47.456ZM427.929 47.456C432.115 47.456 435.375 48.6483 437.711 51.033C440.096 53.369 441.288 56.508 441.288 60.45V86H431.798V63.297C431.798 60.815 431.19 58.917 429.973 57.603C428.805 56.289 427.102 55.632 424.863 55.632C422.673 55.632 420.873 56.362 419.461 57.822C418.05 59.282 417.344 61.18 417.344 63.516V86H407.854V34.17H417.344V52.055C419.875 48.989 423.403 47.456 427.929 47.456ZM469.632 47.456C474.79 47.456 478.781 48.6483 481.604 51.033C484.426 53.4177 485.838 56.6783 485.838 60.815V86H477.297V82.131C474.815 85.5377 470.8 87.241 465.252 87.241C461.261 87.241 458.025 86.3163 455.543 84.467C453.109 82.6177 451.893 79.9897 451.893 76.583C451.893 72.8357 453.255 69.94 455.981 67.896C458.706 65.852 462.721 64.3677 468.026 63.443L476.786 61.837V60.961C476.786 59.1603 476.153 57.7733 474.888 56.8C473.671 55.778 471.968 55.267 469.778 55.267C467.393 55.267 465.446 55.7293 463.938 56.654C462.186 57.7247 460.263 59.282 458.171 61.326L452.185 55.851C456.905 50.2543 462.721 47.456 469.632 47.456ZM466.858 79.649C469.778 79.649 472.162 78.8947 474.012 77.386C475.861 75.8773 476.786 73.6873 476.786 70.816V68.626L470.508 69.94C467.15 70.67 464.741 71.473 463.281 72.349C461.869 73.1763 461.164 74.3687 461.164 75.926C461.164 77.094 461.65 78.0187 462.624 78.7C463.646 79.3327 465.057 79.649 466.858 79.649ZM515.955 48.259C517.464 48.259 519.435 48.624 521.868 49.354L520.189 57.603C518.389 57.1163 516.807 56.873 515.444 56.873C512.914 56.873 510.918 57.822 509.458 59.72C507.998 61.618 507.268 64.246 507.268 67.604V86H497.778V48.697H506.611V54.172C508.558 50.23 511.673 48.259 515.955 48.259ZM546.544 79.138C548.637 79.138 550.437 78.773 551.946 78.043C553.455 77.2643 555.353 75.926 557.64 74.028L562.969 79.868C560.39 82.496 557.786 84.3697 555.158 85.489C552.53 86.6083 549.586 87.168 546.325 87.168C540.339 87.168 535.57 85.3917 532.017 81.839C528.513 78.2863 526.761 73.517 526.761 67.531C526.761 61.6423 528.464 56.8243 531.871 53.077C535.278 49.3297 539.828 47.456 545.522 47.456C551.07 47.456 555.353 49.0863 558.37 52.347C561.436 55.6077 562.969 60.1823 562.969 66.071C562.969 67.093 562.92 68.334 562.823 69.794H536.032C536.47 72.7627 537.565 75.0743 539.317 76.729C541.118 78.335 543.527 79.138 546.544 79.138ZM545.23 54.902C540.412 54.902 537.419 57.603 536.251 63.005H553.698C553.503 60.4743 552.652 58.5033 551.143 57.092C549.683 55.632 547.712 54.902 545.23 54.902Z" />
                                                        <path d="M28 113C27.9776 123.731 36.6539 133 47.9449 133H112.866C117.377 133 121.326 129.961 122.494 125.589L141.309 55.1788C144.26 44.1359 137.436 33.2646 126.989 30.6118C126.94 32.1165 126.718 33.646 126.308 35.1788L109.44 98.1788C107.1 106.921 99.1875 113 90.148 113H28Z" />
                                                        <path d="M19.0302 15.1732C21.2444 6.25819 29.239 0 38.4135 0H99.0153C112.15 0 121.709 12.4758 118.308 25.1789L101.44 88.1789C99.0998 96.9213 91.1873 103 82.148 103H9.99173C3.49964 103 -1.26672 96.8951 0.300087 90.5866L19.0302 15.1732Z" />
                                                    </svg>
                                                </span>
                                            </a>
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem
                                        className={`seperator  p-0 mx-4`}
                                    ></ListGroupItem>
                                    {(isGrantedControl ||
                                        role === ROLE_SUPPORT) && (
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
                                        </>
                                    )}

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
                                                        onClick: () =>
                                                            isNavOpen(!navOpen),
                                                        action: () => {
                                                            updateProfile({
                                                                locale:
                                                                    e.locale,
                                                            }).then(() => {
                                                                setUserLocale(
                                                                    e
                                                                );
                                                                setLocale(
                                                                    e.locale
                                                                );
                                                                navigate(
                                                                    "/reloading",
                                                                    {
                                                                        state: {
                                                                            url:
                                                                                location.pathname,
                                                                        },
                                                                    }
                                                                ).then();
                                                            });
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
                                                    iconClassName:
                                                        "fak fa-userprofile-cs-profile",
                                                    onClick: () =>
                                                        isNavOpen(!navOpen),
                                                },
                                                {
                                                    label: t(
                                                        "navigation:logOut"
                                                    ),
                                                    onClick: () =>
                                                        isNavOpen(!navOpen),
                                                    action: handleLogoutEvent,
                                                    iconClassName:
                                                        "fak fa-logout-cs",
                                                },
                                            ]}
                                        />
                                    </ListGroupItem>

                                    {(menuLocation === "left" ||
                                        width < 768) && (
                                        <>
                                            <ListGroupItem
                                                className={`seperator p-0 mx-4`}
                                            ></ListGroupItem>
                                            <ListGroupItem
                                                className={`px-0 py-1`}
                                            >
                                                <a
                                                    href="https://expertshare.live"
                                                    className="nav-link text-center copyright"
                                                    target="_blank"
                                                >
                                                    <span>
                                                        Virtual event platform
                                                        by
                                                        <svg
                                                            width="607"
                                                            height="133"
                                                            viewBox="0 0 607 133"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M206.047 76.51L209.113 79.43C206.631 82.1553 204.198 84.102 201.813 85.27C199.477 86.3893 196.825 86.949 193.856 86.949C188.697 86.949 184.585 85.27 181.519 81.912C178.453 78.554 176.92 74.1253 176.92 68.626C176.92 63.0293 178.429 58.5033 181.446 55.048C184.463 51.544 188.43 49.792 193.345 49.792C198.163 49.792 201.959 51.3007 204.733 54.318C207.556 57.3353 208.967 61.399 208.967 66.509C208.967 67.1417 208.918 67.896 208.821 68.772H181.811C181.957 72.7627 183.028 76.1207 185.023 78.846C187.018 81.5713 189.963 82.934 193.856 82.934C196.143 82.934 198.139 82.4717 199.842 81.547C201.594 80.6223 203.662 78.9433 206.047 76.51ZM193.345 53.734C190.23 53.734 187.651 54.7317 185.607 56.727C183.612 58.6737 182.395 61.472 181.957 65.122H204.149C204.052 61.618 203.054 58.844 201.156 56.8C199.258 54.756 196.654 53.734 193.345 53.734ZM241.705 86H236.303L226.083 70.816L215.717 86H210.388L223.163 67.604L211.337 50.741H216.739L226.083 64.319L235.281 50.741H240.537L228.93 67.385L241.705 86ZM261.777 49.865C266.303 49.865 270.026 51.5927 272.946 55.048C275.866 58.5033 277.326 62.932 277.326 68.334C277.326 73.7847 275.866 78.2377 272.946 81.693C270.026 85.1483 266.303 86.876 261.777 86.876C256.18 86.876 252.116 84.832 249.586 80.744V99.14H244.768V50.741H249.294V56.654C251.922 52.128 256.083 49.865 261.777 49.865ZM261.339 82.788C264.648 82.788 267.3 81.4497 269.296 78.773C271.34 76.0963 272.362 72.6167 272.362 68.334C272.362 64.0513 271.364 60.5717 269.369 57.895C267.373 55.2183 264.697 53.88 261.339 53.88C257.737 53.88 254.842 55.1697 252.652 57.749C250.462 60.3283 249.367 63.8567 249.367 68.334C249.367 72.7627 250.462 76.291 252.652 78.919C254.89 81.4983 257.786 82.788 261.339 82.788ZM309.55 76.51L312.616 79.43C310.134 82.1553 307.701 84.102 305.316 85.27C302.98 86.3893 300.328 86.949 297.359 86.949C292.201 86.949 288.088 85.27 285.022 81.912C281.956 78.554 280.423 74.1253 280.423 68.626C280.423 63.0293 281.932 58.5033 284.949 55.048C287.966 51.544 291.933 49.792 296.848 49.792C301.666 49.792 305.462 51.3007 308.236 54.318C311.059 57.3353 312.47 61.399 312.47 66.509C312.47 67.1417 312.422 67.896 312.324 68.772H285.314C285.46 72.7627 286.531 76.1207 288.526 78.846C290.521 81.5713 293.466 82.934 297.359 82.934C299.647 82.934 301.642 82.4717 303.345 81.547C305.097 80.6223 307.166 78.9433 309.55 76.51ZM296.848 53.734C293.734 53.734 291.154 54.7317 289.11 56.727C287.115 58.6737 285.898 61.472 285.46 65.122H307.652C307.555 61.618 306.557 58.844 304.659 56.8C302.761 54.756 300.158 53.734 296.848 53.734ZM330.9 50.376C332.554 50.376 334.404 50.7167 336.448 51.398L335.499 55.267C333.893 54.7803 332.36 54.537 330.9 54.537C328.369 54.537 326.325 55.6077 324.768 57.749C323.21 59.8417 322.432 62.713 322.432 66.363V86H317.614V50.741H322.14V56.216C322.918 54.4153 324.062 53.004 325.571 51.982C327.128 50.9113 328.904 50.376 330.9 50.376ZM360.727 81.547L361.603 85.343C359.364 86.1703 357.052 86.584 354.668 86.584C351.65 86.584 349.46 85.9027 348.098 84.54C346.735 83.1287 346.054 81.0603 346.054 78.335V54.318H339.338V50.741H346.054V38.404H350.872V50.741H360.946V54.318H350.872V77.678C350.872 79.43 351.212 80.671 351.894 81.401C352.575 82.131 353.719 82.496 355.325 82.496C356.979 82.496 358.78 82.1797 360.727 81.547ZM381.371 47.456C384.631 47.456 387.478 47.894 389.912 48.77C392.345 49.646 394.851 51.1547 397.431 53.296L392.321 59.501C390.179 57.7977 388.281 56.654 386.627 56.07C385.021 55.4373 383.196 55.121 381.152 55.121C379.254 55.121 377.721 55.4617 376.553 56.143C375.433 56.8243 374.874 57.7247 374.874 58.844C374.874 60.158 375.944 61.1313 378.086 61.764C379.108 62.056 380.933 62.494 383.561 63.078C388.963 64.2947 392.71 65.7303 394.803 67.385C396.944 69.0397 398.015 71.5703 398.015 74.977C398.015 78.6757 396.579 81.6443 393.708 83.883C390.836 86.073 386.943 87.168 382.028 87.168C378.426 87.168 375.239 86.6327 372.465 85.562C369.739 84.4913 366.917 82.6663 363.997 80.087L369.472 73.955C372.197 76.1937 374.436 77.6537 376.188 78.335C377.94 79.1137 379.959 79.503 382.247 79.503C384.193 79.503 385.751 79.1623 386.919 78.481C388.135 77.7997 388.744 76.8263 388.744 75.561C388.744 73.9063 387.503 72.714 385.021 71.984C384.68 71.9353 383.901 71.765 382.685 71.473C381.517 71.181 380.47 70.9377 379.546 70.743C374.241 69.575 370.615 68.188 368.669 66.582C366.771 64.9273 365.822 62.4453 365.822 59.136C365.822 55.8267 367.209 53.0527 369.983 50.814C372.805 48.5753 376.601 47.456 381.371 47.456ZM427.929 47.456C432.115 47.456 435.375 48.6483 437.711 51.033C440.096 53.369 441.288 56.508 441.288 60.45V86H431.798V63.297C431.798 60.815 431.19 58.917 429.973 57.603C428.805 56.289 427.102 55.632 424.863 55.632C422.673 55.632 420.873 56.362 419.461 57.822C418.05 59.282 417.344 61.18 417.344 63.516V86H407.854V34.17H417.344V52.055C419.875 48.989 423.403 47.456 427.929 47.456ZM469.632 47.456C474.79 47.456 478.781 48.6483 481.604 51.033C484.426 53.4177 485.838 56.6783 485.838 60.815V86H477.297V82.131C474.815 85.5377 470.8 87.241 465.252 87.241C461.261 87.241 458.025 86.3163 455.543 84.467C453.109 82.6177 451.893 79.9897 451.893 76.583C451.893 72.8357 453.255 69.94 455.981 67.896C458.706 65.852 462.721 64.3677 468.026 63.443L476.786 61.837V60.961C476.786 59.1603 476.153 57.7733 474.888 56.8C473.671 55.778 471.968 55.267 469.778 55.267C467.393 55.267 465.446 55.7293 463.938 56.654C462.186 57.7247 460.263 59.282 458.171 61.326L452.185 55.851C456.905 50.2543 462.721 47.456 469.632 47.456ZM466.858 79.649C469.778 79.649 472.162 78.8947 474.012 77.386C475.861 75.8773 476.786 73.6873 476.786 70.816V68.626L470.508 69.94C467.15 70.67 464.741 71.473 463.281 72.349C461.869 73.1763 461.164 74.3687 461.164 75.926C461.164 77.094 461.65 78.0187 462.624 78.7C463.646 79.3327 465.057 79.649 466.858 79.649ZM515.955 48.259C517.464 48.259 519.435 48.624 521.868 49.354L520.189 57.603C518.389 57.1163 516.807 56.873 515.444 56.873C512.914 56.873 510.918 57.822 509.458 59.72C507.998 61.618 507.268 64.246 507.268 67.604V86H497.778V48.697H506.611V54.172C508.558 50.23 511.673 48.259 515.955 48.259ZM546.544 79.138C548.637 79.138 550.437 78.773 551.946 78.043C553.455 77.2643 555.353 75.926 557.64 74.028L562.969 79.868C560.39 82.496 557.786 84.3697 555.158 85.489C552.53 86.6083 549.586 87.168 546.325 87.168C540.339 87.168 535.57 85.3917 532.017 81.839C528.513 78.2863 526.761 73.517 526.761 67.531C526.761 61.6423 528.464 56.8243 531.871 53.077C535.278 49.3297 539.828 47.456 545.522 47.456C551.07 47.456 555.353 49.0863 558.37 52.347C561.436 55.6077 562.969 60.1823 562.969 66.071C562.969 67.093 562.92 68.334 562.823 69.794H536.032C536.47 72.7627 537.565 75.0743 539.317 76.729C541.118 78.335 543.527 79.138 546.544 79.138ZM545.23 54.902C540.412 54.902 537.419 57.603 536.251 63.005H553.698C553.503 60.4743 552.652 58.5033 551.143 57.092C549.683 55.632 547.712 54.902 545.23 54.902Z" />
                                                            <path d="M28 113C27.9776 123.731 36.6539 133 47.9449 133H112.866C117.377 133 121.326 129.961 122.494 125.589L141.309 55.1788C144.26 44.1359 137.436 33.2646 126.989 30.6118C126.94 32.1165 126.718 33.646 126.308 35.1788L109.44 98.1788C107.1 106.921 99.1875 113 90.148 113H28Z" />
                                                            <path d="M19.0302 15.1732C21.2444 6.25819 29.239 0 38.4135 0H99.0153C112.15 0 121.709 12.4758 118.308 25.1789L101.44 88.1789C99.0998 96.9213 91.1873 103 82.148 103H9.99173C3.49964 103 -1.26672 96.8951 0.300087 90.5866L19.0302 15.1732Z" />
                                                        </svg>
                                                    </span>
                                                </a>
                                            </ListGroupItem>
                                        </>
                                    )}
                                    {menuLocation === "bottom" &&
                                        width > 768 &&
                                        showSubMenuItems && (
                                            <ListGroupItem
                                                className={`seperator  p-0 mx-4`}
                                            ></ListGroupItem>
                                        )}
                                </ListGroup>
                                <ListGroup>
                                    {showSubMenuItems &&
                                        menuLocation === "bottom" &&
                                        width > 768 && (
                                            <div
                                                className="main-menu-container"
                                                style={getMenuHeightStyle()}
                                            >
                                                {renderSubMenu()}
                                            </div>
                                        )}
                                </ListGroup>
                            </ListGroupItem>
                        </ListGroup>
                    </Nav>
                </Navbar.Collapse>
                <div
                    onClick={() => {
                        setShowMenu(!showMenu);
                        isNavOpen(!navOpen);
                    }}
                    id="show-menu-toggler"
                >
                    <i className="fak fa-text"></i>
                </div>
            </Navbar>
        </aside>
    );
};

export default AppNavigation;
