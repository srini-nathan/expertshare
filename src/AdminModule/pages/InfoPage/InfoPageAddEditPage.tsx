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
    AppFormActions,
    AppCard,
    AppFormTranslatable,
    TranslationsType,
    AppFormSwitch,
    AppFormInput,
} from "../../../AppModule/components";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    useParamId,
    useNavigator,
    useAuthState,
} from "../../../AppModule/hooks";
import { schema, validations } from "./schema";
import { useGlobalData } from "../../../AppModule/contexts";
import { InfoPage, InfoPageTranslations } from "../../models";
import { InfoPageApi } from "../../apis";

export const InfoPageAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<InfoPage>(
        new InfoPage(containerResourceId)
    );
    const { languages } = useGlobalData();
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingLang, setLoadingLang] = useState<boolean>(true);
    const [translations, setTranslations] = useState<TranslationsType[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");

    const { t } = useTranslation();

    const {
        handleSubmit,
        setError,
        trigger,
        formState,
        control,
    } = useForm<InfoPage>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const getTranslation = () => {
        let defaultValues: InfoPageTranslations = {
            locale: defaultLanguage,
            title: "",
            description: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLanguage) {
                defaultValues = e;
            }
        });

        return translations.map((e) => {
            if (e.title === "")
                return {
                    ...defaultValues,
                    locale: e.locale,
                };
            return e;
        });
    };

    const checkTranslation = () => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle)
                noErrorTitle = e.description !== "" && e.title !== "";
        });
        return noErrorTitle;
    };

    const onSubmit = async (formData: InfoPage) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = containerResourceId;

            return InfoPageApi.createOrUpdate<InfoPage>(id, formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<InfoPage>(error, setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else {
                        navigator("..").then(() => {
                            successToast(
                                isEditMode
                                    ? t(
                                          "admin.infopage.form:updated.info.message"
                                      )
                                    : t(
                                          "admin.infopage.form:created.info.message"
                                      )
                            );
                        });
                    }
                }
            );
        }
        return Promise.reject();
    };

    useEffect(() => {
        if (isEditMode) {
            InfoPageApi.findById<InfoPage>(id, {
                "groups[]": "translations",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(t(errorMessage));
                } else if (isNotFound) {
                    errorToast(t("admin.infopage.form:notfound.error.message"));
                } else if (response !== null) {
                    setData(response);
                    const items: InfoPageTranslations[] = [];
                    Object.entries(response.translations).forEach(
                        ([, value]) => {
                            items.push({
                                locale: value.locale,
                                title: value.title,
                                description: value.description,
                            });
                        }
                    );
                    setTranslations(items);
                    trigger();
                }
                setLoading(false);
            });
        }
    }, [id, isEditMode, trigger]);

    useEffect(() => {
        languages?.forEach((e) => {
            if (e.isDefault) {
                setDefaultLanguage(e.locale);
            }
        });
        if (languages && languages.length !== translations.length) {
            const items: TranslationsType[] = languages.map((e) => {
                let item = {
                    locale: e.locale,
                    title: "",
                    description: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            title: k.title,
                            description: k.description,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
        setLoadingLang(false);
    }, [languages]);

    const { errors } = formState;

    if (loading || loadingLang) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:infopage")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.infopage.form:header.title.edit")
                        : t("admin.infopage.form:header.title.add")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <AppFormTranslatable
                                languages={languages}
                                defaultLanguage={defaultLanguage}
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <Form.Row>
                                <AppFormInput
                                    name={"slugKey"}
                                    label={t(
                                        "admin.infopage.form:label.slugKey"
                                    )}
                                    maxCount={validations.slugKey.max}
                                    {...validation(
                                        "slugKey",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.slugKey?.message}
                                    defaultValue={data.slugKey}
                                    control={control}
                                />
                                <AppFormSwitch
                                    name={"isActive"}
                                    label={t(
                                        "admin.infopage.form:label.isActive"
                                    )}
                                    {...validation(
                                        "isActive",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isActive?.message}
                                    defaultChecked={data.isActive}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>

                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={".."}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
