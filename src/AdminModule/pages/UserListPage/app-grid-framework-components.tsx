import React, { ReactElement, FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { filter } from "lodash";
import {
    AppSwitch,
    AppGridActionProps,
    AppGridAction,
} from "../../../AppModule/components";
import { PUser, User, UserGroup } from "../../models";
import {
    useAuthState,
    useBuildAssetPath,
    useRoles,
} from "../../../AppModule/hooks";
import { AppCellActionParamsUserList } from "./AppCellActionParamsUserList";
import { UserApi } from "../../apis";
import UserAvatar from "../../../AppModule/assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";
import {
    FileTypeInfo,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import { AuthApi } from "../../../SecurityModule/apis";
import {
    errorToast,
    hideLoader,
    showLoader,
    successToast,
} from "../../../AppModule/utils";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppCellActionWithRenderParamsUserList
    extends AppCellActionParamsUserList,
        ICellRendererParams {}

interface UserRoles {
    role: string;
}
interface UserInfo {
    data: User;
}

export const GetRoles: FC<UserRoles> = ({ role }): JSX.Element => {
    const { role: ROLE } = useAuthState();
    const { filterRoles } = useRoles();
    const FilterRoute = filterRoles(ROLE);

    return (
        <>
            {FilterRoute.map((e: any, key: number) => {
                return (
                    <option
                        selected={role === e.role}
                        key={key}
                        value={e["@id"]}
                    >
                        {e.name}
                    </option>
                );
            })}
        </>
    );
};
export const UserDetailsInfo: FC<UserInfo> = ({ data }): JSX.Element => {
    const { firstName, lastName, imageName } = data;
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );

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
        <div className="info">
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
};

export const appGridFrameworkComponents = {
    appNameTemplateRenderer: (params: ICellRendererParams): ReactElement => {
        const { data } = params;

        return <UserDetailsInfo data={data as User} />;
    },
    appSelect: (
        params: AppCellActionWithRenderParamsUserList
    ): ReactElement => {
        const { data, onSelectChange } = params;
        const { id, roles } = data as User;

        return (
            <select
                id={`${id}`}
                onChange={(e) => {
                    onSelectChange(id, e.target.value);
                }}
                name={"role"}
                className="list-deopdown"
            >
                <optgroup>
                    <GetRoles role={roles[0]} />
                </optgroup>
            </select>
        );
    },
    appSwitch: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { id, isBlocked } = data as User;

        return (
            <AppSwitch
                name={`isblocked-${id}`}
                id={`isblocked-${id}`}
                value={isBlocked}
                size={"sm"}
                onChange={(event) => {
                    UserApi.update<User, Partial<User>>(id, {
                        isBlocked: event.currentTarget.checked,
                    }).then();
                }}
            />
        );
    },
    AppHeaderChekbox: (params: any): ReactElement => {
        const { onCheckHeaderCheckbox } = params;
        return (
            <label className="checkbox-label-container list-checkbox">
                <input onChange={onCheckHeaderCheckbox} type="checkbox"></input>
                <span className="custom-checkbox"></span>
            </label>
        );
    },
    appCheckBox: (
        params: AppCellActionWithRenderParamsUserList
    ): ReactElement => {
        const { data, onCheckCheckbox, selectedUserList } = params;
        const { id } = data as User;
        const index = selectedUserList.indexOf(id);
        return (
            <label className="checkbox-label-container list-checkbox">
                <input
                    onChange={() => onCheckCheckbox(id)}
                    type="checkbox"
                    defaultChecked={index !== -1}
                ></input>
                <span className="custom-checkbox"></span>
            </label>
        );
    },
    AppGridActionRenderer: (
        params: AppCellActionWithRenderParamsUserList
    ): ReactElement => {
        const { t } = useTranslation();
        const { data, onPressDelete, api } = params;
        const { id, userGroups, email } = data as User;
        const generatedGroups = filter(
            userGroups,
            (grp: UserGroup) => grp.isGenerated
        );

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/users/${id}`,
            },
            deleteAction: {
                confirmationTitle: t(
                    "admin.users.list:delete.modal.confirmationTitle"
                ),
                confirmation: t("admin.users.list:delete.modal.confirmation"),
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customClickActions: [],
        };

        if (generatedGroups.length > 1) {
            props.customClickActions?.push({
                confirmationTitle: t(
                    "admin.users.list:unlink.modal.confirmationTitle"
                ),
                confirmation: t("admin.users.list:unlink.modal.confirmation"),
                icon: "faUnlink",
                onClick: () => {
                    UserApi.unsubscribe<PUser>(id).then(() => {
                        api.refreshServerSideStore({
                            purge: true,
                        });
                    });
                },
            });
        }

        props.customClickActions?.push({
            confirmationTitle: t(
                "admin.users.list:resetpassword.modal.confirmationTitle"
            ),
            confirmation: t(
                "admin.users.list:resetpassword.modal.confirmation"
            ),
            icon: "Email",
            onClick: () => {
                showLoader(
                    t("admin.users.list:resetpassword.loader.sendingemail")
                ).then();
                AuthApi.resetPasswordRequest({
                    email,
                }).then((error) => {
                    hideLoader();
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        errorToast(t(error.description));
                    } else {
                        successToast(
                            t("admin.users.list:resetpassword.success.message")
                        );
                    }
                });
            },
        });

        return <AppGridAction {...props} />;
    },
};
