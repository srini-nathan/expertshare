import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";

export interface AppGridActionProps {
    doorAction?: AppGridLinkAction;
    screenAction?: AppGridLinkAction;
    billBoardAction?: AppGridLinkAction;
    projectorAction?: AppGridLinkAction;
    addAction?: AppGridLinkAction;
    editAction?: AppGridLinkAction;
    viewAction?: AppGridLinkAction;
    treeAction?: AppGridLinkAction;
    deleteAction?: AppGridClickAction;
    customClickActions?: AppGridCustomClickAction[];
    isGrantedControl?: boolean;
}

interface AppGridLinkAction {
    url?: string;
    disable?: boolean;
}

interface AppGridClickAction {
    confirmation?: string;
    confirmationTitle?: string;
    onClick?: () => void;
    disable?: boolean;
}

interface AppGridCustomClickAction {
    confirmation?: string;
    confirmationTitle?: string;
    onClick?: () => void;
    disable?: boolean;
    icon?: string;
    text?: string;
}
interface ActionProps {
    disable?: boolean;
    icon?: string;
}

interface LinkActionProps extends ActionProps {
    url?: string;
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
        <Link to={url}>
            <AppIcon name={icon} />
        </Link>
    );
};
interface ClickActionProps extends ActionProps {
    onClick?: () => void;
    confirmation?: string;
    text?: string;
    confirmationTitle?: string;
}

const ClickAction: FC<ClickActionProps> = ({
    icon,
    disable = false,
    onClick,
    confirmationTitle = "Delete Action",
    confirmation,
    text,
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
                    title={confirmationTitle}
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
                {icon && <AppIcon name={icon} />}
                {text}
            </a>
        </>
    );
};

export const AppGridAction: FC<AppGridActionProps> = ({
    doorAction,
    screenAction,
    billBoardAction,
    projectorAction,
    addAction,
    editAction,
    treeAction,
    deleteAction,
    viewAction,
    isGrantedControl,
    customClickActions = [],
}): JSX.Element => {
    const showItem = () => {
        if (isGrantedControl !== undefined) return isGrantedControl;
        return true;
    };

    return (
        <div className="actions">
            <LinkAction icon={"Eye"} {...viewAction}></LinkAction>
            <LinkAction icon={"add"} {...addAction}></LinkAction>
            <LinkAction icon={"ListTree"} {...treeAction}></LinkAction>
            {customClickActions.map(({ icon, text, ...rest }, index) => (
                <ClickAction key={index} icon={icon} text={text} {...rest} />
            ))}
            {showItem() ? (
                <>
                    <LinkAction icon={"DoorOpen"} {...doorAction}></LinkAction>
                    <LinkAction icon={"Desktop"} {...screenAction}></LinkAction>
                    <LinkAction
                        icon={"Globe"}
                        {...billBoardAction}
                    ></LinkAction>
                    <LinkAction
                        icon={"Projector"}
                        {...projectorAction}
                    ></LinkAction>
                    <LinkAction icon={"edit"} {...editAction}></LinkAction>
                    <ClickAction
                        icon={"delete"}
                        {...deleteAction}
                    ></ClickAction>
                </>
            ) : null}
        </div>
    );
};
