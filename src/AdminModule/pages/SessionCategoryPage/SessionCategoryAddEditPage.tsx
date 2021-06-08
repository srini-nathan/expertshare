import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { isString as _isString } from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppSessionCategoryTranslations,
    AppFormInputColorPicker,
    SessionCategoryTranslationsType,
} from "../../../AppModule/components";
import { SessionCategory, Language } from "../../models";
import { SessionCategoryApi, ContainerApi, LanguageApi } from "../../apis";
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

export const SessionCategoryAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("en");
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [data, setData] = useState<SessionCategory>(
        new SessionCategory(containerResourceId)
    );
    const [translations, setTranslations] = useState<
        SessionCategoryTranslationsType[]
    >([]);

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        setValue,
    } = useForm<SessionCategory>({
        resolver: yupResolver(
            yup.object().shape({
                color: yup
                    .string()
                    .required()
                    .matches(
                        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8}|[A-Fa-f0-9]{3,4})$/,
                        {
                            message: "Only support valid HEX color code",
                        }
                    ),
                name: yup.string().required(),
            })
        ),
        mode: "all",
    });

    const getTranslation = () => {
        let defaultValues: SessionCategoryTranslationsType = {
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
                    trigger();

                    const items: SessionCategoryTranslationsType[] = Object.keys(
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
    }, [id, isEditMode, trigger]);

    useEffect(() => {
        languages.forEach((e) => {
            if (e.isDefault) {
                setDefaultLanguage(e.locale);
            }
        });
        if (languages.length !== translations.length) {
            const items: SessionCategoryTranslationsType[] = languages.map(
                (e) => {
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
                }
            );
            setTranslations(items);
        }
    }, [languages]);

    useEffect(() => {
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setLanguages(response.items);
                }
                setLoading(false);
            }
        );
    }, [data]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Session Category"} linkUrl={".."} />
            <AppPageHeader
                title={
                    isEditMode
                        ? "Edit Session Category"
                        : "Add Session Category"
                }
            />

            <Row>
                <Col>
                    <AppCard>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <AppSessionCategoryTranslations
                                languages={languages}
                                defaultLanguage={defaultLanguage}
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <Form.Row>
                                <AppFormInputColorPicker
                                    name={"color"}
                                    label={"Color"}
                                    {...validation(
                                        "color",
                                        formState,
                                        isEditMode
                                    )}
                                    xl={12}
                                    lg={12}
                                    errorMessage={errors.color?.message}
                                    defaultValue={data.color}
                                    control={control}
                                    setValue={setValue}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                isLoading={formState.isSubmitting}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
