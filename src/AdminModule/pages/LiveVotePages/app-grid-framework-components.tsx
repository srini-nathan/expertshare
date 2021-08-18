import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "@reach/router";
import { Badge } from "react-bootstrap";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import {
    Conference,
    LiveVoteQuestion,
    LiveVoteResult,
    Session,
} from "../../models";
import { useBuildAssetPath, useDateTime } from "../../../AppModule/hooks";
import { User, AppCellActionWithRenderParams } from "../../../AppModule/models";
import { UserProfileFileInfo } from "../../../config";
import UserAvatar from "../../../AppModule/assets/images/user-avatar.png";

export const appGridFrameworkComponents = {
    AppLiveVoteResultGridActionRenderer: (
        params: AppCellActionWithRenderParams
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
    AppUserInfo: (params: AppCellActionWithRenderParams): ReactElement => {
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
    AppCreatedAt: (params: AppCellActionWithRenderParams): ReactElement => {
        const { data } = params;
        const { toShortDate } = useDateTime();
        const { createdAt } = data as LiveVoteResult;
        return <>{createdAt ? toShortDate(new Date(createdAt)) : ""}</>;
    },
    AppIsSelectedBadge: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { t } = useTranslation();
        const { data } = params;
        const { isSelected } = data as LiveVoteQuestion;
        return isSelected ? (
            <Badge variant={"success"} pill>
                {t("admin.liveVote.list:column.isSelected.true")}
            </Badge>
        ) : (
            <Badge variant={"danger"} pill>
                {t("admin.liveVote.list:column.isSelected.false")}
            </Badge>
        );
    },
    AppIsResultPublished: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { t } = useTranslation();
        const { data } = params;
        const { isResultPublished } = data as LiveVoteQuestion;
        return isResultPublished ? (
            <Badge variant={"success"} pill>
                {t("admin.liveVote.list:column.isResultPublished.true")}
            </Badge>
        ) : (
            <Badge variant={"danger"} pill>
                {t("admin.liveVote.list:column.isResultPublished.false")}
            </Badge>
        );
    },
    AppLiveVoteGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id, isSelected, session } = data as LiveVoteQuestion;
        const { id: parentId, conference } = session as Session;
        const { id: grandParentId } = (conference as unknown) as Conference;
        const { t } = useTranslation();

        const props: AppGridActionProps = {
            editAction: {
                disable: isSelected,
                url: `/admin/live-votes/${id}`,
            },
            deleteAction: {
                disable: isSelected,
                confirmation: t(
                    "admin.liveVote.list:delete.confirmation.message"
                ),
                confirmationTitle: t(
                    "admin.liveVote.list:delete.confirmation.title"
                ),
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customLinkActions: [
                {
                    icon: "List2",
                    url: `/admin/live-votes-result/${id}`,
                },
                {
                    icon: "Chart",
                    url: `/admin/live-votes-result/${id}/overview`,
                },
                {
                    icon: "faArrowToRight",
                    url: `/event/${grandParentId}/session/${parentId}`,
                },
            ],
        };

        return <AppGridAction {...props} />;
    },
};
