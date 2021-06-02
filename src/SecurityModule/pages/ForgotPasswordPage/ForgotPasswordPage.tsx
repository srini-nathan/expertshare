import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import "./assets/scss/styles.scss";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AuthApi } from "../../apis";
import {
    validation,
    errorToast,
    setViolations,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";

type ForgotPassword = {
    [key: string]: any;
};

type ForgotPasswordForm = {
    email: string;
};

const schema = yup.object().shape({
    email: yup.string().email().required(),
});

export const ForgotPasswordPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<ForgotPasswordForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const { errors, isSubmitting } = formState;

    const onSubmit = async (dataForm: ForgotPasswordForm) => {
        return AuthApi.resetPasswordRequest<ForgotPasswordForm, ForgotPassword>(
            dataForm
        ).then((error) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<ForgotPasswordForm>(error, setError);
                errorToast(error.title);
                setErrorMessage(error.description);
            } else if (navigate) {
                navigate("/auth/forgot-password-email-confirmation");
            }
        });
    };
    return (
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title="Forgot Password?"
                        errorMessage={errorMessage}
                        description="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
            velit mollit. Exercitation veniam consequat sunt nostrud amet."
                    />
                    <div className="active-account-box">
                        <Col md={12} className="active-account-box--auth-form">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group>
                                    <Form.Row>
                                        <AppFormInput
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            type={"email"}
                                            name={"email"}
                                            label={""}
                                            required={true}
                                            {...validation(
                                                "email",
                                                formState,
                                                false
                                            )}
                                            errorMessage={errors.email?.message}
                                            placeholder={"Type in your Email"}
                                            control={control}
                                        />
                                    </Form.Row>
                                </Form.Group>
                                <AppButton
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    loadingTxt={"Please wait..."}
                                    block={true}
                                    type={"submit"}
                                >
                                    Reset Password
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
