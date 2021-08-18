import { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Exhibitor } from "../../models";
import { useDataAddEdit } from "../../../AppModule/hooks";
import { AppLoader } from "../../../AppModule/components";

export const ExhibitorAddEditPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { isLoading } = useDataAddEdit<Exhibitor>(new Exhibitor());

    if (isLoading) {
        return <AppLoader />;
    }

    return <></>;
};
