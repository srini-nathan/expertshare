import { ICellRendererParams } from "ag-grid-community";
import React, { FC, ReactElement } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { AppIcon } from "../../components";
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
    const { firstName, lastName, imageName, id } = data;
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );
    const style = imageName
        ? {
              backgroundImage: `url(${imagePath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {
              backgroundImage: `url(${UserAvatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          };

    return (
        <div className="info">
            <div className="info--profile-pic mr-2">
                <Link to={`/attendee/${id}/show`}>
                    <i style={style}></i>
                </Link>
            </div>
            <div className="info--det">
                <Link to={`/attendee/${id}/show`}>
                    <h3 className="mb-1">
                        {firstName} {lastName}
                    </h3>
                </Link>
            </div>
        </div>
    );
};
export const RenderGetInContact: FC<UserInfo> = ({ data }): JSX.Element => {
    const { id } = data;
    const { t } = useTranslation();

    return (
        <Link className="btn btn-secondary" to={`/attendee/${id}/show`}>
            {t("attendee.form:button.getInContact")}
        </Link>
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
                        if (index < 3) {
                            return (
                                <div
                                    className="tag-container--item pr-2"
                                    key={index}
                                >
                                    <a>{tag.name}</a>
                                </div>
                            );
                        }
                        return <></>;
                    })}
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
    appGridActionRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        return <RenderGetInContact data={data} />;
    },
};
