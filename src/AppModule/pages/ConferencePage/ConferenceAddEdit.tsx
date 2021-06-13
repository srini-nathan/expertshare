import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { isString as _isString } from "lodash";
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
    Language,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    LanguageApi,
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
    const [languages, setLanguages] = useState<Language[]>([]);
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
                                isEditMode ? "Event updated" : "Event created"
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

                    successToast("Image uploaded");
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
                    trigger();
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
            <AppBreadcrumb linkText={"Events"} linkUrl={"/event"} />
            <AppPageHeader title={isEditMode ? "Edit Event" : "Add Event"} />
            <Row>
                <Col>
                    <AppCard>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <AppFormTranslatable
                                languages={languages}
                                defaultLanguage={defaultLanguage}
                                translations={translations}
                                onChange={setTranslations}
                            />
                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                name={"isVisible"}
                                label={"Is Visible ?"}
                                {...validation(
                                    "isVisible",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={errors.isVisible?.message}
                                defaultChecked={data.isVisible}
                                control={control}
                            />
                            <Form.Row>
                                <Form.Group
                                    as={Col}
                                    sm={12}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                >
                                    <Form.Label>Poster</Form.Label>
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
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
                                <AppFormSelectCreatable
                                    name="userTags"
                                    label="Conference Tags"
                                    md={12}
                                    sm={12}
                                    lg={12}
                                    xl={12}
                                    id="where-filter"
                                    onChangeHandler={setSelectedConferenceTags}
                                    value={selectedConferenceTags}
                                    options={conferenceTags}
                                    control={control}
                                />
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={"/event"}
                                isLoading={formState.isSubmitting}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
