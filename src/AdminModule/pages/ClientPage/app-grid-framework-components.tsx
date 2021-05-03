import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components/AppGridAction";
import { CellActionWithRenderParams } from "../LanguagePage";
import { Client } from "../../models";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: CellActionWithRenderParams
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
