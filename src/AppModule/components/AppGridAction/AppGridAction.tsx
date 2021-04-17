import React, { FC, useState } from "react";
import { Link } from "@reach/router";

import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";

export const AppGridAction: FC<{
    value: number;
    callback: (id: number) => void;
    editLink: string;
    addLink: string;
    listTree?: boolean;
    listTreeSubUrl?: string;
}> = ({
    value,
    callback,
    editLink,
    addLink,
    listTree,
    listTreeSubUrl,
}): JSX.Element => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        setShow(false);
        callback(value);
    };
    return (
        <div>
            <a
                href="#"
                className={"mr-3"}
                onClick={() => {
                    setShow(true);
                }}
            >
                <AppIcon name={"delete"} />
            </a>

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
            <AppModal
                show={show}
                handleClose={handleClose}
                handleDelete={handleDelete}
                id={value}
            />
        </div>
    );
};
