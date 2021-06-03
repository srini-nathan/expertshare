import React, { ReactElement, FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import {
    AppSwitch,
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { User } from "../../models";
import { useAuthState, useRoles } from "../../../AppModule/hooks";
import { AppCellActionParamsUserList } from "./AppCellActionParamsUserList";
import { UserApi } from "../../apis";

export interface AppCellActionWithRenderParamsUserList
    extends AppCellActionParamsUserList,
        ICellRendererParams {}

interface UserRoles {
    role: string;
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

export const appGridFrameworkComponents = {
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
    appGridActionRenderer: (
        params: AppCellActionWithRenderParamsUserList
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as User;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/users/${id}`,
            },
            viewAction: {
                url: `/admin/users/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
