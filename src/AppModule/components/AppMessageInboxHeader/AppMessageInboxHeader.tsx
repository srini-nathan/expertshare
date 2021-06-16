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

export interface AppMessageInboxHeaderProps {
    user: PUser;
    isOnline?: boolean;
    newMsgCounter?: number;
    onCloseAction: () => void;
    onCollapseAction: () => void;
}

export const AppMessageInboxHeader: FC<AppMessageInboxHeaderProps> = ({
    user,
    newMsgCounter = 0,
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
        <div className="app-message-inbox-header row m-0 px-3 pt-3 pb-2">
            <div className="inner-container--details col-auto p-0">
                <a href="#">
                    <div className="inner-container--details--content">
                        <i
                            className={`inner-container--details--content--profile ${
                                isOnline ? "online" : ""
                            }`}
                            style={{
                                backgroundImage: `url(${avatarUrl})`,
                            }}
                        ></i>
                        <h2 className="inner-container--details--content--title">
                            Messages
                            {newMsgCounter && newMsgCounter > 0 ? (
                                <span className="inner-container--details--content--title--count">
                                    {newMsgCounter}
                                </span>
                            ) : null}
                        </h2>
                    </div>
                </a>
            </div>
            <div className="inner-container--action col-auto p-0 mr-0 ml-auto">
                <div className="row m-0 p-0">
                    <div
                        className="btn-collapse col-auto p-0"
                        id="btn-collapse-index"
                        onClick={onCollapseAction}
                    >
                        <a>
                            <i className="fak fa-chevron-down"></i>
                        </a>
                    </div>
                    <div
                        className="btn-close col-auto px-1 p-0 pl-2"
                        id="btn-close-index"
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
