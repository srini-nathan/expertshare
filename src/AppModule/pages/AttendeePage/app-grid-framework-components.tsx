import { ICellRendererParams } from "ag-grid-community";
import React, { ReactElement } from "react";
import { AppGridAction, AppGridActionProps, AppIcon } from "../../components";
import { AppCellActionWithRenderWithCustom } from "./app-actions";

export const appGridFrameworkComponents = {
    appNameTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return (
            <div className="info">
                <a href="#">
                    <div className="info--profile-pic mr-2">
                        <i
                            style={{
                                backgroundImage: `url(${data.avatarUrl})`,
                            }}
                        ></i>
                    </div>
                    <div className="info--det">
                        <h3 className="mb-1">{data.name}</h3>
                        <p className="mb-0">{data.description}</p>
                    </div>
                </a>
            </div>
        );
    },
    appTagTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return (
            <div className="tag-container d-flex">
                {data.tags.map((tag: string, index: any) => {
                    if (index < 2) {
                        return (
                            <div
                                className="tag-container--item pr-2"
                                key={index}
                            >
                                <a href="#">{tag}</a>
                            </div>
                        );
                    }
                    return <></>;
                })}
                {data.tags.length > 2 && (
                    <div className="tag-container--item more pr-2">
                        <a href="#">+ Show More</a>
                    </div>
                )}
            </div>
        );
    },
    appCategoryTemplateRenderer: (
        params: ICellRendererParams
    ): ReactElement => {
        const { data } = params;
        return (
            <div className="category-container d-flex">
                <a href="#" className="speaker-btn">
                    <AppIcon name={"Microphone"} />
                    &nbsp;
                    {data.category}
                </a>
            </div>
        );
    },
    appEmailRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return <div className="email">{data.email}</div>;
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const {
            onPressBookSession,
            onPressGetInContact,
            onPressAddNewUser,
        } = params;
        const props: AppGridActionProps = {
            customClickActions: [
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
                {
                    icon: "AddUserPlus",
                    text: "",
                    onClick: () => {
                        onPressAddNewUser();
                    },
                },
            ],
        };
        return <AppGridAction {...props} />;
    },
};
