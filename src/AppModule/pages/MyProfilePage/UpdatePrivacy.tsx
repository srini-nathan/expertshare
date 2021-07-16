import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AppFormSwitch, AppButton, AppLoader, AppCard } from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import {
    validation,
    errorToast,
    successToast,
    setViolations,
} from "../../utils";
import { UserApi } from "../../../AdminModule/apis";
import { UnprocessableEntityErrorResponse, SimpleObject } from "../../models";
import { useAuthState } from "../../hooks";
import { CONSTANTS } from "../../../config";

const {
    Role: { ROLE },
} = CONSTANTS;

type UpdateProfileReq = {
    [key: string]: any;
};

type UpdateProfileForm<T> = {
    [key: string]: T;
};

export const UpdatePrivacy: FC<RouteComponentProps> = (): JSX.Element => {
    const { state, dispatch } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const { role } = useAuthState();
    const [loading, isLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();
    const validationShape = {};
    const validationSchema = Yup.object().shape(validationShape);

    const { control, handleSubmit, formState, setError } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });
    const { errors } = formState;

    const onSubmit = async (formData: UpdateProfileForm<any>) => {
        isLoading(true);
        if (user && user.id)
            UserApi.updateProfile<UpdateProfileReq, UpdateProfileForm<any>>(
                user.id,
                formData
            ).then(({ error, response }) => {
                isLoading(false);
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<UpdateProfileForm<any>>(error, setError);

                    errorToast(error.title);
                } else if (response !== null) {
                    const isArr = response.userTags instanceof Array;

                    if (!isArr) {
                        const userTagsToArray: SimpleObject<string>[] = [];
                        Object.keys(response.userTags).forEach(function (key) {
                            userTagsToArray.push(response.userTags[key]);
                        });
                        response.userTags = userTagsToArray;
                    }
                    successToast("Profile has been updated successfully.");
                    dispatch({
                        type: 0,
                        payload: {
                            ...state,
                            user: response,
                        },
                    });
                }
            });
    };
    return (
        <>
            <Form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                <Row className="pt-3 update-profile">
                    <Col md={12} sm={12}>
                        <AppCard
                            title={t(
                                "profile.update:label.sectionPrivacyAndCommunication"
                            )}
                        >
                            <Row className="m-0 mt-3">
                                {role === ROLE.ROLE_SPEAKER ||
                                role === ROLE.ROLE_MODERATOR ? null : (
                                    <AppFormSwitch
                                        id={"isDisplayAsGuest"}
                                        name={"isDisplayAsGuest"}
                                        label={t(
                                            "profile.update:label.isDisplayAsGuest"
                                        )}
                                        md={12}
                                        lg={4}
                                        xl={4}
                                        required={true}
                                        {...validation(
                                            "isDisplayAsGuest",
                                            formState,
                                            true
                                        )}
                                        defaultChecked={user?.isDisplayAsGuest}
                                        errorMessage={
                                            errors.isDisplayAsGuest?.message
                                        }
                                        control={control}
                                        className={
                                            "pl-0 form-switch-label-wrap"
                                        }
                                    />
                                )}
                                <AppFormSwitch
                                    id={"isExposeEmail"}
                                    name={"isExposeEmail"}
                                    label={t(
                                        "profile.update:label.isExposeEmail"
                                    )}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={true}
                                    {...validation(
                                        "isExposeEmail",
                                        formState,
                                        true
                                    )}
                                    defaultChecked={user?.isExposeEmail}
                                    errorMessage={errors.isExposeEmail?.message}
                                    control={control}
                                    className={"pl-0 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    id={"isAllowCommunication"}
                                    name={"isAllowCommunication"}
                                    label={t(
                                        "profile.update:label.isAllowCommunication"
                                    )}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={true}
                                    {...validation(
                                        "isAllowCommunication",
                                        formState,
                                        true
                                    )}
                                    defaultChecked={user?.isAllowCommunication}
                                    errorMessage={
                                        errors.isAllowCommunication?.message
                                    }
                                    control={control}
                                    className={"pl-0 form-switch-label-wrap"}
                                />
                            </Row>
                        </AppCard>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} className="justify-content-end d-flex">
                        {loading ? (
                            <AppLoader containerClassName="custom-btn-loader" />
                        ) : (
                            <AppButton variant="primary" type="submit">
                                Save
                            </AppButton>
                        )}
                    </Col>
                </Row>
            </Form>
        </>
    );
};
