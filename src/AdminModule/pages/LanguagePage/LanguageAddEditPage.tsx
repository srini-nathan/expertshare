import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormSwitch,
    AppFormActions,
    AppCard,
    AppFormInput,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { LanguageApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import {
    useParamId,
    useNavigator,
    useAuthState,
} from "../../../AppModule/hooks";
import { schema, validations } from "./schema";

const { name, locale } = validations;

export const LanguageAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<Language>(
        new Language(containerResourceId)
    );
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
    } = useForm<Language>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: Language) => {
        return LanguageApi.createOrUpdate<Language>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Language>(error, setError);
                } else if (errorMessage) {
                    errorToast(t(errorMessage));
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode
                                ? t("admin.language.form:toast.success.edit")
                                : t("admin.language.form:toast.success.add")
                        );
                    });
                }
            }
        );
    };

    useEffect(() => {
        if (isEditMode) {
            LanguageApi.findById<Language>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast(
                            t("admin.language.form:toast.error.notfound")
                        );
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("admin.language.list:header.title")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.language.form:header.title")
                        : t("admin.language.form:header.edittitle")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={t("admin.language.form:label.name")}
                                    maxCount={name.max}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"locale"}
                                    label={t(
                                        "admin.language.form:label.locale"
                                    )}
                                    maxCount={locale.max}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.locale?.message}
                                    defaultValue={data.locale}
                                    control={control}
                                />
                                <AppFormSwitch
                                    name={"isActive"}
                                    label={t(
                                        "admin.language.form:label.isActive"
                                    )}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isActive?.message}
                                    value={data.isActive}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>

                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
