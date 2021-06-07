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
        const { data } = params;
        const { color } = data as SessionCategory;
        return (
            <div
                className="cell-color"
                style={{ backgroundColor: color }}
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
