import React, { FC } from "react";
import { User } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import { useBuildAssetPath } from "../../hooks";
import { CONSTANTS } from "../../../config";
import UserAvatar from "../../assets/images/user-avatar.png";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppUserListItemProps {
    user: User;
}

export const AppUserListItem: FC<AppUserListItemProps> = ({
    user,
}): JSX.Element => {
    const userProfilePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        user.imageName
    );

    const style = user.imageName
        ? {
              backgroundImage: `url(${userProfilePath})`,
          }
        : {
              backgroundImage: `url(${UserAvatar})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
          };

    return (
        <div className="inner-container--det--content--speakers--item">
            <a href={`/attendee/${user.id}/show`} target="_blank">
                <div className="inner-container--det--content--speakers--item--profile pr-2">
                    <i style={style}></i>
                </div>
                <div className="inner-container--det--content--speakers--item--det">
                    <h4 className="name mb-0">
                        {user.firstName} {user.lastName}
                    </h4>
                    <span className="major">
                        {user.jobTitle && user.jobTitle}
                        {user.jobTitle &&
                            user.jobTitle !== "" &&
                            user.company &&
                            user.company !== "" &&
                            ", "}
                        {user.company && user.company}
                    </span>
                </div>
            </a>
        </div>
    );
};
