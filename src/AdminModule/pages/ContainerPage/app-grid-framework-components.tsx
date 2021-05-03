import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components/AppGridAction";
import { CellActionWithRenderParams } from "../LanguagePage";
import { Container } from "../../models";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: CellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete, parentId: clientId } = params;
        const { id } = data as Container;

        if (!clientId) {
            throw new Error("Client's Id is required.");
        }

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/clients/${clientId}/containers/${id}`,
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
