import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { SessionCategory } from "../../models";
import { AppCellActionWithRenderParams } from "../../../AppModule/models";

export const appGridFrameworkComponents = {
    AppColorPickerRender: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { value } = params;

        return (
            <div
                className="cell-color"
                style={{ backgroundColor: value }}
            ></div>
        );
    },
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as SessionCategory;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/session-categories/${id}`,
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
