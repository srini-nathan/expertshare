import React, { FC } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { parse } from "qs";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { forEach as _forEach, isString as _isString } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";
import { AppFormInputPassword } from "../../../AppModule/components";
import { validation, errorToast } from "../../../AppModule/utils";
import { AuthApi } from "../../apis";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";

type RestPassword = {
    [key: string]: any;
};

type RestPasswordForm = {
    password?: string;
    confirmPassword?: string;
    plainPassword?: string;
    token?: string;
};

const schema = yup.object().shape({
    password: yup.string().min(6).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must be match"),
});

export const ResetPasswordPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<RestPasswordForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const [loading, isLoading] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const { t } = useTranslation();

    const { errors } = formState;
    const location = useLocation();
    const onSubmit = async ({ password }: RestPasswordForm) => {
        const searchParams = parse(location.search, {
            ignoreQueryPrefix: true,
        });
        const { token } = searchParams;
        if (_isString(token)) {
            isLoading(true);
            AuthApi.resetPassword<RestPasswordForm, RestPassword>({
                plainPassword: password,
                token,
            }).then((error) => {
                isLoading(false);
                if (error instanceof UnprocessableEntityErrorResponse) {
                    const { violations } = error;
                    _forEach(violations, (value: string, key: string) => {
                        const propertyName = key as keyof RestPasswordForm;
                        setError(propertyName, {
                            type: "backend",
                            message: value,
                        });
                    });
                    errorToast(error.title);
                    setErrorMessage(error.description);
                } else if (navigate) {
                    navigate("/auth/reset-password-confirmation");
                }
            });
        }
    };
    return (
        <Container fluid className="active-account auth-container with-bg">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        errorMessage={errorMessage}
                        title={t("resetPassword:title")}
                        description={t("resetPassword:description")}
                    />
                    <div className="active-account-box">
                        <Col md={12} className="active-account-box--auth-form">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group>
                                    <Form.Row>
                                        <AppFormInputPassword
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            name={"password"}
                                            label={""}
                                            required={true}
                                            {...validation(
                                                "password",
                                                formState,
                                                false
                                            )}
                                            errorMessage={
                                                errors.password?.message
                                            }
                                            control={control}
                                        />
                                    </Form.Row>
                                    <Form.Row>
                                        <AppFormInputPassword
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            name={"confirmPassword"}
                                            label={""}
                                            required={true}
                                            {...validation(
                                                "confirmPassword",
                                                formState,
                                                false
                                            )}
                                            errorMessage={
                                                errors.confirmPassword?.message
                                            }
                                            control={control}
                                        />
                                    </Form.Row>
                                </Form.Group>

                                <AppButton
                                    block={true}
                                    disabled={loading}
                                    type={"submit"}
                                >
                                    {loading
                                        ? `${t(
                                              "resetPassword.form:button.resetPassword"
                                          )}...`
                                        : t(
                                              "resetPassword.form:button.resetPassword"
                                          )}
                                </AppButton>
                            </Form>
                        </Col>
                    </div>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
