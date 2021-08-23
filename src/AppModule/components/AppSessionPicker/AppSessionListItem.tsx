import React, { FC } from "react";
import { Session } from "../../../AdminModule/models";
import "./assets/scss/style.scss";

export interface AppSessionListItemProps {
    item: Session;
}

export const AppSessionListItem: FC<AppSessionListItemProps> = ({
    item,
}): JSX.Element => {
    const { title } = item;

    return (
        <div className="inner-container--det--content--speakers--item">
            <span className="name mb-0">{title}</span>
        </div>
    );
};
