import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { forEach as _forEach } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    AppCard,
    AppFormInputPassword,
    AppButton,
    AppLoader,
} from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { validation, errorToast, successToast } from "../../utils";
import { UserApi } from "../../../AdminModule/apis";
import { UnprocessableEntityErrorResponse } from "../../models";

const validationSchema = Yup.object().shape({
    Password: Yup.string().min(6).required(),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref("Password"), null],
        "Passwords must be match"
    ),
});

type RestPassword = {
    [key: string]: any;
};

type RestPasswordForm = {
    Password?: string;
};

export const ChangePassword: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const [loading, isLoading] = React.useState<boolean>(false);
    const { control, handleSubmit, formState, setError } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const { t } = useTranslation();

    const { errors } = formState;

    const onSubmit = async ({ Password }: RestPasswordForm) => {
        isLoading(true);
        if (user && user.id)
            UserApi.changePassword<RestPasswordForm, RestPassword>(user.id, {
                plainPassword: Password,
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
                } else {
                    successToast("Password has been changed successfully.");
                }
            });
    };
    return (
        <>
            <Row className="pt-3">
                <Col md={12} sm={12}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Row>
                                <AppFormInputPassword
                                    lg={6}
                                    xl={6}
                                    name={"Password"}
                                    label={t(
                                        "profile.update:label.newPassword"
                                    )}
                                    required={true}
                                    {...validation(
                                        "Password",
                                        formState,
                                        false
                                    )}
                                    errorMessage={errors.Password?.message}
                                    control={control}
                                />
                                <AppFormInputPassword
                                    lg={6}
                                    xl={6}
                                    name={"confirmPassword"}
                                    label={t(
                                        "profile.update:label.confirmNewPassword"
                                    )}
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
                                <Col className="justify-content-end d-flex">
                                    {loading ? (
                                        <AppLoader containerClassName="custom-btn-loader" />
                                    ) : (
                                        <AppButton
                                            variant="primary"
                                            type="submit"
                                        >
                                            {t("common.button:save")}
                                        </AppButton>
                                    )}
                                </Col>
                            </Row>
                        </AppCard>
                    </Form>
                </Col>
            </Row>
        </>
    );
};
