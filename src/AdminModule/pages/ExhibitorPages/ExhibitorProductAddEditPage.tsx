import React, { FC, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Col, Form, Row } from "react-bootstrap";
import { first } from "lodash";
import { useTranslation } from "react-i18next";
import {
    ExhibitorProduct,
    ExhibitorProductTag,
    ExhibitorProductTranslation,
} from "../../models";
import {
    useAuthState,
    useBuildAssetPath,
    useDataAddEdit,
    useNavigator,
} from "../../../AppModule/hooks";
import { productSchema } from "./schema";
import {
    AppBreadcrumb,
    AppCard,
    AppFormActions,
    AppFormInput,
    AppFormLabelTranslatable,
    AppFormSelectCreatable,
    AppFormSwitch,
    AppLoader,
    AppPageHeaderTranslatable,
    AppUploader,
} from "../../../AppModule/components";
import "./assets/scss/style.scss";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import {
    EXHIBITOR_PRODUCT_POSTER_TYPE,
    ExhibitorProductPosterFileInfo,
} from "../../../config";
import { ExhibitorProductTranslatable } from "./ExhibitorProductTranslatable";
import { ExhibitorApi, ExhibitorProductApi } from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { UploadAPI } from "../../../AppModule/apis";
import {
    SimpleObject,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import { ExhibitorProductTagApi } from "../../apis/ExhibitorProductTagApi";

export const ExhibitorProductAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const navigator = useNavigator(navigate);
    const { parentId } = useParams();
    const { containerResourceId, containerId } = useAuthState();
    const exhibitorUrl = ExhibitorApi.toResourceUrl(parentId);
    const {
        id,
        isEditMode,
        hookForm,
        activeLocale,
        defaultLocale,
        setActiveLocale,
        languages,
        isLoading,
        setIsLoading,
        setData,
        data,
    } = useDataAddEdit<ExhibitorProduct>(
        new ExhibitorProduct(containerResourceId, exhibitorUrl),
        productSchema
    );
    const posterBasePath = useBuildAssetPath(ExhibitorProductPosterFileInfo);
    const posterImageFileRef = useRef<File | null>(null);
    const [translations, setTranslations] = useState<
        ExhibitorProductTranslation[]
    >([]);
    const { t } = useTranslation();
    const [loadingLang, setLoadingLang] = useState<boolean>(true);
    const [tags, setTags] = React.useState<SimpleObject<string>[]>([]);
    const [selectedTags, setSelectedTags] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [loadingTags, setLoadingTags] = useState<boolean>(true);
    const { formState, control, setValue, handleSubmit, watch } = hookForm;
    const isCTA = watch("isCta");

    useEffect(() => {
        if (isEditMode && id !== null) {
            ExhibitorProductApi.findById<ExhibitorProduct>(id, {
                "groups[]": "ExhibitorProductTranslationsGroup",
            })
                .then(({ response, isNotFound }) => {
                    if (isNotFound) {
                        errorToast(
                            t(
                                "admin.exhibitorProduct.form:notfound.error.message"
                            )
                        );
                    } else if (response !== null) {
                        setData(response);
                        const items: ExhibitorProductTranslation[] = [];
                        if (response.translations) {
                            Object.entries(response.translations).forEach(
                                ([, value]) => {
                                    items.push({
                                        locale: value.locale,
                                        name: value.name,
                                        description: value.description,
                                        ctaLabel: value.ctaLabel,
                                    });
                                }
                            );
                        }
                        const selected = [] as SimpleObject<string>[];
                        const selTags = response.exhibitorProductTags as ExhibitorProductTag[];
                        selTags?.forEach(({ id: ugId, name }) => {
                            selected.push({
                                label: name,
                                value: name,
                                id: `${ugId}`,
                            });
                        });
                        setSelectedTags(selected);
                        setTranslations(items);
                        hookForm.trigger();
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (languages.length !== translations.length) {
            setLoadingLang(true);
            const items: ExhibitorProductTranslation[] = languages.map((e) => {
                let item = {
                    locale: e.locale,
                    name: "",
                    description: "",
                    ctaLabel: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            name: k.name,
                            description: k.description,
                            ctaLabel: k.ctaLabel,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
        setLoadingLang(false);
    }, [languages, translations]);

    useEffect(() => {
        setLoadingTags(true);
        ExhibitorProductTagApi.find<ExhibitorProductTag>(1, {
            "container.id": containerId,
        })
            .then(({ response }) => {
                if (response !== null) {
                    setTags(
                        response.items.map((tag) => {
                            return {
                                label: tag.name,
                                value: tag.name,
                                id: `${tag.id}`,
                            };
                        })
                    );
                }
            })
            .finally(() => {
                setLoadingTags(false);
            });
    }, []);

    const getTranslation = () => {
        let defaultValues: ExhibitorProductTranslation = {
            locale: defaultLocale,
            name: "",
            description: "",
            ctaLabel: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLocale) {
                defaultValues = e;
            }
        });

        return translations.map((e) => {
            if (e.name === "") {
                return {
                    ...defaultValues,
                    locale: e.locale,
                };
            }
            return e;
        });
    };

    const checkTranslation = () => {
        let error = false;
        translations.forEach((e) => {
            if (!error) {
                if (isCTA) {
                    error = e.name !== "" && e.ctaLabel !== "";
                } else {
                    error = e.name !== "";
                }
            }
        });
        return error;
    };

    const onSubmit = async (formData: ExhibitorProduct) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = containerResourceId;
            formData.exhibitor = exhibitorUrl;
            formData.exhibitorProductTags = [];
            selectedTags.forEach((e) => {
                if (e.id) {
                    formData.exhibitorProductTags.push(
                        ExhibitorProductTagApi.toResourceUrl(parseInt(e.id, 10))
                    );
                }
                formData.exhibitorProductTags.push({
                    name: e.value,
                    container: containerResourceId,
                } as ExhibitorProductTag);
            });
            if (posterImageFileRef.current) {
                const res = await UploadAPI.upload(
                    posterImageFileRef.current,
                    EXHIBITOR_PRODUCT_POSTER_TYPE,
                    containerResourceId
                );
                if (res.response && res.response?.fileName) {
                    formData.imageName = res.response.fileName;
                }
            }
            return ExhibitorProductApi.createOrUpdate<ExhibitorProduct>(
                id,
                formData
            ).then(({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<ExhibitorProduct>(error, hookForm.setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else if (navigate) {
                    navigate("..").then(() => {
                        successToast(
                            isEditMode
                                ? t(
                                      "admin.exhibitorProduct.form:updated.info.message"
                                  )
                                : t(
                                      "admin.exhibitorProduct.form:created.info.message"
                                  )
                        );
                    });
                }
            });
        }
        return Promise.reject();
    };
    const { errors } = formState;

    if (isLoading || loadingLang || loadingTags) {
        return <AppLoader />;
    }

    return (
        <div className={"exhibitor-product-add-edit-page"}>
            <AppBreadcrumb
                linkText={t("admin.exhibitorProduct.list:header.title")}
                linkUrl={".."}
            />
            <AppPageHeaderTranslatable
                title={`admin.exhibitorProduct.form:header.${
                    isEditMode ? "editTitle" : "addTitle"
                }`}
            />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={6}>
                        <AppCard>
                            <AppLanguageSwitcher
                                activeLocale={activeLocale}
                                onChange={setActiveLocale}
                            />
                            <ExhibitorProductTranslatable
                                languages={languages}
                                control={control}
                                activeLocale={activeLocale}
                                defaultLocale={defaultLocale}
                                translations={translations}
                                onChange={setTranslations}
                                ctaRequire={isCTA}
                            />
                        </AppCard>
                    </Col>
                    <Col md={6}>
                        <AppCard>
                            <Row>
                                <Col lg={6} className={"pl-0"}>
                                    <AppFormSwitch
                                        name={"isActive"}
                                        label={t(
                                            "admin.exhibitorProduct.form:label.isActive"
                                        )}
                                        {...validation(
                                            "isActive",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.isActive?.message}
                                        defaultChecked={data.isActive}
                                        control={control}
                                        xl={12}
                                        lg={12}
                                    />
                                </Col>
                                <Col lg={6} className={"pl-0"}>
                                    <AppFormSwitch
                                        name={"isCta"}
                                        label={t(
                                            "admin.exhibitorProduct.form:label.isCta"
                                        )}
                                        {...validation(
                                            "isCta",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.isCta?.message}
                                        defaultChecked={data.isCta}
                                        control={control}
                                        lg={12}
                                        xl={12}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <AppFormSelectCreatable
                                    name="exhibitorProductTags"
                                    label={t(
                                        "admin.exhibitorProduct.form:label.exhibitorProductTags"
                                    )}
                                    md={12}
                                    sm={12}
                                    lg={12}
                                    xl={12}
                                    id="where-filter"
                                    onChangeHandler={setSelectedTags}
                                    value={selectedTags}
                                    options={tags}
                                    control={control}
                                />
                            </Row>
                            <Row>
                                <AppFormInput
                                    name={"price"}
                                    label={t(
                                        "admin.exhibitorProduct.form:label.price"
                                    )}
                                    {...validation(
                                        "price",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.price?.message}
                                    defaultValue={data.price}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={true}
                                />
                                <AppFormInput
                                    name={"ctaUrl"}
                                    label={t(
                                        "admin.exhibitorProduct.form:label.ctaUrl"
                                    )}
                                    {...validation(
                                        "ctaUrl",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.ctaUrl?.message}
                                    defaultValue={data.ctaUrl}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={isCTA}
                                />
                            </Row>
                        </AppCard>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <AppCard>
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitorProduct.form:label.cover"
                                        }
                                        required={false}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={
                                            ExhibitorProductPosterFileInfo
                                        }
                                        imagePath={
                                            data.imageName
                                                ? `${posterBasePath}/${data.imageName}`
                                                : ""
                                        }
                                        onFileSelect={(selectedFiles) => {
                                            const file =
                                                first(selectedFiles) ?? null;
                                            posterImageFileRef.current = file;
                                        }}
                                        onDelete={() => {
                                            setValue("imageName", "");
                                        }}
                                        confirmation={{
                                            title: t(
                                                "admin.exhibitorProduct.form:deleteImage.confirm.title"
                                            ),
                                            bodyContent: t(
                                                "admin.exhibitorProduct.form:deleteImage.confirm.message"
                                            ),
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </AppCard>
                    </Col>
                </Row>
                <AppFormActions
                    isEditMode={isEditMode}
                    navigation={navigator}
                    backLink={`/admin/exhibitors/${parentId}?tab=products`}
                    isLoading={formState.isSubmitting}
                />
            </Form>
        </div>
    );
};
