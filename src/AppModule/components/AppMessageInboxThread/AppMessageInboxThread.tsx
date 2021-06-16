import React, { FC, useState } from "react";
import { find } from "lodash";
import { PUser } from "../../../AdminModule/models";
import { ChatThread } from "../../models/entities/ChatThread";

import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppMessageInboxThreadProps {
    thread: ChatThread;
    loginUser: PUser;
}

export const AppMessageInboxThread: FC<AppMessageInboxThreadProps> = ({
    thread,
    loginUser,
}) => {
    const [newMessageCounter] = useState<number>(0);
    const [lastMsgTime] = useState<Date>(new Date());
    const [online] = useState<boolean>(false);
    const [lastMsg] = useState<string>("No Message");
    const user = find(
        thread.users,
        (u: PUser) => loginUser.id !== u.id
    ) as PUser;
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user?.imageName
    );
    const { toShortTime } = useDateTime();
    const avatarUrl = user?.imageName ? avatar : placeholder;

    return (
        <div className="app-message-inbox-thread inner-container--message--item message-1 col-12 py-3">
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
                                    <span className="time">
                                        {" "}
                                        {toShortTime(lastMsgTime)}{" "}
                                    </span>
                                </h3>
                            </div>
                            <div className="details--comment">
                                <p>{lastMsg}</p>
                            </div>
                        </div>
                    </div>
                    {newMessageCounter && newMessageCounter > 0 ? (
                        <div className="count">
                            <span>3</span>
                        </div>
                    ) : null}
                </div>
            </a>
        </div>
    );
};
