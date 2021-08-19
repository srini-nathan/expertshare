import React, { ReactElement } from "react";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components";
import { ExhibitorCategory } from "../../models";
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
        const { id } = data as ExhibitorCategory;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/exhibitor-categories/${id}`,
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
