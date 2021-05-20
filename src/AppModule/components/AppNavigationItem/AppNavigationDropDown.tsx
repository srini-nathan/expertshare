import React, { FC } from "react";
import { Accordion, ListGroupItem, ListGroup } from "react-bootstrap";
import { AppIcon } from "../AppIcon";

interface AppNavigationDropDownProps {
    label: string;
    className?: string;
    iconClassName?: string;
    icon?: string;
    path?: string;
    subDropDownItems?: AppNavigationDropDownProps[];
    action?: () => void;
}

export const AppNavigationDropDown: FC<AppNavigationDropDownProps> = ({
    label,
    className = "",
    iconClassName,
    subDropDownItems,
    action = () => {},
}) => {
    const [open, isOpen] = React.useState<boolean>(false);
    return (
        <Accordion>
            <Accordion.Toggle
                as={ListGroupItem}
                onClick={() => {
                    action();
                    isOpen(!open);
                }}
                className={`nav-link py-2 px-lg-4 custom-dropdown-toggle ${className}`}
                eventKey="0"
            >
                <div className="nav-icon img-container">
                    <i className={`${iconClassName}`}></i>
                </div>
                <span>{label}</span>
                <AppIcon name={!open ? "next" : "ChevronDown"} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <ListGroup className="sub-list  ">
                    {subDropDownItems &&
                        subDropDownItems.map((e) => {
                            return (
                                <ListGroupItem
                                    onClick={e.action && e.action}
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
