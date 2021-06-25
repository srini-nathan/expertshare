import React, { FC } from "react";
import { isString } from "lodash";
import { PUser } from "../../../AdminModule/models";
import { ChatMessage } from "../../models/entities/ChatMessage";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";
import { UserApi } from "../../../AdminModule/apis";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppChatOneToOneMessageProps {
    chat: ChatMessage;
    loginUser: PUser;
    otherUser: PUser;
}

export const AppChatOneToOneMessage: FC<AppChatOneToOneMessageProps> = ({
    chat,
    loginUser,
    otherUser,
}) => {
    const { content, createdAt, user: senderUser } = chat;
    const isMe =
        isString(senderUser) && loginUser.id
            ? senderUser === UserApi.toResourceUrl(loginUser.id)
            : otherUser.id === loginUser.id;
    const { imageName, firstName, lastName } = isMe ? loginUser : otherUser;
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );
    const { toShortTime } = useDateTime();
    const avatarUrl = imageName ? avatar : placeholder;
    const name = isMe ? "You" : `${firstName} ${lastName}`;

    return (
        <div className={`message-item ${isMe ? "out" : "in"}`}>
            <div className="avatar">
                <i
                    style={{
                        backgroundImage: `url(${avatarUrl})`,
                    }}
                ></i>
            </div>
            <div className="content">
                <div className="content--header">
                    <h4>
                        {name}
                        {createdAt ? (
                            <span className="time">
                                {toShortTime(new Date(createdAt))}
                            </span>
                        ) : null}
                    </h4>
                </div>
                <div className="content--comment">
                    <p className="p-2">{content}</p>
                </div>
            </div>
        </div>
    );
};
