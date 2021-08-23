import React, { FC } from "react";
import { Conference } from "../../../AdminModule/models";
import "./assets/scss/style.scss";

export interface AppEventListItemProps {
    item: Conference;
}

export const AppEventListItem: FC<AppEventListItemProps> = ({
    item,
}): JSX.Element => {
    const { title } = item;

    return (
        <div className="inner-container--det--content--speakers--item">
            <span className="name mb-0">{title}</span>
        </div>
    );
};
