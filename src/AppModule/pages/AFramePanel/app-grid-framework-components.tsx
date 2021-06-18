import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { AppGridAction, AppGridActionProps } from "../../components";
import { AppCellActionParams } from "../../models";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}

export const appGridFrameworkComponentsForPanels = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, isGrantedControl } = params;
        const { id } = data;

        const props: AppGridActionProps = {
            isGrantedControl,
            editAction: {
                url: `${id}`,
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

export const appGridFrameworkComponentsForRooms = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, isGrantedControl } = params;
        const { id } = data;

        const props: AppGridActionProps = {
            isGrantedControl,
            doorAction: {
                url: `/admin/room/${id}/door`,
            },
            screenAction: {
                url: `/admin/room/${id}/screen`,
            },
            billBoardAction: {
                url: `/admin/room/${id}/billboard`,
            },
            projectorAction: {
                url: `/admin/room/${id}/projector`,
            },
            editAction: {
                url: `/admin/room/${id}`,
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
