import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { AppGridAction, AppGridActionProps, AppSwitch } from "../../components";
import { AFrameRoom } from "../../../AdminModule/models";
import { AFrameRoomApi } from "../../../AdminModule/apis";
import { AppCellActionParams } from "../../models";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}

export const appGridFrameworkComponents = {
    appSwitch: (params: ICellRendererParams): ReactElement => {
        const { data } = params;
        const { id, isEntryRoom } = data as AFrameRoom;

        return (
            <AppSwitch
                name={`isEntryRoom-${id}`}
                id={`isEntryRoom-${id}`}
                value={isEntryRoom}
                size={"sm"}
                onChange={(event) => {
                    AFrameRoomApi.update<AFrameRoom, Partial<AFrameRoom>>(id, {
                        isEntryRoom: event.currentTarget.checked,
                    }).then();
                }}
            />
        );
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, isGrantedControl } = params;
        const { id } = data;

        const props: AppGridActionProps = {
            isGrantedControl,
            editAction: {
                url: `/aframeroom/${id}`,
            },
            viewAction: {
                url: `/aframeroom/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
            customClickActions: [],
        };

        return <AppGridAction {...props} />;
    },
};
