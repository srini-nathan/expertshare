import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Exhibitor, ExhibitorTranslation } from "../../models";
import { useBuildAssetPath, useDataAddEdit } from "../../../AppModule/hooks";
import {
    AppCard,
    AppLoader,
    AppFormLabelTranslatable,
    AppPageHeaderTranslatable,
    AppUploader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import { ExhibitorTranslatable } from "./ExhibitorTranslatable";
import { ExhibitorApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
} from "../../../AppModule/utils";
import "./assets/scss/style.scss";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";

export const ExhibitorAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const {
        id,
        setData,
        isLoading,
        setIsLoading,
        isEditMode,
        activeLocale,
        defaultLocale,
        setActiveLocale,
        languages,
        hookForm,
        conUrl,
    } = useDataAddEdit<Exhibitor>(new Exhibitor());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const logoBasePath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const [translations, setTranslations] = useState<ExhibitorTranslation[]>(
        []
    );
    const [loadingLang, setLoadingLang] = useState<boolean>(true);

    const { t } = useTranslation();

    useEffect(() => {
        if (isEditMode && id !== null) {
            ExhibitorApi.findById<Exhibitor>(id, {
                "groups[]": "translations",
            })
                .then(({ response, isNotFound }) => {
                    if (isNotFound) {
                        errorToast(
                            t("admin.exhibitor.form:notfound.error.message")
                        );
                    } else if (response !== null) {
                        setData(response);
                        const items: ExhibitorTranslation[] = [];
                        Object.entries(response.translations).forEach(
                            ([, value]) => {
                                items.push({
                                    locale: value.locale,
                                    name: value.name,
                                    description: value.description,
                                    contactUsCaption: value.contactUsCaption,
                                });
                            }
                        );
                        setTranslations(items);
                        hookForm.trigger();
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (languages.length !== translations.length) {
            setLoadingLang(true);
            const items: ExhibitorTranslation[] = languages.map((e) => {
                let item = {
                    locale: e.locale,
                    name: "",
                    description: "",
                    contactUsCaption: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            name: k.name,
                            description: k.description,
                            contactUsCaption: k.contactUsCaption,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
        setLoadingLang(false);
    }, [languages]);

    const getTranslation = () => {
        let defaultValues: ExhibitorTranslation = {
            locale: defaultLocale,
            name: "",
            description: "",
            contactUsCaption: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLocale) {
                defaultValues = e;
            }
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
        let error = false;
        translations.forEach((e) => {
            if (!error)
                error =
                    e.description !== "" &&
                    e.name !== "" &&
                    e.contactUsCaption !== "";
        });
        return error;
    };

    const onSubmit = async (formData: Exhibitor) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = conUrl;

            return ExhibitorApi.createOrUpdate<Exhibitor>(id, formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<Exhibitor>(error, hookForm.setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (navigate) {
                        navigate("..").then(() => {
                            successToast(
                                isEditMode
                                    ? t(
                                          "admin.exhibitor.form:updated.info.message"
                                      )
                                    : t(
                                          "admin.exhibitor.form:created.info.message"
                                      )
                            );
                        });
                    }
                }
            );
        }
        return Promise.reject();
    };

    if (isLoading || loadingLang) {
        return <AppLoader />;
    }

    return (
        <div className={"exhibitor-add-edit-page"}>
            <AppPageHeaderTranslatable
                title={`admin.exhibitor.form:header.${
                    isEditMode ? "editTitle" : "addTitle"
                }`}
            />
            <Form noValidate onSubmit={hookForm.handleSubmit(onSubmit)}>
                <Row>
                    <Col>
                        <AppCard>
                            <AppLanguageSwitcher
                                activeLocale={activeLocale}
                                onChange={setActiveLocale}
                            />
                            <ExhibitorTranslatable
                                languages={languages}
                                control={hookForm.control}
                                activeLocale={activeLocale}
                                defaultLocale={defaultLocale}
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitor.form:label.logo"
                                        }
                                        required={true}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={ExhibitorLogoPosterFileInfo}
                                        onFileSelect={() => {}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitor.form:label.poster"
                                        }
                                        required={true}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={ExhibitorPosterFileInfo}
                                        onFileSelect={() => {}}
                                    />
                                </Form.Group>
                            </Col>
                        </AppCard>
                    </Col>
                    <Col></Col>
                </Row>
            </Form>
        </div>
    );
};
