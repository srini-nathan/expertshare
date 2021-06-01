import React, { ReactElement } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { AppGridAction, AppGridActionProps } from "../../components";
import { Conference } from "../../../AdminModule/models";
import { AppCellActionParams } from "../../models";

export interface AppCellActionWithRenderParams
    extends AppCellActionParams,
        ICellRendererParams {}

export const appGridFrameworkComponents = {
    appGridActionRenderer: (
        params: AppCellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as Conference;

        const props: AppGridActionProps = {
            editAction: {
                url: `/conference/${id}`,
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
    tags: (params: AppCellActionWithRenderParams): ReactElement => {
        const { data } = params;
        const { conferenceTags } = data as Conference;
        return (
            <>
                {conferenceTags.map((e, i) => {
                    return (
                        <div className={"conference-tags"} key={i}>
                            {e.name}
                        </div>
                    );
                })}
            </>
        );
    },
};
