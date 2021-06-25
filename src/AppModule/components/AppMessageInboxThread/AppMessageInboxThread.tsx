import React, { FC, useState } from "react";
import { User } from "../../../AdminModule/models";

import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppMessageInboxThreadProps {
    user: User;
    onClick: () => void;
}

export const AppMessageInboxThread: FC<AppMessageInboxThreadProps> = ({
    user,
    onClick,
}) => {
    const [newMessageCounter] = useState<number>(0);
    const [online] = useState<boolean>(false);
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user?.imageName
    );
    const avatarUrl = user?.imageName ? avatar : placeholder;

    return (
        <div
            className="app-message-inbox-thread inner-container--message--item message-1 col-12 py-3"
            onClick={onClick}
        >
            <a href="#">
                <div className="inner-container--message--item--container">
                    <div className="content">
                        <div className={`avatar ${online ? "online" : ""}`}>
                            <i
                                style={{
                                    backgroundImage: `url(${avatarUrl})`,
                                }}
                            ></i>
                        </div>
                        <div className="details pl-2">
                            <div className="details--sender">
                                <h3>
                                    {user?.firstName} {user?.lastName}
                                </h3>
                            </div>
                            <div className="details--comment">
                                <p>
                                    {user?.jobTitle} @ {user?.company}
                                </p>
                            </div>
                        </div>
                    </div>
                    {newMessageCounter && newMessageCounter > 0 ? (
                        <div className="count">
                            <span>{newMessageCounter}</span>
                        </div>
                    ) : null}
                </div>
            </a>
        </div>
    );
};
