import React, { FC } from "react";
import { PUser } from "../../../AdminModule/models";
import { ChatMessage } from "../../models/entities/ChatMessage";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import { UserApi } from "../../../AdminModule/apis";
import placeholder from "../../assets/images/user-avatar.png";

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
    const senderResourceUrl = chat.user;
    const isMe = loginUser.id
        ? senderResourceUrl === UserApi.toResourceUrl(loginUser.id)
        : false;
    const { content, createdAt } = chat;
    const senderUser = isMe ? loginUser : otherUser;
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        senderUser?.imageName
    );
    const { toShortTime } = useDateTime();
    const avatarUrl = senderUser?.imageName ? avatar : placeholder;
    const name = isMe
        ? "You"
        : `${senderUser?.firstName} ${senderUser?.lastName}`;

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
                                {toShortTime(new Date())}
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
