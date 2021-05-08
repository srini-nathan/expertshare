import React, { FC } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { AuthContext, socialLogin } from "../../context/AuthContext";
import { AppLoader } from "../../../AppModule/components";

export const SocialLoginRedirectPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { token } = useParams();
    const { dispatch, state } = React.useContext(AuthContext);
    if (token && token.length > 0) {
        socialLogin(token, dispatch).then();
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
