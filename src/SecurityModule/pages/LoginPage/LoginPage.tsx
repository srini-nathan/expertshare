import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Container } from "react-bootstrap";
import InfoPanel from "../../components/InfoPanel";
import "./styles.scss";
import { AppButton } from "../../../AppModule/components";
import {
    AppSocialLoginBtn,
    AppSocialLoginBtnType,
} from "../../components/AppSocialLoginBtn";

export const LoginPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <Container fluid>
            <div className="row background-main">
                <div className="col-md-8 col-sm-8 col-xs-12 d-flex vh-100">
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
                <InfoPanel
                    className={
                        "col-md-4 col-sm-4 col-xs-12 vh-100 d-none d-md-flex"
                    }
                />
            </div>
        </Container>
    );
};
