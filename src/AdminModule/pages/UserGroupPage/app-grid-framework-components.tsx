import React, { ReactElement } from "react";
import { Badge } from "react-bootstrap";
import { UserGroup } from "../../models";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";

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
    appGridActionRenderer: AppGridAction,
};
