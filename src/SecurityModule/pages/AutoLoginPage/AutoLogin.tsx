import React, { FC } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { AuthContext, autoLogin } from "../../contexts/AuthContext";
import { AppLoader } from "../../../AppModule/components";

export const AutoLogin: FC<RouteComponentProps> = (): JSX.Element => {
    const { token } = useParams();
    const { dispatch, state } = React.useContext(AuthContext);
    if (token && token.length > 0) {
        autoLogin(token, dispatch).then();
    }

    if (state.isAuthenticated === null) {
        return (
            <div className={"vh-100 vw-100"}>
                <AppLoader />
            </div>
        );
    }

    return <></>;
};
