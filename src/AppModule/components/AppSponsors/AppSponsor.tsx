import React, { FC } from "react";
import { Link } from "@reach/router";
import { Exhibitor } from "../../../AdminModule/models";
import { resolveImage } from "../../utils";
import placeholder from "../../assets/images/imgthumb.svg";
import "./assets/scss/style.scss";

interface AppSponsorType {
    data: Exhibitor;
    basePath: string;
}

export const AppSponsor: FC<AppSponsorType> = ({ data, basePath }) => {
    const { logoImageName, id } = data;
    const img = resolveImage(basePath, logoImageName, placeholder);
    return (
        <div className={"app-sponsors--item"}>
            <Link to={`/exhibitors/${id}/detail`}>
                <img
                    src={img}
                    className={data?.logoImageName ? "" : "placeholderImg"}
                />
            </Link>
        </div>
    );
};
