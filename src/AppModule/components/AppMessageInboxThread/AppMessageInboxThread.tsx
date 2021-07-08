import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
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
    rm?: boolean;
    onClick: () => void;
}

export const AppMessageInboxThread: FC<AppMessageInboxThreadProps> = ({
    user,
    rm = false,
    onClick,
}) => {
    const [newMessageCounter] = useState<number>(0);
    const [online] = useState<boolean>(false);
    const { t } = useTranslation();
    const avatar = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user?.imageName
    );
    const avatarUrl = user?.imageName ? avatar : placeholder;

    return (
        <div
            className={`app-message-inbox-thread inner-container--message--item message-1 col-12 py-3 ${
                rm ? "rm" : ""
            }`}
            onClick={onClick}
        >
            <a>
                <div className="inner-container--message--item--container">
                    {rm && (
                        <div className="relational-manager">
                            <span>{t("messagebox:relationManager")}</span>
                        </div>
                    )}
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
                                    {user?.jobTitle}
                                    {user?.jobTitle &&
                                        user?.jobTitle !== "" &&
                                        user?.company &&
                                        user?.company !== "" &&
                                        ", "}
                                    {user?.company}
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
