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
    CategoryTranslationsType,
} from "../../../AppModule/components";
import { ExhibitorCategory } from "../../models";
import { ExhibitorCategoryApi, ContainerApi } from "../../apis";
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

export const ExhibitorCategoryAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerId } = useAuthState();
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    // const [data, setData] = useState<ExhibitorCategory>(
    //     new ExhibitorCategory(containerResourceId)
    // );
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
    } = useForm<ExhibitorCategory>({
        resolver: yupResolver(
            yup.lazy((obj) =>
                yup.object(
                    mapValues(obj, (_, key) => {
                        if (
                            defaultLanguage &&
                            key === `name_${defaultLanguage}`
                        ) {
                            return yup
                                .string()
                                .required(
                                    t(
                                        "admin.exhibitorCategory.form:name.required"
                                    )
                                );
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

    const submitForm = async (formData: ExhibitorCategory) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = ContainerApi.toResourceUrl(containerId);

            return ExhibitorCategoryApi.createOrUpdate<ExhibitorCategory>(
                id,
                formData
            ).then(({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<ExhibitorCategory>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("/admin/exhibitor-categories").then(() => {
                        successToast(
                            isEditMode
                                ? t(
                                      "admin.exhibitorCategory.form:update.success"
                                  )
                                : t(
                                      "admin.exhibitorCategory.form:create.success"
                                  )
                        );
                    });
                }
            });
        }
        return Promise.reject();
    };
    const onSubmit = async (formData: ExhibitorCategory) => {
        return submitForm(formData);
    };

    useEffect(() => {
        if (isEditMode) {
            ExhibitorCategoryApi.findById<ExhibitorCategory>(id, {
                "groups[]": "ExhibitorCategoryTranslationGroup",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    // setData(response);
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

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:exhibitorCategory")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.exhibitorCategory.form:header.titleEdit")
                        : t("admin.exhibitorCategory.form:header.title")
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