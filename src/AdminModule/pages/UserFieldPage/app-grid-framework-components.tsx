import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { UserField } from "../../models";
import { AppCellActionWithRenderParams } from "../../../AppModule/models";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;

        const { id } = data as UserField;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/user-fields/${id}`,
            },
            deleteAction: {
                confirmation:
                    "Are you sure you want to delete the User Field ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
