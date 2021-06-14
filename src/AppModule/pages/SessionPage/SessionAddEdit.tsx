import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { find as _find, isString as _isString } from "lodash";
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
    AppTagSelect,
    AppFormLabel,
    AppFormSelect,
    AppFormInput,
    AppFormSwitch,
    AppDatePicker,
    AppSelectStream,
    AppSessionDoc,
    AppSessionUsers,
} from "../../components";
import {
    Upload,
    UnprocessableEntityErrorResponse,
    SimpleObject,
    PrimitiveObject,
    FileTypeInfo,
} from "../../models";
import {
    Session,
    SessionCategory,
    Language,
    SessionTag,
    UserGroup,
    User,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    SessionTagApi,
    SessionCategoryApi,
    SessionApi,
    LanguageApi,
    ContainerApi,
    UserGroupApi,
    UserApi,
} from "../../../AdminModule/apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
    getDate,
    getTime24,
} from "../../utils";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useBuildAssetPath,
} from "../../hooks";
import { CONSTANTS } from "../../../config";
import { UploadAPI } from "../../apis";
import { schema } from "./schemaSession";
import "./assets/scss/style.scss";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_SESSION_POSTER, FILETYPE_SESSION_DOC },
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;
const { Session: SESSION } = CONSTANTS;
const { CARDSIZE } = SESSION;
const { CARDTYPE } = SESSION;

const cardSizeOptions = Object.entries(CARDSIZE).map(([, value]) => ({
    value,
    label: value,
}));

const cardTypeOptions = Object.entries(CARDTYPE).map(([, value]) => ({
    value,
    label: value,
}));

