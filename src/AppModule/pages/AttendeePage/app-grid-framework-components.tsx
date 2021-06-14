import { ICellRendererParams } from "ag-grid-community";
import React, { FC, ReactElement } from "react";
import { AppGridAction, AppGridActionProps, AppIcon } from "../../components";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { FileTypeInfo, User } from "../../models";
import UserAvatar from "../../assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

interface UserInfo {
    data: User;
}
export const UserDetailsInfo: FC<UserInfo> = ({ data }): JSX.Element => {
    const { firstName, lastName, imageName } = data;
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );

    const style = imageName
        ? {
              backgroundImage: `url(${imagePath})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
          }
        : {
              backgroundImage: `url(${UserAvatar})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
          };

    return (
        <div className="info">
            <div className="info--profile-pic mr-2">
                <i style={style}></i>
            </div>
            <div className="info--det">
                <h3 className="mb-1">
                    {firstName} {lastName}
                </h3>
            </div>
        </div>
    );
};
export const appGridFrameworkComponents = {
    appNameTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;

        return <UserDetailsInfo data={data as User} />;
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
        return <div className="email">{data.isExposeEmail && data.email} </div>;
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const {
            // onPressBookSession,
            onPressGetInContact,
            // onPressAddNewUser,
        } = params;
        const props: AppGridActionProps = {
            customClickActions: [
                // {
                //     text: "Book Session",
                //     onClick: () => {
                //         onPressBookSession();
                //     },
                // },
                {
                    text: "Get In Contact",
                    onClick: () => {
                        onPressGetInContact();
                    },
                },
                // {
                //     icon: "AddUserPlus",
                //     text: "",
                //     onClick: () => {
                //         onPressAddNewUser();
                //     },
                // },
            ],
        };
        return <AppGridAction {...props} />;
    },
};
