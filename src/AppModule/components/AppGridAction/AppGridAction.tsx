import React, { FC, useState } from "react";

import { AppIcon } from "../AppIcon";
import { AppModal } from "../AppModal";

export const AppGridAction: FC<{ value: number }> = (props: {
    value: number;
}): JSX.Element => {
    // eslint-disable-next-line no-console
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleDelete = () => {
        setShow(false);
        // TODO DELETE FUNCTION => in=Client
    };
    return (
        <div>
            <a
                href="#"
                className={"mr-3"}
                onClick={() => {
                    // eslint-disable-next-line no-console
                    setShow(true);
                }}
            >
                <AppIcon name={"delete"} />
            </a>

            <a href="#" className={"mr-3"}>
                <AppIcon name={"edit"} />
            </a>
            <a href="#" className={"mr-3"}>
                <AppIcon name={"add"} />
            </a>
            <a href="#">
                <AppIcon name={"ListTree"} />
            </a>
            <AppModal
                show={show}
                handleClose={handleClose}
                handleDelete={handleDelete}
                id={props.value}
            />
        </div>
    );
};
