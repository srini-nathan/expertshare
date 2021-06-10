import { ICellRendererParams } from "ag-grid-community";
import React, { ReactElement } from "react";
import { AppGridAction, AppGridActionProps, AppIcon } from "../../components";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { User } from "../../models";
import UserAvatar from "./assets/images/user-avatar.png";

export const appGridFrameworkComponents = {
    appNameTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { firstName, lastName, jobTitle, company } = data as User;
        return (
            <div className="info">
                <a href="#">
                    <div className="info--profile-pic mr-2">
                        <i
                            style={{
                                backgroundImage: `url(${
                                    data.avatarUrl ? data.avatarUrl : UserAvatar
                                })`,
                                backgroundPosition: "center",
                            }}
                        ></i>
                    </div>
                    <div className="info--det">
                        <h3 className="mb-1">
                            {firstName} {lastName}
                        </h3>
                        <p className="mb-0">
                            {jobTitle} at {company}
                        </p>
                    </div>
                </a>
            </div>
        );
    },
    appTagTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { userTags } = data as User;
        return (
            <div className="tag-container d-flex">
                {userTags &&
                    userTags.map((tag, index: any) => {
                        if (index < 2) {
                            return (
                                <div
                                    className="tag-container--item pr-2"
                                    key={index}
                                >
                                    <a href="#">{tag.name}</a>
                                </div>
                            );
                        }
                        return <></>;
                    })}
                {userTags && userTags.length > 2 && (
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
                {data.category && (
                    <a href="#" className="speaker-btn">
                        <AppIcon name={"Microphone"} />
                        &nbsp;
                        {data.category}
                    </a>
                )}
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
