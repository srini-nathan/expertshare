import React, { ReactElement } from "react";
import { Badge } from "react-bootstrap";
import { UserGroup } from "../../models";
import {
    AppGridAction,
    AppGridActionProps,
} from "../../../AppModule/components/AppGridAction";
import { CellActionWithRenderParams } from "../LanguagePage";

export const appGridFrameworkComponents = {
    appBooleanRender: (params: never): ReactElement => {
        const { data } = params;
        const { isGenerated } = data as UserGroup;
        return (
            <div className={"justify-content-center"}>
                {isGenerated ? (
                    <Badge className={"pr-2 pl-2"} variant="primary">
                        Yes
                    </Badge>
                ) : (
                    <Badge className={"pl-2 pr-2"} variant="secondary">
                        No
                    </Badge>
                )}
            </div>
        );
    },
    appGridActionRenderer: (
        params: CellActionWithRenderParams
    ): ReactElement => {
        const { data, onPressDelete } = params;
        const { id } = data as UserGroup;

        const props: AppGridActionProps = {
            editAction: {
                url: `/admin/user-groups/${id}`,
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
