import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components/AppGridAction";
import { Client } from "../../models";
import { AppCellActionWithRenderParams } from "../../../AppModule/models";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as Client;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/clients/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
            treeAction: {
                url: `/admin/clients/${id}/containers`,
            },
        };

        return <AppGridAction {...props} />;
    },
};
