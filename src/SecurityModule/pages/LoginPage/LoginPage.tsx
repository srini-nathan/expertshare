import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Container } from "react-bootstrap";
import "./styles.scss";
import { AppButton } from "../../../AppModule/components/AppButton";
import {
    AppSocialLoginBtn,
    AppSocialLoginBtnType,
} from "../../components/AppSocialLoginBtn";
import { AppLoadable } from "../../../AppModule/components/AppLoadable/AppLoadable";

const LoadableInfoPanel = AppLoadable(
    import(/* webpackChunkName: "InfoPanel" */ "../../components/InfoPanel"),
    {
        fallbackProps: {
            containerStyle: {
                background: "linear-gradient(#36999CAD, #36889CA4)",
            },
            containerClassName:
                "col-md-4 col-sm-4 col-xs-12 vh-100  d-none d-md-flex d-flex align-items-center justify-content-center",
        },
    }
);

export const LoginPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Container fluid>
            <div className="row">
                <div className="col-md-8 col-sm-8 col-xs-12 d-flex vh-100 background-main">
                    <div className="company-login-form m-auto">
                        <div className="company-logo"></div>
                        <p
                            className={
                                "text-muted my-4 text-center font-weight-light"
                            }
                        >
                            We user innovative password authentication. <br />
                            All you need just enter your email.
                        </p>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Email"
                        />

                        <div className="terms text-center my-2">
                            <p>
                                By continuing you agree to the <br />
                                <a href="#">Terms & Conditions</a> &{" "}
                                <a href="#">Privacy Policy</a>
                            </p>
                        </div>
                        <AppButton block={true}>Login</AppButton>
                        <AppSocialLoginBtn
                            type={AppSocialLoginBtnType.GOOGLE}
                            block={true}
                        >
                            Login with Google
                        </AppSocialLoginBtn>
                    </div>
                </div>
                <LoadableInfoPanel />
            </div>
        </Container>
    );
};
