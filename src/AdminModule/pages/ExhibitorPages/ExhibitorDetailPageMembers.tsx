import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AppSessionUsers,
    AppShowUserListPopup,
} from "../../../AppModule/components";
import { User } from "../../models";

type ExhibitorDetailPageMembersType = {
    members: User[];
};

export const ExhibitorDetailPageMembers: FC<ExhibitorDetailPageMembersType> = ({
    members,
}): JSX.Element => {
    const { t } = useTranslation();
    const [showMore, isShowMore] = useState<boolean>(false);
    const limitedMembers = members.slice(0, 4);
    return (
        <>
            <AppShowUserListPopup
                show={showMore}
                handleClose={isShowMore}
                users={members}
                title={t("exhibitor.list:section.title.members")}
                icon="atendees-cs"
            />
            <AppSessionUsers
                xl={6}
                lg={6}
                md={12}
                sm={12}
                selectedUsers={limitedMembers}
                title={t("exhibitor.list:section.title.members")}
                icon="atendees-cs"
            />
            <div className="inner-container--det--content--more">
                {members.length > 4 && (
                    <a
                        href={"#"}
                        onClick={(e) => {
                            e.preventDefault();
                            isShowMore(!showMore);
                        }}
                    >
                        {showMore
                            ? `- ${t("exhibitor.list:section.showLess")}`
                            : `+ ${t("exhibitor.list:section.showMore")}`}
                    </a>
                )}
            </div>
        </>
    );
};
