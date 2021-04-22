import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container } from "react-bootstrap";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AppSocialLoginBtn, AppSocialLoginBtnType } from "../../components";
import { AppLoadable } from "../../../AppModule/components/AppLoadable/AppLoadable";
import {
    AuthContext,
    loginAction,
} from "../../../AppModule/Authentication/context/AuthContext";
import "./styles.scss";

const LoadableInfoPanel = AppLoadable(import("../../components/InfoPanel"), {
    fallbackProps: {
        containerStyle: {
            background: "linear-gradient(#36999CAD, #36889CA4)",
        },
        containerClassName:
            "col-md-4 col-sm-4 col-xs-12 vh-100  d-none d-md-flex d-flex align-items-center justify-content-center",
    },
});

type Inputs = {
    email: string;
    password: string;
};

export const LoginPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { register, handleSubmit } = useForm<Inputs>();

    const { dispatch } = React.useContext(AuthContext);
    const onSubmit = async ({ email, password }: Inputs) => {
        await loginAction(email, password, dispatch);
    };
    return (
        <Container fluid>
            <div className="row">
                <div className="col-md-8 col-sm-8 col-xs-12 d-flex vh-100 background-main">
                    <div className="company-login-form m-auto">
                        <div className="company-logo" />
                        <p
                            className={
                                "text-muted my-4 text-center font-weight-light"
                            }
                        >
                            We user innovative password authentication. <br />
                            All you need just enter your email.
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <br />
                            <input
                                className="form-control"
                                type="email"
                                defaultValue="admin@admin.com"
                                placeholder="Email"
                                {...register("email", { required: true })}
                            />
                            <input
                                className="form-control"
                                type="password"
                                defaultValue={"123123"}
                                placeholder="Password"
                                {...register("password", { required: true })}
                            />

                            <div className="terms text-center my-2">
                                <p>
                                    By continuing you agree to the <br />
                                    <a href="#">Terms & Conditions</a> &{" "}
                                    <a href="#">Privacy Policy</a>
                                </p>
                            </div>
                            <AppButton block={true} type={"submit"}>
                                Login
                            </AppButton>
                        </form>
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
