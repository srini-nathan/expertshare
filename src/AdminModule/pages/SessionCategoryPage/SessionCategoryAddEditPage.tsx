import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider } from "react-hook-form";
import mapValues from "lodash/mapValues";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppCategoryTranslations,
    AppFormInputColorPicker,
    CategoryTranslationsType,
} from "../../../AppModule/components";
import { SessionCategory } from "../../models";
import { SessionCategoryApi, ContainerApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
} from "../../../AppModule/utils";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useLanguages,
} from "../../../AppModule/hooks";

export const SessionCategoryAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<SessionCategory>(
        new SessionCategory(containerResourceId)
    );
    const { Languages } = useLanguages();
    const [translations, setTranslations] = useState<
        CategoryTranslationsType[]
    >([]);
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        setValue,
        register,
        ...rest
    } = useForm<SessionCategory>({
        resolver: yupResolver(
            yup.lazy((obj) =>
                yup.object(
                    mapValues(obj, (_, key) => {
                        if (key === "color") {
                            return yup
                                .string()
                                .required()
                                .matches(
                                    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3,4})$/,
                                    {
                                        message:
                                            "Only support valid HEX color code",
                                    }
                                );
                        }

                        if (key === "textColor") {
                            return yup
                                .string()
                                .required()
                                .matches(
                                    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3,4})$/,
                                    {
                                        message:
                                            "Only support valid HEX color code",
                                    }
                                );
                        }

                        if (
                            defaultLanguage &&
                            key === `name_${defaultLanguage}`
                        ) {
                            return yup
                                .string()
                                .required("Name is a required field.");
                        }

                        return yup.string().notRequired();
                    })
                )
            )
        ),
        mode: "all",
    });

    const getTranslation = () => {
        let defaultValues: CategoryTranslationsType = {
            locale: defaultLanguage,
            name: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLanguage) defaultValues = e;
        });
        return translations.map((e) => {
            if (e.name === "")
                return {
                    ...defaultValues,
                    locale: e.locale,
                };
            return e;
        });
    };

    const checkTranslation = () => {
        let noErrorName = false;
        translations.forEach((e) => {
            if (!noErrorName) noErrorName = e.name !== "";
        });
        return noErrorName;
    };

    const submitForm = async (formData: SessionCategory) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = ContainerApi.toResourceUrl(containerId);

            return SessionCategoryApi.createOrUpdate<SessionCategory>(
                id,
                formData
            ).then(({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<SessionCategory>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("/admin/session-categories").then(() => {
                        successToast(
                            isEditMode
                                ? "Session Category updated"
                                : "Session Category created"
                        );
                    });
                }
            });
        }
        return Promise.reject();
    };
    const onSubmit = async (formData: SessionCategory) => {
        return submitForm(formData);
    };

    useEffect(() => {
        if (isEditMode) {
            SessionCategoryApi.findById<SessionCategory>(id, {
                "groups[]": "SessionCategoryTranslationGroup",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    setData(response);
                    setValue("color", response.color);
                    const items: CategoryTranslationsType[] = Object.keys(
                        response.translations
                    ).map((key) => {
                        return {
                            locale: response.translations[key].locale,
                            name: response.translations[key].name,
                        };
                    });
                    setTranslations(items);
                }
            });
        }
    }, [id, isEditMode]);

    useEffect(() => {
        Languages().forEach((e) => {
            if (e.isDefault) {
                setDefaultLanguage(e.locale);
            }
        });
        if (Languages().length !== translations.length) {
            const items: CategoryTranslationsType[] = Languages().map((e) => {
                let item = {
                    locale: e.locale,
                    name: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            name: k.name,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
        setLoading(false);
    }, [Languages()]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:sessionCategory")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.sessionCategory.form:header.titleEdit")
                        : t("admin.sessionCategory.form:header.title")
                }
            />

            <Row>
                <Col>
                    <FormProvider
                        {...{
                            control,
                            handleSubmit,
                            formState,
                            setError,
                            trigger,
                            setValue,
                            register,
                            ...rest,
                        }}
                    >
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <AppCard>
                                <AppCategoryTranslations
                                    languages={Languages()}
                                    defaultLanguage={defaultLanguage}
                                    translations={translations}
                                    onChange={setTranslations}
                                />
                                <Form.Row>
                                    <AppFormInputColorPicker
                                        label={t(
                                            "admin.sessionCategory.form:label.color"
                                        )}
                                        {...register("color")}
                                        xl={12}
                                        lg={12}
                                        errorMessage={errors.color?.message}
                                        defaultValue={data.color}
                                        control={control}
                                        setValue={setValue}
                                    />
                                    <AppFormInputColorPicker
                                        label={t(
                                            "admin.sessionCategory.form:label.textColor"
                                        )}
                                        {...register("textColor")}
                                        xl={12}
                                        lg={12}
                                        errorMessage={errors.textColor?.message}
                                        defaultValue={data.textColor}
                                        control={control}
                                        setValue={setValue}
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
                    </FormProvider>
                </Col>
            </Row>
        </Fragment>
    );
};
