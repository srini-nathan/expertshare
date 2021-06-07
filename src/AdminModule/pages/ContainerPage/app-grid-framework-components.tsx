import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components/AppGridAction";
import { Container } from "../../models";
import { AppCellActionWithRenderWithCustom } from "./app-actions";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderWithCustom
    ): ReactElement => {
        const {
            data,
            onPressDelete,
            parentId: clientId,
            onPressClone,
            hideParentFromUrl,
        } = params;
        const { id } = data as Container;

        if (!clientId) {
            throw new Error("Client's Id is required.");
        }

        const props: AppGridActionProps = {
            editAction: {
                url: hideParentFromUrl
                    ? `/admin/containers/${id}`
                    : `/admin/clients/${clientId}/containers/${id}`,
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
                    confirmationTitle: "Clone Action",
                    confirmation: "Are you sure want to clone ?",
                    onClick: () => {
                        onPressClone(id);
                    },
                },
            ],
        };

        return <AppGridAction {...props} />;
    },
};
