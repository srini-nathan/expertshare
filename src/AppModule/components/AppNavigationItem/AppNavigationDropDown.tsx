import React, { FC, useRef } from "react";
import { Accordion, ListGroupItem, ListGroup } from "react-bootstrap";
import { Link, Match } from "@reach/router";
import { AppIcon } from "../AppIcon";

interface AppNavigationDropDownProps {
    label: string;
    className?: string;
    style?: any;
    iconClassName?: string;
    icon?: string;
    path?: string;
    subDropDownItems?: AppNavigationDropDownProps[];
    action?: () => void;
}

export const AppNavigationDropDown: FC<AppNavigationDropDownProps> = ({
    label,
    className = "",
    style = {},
    iconClassName,
    subDropDownItems,
    action = () => {},
}) => {
    const [open, isOpen] = React.useState<boolean>(false);
    const accordionRef = useRef<HTMLDivElement>(null);

    const closeMenu = () => {
        if (accordionRef && accordionRef.current) {
            accordionRef?.current?.click();
        }
    };

    return (
        <Accordion>
            <Accordion.Toggle
                ref={accordionRef}
                onClick={() => {
                    action();
                    isOpen(!open);
                }}
                className={`nav-link py-2 px-lg-4 custom-dropdown-toggle list-group-item ${className}`}
                eventKey="0"
            >
                <div className="nav-icon img-container">
                    <i style={style} className={`${iconClassName}`}></i>
                </div>
                <span>{label}</span>
                <AppIcon name={!open ? "next" : "ChevronDown"} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <ListGroup className="sub-list  ">
                    {subDropDownItems &&
                        subDropDownItems.map((e) => {
                            if (e.path)
                                return (
                                    <Match path={e.path} key={e.path}>
                                        {(props) => {
                                            return (
                                                <Link
                                                    onClick={() => {
                                                        closeMenu();
                                                    }}
                                                    to={e.path as string}
                                                >
                                                    <ListGroupItem
                                                        className={`nav-item px-lg-4 ${className} ${
                                                            props.location.pathname.includes(
                                                                e.path as string
                                                            )
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div className="nav-icon img-container">
                                                            {e.icon ? (
                                                                <AppIcon
                                                                    name={
                                                                        e.icon
                                                                    }
                                                                />
                                                            ) : (
                                                                <i
                                                                    className={`${e.iconClassName}`}
                                                                ></i>
                                                            )}
                                                        </div>
                                                        <span>{e.label}</span>
                                                    </ListGroupItem>
                                                </Link>
                                            );
                                        }}
                                    </Match>
                                );
                            return (
                                <ListGroupItem
                                    onClick={() => {
                                        if (e.action) {
                                            e.action();
                                        }
                                        closeMenu();
                                    }}
                                    href={e.path}
                                    key={e.label}
                                >
                                    <div className="nav-icon img-container">
                                        {e.icon ? (
                                            <AppIcon name={e.icon} />
                                        ) : (
                                            <i
                                                className={`${e.iconClassName}`}
                                            ></i>
                                        )}
                                    </div>
                                    <span>{e.label}</span>
                                </ListGroupItem>
                            );
                        })}
                </ListGroup>
            </Accordion.Collapse>
        </Accordion>
    );
};
