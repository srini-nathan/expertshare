import React, { FC } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AuthContext, loginAction } from "../../context/AuthContext";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { validation } from "../../../AppModule/utils";
import "./assets/scss/styles.scss";

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
        <Container fluid className="active-account auth-container">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        title="Log In"
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
                                            errorMessage={
                                                errors.password?.message
                                            }
                                            value={"123123"}
                                            control={control}
                                        />
                                    </Form.Row>
                                    <Link
                                        to={"/auth/forgot-password"}
                                        className="forgot-password"
                                    >
                                        Forgot Password
                                    </Link>
                                </Form.Group>

                                <AppButton block={true} type={"submit"}>
                                    Login
                                </AppButton>
                                <Row className={"mt-3"}>
                                    <Col
                                        sm={12}
                                        className={
                                            "text-center mb-3 normal-label"
                                        }
                                    >
                                        <span>Or login with</span>
                                    </Col>

                                    <Col md={4} xl={4} lg={4} sm={12}>
                                        <a
                                            className={
                                                "btn mb-3 btn-secondary justify-content-center social-media-button" +
                                                " google"
                                            }
                                            href={
                                                "http://api.expertshare.site:8091/social/connect/google"
                                            }
                                        >
                                            Google
                                        </a>
                                    </Col>
                                    <Col md={4} xl={4} lg={4} sm={12}>
                                        <a
                                            className={
                                                "btn mb-3 btn-secondary justify-content-center social-media-button linkedin"
                                            }
                                            href={
                                                "http://api.expertshare.site:8091/social/connect/linkedin"
                                            }
                                        >
                                            LinkedIn
                                        </a>
                                    </Col>
                                    <Col md={4} xl={4} lg={4} sm={12}>
                                        <a
                                            className={
                                                "btn mb-3 btn-secondary justify-content-center social-media-button azure"
                                            }
                                            href={
                                                "http://api.expertshare.site:8091/social/connect/azure"
                                            }
                                        >
                                            Azure
                                        </a>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </div>
                </Row>
            </div>
            <AppAuthFooter />
        </Container>
    );
};
