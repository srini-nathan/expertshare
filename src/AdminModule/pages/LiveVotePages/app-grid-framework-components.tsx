import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "@reach/router";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { LiveVoteResult } from "../../models";
import { AppCellActionWithRenderWithCustom } from "./app-actions";
import { useBuildAssetPath, useDateTime } from "../../../AppModule/hooks";
import { User } from "../../../AppModule/models";
import { UserProfileFileInfo } from "../../../config";
import UserAvatar from "../../../AppModule/assets/images/user-avatar.png";

export const appGridFrameworkComponents = {
    AppGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as LiveVoteResult;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            deleteAction: {
                confirmation: t(
                    "admin.liveVoteResult.list:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "admin.liveVoteResult.list:delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
    AppUserInfo: (params: AppCellActionWithRenderWithCustom): ReactElement => {
        const { data } = params;
        const { user } = data as LiveVoteResult;
        const { firstName, lastName, imageName, id } = user as User;
        const imagePath = useBuildAssetPath(UserProfileFileInfo, imageName);
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
            <div
                className="info"
                onClick={() => {
                    navigate(`/attendee/${id}/show`).then();
                }}
            >
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
    },
    AppCreatedAt: (params: AppCellActionWithRenderWithCustom): ReactElement => {
        const { data } = params;
        const { toShortDate } = useDateTime();
        const { createdAt } = data as LiveVoteResult;
        return <>{createdAt ? toShortDate(new Date(createdAt)) : ""}</>;
    },
};
