import { ICellRendererParams } from "ag-grid-community";
import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { AppCellActionWithRenderWithCustom } from "./app-actions";

export const appGridFrameworkComponents = {
    appNameTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return (
            <div className="info">
                <a href="#">
                    <div className="info--profile-pic mr-2">
                        <i
                            style={{ backgroundImage: `url(${data.imageUrl})` }}
                        ></i>
                    </div>
                    <div className="info--det">
                        <h3 className="mb-1">{data.name}</h3>
                        <p className="mb-0">{data.designation}</p>
                    </div>
                </a>
            </div>
        );
    },
    appTagTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return (
            <div className="tag-container d-flex">
                <div className="tag-container--item pr-2">
                    <a href="#">{data.tags[0]}</a>
                </div>
                <div className="tag-container--item pr-2">
                    <a href="#">{data.tags[1]}</a>
                </div>
                <div className="tag-container--item more pr-2">
                    <a href="#">+ Show More</a>
                </div>
            </div>
        );
    },
    appEmailRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return <div className="email">{data.emailId}</div>;
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { onPressBookSession, onPressGetInContact } = params;
        const props: AppGridActionProps = {
            buttonAction: [
                {
                    text: "Book Session",
                    onClick: () => {
                        onPressBookSession();
                    },
                },
                {
                    text: "Get In Contact",
                    onClick: () => {
                        onPressGetInContact();
                    },
                },
            ],
        };
        return <AppGridAction {...props} />;
    },
};
