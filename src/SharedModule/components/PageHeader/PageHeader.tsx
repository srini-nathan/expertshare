import React, { FC } from "react";
import { Breadcrumbs } from "../Breadcumbs/Breadcrumbs";
import "./style.scss";

export interface PageHeaderProps {
    pageHeader: string;
    linkText: string;
    linkUrl: string;
}
export const PageHeader: FC<PageHeaderProps> = ({
    pageHeader,
    linkUrl,
    linkText,
}): JSX.Element => {
    return (
        <div className="nav-header mt-3 col-12">
            <div className="row m-0">
                <Breadcrumbs linkText={linkText} linkUrl={linkUrl} />
                <div className="col-12">
                    <div className="page-title col-12 px-0 px-xl-3">
                        <h1 className="theme-primary-font-bold theme-header-font-color">
                            {pageHeader}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
