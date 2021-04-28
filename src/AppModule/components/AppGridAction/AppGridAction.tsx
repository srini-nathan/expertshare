import React, { FC, useState } from "react";
import { Link } from "@reach/router";

import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";
import { AppGridActionParams } from "../../models";

export const AppGridAction: FC<AppGridActionParams> = ({
    value,
    callback,
    editLink,
    addLink,
    listTree,
    listTreeSubUrl,
    ui,
    enableDelete = true,
}): JSX.Element => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        setShow(false);
        callback(value);
    };
    return (
        <div>
            {enableDelete ? (
                <a
                    href="#"
                    className={"mr-3"}
                    onClick={() => {
                        setShow(true);
                    }}
                >
                    <AppIcon name={"delete"} />
                </a>
            ) : null}

            <Link className={"mr-3"} to={`${editLink}${value}`}>
                <AppIcon name={"edit"} />
            </Link>
            {addLink ? (
                <Link className={"mr-3"} to={`${addLink}`}>
                    <AppIcon name={"add"} />
                </Link>
            ) : (
                <></>
            )}

            {listTree ? (
                <Link
                    className={"mr-3"}
                    to={`${editLink}${value}/${listTreeSubUrl}`}
                >
                    <AppIcon name={"ListTree"} />
                </Link>
            ) : (
                <></>
            )}
            {/* TODO: move it to grid or else, otherwise repeat multiple times on rows, on iterations */}
            <AppModal
                show={show}
                handleClose={handleClose}
                handleDelete={handleDelete}
                id={value}
                ui={ui}
            />
        </div>
    );
};
