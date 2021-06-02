import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form, Image } from "react-bootstrap";
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
    AppTagSelect,
} from "../../components";
import {
    Upload,
    UnprocessableEntityErrorResponse,
    SimpleObject,
} from "../../models";
import {
    Conference,
    PConferenceTag,
    ConferenceTag,
    Language,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    LanguageApi,
    ContainerApi,
    ConferenceTagApi,
} from "../../../AdminModule/apis";
import { errorToast, setViolations, successToast } from "../../utils";
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
const { path } = FILETYPEINFO_CONFERENCE_POSTER;

export const ConferenceAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<Conference>(
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
    const conferencePosterPath = useBuildAssetPath(path);

    const { handleSubmit, setError, trigger } = useForm<Conference>({
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

    const submitForm = (formData: Conference) => {
        if (checkTranslation()) {
            const tagsSelectedItems: PConferenceTag[] = selectedConferenceTags.map(
                (e) => {
                    return {
                        name: e.value,
                        container: ContainerApi.toResourceUrl(containerId),
                    };
                }
            );
            formData.conferenceTags = tagsSelectedItems;
            formData.translations = getTranslation();
            formData.container = ContainerApi.toResourceUrl(containerId);
            formData.isVisible = true;

            ConferenceApi.createOrUpdate<Conference>(id, formData).then(
                ({ error, errorMessage }) => {
                    if (error instanceof UnprocessableEntityErrorResponse) {
                        setViolations<Conference>(error, setError);
                    } else if (errorMessage) {
                        errorToast(errorMessage);
                    } else {
                        navigator("/conferences").then(() => {
                            successToast(
                                isEditMode ? "Event updated" : "Event created"
                            );
                        });
                    }
                }
            );
        }
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
    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Events"} linkUrl={"/conferences"} />
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
                            />{" "}
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
                                        accept="image/*"
                                        onFileSelect={onFileSelect}
                                    />
                                    {data.imageName ? (
                                        <Image
                                            src={`${conferencePosterPath}/${data.imageName}`}
                                            thumbnail
                                        />
                                    ) : null}
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    sm={12}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                >
                                    <AppTagSelect
                                        options={conferenceTags}
                                        selectedItems={selectedConferenceTags}
                                        label="Conference Tags"
                                        onChange={(item) => {
                                            let index = -1;
                                            selectedConferenceTags.filter(
                                                (e, i) => {
                                                    if (e.id === item.id) {
                                                        index = i;
                                                    }
                                                    return e;
                                                }
                                            );
                                            if (index !== -1) {
                                                setSelectedConferenceTags([
                                                    ...selectedConferenceTags.slice(
                                                        0,
                                                        index
                                                    ),
                                                    ...selectedConferenceTags.slice(
                                                        index + 1
                                                    ),
                                                ]);
                                            } else {
                                                setSelectedConferenceTags([
                                                    ...selectedConferenceTags,
                                                    item,
                                                ]);
                                            }
                                        }}
                                    ></AppTagSelect>
                                </Form.Group>
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={"/conferences"}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};