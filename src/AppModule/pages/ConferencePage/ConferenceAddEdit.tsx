import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { isString as _isString } from "lodash";
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
    AppUploader,
    AppFormSelectCreatable,
    AppFormSwitch,
} from "../../components";
import {
    Upload,
    UnprocessableEntityErrorResponse,
    SimpleObject,
    FileTypeInfo,
} from "../../models";
import {
    Conference,
    ConferenceTag,
    PConference,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    ContainerApi,
    ConferenceTagApi,
} from "../../../AdminModule/apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../utils";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useBuildAssetPath,
} from "../../hooks";
import { schema } from "./schema";
import { CONSTANTS } from "../../../config";
import { UploadAPI } from "../../apis";
import { useGlobalData } from "../../contexts";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_CONFERENCE_POSTER },
    FILETYPEINFO: { FILETYPEINFO_CONFERENCE_POSTER },
} = UPLOAD;

export const ConferenceAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<PConference>(
        new Conference(containerResourceId)
    );
    const { languages } = useGlobalData();
    const [conferenceTags, setConferenceTags] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [selectedConferenceTags, setSelectedConferenceTags] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [translations, setTranslations] = useState<TranslationsType[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const conferencePosterPath = useBuildAssetPath(
        FILETYPEINFO_CONFERENCE_POSTER as FileTypeInfo
    );
    const { t } = useTranslation();

    const {
        handleSubmit,
        setError,
        trigger,
        formState,
        control,
        setValue,
    } = useForm<Conference>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const getTranslation = () => {
        let defaultValues: TranslationsType = {
            locale: defaultLanguage,
            title: "",
            description: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLanguage) defaultValues = e;
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

    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };

    const submitForm = async (formData: Conference) => {
        if (checkTranslation()) {
            formData.translations = getTranslation();
            formData.container = ContainerApi.toResourceUrl(containerId);
            formData.conferenceTags = selectedConferenceTags.map((e) => {
                if (e.id) {
                    return ConferenceTagApi.toResourceUrl(parseInt(e.id, 10));
                }

                return {
                    name: e.value,
                    container: ContainerApi.toResourceUrl(containerId),
                };
            });

            return ConferenceApi.createOrUpdate<Conference>(id, formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<Conference>(error, setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else {
                        navigator("/event").then(() => {
                            successToast(
                                isEditMode
                                    ? t("event.form:updated.info.message")
                                    : t("event.form:created.info.message")
                            );
                        });
                    }
                }
            );
        }
        return Promise.reject();
    };
    const onSubmit = async (formData: Conference) => {
        if (files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_CONFERENCE_POSTER);

            return UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ errorMessage, response }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                        return submitForm(formData);
                    }

                    if (response && response.fileName) {
                        formData.imageName = response.fileName;
                    }

                    successToast(t("event.form:uploaded.info.message"));
                    return submitForm(formData);
                }
            );
        }
        return submitForm(formData);
    };
    useEffect(() => {
        if (isEditMode) {
            ConferenceApi.findById<Conference>(id, {
                "groups[]": "translations",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    setData(response);
                    const selected = [] as SimpleObject<string>[];
                    response.conferenceTags?.forEach(({ id: ugId, name }) => {
                        selected.push({
                            label: name as string,
                            value: name as string,
                            id: `${ugId}`,
                        });
                    });
                    setSelectedConferenceTags(selected);
                    const items: TranslationsType[] = Object.keys(
                        response.translations
                    ).map((key) => {
                        return {
                            locale: response.translations[key].locale,
                            title: response.translations[key].title,
                            description: response.translations[key].description,
                        };
                    });
                    setTranslations(items);
                }
                setLoading(false);
                trigger();
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
        setLoading(false);
    }, [languages]);
    useEffect(() => {
        ConferenceTagApi.find<ConferenceTag>(1, {
            "container.id": containerId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setConferenceTags(
                    response.items.map((user) => {
                        return {
                            label: user.name,
                            value: user.name,
                            id: `${user.id}`,
                        };
                    })
                );
            }
        });
    }, [data]);

    const { errors } = formState;

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:event")}
                linkUrl={"/event"}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("event.form:header.title.edit")
                        : t("event.form:header.title.add")
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
                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                {/* @ts-ignore */}
                                <Form.Group
                                    as={Col}
                                    sm={12}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                >
                                    <Form.Label>
                                        {t("event.form:label.posterImage")}
                                    </Form.Label>
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={
                                            FILETYPEINFO_CONFERENCE_POSTER as FileTypeInfo
                                        }
                                        imagePath={
                                            data.imageName
                                                ? `${conferencePosterPath}/${data.imageName}`
                                                : ""
                                        }
                                        onFileSelect={onFileSelect}
                                        onDelete={() => {
                                            setValue("imageName", "");
                                            setData({
                                                ...data,
                                                imageName: "",
                                            });
                                        }}
                                    />
                                </Form.Group>
                                <Col md={12} sm={12} lg={6} xl={6}>
                                    <AppFormSelectCreatable
                                        name="conferenceTags"
                                        label={t("event.form:label.tags")}
                                        md={12}
                                        sm={12}
                                        lg={12}
                                        xl={12}
                                        id="where-filter"
                                        onChangeHandler={
                                            setSelectedConferenceTags
                                        }
                                        value={selectedConferenceTags}
                                        options={conferenceTags}
                                        control={control}
                                    />
                                    <AppFormSwitch
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                        name={"isVisible"}
                                        label={t("event.form:label.isVisible")}
                                        {...validation(
                                            "isVisible",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.isVisible?.message}
                                        defaultChecked={data.isVisible}
                                        control={control}
                                    />
                                </Col>
                            </Form.Row>
                        </AppCard>

                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={"/event"}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
