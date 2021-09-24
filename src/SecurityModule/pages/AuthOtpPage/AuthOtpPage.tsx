import React, { FC, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppButton } from "../../../AppModule/components/AppButton";
import { AppAuthHeader, AppAuthFooter } from "../../components";
import { AppFormInput } from "../../../AppModule/components/AppFormInput";
import { AuthApi } from "../../apis";
import {
    validation,
    setViolations,
    successToast,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import "./assets/scss/styles.scss";
import { SendOtpPayload } from "../../models";
import { AuthContext, loginByToken, buildConfig } from "../../contexts";

class OtpResponse {
    success = false;
}

type VerifyOtpForm = {
    otp: number;
    token: string;
};

const schema = yup.object().shape({
    otp: yup
        .string()
        .matches(/^[0-9]+$/, "authOtp.form:otp.error.onlyDigits")
        .min(6, "authOtp.form:otp.error.max6Digit")
        .max(6, "authOtp.form:otp.error.max6Digit"),
});

export const AuthOtpPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const {
        control,
        handleSubmit,
        formState,
        setError,
    } = useForm<VerifyOtpForm>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const { errors, isSubmitting } = formState;
    const { t } = useTranslation();
    const { token } = useParams();
    const [sending, setSending] = useState<boolean>(false);
    const { dispatch } = React.useContext(AuthContext);

    const resendOtp = async () => {
        setSending(true);
        await AuthApi.sendOtp<SendOtpPayload, OtpResponse>(
            {
                token,
            },
            buildConfig(token)
        );
        successToast("authOtp.form:message.otpResent");
        setSending(false);
    };

    const onSubmit = async (dataForm: VerifyOtpForm) => {
        dataForm.token = token;
        setErrorMessage("");
        return AuthApi.checkOtp<VerifyOtpForm, OtpResponse>(
            dataForm,
            buildConfig(token)
        ).then((res) => {
            if (res instanceof UnprocessableEntityErrorResponse) {
                setViolations<VerifyOtpForm>(res, setError);
                setErrorMessage(res?.description);
            } else if (navigate) {
                const { success = false } = res as OtpResponse;
                if (success) {
                    loginByToken(token, dispatch);
                } else {
                    setErrorMessage("authOtp.form:error.invalidOtp");
                }
            }
        });
    };

    return (
        <Container fluid className="active-account auth-container with-bg">
            <div className="auth-container--box">
                <Row className="p-0 m-auto">
                    <AppAuthHeader
                        errorMessage={t(errorMessage)}
                        title={t("authOtp.form:title")}
                        description={t("authOtp.form:description")}
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
                                            type={"text"}
                                            name={"otp"}
                                            label={""}
                                            required={true}
                                            {...validation(
                                                "otp",
                                                formState,
                                                false
                                            )}
                                            errorMessage={errors.otp?.message}
                                            placeholder={t(
                                                "authOtp.form:placeholder.enterOtp"
                                            )}
                                            control={control}
                                        />
                                    </Form.Row>
                                </Form.Group>
                                <AppButton
                                    className={"p-0 mb-2"}
                                    variant={"link"}
                                    disabled={sending}
                                    isLoading={sending}
                                    loadingTxt={`${t(
                                        "authOtp.form:button.sendingOtp"
                                    )}...`}
                                    onClick={resendOtp}
                                    type={"button"}
                                >
                                    {t("authOtp.form:button.resend")}
                                </AppButton>
                                <AppButton
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    loadingTxt={`${t(
                                        "authOtp.form:button.validating"
                                    )}...`}
                                    block={true}
                                    type={"submit"}
                                >
                                    {t("authOtp.form:button.verify")}
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
