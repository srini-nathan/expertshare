import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { AppGridAction, AppGridActionProps, AppSwitch } from "../../components";
import { Conference } from "../../../AdminModule/models";
import { ConferenceApi } from "../../../AdminModule/apis";
import { AppCellActionParams } from "../../models";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}

export const appGridFrameworkComponents = {
    appSwitch: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { id, isVisible } = data as Conference;

        return (
            <AppSwitch
                name={`isvisible-${id}`}
                id={`isvisible-${id}`}
                value={isVisible}
                size={"sm"}
                onChange={(event) => {
                    ConferenceApi.update<Conference, Partial<Conference>>(id, {
                        isVisible: event.currentTarget.checked,
                    }).then();
                }}
            />
        );
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, isGrantedControl, onPressClone } = params;
        const { id } = data as Conference;

        const props: AppGridActionProps = {
            isGrantedControl,
            editAction: {
                url: `/conference/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customClickActions: [
                {
                    icon: "Clone",
                    confirmation: "Are you sure want to clone ?",
                    confirmationTitle: "Clone Action",
                    onClick: () => {
                        if (onPressClone) onPressClone(id);
                    },
                },
            ],
        };

        return <AppGridAction {...props} />;
    },
    tags: (params: AppCellActionWithRenderParams): ReactElement => {
        const { data } = params;
        const { conferenceTags } = data as Conference;
        return (
            <>
                {conferenceTags.map((e, i) => {
                    return (
                        <div className={"conference-tags"} key={i}>
                            {e.name}
                        </div>
                    );
                })}
            </>
        );
    },
};
