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
import { validation } from "../../../AppModule/utils";

type RestPasswordForm = {
    password: string;
    confirmPassword: string;
};

const schema = yup.object().shape({
    password: yup.string().min(6).required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must be match"),
});

export const ResetPasswordPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { control, handleSubmit, formState } = useForm<RestPasswordForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const { errors } = formState;

    const onSubmit = async ({ password }: RestPasswordForm) => {
        alert(password);
    };
    return (
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title="Resset Password"
                        desctiption="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
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
                                            type={"password"}
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
                                        <AppFormInput
                                            md={12}
                                            lg={12}
                                            xl={12}
                                            type={"password"}
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

                                <AppButton block={true} type={"submit"}>
                                    Resset Password
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
