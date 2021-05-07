import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { Email } from "../../models";
import { CellActionWithRenderParams } from "../LanguagePage/app-grid-action";

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: CellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as Email;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/templates/${id}`,
            },
            deleteAction: {
                confirmation: "Are you sure want to delete the template ?",
                onClick: () => {
                    onPressDelete(id);
                },
            },
        };

        return <AppGridAction {...props} />;
    },
};
