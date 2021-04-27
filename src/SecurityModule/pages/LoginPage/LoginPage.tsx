import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container, Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AppSocialLoginBtn, AppSocialLoginBtnType } from "../../components";
import { AppLoadable } from "../../../AppModule/components/AppLoadable/AppLoadable";
import {
    AuthContext,
    loginAction,
} from "../../../AppModule/Authentication/context/AuthContext";
import "./assets/scss/styles.scss";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { validation } from "../../../AppModule/utils";

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

type LoginForm = {
    email: string;
    password: string;
};

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

export const LoginPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { control, handleSubmit, formState } = useForm<LoginForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const { errors } = formState;

    const { dispatch } = React.useContext(AuthContext);
    const onSubmit = async ({ email, password }: LoginForm) => {
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
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Row>
                                <AppFormInput
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    type={"email"}
                                    name={"email"}
                                    label={""}
                                    required={true}
                                    {...validation("email", formState, false)}
                                    errorMessage={errors.email?.message}
                                    value={"admin@admin.com"}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormInput
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    type={"password"}
                                    name={"password"}
                                    label={""}
                                    required={true}
                                    {...validation(
                                        "password",
                                        formState,
                                        false
                                    )}
                                    errorMessage={errors.password?.message}
                                    value={"123123"}
                                    control={control}
                                />
                            </Form.Row>
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
                        </Form>
                        <AppSocialLoginBtn
                            type={AppSocialLoginBtnType.GOOGLE}
                            block={true}
                            className={"mt-2"}
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
