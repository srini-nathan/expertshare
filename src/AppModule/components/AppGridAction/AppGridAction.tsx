import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";

export interface AppGridActionProps {
    // @FIXME: remove from this
    doorAction?: AppGridLinkAction;
    screenAction?: AppGridLinkAction;
    billBoardAction?: AppGridLinkAction;
    projectorAction?: AppGridLinkAction;
    // @FIXME: remove till here
    addAction?: AppGridLinkAction;
    editAction?: AppGridLinkAction;
    viewAction?: AppGridLinkAction;
    treeAction?: AppGridLinkAction;
    deleteAction?: AppGridClickAction;
    customClickActions?: AppGridCustomClickAction[];
    customLinkActions?: AppGridCustomLinkAction[];
    isGrantedControl?: boolean;
}

interface AppGridLinkAction {
    url: string;
    icon?: string;
    text?: string;
    disable?: boolean;
}

interface AppGridClickAction {
    onClick: () => void;
    disable?: boolean;
    confirmation?: string;
    confirmationTitle?: string;
}

interface AppGridCustomAction {
    icon?: string;
    text?: string;
    disable?: boolean;
}

interface AppGridCustomClickAction extends AppGridCustomAction {
    onClick: () => void;
    confirmation?: string;
    confirmationTitle?: string;
}

interface AppGridCustomLinkAction extends AppGridCustomAction {
    url: string;
}

interface LinkActionProps extends AppGridCustomAction {
    url: string;
}

const LinkAction: FC<LinkActionProps> = ({
    url,
    icon,
    text,
    disable = false,
}): JSX.Element => {
    const { t } = useTranslation();
    if (!text && !icon) {
        return <></>;
    }

    const renderTextOrIcon = () => {
        return (
            <>
                {icon ? <AppIcon name={icon} /> : null}
                {text ? t(text) : null}
            </>
        );
    };

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
                {renderTextOrIcon()}
            </a>
        );
    }

    return <Link to={url}>{renderTextOrIcon()}</Link>;
};
interface ClickActionProps extends AppGridCustomAction {
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
    customLinkActions = [],
}): JSX.Element => {
    const showItem = () => {
        if (isGrantedControl !== undefined) return isGrantedControl;
        return true;
    };

    return (
        <div className="actions">
            {viewAction ? (
                <LinkAction icon={"Eye"} {...viewAction}></LinkAction>
            ) : null}
            {addAction ? (
                <LinkAction icon={"add"} {...addAction}></LinkAction>
            ) : null}
            {treeAction ? (
                <LinkAction icon={"ListTree"} {...treeAction}></LinkAction>
            ) : null}
            {customClickActions.map(({ icon, text, ...rest }, index) => (
                <ClickAction key={index} icon={icon} text={text} {...rest} />
            ))}
            {customLinkActions.map(({ icon, text, ...rest }, index) => (
                <LinkAction key={index} icon={icon} text={text} {...rest} />
            ))}
            {showItem() ? (
                <>
                    {doorAction ? (
                        <LinkAction icon={"DoorOpen"} {...doorAction} />
                    ) : null}
                    {screenAction ? (
                        <LinkAction icon={"Desktop"} {...screenAction} />
                    ) : null}

                    {billBoardAction ? (
                        <LinkAction icon={"Globe"} {...billBoardAction} />
                    ) : null}

                    {projectorAction ? (
                        <LinkAction icon={"Projector"} {...projectorAction} />
                    ) : null}

                    {editAction ? (
                        <LinkAction icon={"edit"} {...editAction} />
                    ) : null}

                    {deleteAction ? (
                        <ClickAction icon={"delete"} {...deleteAction} />
                    ) : null}
                </>
            ) : null}
        </div>
    );
};
