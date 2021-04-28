import React, { ReactElement } from "react";
import { UserGroup } from "../../models";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";

export const appGridFrameworkComponents = {
    appBooleanRender: (params: never): ReactElement => {
        const { data } = params;
        const { isGenerated } = data as UserGroup;
        return <>{isGenerated ? "Yes" : "No"}</>;
    },
    appGridActionRenderer: AppGridAction,
};
