import React, { FC } from "react";
import { PUser } from "../../../AdminModule/models";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppChatOneToOneHeaderProps {
    user: PUser;
    isOnline?: boolean;
    onCloseAction: () => void;
    onCollapseAction: () => void;
}

export const AppChatOneToOneHeader: FC<AppChatOneToOneHeaderProps> = ({
    user,
    isOnline = false,
    onCloseAction,
    onCollapseAction,
}) => {
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user.imageName
    );
    const avatarUrl = user.imageName ? avatar : placeholder;

    return (
        <div className="row m-0 px-3 pt-3 pb-3">
            <div className="details col-auto p-0">
                <a>
                    <div className="details--content">
                        <div className="avatar">
                            <i
                                className={`${isOnline ? "online" : ""}`}
                                style={{
                                    backgroundImage: `url(${avatarUrl})`,
                                }}
                            ></i>
                        </div>
                        <div className="name pl-2">
                            <div className="name--sender">
                                <h3>
                                    {user?.firstName} {user?.lastName}
                                </h3>
                            </div>
                            <div className="name--comment">
                                <span>
                                    {user?.jobTitle} @ {user?.company}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
            <div className="action col-auto p-0 mr-0 ml-auto">
                <div className="row m-0 p-0">
                    <div
                        className="d-none btn-collapse col-auto p-0"
                        onClick={onCollapseAction}
                    >
                        <a>
                            <i className="fak fa-chevron-down"></i>
                        </a>
                    </div>
                    <div
                        className="btn-close col-auto px-1 p-0 pl-2"
                        id="btn-close-single"
                        onClick={onCloseAction}
                    >
                        <a>
                            <i className="fak fa-times-light"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
