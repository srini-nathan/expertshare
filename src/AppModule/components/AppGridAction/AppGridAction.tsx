import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";

export interface AppGridActionProps {
    addAction?: AppGridLinkAction;
    editAction?: AppGridLinkAction;
    viewAction?: AppGridLinkAction;
    treeAction?: AppGridLinkAction;
    deleteAction?: AppGridClickAction;
    buttonAction?: AppCustomButtonAction[];
    customClickActions?: AppGridCustomClickAction[];
}

interface AppGridLinkAction {
    url?: string;
    disable?: boolean;
}

interface AppGridClickAction {
    confirmation?: string;
    onClick?: () => void;
    disable?: boolean;
}

interface AppGridCustomClickAction {
    confirmation?: string;
    onClick?: () => void;
    disable?: boolean;
    icon: string;
}
interface AppCustomButtonAction {
    onClick?: () => void;
    text?: string;
}

interface ActionProps {
    disable?: boolean;
    icon: string;
}

interface LinkActionProps extends ActionProps {
    url?: string;
}
interface ButtonActionProps {
    onClick?: () => void;
    text?: string;
}

const LinkAction: FC<LinkActionProps> = ({
    url,
    icon,
    disable = false,
}): JSX.Element => {
    if (!url || !icon) {
        return <></>;
    }

    if (disable) {
        return (
            <a
                href="#"
                className={"disabled text-muted"}
                onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
            >
                <AppIcon name={icon} />
            </a>
        );
    }

    return (
        <Link className={"mr-3"} to={url}>
            <AppIcon name={icon} />
        </Link>
    );
};
const ButtonAction: FC<ButtonActionProps> = ({
    text,
    onClick,
}): JSX.Element => {
    if (!text || !onClick) {
        return <></>;
    }

    return (
        <div className="action-btn">
            <a
                href="#"
                className="btn btn-secondary mr-2"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClick();
                }}
            >
                {text}
            </a>
        </div>
    );
};

interface ClickActionProps extends ActionProps {
    onClick?: () => void;
    confirmation?: string;
}

const ClickAction: FC<ClickActionProps> = ({
    icon,
    disable = false,
    onClick,
    confirmation,
}): JSX.Element => {
    const [show, setShow] = useState(false);
    if (!onClick) {
        return <></>;
    }
    const handlePositive = () => {
        setShow(false);
        onClick();
    };
    const handleNegative = () => {
        setShow(false);
    };

    return (
        <>
            {/* TODO: move it to grid or else, otherwise repeat multiple times on rows, on iterations */}
            {confirmation ? (
                <AppModal
                    show={show}
                    handleClose={handleNegative}
                    handleDelete={handlePositive}
                    bodyContent={confirmation}
                />
            ) : null}
            <a
                href="#"
                className={disable ? "disabled text-muted" : ""}
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!disable) {
                        if (confirmation) {
                            setShow(true);
                        } else {
                            onClick();
                        }
                    }
                }}
            >
                <AppIcon name={icon} />
            </a>
        </>
    );
};

export const AppGridAction: FC<AppGridActionProps> = ({
    addAction,
    editAction,
    treeAction,
    deleteAction,
    buttonAction = [],
    viewAction,
    customClickActions = [],
}): JSX.Element => {
    return (
        <div className="actions">
            <LinkAction icon={"add"} {...addAction}></LinkAction>
            <LinkAction icon={"edit"} {...editAction}></LinkAction>
            <LinkAction icon={"ListTree"} {...treeAction}></LinkAction>
            {buttonAction.map(({ text, ...rest }) => (
                <ButtonAction text={text} {...rest}></ButtonAction>
            ))}
            {customClickActions.map(({ icon, ...rest }) => (
                <ClickAction icon={icon} {...rest}></ClickAction>
            ))}
            <ClickAction icon={"delete"} {...deleteAction}></ClickAction>
            <LinkAction icon={"Eye"} {...viewAction}></LinkAction>
        </div>
    );
};
