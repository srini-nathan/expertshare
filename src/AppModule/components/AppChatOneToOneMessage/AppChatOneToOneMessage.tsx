import React, { FC } from "react";
import { PUser } from "../../../AdminModule/models";
import { ChatMessage } from "../../models/entities/ChatMessage";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppChatOneToOneMessageProps {
    chat: ChatMessage;
    loginUser: PUser;
}

export const AppChatOneToOneMessage: FC<AppChatOneToOneMessageProps> = ({
    chat,
    loginUser,
}) => {
    const user = chat.user as PUser;
    const isMe = user.id === loginUser.id;
    const { content, createdAt } = chat;
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user?.imageName
    );
    const { toShortTime } = useDateTime();
    const avatarUrl = user?.imageName ? avatar : placeholder;
    const name = isMe ? `${user?.firstName} ${user?.lastName}` : "You";

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
                        <span className="time">
                            {toShortTime(new Date(createdAt))}
                        </span>
                    </h4>
                </div>
                <div className="content--comment">
                    <p className="p-2">{content}</p>
                </div>
            </div>
        </div>
    );
};
