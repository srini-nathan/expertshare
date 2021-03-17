import React, { FC } from "react";
import { Link } from "@reach/router";
import "./style.scss";

export interface BreadcrumbsProps {
    linkUrl: string;
    linkText: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
    linkText,
    linkUrl,
}): JSX.Element => {
    return (
        <div className="col-12 px-0 px-xl-3">
            <div className="d-flex align-items-center breadcrumbs">
                <svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7 11L1 6L7 1"
                        stroke="#36989C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <Link to={linkUrl} className="theme-breadcrumbs-clr ml-2">
                    {linkText}
                </Link>
            </div>
        </div>
    );
};