export const SessionAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const { conferenceId } = useParams();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId, clientId } = useAuthState();
    const [data, setData] = useState<Session>(new Session(containerResourceId));
    const [languages, setLanguages] = useState<Language[]>([]);
    const [moderatores, setModeratores] = useState<User[]>([]);
    const [speakers, setSpeakers] = useState<User[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<User[]>([]);
    const [selectedSpeakers, setSelectedSpeakers] = useState<User[]>([]);
    const [sessionTags, setSessionTags] = React.useState<
        SimpleObject<string>[]
    >([]);

    const [selectedSessionTags, setSelectedSessionTags] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [SessionCategories, setSessionCategories] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingCat, setLoadingCat] = useState<boolean>(true);
    const [showExtraLinks, isExtraLink] = useState<boolean>(
        data.isExternalLinkEnable
    );
    const [activeLanguage, setActiveLanguage] = useState<string>("");
    const [translations, setTranslations] = useState<TranslationsType[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [docsFile, setDocsFile] = useState<SimpleObject<string>[]>([]);
    const sessionPosterPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_POSTER as FileTypeInfo
    );
    const [userGroups, setUserGroups] = React.useState<SimpleObject<string>[]>(
        data.sessionDocs
    );

    const [selectedUserGroups, setSelectedUserGroups] = React.useState<
        SimpleObject<string>[]
    >([]);
    const {
        handleSubmit,
        setError,
        trigger,
        formState,
        control,
        setValue,
    } = useForm<Session>({
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

    const onDocsSelect = (selectedFiles: File[]) => {
        if (selectedFiles) {
            const fd = new FormData();
            fd.set("file", selectedFiles[0], selectedFiles[0].name);
            fd.set("fileType", FILETYPE_SESSION_DOC);

            UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ response }) => {
                    if (response && response.fileName) {
                        setDocsFile([
                            {
                                fileName: response.fileName,
                                name: selectedFiles[0].name,
                                size: selectedFiles[0].size.toString(),
                                container: ContainerApi.toResourceUrl(
                                    containerId
                                ),
                            },
                            ...docsFile,
                        ]);
                    }
                }
            );
        }
    };

    const onRemoveDoc = (index: number) => {
        setDocsFile([
            ...docsFile.slice(0, index),
            ...docsFile.slice(index + 1),
        ]);
    };

    const submitForm = async (formData: Session) => {
        /* eslint-disable no-console */
        console.log(formData.end);
        /* eslint-enable no-console */
        formData.translations = getTranslation();
        formData.sessionDocs = docsFile.map((e) => {
            return {
                fileName: e.fileName,
                name: e.name,
                container: e.container,
            };
        });
        formData.container = ContainerApi.toResourceUrl(containerId);
        formData.conference = ConferenceApi.toResourceUrl(conferenceId);
        formData.sessionTags = selectedSessionTags.map((e) => {
            if (e.id) return SessionTagApi.toResourceUrl(parseInt(e.id, 10));
            return {
                name: e.value,
                container: ContainerApi.toResourceUrl(containerId),
            };
        });
        formData.speakers = selectedSpeakers.map((e) => {
            return UserApi.toResourceUrl(e.id);
        });
        formData.moderators = selectedModerators.map((e) => {
            return UserApi.toResourceUrl(e.id);
        });
        formData.start = `${getDate(formData.start)} ${getTime24(
            formData.start
        )}`;
        formData.end = `${getDate(formData.end)} ${getTime24(formData.end)}`;
        /* eslint-disable no-console */
        console.log(formData.end);
        /* eslint-enable no-console */
        return SessionApi.createOrUpdate<Session>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Session>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator(`/event/${conferenceId}/agenda`).then(() => {
                        successToast(
                            isEditMode ? "Event updated" : "Event created"
                        );
                    });
                }
            }
        );
    };

    const onSubmit = async (formData: Session) => {
        if (files.length > 0) {
            if (checkTranslation()) {
                const fd = new FormData();
                fd.set("file", files[0], files[0].name);
                fd.set("fileType", FILETYPE_SESSION_POSTER);

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
        }
        return submitForm(formData);
    };

    useEffect(() => {
        if (isEditMode) {
            SessionApi.findById<Session>(id, {
                "groups[]": "SessionTranslationsGroup",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    setData(response);
                    trigger();
                    const selected = [] as SimpleObject<string>[];
                    response.sessionTags?.forEach(({ id: ugId, name }) => {
                        selected.push({
                            label: name as string,
                            value: name as string,
                            id: `${ugId}`,
                        });
                    });
                    setSelectedSessionTags(selected);
                    const items: TranslationsType[] = Object.keys(
                        response.translations
                    ).map((key) => {
                        return {
                            locale: response.translations[key].locale,
                            title: response.translations[key].title,
                            description: response.translations[key].description,
                            streamUrl: response.translations[key].streamUrl,
                        };
                    });
                    setTranslations(items);
                    const sessionDocs: SimpleObject<string>[] = response.sessionDocs.map(
                        (e) => {
                            return {
                                fileName: e.fileName,
                                name: e.name,
                                size: "",
                                container: ContainerApi.toResourceUrl(
                                    containerId
                                ),
                            };
                        }
                    );
                    setDocsFile(sessionDocs);
                    isExtraLink(response.isExternalLinkEnable);
                    setSelectedModerators(response.moderators as User[]);
                    setSelectedSpeakers(response.speakers as User[]);
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
                    streamUrl: "",
                };
                translations.forEach((k) => {
                    if (k.locale === e.locale) {
                        item = {
                            locale: k.locale,
                            title: k.title,
                            description: k.description,
                            streamUrl: k.streamUrl as string,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
    }, [languages]);
    useEffect(() => {
        UserGroupApi.find<UserGroup>(1, { "client.id": clientId }).then(
            ({ response, error }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setUserGroups(
                        response.items.map((user) => {
                            return {
                                label: user.name,
                                value: `${user.id}`,
                                id: `${user.id}`,
                            };
                        })
                    );
                }
            }
        );
        UserApi.getLimited<User>(1, {
            "roles.role": "ROLE_MODERATOR",
            "client.id": clientId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setModeratores(response.items);
            }
        });
        UserApi.getLimited<User>(1, {
            "roles.role": "ROLE_SPEAKER",
            "client.id": clientId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setSpeakers(response.items);
            }
        });
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
        SessionTagApi.find<SessionTag>(1, {
            "container.id": containerId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setSessionTags(
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
        SessionCategoryApi.find<SessionCategory>(1, {
            "container.id": containerId,
        }).then(({ error, response }) => {
            setLoadingCat(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setSessionCategories(
                    response.items.map((sc: SessionCategory) => {
                        return {
                            label: sc.name,
                            value: SessionCategoryApi.toResourceUrl(sc.id),
                            id: `${sc.id}`,
                        };
                    })
                );
            }
        });
    }, []);

    const renderLinksValue = () => {
        return !showExtraLinks ? "d-none" : "d-flex";
    };

    const { errors } = formState;

    if (loading || loadingCat) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={"Events"}
                linkUrl={`/event/${conferenceId}/agenda`}
            />
            <AppPageHeader
                title={isEditMode ? "Edit Session" : "Add Session"}
            />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={12}>
                        <AppCard>
                            <AppFormTranslatable
                                languages={languages}
                                defaultLanguage={defaultLanguage}
                                translations={translations}
                                onChange={setTranslations}
                                setActiveLanguage={setActiveLanguage}
                            />
                        </AppCard>
                    </Col>
                    <Col md={12} lg={6} xl={6}>
                        <AppCard
                            className={" mt-2 p-4 card-height"}
                            title="Conver Image"
                        >
                            <AppUploader
                                withCropper
                                accept="image/*"
                                imagePath={
                                    data.imageName
                                        ? `${sessionPosterPath}/${data.imageName}`
                                        : ""
                                }
                                onFileSelect={onFileSelect}
                            />
                        </AppCard>
                    </Col>

                    <Col md={12} lg={6} xl={6}>
                        <AppCard title="Session Details">
                            <Row>
                                <Col
                                    md={12}
                                    lg={6}
                                    className="react-datepicker-container mb-2"
                                >
                                    <AppFormLabel
                                        required={false}
                                        label="Start Date"
                                    />
                                    <AppDatePicker
                                        showTimeInput
                                        dateFormat={"d MMMM yyyy, h:mm aa"}
                                        {...validation(
                                            "start",
                                            formState,
                                            isEditMode
                                        )}
                                        name={"start"}
                                        control={control}
                                        defaultValue={
                                            data.start
                                                ? new Date(data.start)
                                                : new Date()
                                        }
                                    />
                                </Col>
                                <Col
                                    md={12}
                                    lg={6}
                                    className="react-datepicker-container mb-2"
                                >
                                    <AppFormLabel
                                        label="End Date"
                                        required={false}
                                    />
                                    <AppDatePicker
                                        showTimeInput
                                        dateFormat={"d MMMM yyyy, h:mm aa"}
                                        {...validation(
                                            "end",
                                            formState,
                                            isEditMode
                                        )}
                                        name={"end"}
                                        control={control}
                                        defaultValue={
                                            data.end
                                                ? new Date(data.end)
                                                : new Date()
                                        }
                                    />
                                </Col>
                                <AppFormSelect
                                    id={"category"}
                                    name={"sessionCategory"}
                                    label={"Choose Category"}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    {...validation(
                                        "sessionCategory",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.sessionCategory?.message
                                    }
                                    defaultValue={
                                        (data.sessionCategory as SessionCategory)
                                            .id &&
                                        SessionCategoryApi.toResourceUrl(
                                            (data.sessionCategory as SessionCategory)
                                                .id
                                        )
                                    }
                                    placeholder={"Category"}
                                    options={SessionCategories}
                                    control={control}
                                    transform={{
                                        output: (category: PrimitiveObject) =>
                                            category?.value,
                                        input: (value: string) => {
                                            return _find(SessionCategories, {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                <Col md={12}>
                                    <AppSelectStream
                                        name="streamValue"
                                        activeLanguage={activeLanguage}
                                        changeValue={setValue}
                                        streamType={data.streamType.toUpperCase()}
                                        languages={languages}
                                        control={control}
                                        formState={formState}
                                        isEditMode={isEditMode}
                                        data={data}
                                        errors={errors}
                                        defaultLanguage={defaultLanguage}
                                        translations={translations}
                                        onChange={setTranslations}
                                        setActiveLanguage={setActiveLanguage}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    </Col>

                    <Col md={12} lg={6} xl={6}>
                        <AppCard>
                            <AppTagSelect
                                options={userGroups}
                                selectedItems={selectedUserGroups}
                                label="User Groups"
                                required
                                onChange={(item) => {
                                    let index = -1;
                                    selectedUserGroups.filter((e, i) => {
                                        if (e.id === item.id) {
                                            index = i;
                                        }
                                        return e;
                                    });
                                    if (index !== -1) {
                                        setSelectedUserGroups([
                                            ...selectedUserGroups.slice(
                                                0,
                                                index
                                            ),
                                            ...selectedUserGroups.slice(
                                                index + 1
                                            ),
                                        ]);
                                    } else {
                                        setSelectedUserGroups([
                                            ...selectedUserGroups,
                                            item,
                                        ]);
                                    }
                                }}
                            ></AppTagSelect>
                        </AppCard>
                    </Col>

                    <Col md={12} lg={6} xl={6}>
                        <AppCard className={" mt-2 p-4 card-height2"}>
                            <AppFormSelectCreatable
                                name="SessionTags"
                                label="Session Tags"
                                md={12}
                                sm={12}
                                lg={12}
                                xl={12}
                                id="SessionTags"
                                onChangeHandler={setSelectedSessionTags}
                                value={selectedSessionTags}
                                options={sessionTags}
                                control={control}
                            />
                        </AppCard>
                    </Col>
                    <Col md={12}>
                        <AppCard>
                            <Form.Row>
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isVisible"}
                                    label={"Visible"}
                                    {...validation(
                                        "isVisible",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isVisible?.message}
                                    defaultChecked={data.isVisible}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isCommentEnable"}
                                    label={"Enable Comments / Questions"}
                                    {...validation(
                                        "isCommentEnable",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.isCommentEnable?.message
                                    }
                                    defaultChecked={data.isCommentEnable}
                                    control={control}
                                />

                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isCommentModerated"}
                                    label={"Moderated Comments"}
                                    {...validation(
                                        "isCommentModerated",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.isCommentModerated?.message
                                    }
                                    defaultChecked={data.isCommentModerated}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isSharingEnable"}
                                    label={"Enable Sharing"}
                                    {...validation(
                                        "isSharingEnable",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.isSharingEnable?.message
                                    }
                                    defaultChecked={data.isSharingEnable}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isLikeEnable"}
                                    label={"Enable Likes"}
                                    {...validation(
                                        "isLikeEnable",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isLikeEnable?.message}
                                    defaultChecked={data.isLikeEnable}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isJoinRequired"}
                                    label={"Moderated Join"}
                                    {...validation(
                                        "isJoinRequired",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isLikeEnable?.message}
                                    defaultChecked={data.isLikeEnable}
                                    control={control}
                                />
                                <AppFormSwitch
                                    sm={12}
                                    md={12}
                                    lg={3}
                                    xl={3}
                                    name={"isSessionPublic"}
                                    label={"Public Session"}
                                    {...validation(
                                        "isSessionPublic",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.isSessionPublic?.message
                                    }
                                    defaultChecked={data.isSessionPublic}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                    </Col>

                    <Col md={12}>
                        <AppCard>
                            <Row>
                                <Col
                                    md={12}
                                    lg={6}
                                    className="create-session--speakers divider-right"
                                >
                                    <AppSessionUsers
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelectedUsers={
                                            setSelectedSpeakers
                                        }
                                        selectedUsers={selectedSpeakers}
                                        title="Speakers"
                                        icon="speakers"
                                        users={speakers}
                                    />
                                </Col>
                                <Col
                                    md={12}
                                    lg={6}
                                    className="create-session--speakers"
                                >
                                    <AppSessionUsers
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelectedUsers={
                                            setSelectedModerators
                                        }
                                        selectedUsers={selectedModerators}
                                        title="Moderators"
                                        icon="moderators"
                                        users={moderatores}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    </Col>

                    <Col md={12} lg={6} xl={6}>
                        <AppCard>
                            <AppSessionDoc
                                showAddDelete={true}
                                onFileSelect={onDocsSelect}
                                onRemoveDoc={onRemoveDoc}
                                files={docsFile}
                            />
                        </AppCard>
                    </Col>
                    <Col md={12} lg={6} xl={6}>
                        <AppCard className="mt-2 p-4 card-height2">
                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={3}
                                xl={3}
                                className="p-0"
                                name={"isExternalLinkEnable"}
                                label={"Enable Extra Link"}
                                {...validation(
                                    "isExternalLinkEnable",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={
                                    errors.isExternalLinkEnable?.message
                                }
                                defaultChecked={data.isExternalLinkEnable}
                                control={control}
                                onChange={(e) => {
                                    isExtraLink(e.target.checked);
                                }}
                            />

                            <Row className={`m-0 ${renderLinksValue()}`}>
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"externalLinkLabel"}
                                    lg={6}
                                    xl={6}
                                    required={true}
                                    label="Extra Link Label"
                                    {...validation(
                                        "externalLinkLabel",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.externalLinkLabel?.message
                                    }
                                    defaultValue={data.externalLinkLabel}
                                    control={control}
                                />

                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"externalLinkUrl"}
                                    lg={6}
                                    xl={6}
                                    required={true}
                                    label="Extra Link Url"
                                    {...validation(
                                        "externalLinkUrl",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.externalLinkUrl?.message
                                    }
                                    defaultValue={data.externalLinkLabel}
                                    control={control}
                                />
                            </Row>

                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={3}
                                xl={3}
                                className="p-0"
                                name={"isSessionAutoSwitch"}
                                label={"Auto Switch Session"}
                                {...validation(
                                    "isSessionAutoSwitch",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={
                                    errors.isSessionAutoSwitch?.message
                                }
                                defaultChecked={data.isSessionAutoSwitch}
                                control={control}
                            />
                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={3}
                                xl={3}
                                className="p-0"
                                name={"isShowInVideoLibrary"}
                                label={"Show in Video Library"}
                                {...validation(
                                    "isShowInVideoLibrary",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={
                                    errors.isShowInVideoLibrary?.message
                                }
                                defaultChecked={data.isShowInVideoLibrary}
                                control={control}
                            />
                            <AppFormSelect
                                id={"cardSize"}
                                name={"cardSize"}
                                label={"Choose Card Size"}
                                md={12}
                                lg={12}
                                xl={12}
                                {...validation(
                                    "cardSize",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={errors.cardSize?.message}
                                defaultValue={data.cardSize}
                                placeholder={"Card Size"}
                                className={"p-0 editSession cardsize"}
                                options={cardSizeOptions}
                                control={control}
                                transform={{
                                    output: (cardSize: PrimitiveObject) =>
                                        cardSize?.value,
                                    input: (value: string) => {
                                        return _find(cardSizeOptions, {
                                            value,
                                        });
                                    },
                                }}
                            />
                            <AppFormSelect
                                id={"cardType"}
                                name={"cardType"}
                                label={"Choose Card Type"}
                                md={12}
                                lg={12}
                                xl={12}
                                className={"p-0 editSession"}
                                {...validation(
                                    "cardType",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={errors.cardType?.message}
                                defaultValue={data.cardType}
                                placeholder={"Card Type"}
                                options={cardTypeOptions}
                                control={control}
                                transform={{
                                    output: (cardType: PrimitiveObject) =>
                                        cardType?.value,
                                    input: (value: string) => {
                                        return _find(cardTypeOptions, {
                                            value,
                                        });
                                    },
                                }}
                            />
                            <AppFormInput
                                className="pl-0"
                                name={"ord"}
                                type={"number"}
                                md={12}
                                lg={12}
                                xl={12}
                                required={false}
                                label="Order"
                                {...validation("ord", formState, isEditMode)}
                                errorMessage={errors.ord?.message}
                                defaultValue={`${data?.ord}`}
                                control={control}
                            />
                        </AppCard>
                    </Col>

                    <AppFormActions
                        isEditMode={isEditMode}
                        navigation={navigator}
                        backLink={`/event/${conferenceId}/agenda`}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
        </Fragment>
    );
};
