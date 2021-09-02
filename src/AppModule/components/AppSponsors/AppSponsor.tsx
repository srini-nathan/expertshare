import React, { FC } from "react";
import { Exhibitor } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import { resolveImage } from "../../utils";
import placeholder from "../../assets/images/imgthumb.svg";

interface AppSponsorType {
    data: Exhibitor;
    basePath: string;
}

export const AppSponsor: FC<AppSponsorType> = ({ data, basePath }) => {
    const img = resolveImage(basePath, data.logoImageName, placeholder);
    return (
        <div className={"app-sponsors--item"}>
            <img src={img} />
        </div>
    );
};
