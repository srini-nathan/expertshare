import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { find as _find, isString as _isString } from "lodash";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
    SessionTag,
    UserGroup,
    User,
    PSession,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    SessionTagApi,
    SessionCategoryApi,
    SessionApi,
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
    getDateTimeWithoutTimezone,
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
import { useGlobalData } from "../../contexts";
import { cardSizeOptions, cardTypeOptions } from "./session-helper";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_SESSION_POSTER, FILETYPE_SESSION_DOC },
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;

export const SessionAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const { conferenceId } = useParams();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId, clientId } = useAuthState();
    const { languages } = useGlobalData();
    const [data, setData] = useState<Session>(new Session(containerResourceId));
    const [moderatores, setModeratores] = useState<User[]>([]);
    const [speakers, setSpeakers] = useState<User[]>([]);
    const [totalSpeakers, setTotalSpeakers] = useState<number>(0);
    const [pageSpeakers, setPageSpeakers] = useState<number>(0);
    const [totalModerators, setTotalModerators] = useState<number>(0);
    const [pageModerators, setPageModerators] = useState<number>(0);
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
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [loadingCat, setLoadingCat] = useState<boolean>(true);
    const [showExtraLinks, isExtraLink] = useState<boolean>(
        data.isExternalLinkEnable
    );
    const [activeLanguage, setActiveLanguage] = useState<string>("");
    const [translations, setTranslations] = useState<any[]>([]);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [docsFile, setDocsFile] = useState<SimpleObject<string>[]>([]);
    const sessionPosterPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_POSTER as FileTypeInfo
    );
    const [userGroups, setUserGroups] = React.useState<SimpleObject<string>[]>(
        data.sessionDocs
    );
    const { t } = useTranslation();
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
        let defaultValues: any = {
            locale: defaultLanguage,
            title: "",
            description: "",
        };
        translations.forEach((e) => {
            if (e.locale === defaultLanguage) defaultValues = e;
        });
        return translations.map((e) => {
            if (e !== defaultValues) {
                let item = e;
                Object.keys(defaultValues).forEach((key: any) => {
                    if (!item[key]) {
                        item = {
                            ...item,
                            [key]: defaultValues[key],
                        };
                    }
                });
                return item;
            }

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

        const userGroupsSelectedItems = selectedUserGroups.map((e) => {
            return UserGroupApi.toResourceUrl(parseInt(e.id, 10));
        });

        formData.userGroups = userGroupsSelectedItems;

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

        return SessionApi.createOrUpdate<Session>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Session>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator(`/event/${conferenceId}/agenda`).then(() => {
                        successToast(
                            isEditMode
                                ? t("session.form:update.infoMessage")
                                : t("session.form:add.infoMessage")
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

                        return submitForm(formData);
                    }
                );
            }
        }
        return submitForm(formData);
    };

    useEffect(() => {
        if (isEditMode) {
            setLoadingData(true);
            SessionApi.getSession<Session[]>({
                id,
                "groups[]": "SessionTranslationsGroup",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Session not exist");
                } else if (response) {
                    if (response.items[0]) {
                        const res: Session = (response.items as PSession[])[0] as Session;
                        setData(res);
                        trigger();
                        const selected = [] as SimpleObject<string>[];
                        res.sessionTags?.forEach(({ id: ugId, name }) => {
                            selected.push({
                                label: name as string,
                                value: name as string,
                                id: `${ugId}`,
                            });
                        });
                        setSelectedSessionTags(selected);
                        const items: TranslationsType[] = Object.keys(
                            res.translations
                        ).map((key) => {
                            return {
                                locale: res.translations[key].locale,
                                title: res.translations[key].title,
                                description: res.translations[key].description,
                                streamUrl: res.translations[key].streamUrl,
                            };
                        });
                        setTranslations(items);
                        const sessionDocs: SimpleObject<string>[] = res.sessionDocs.map(
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
                        const groups = res.userGroups as UserGroup[];
                        const selectedUg: SimpleObject<string>[] = groups.map(
                            ({ id: ugId, name }) => {
                                return {
                                    label: name,
                                    value: `${ugId}`,
                                    id: `${ugId}`,
                                };
                            }
                        );
                        setSelectedUserGroups(selectedUg);

                        setDocsFile(sessionDocs);
                        isExtraLink(res.isExternalLinkEnable);
                        setSelectedModerators(res.moderators as User[]);
                        setSelectedSpeakers(res.speakers as User[]);
                    }
                }
                setLoadingData(false);
            });
        } else {
            setLoadingData(false);
        }
    }, [id, isEditMode, trigger]);

    useEffect(() => {
        if (languages) {
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
        }
    }, [languages, translations]);

    const getSpeakers = (search = "") => {
        const searchStatus = search !== "";
        if (
            searchStatus ||
            totalSpeakers === 0 ||
            totalSpeakers > speakers.length
        )
            UserApi.getLimited<User>(searchStatus ? 1 : pageSpeakers + 1, {
                user_search: search,
                "roles.role": "ROLE_SPEAKER",
                "client.id": clientId,
            }).then(({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    if (searchStatus) {
                        setSpeakers(response.items);
                        setTotalSpeakers(response.totalItems);
                        setPageSpeakers(0);
                    } else {
                        setSpeakers([...speakers, ...response.items]);
                        setTotalSpeakers(response.totalItems);
                        setPageSpeakers(pageSpeakers + 1);
                    }
                }
            });
    };

    const getModerators = (search = "") => {
        const searchStatus = search !== "";
        if (
            searchStatus ||
            totalModerators === 0 ||
            totalModerators > moderatores.length
        )
            UserApi.getLimited<User>(searchStatus ? 1 : pageModerators + 1, {
                user_search: search,
                "roles.role": "ROLE_MODERATOR",
                "client.id": clientId,
            }).then(({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    if (searchStatus) {
                        setModeratores(response.items);
                        setTotalModerators(response.totalItems);
                        setPageModerators(0);
                    } else {
                        setModeratores([...moderatores, ...response.items]);
                        setTotalModerators(response.totalItems);
                        setPageModerators(pageSpeakers + 1);
                    }
                }
            });
    };

    useEffect(() => {
        UserGroupApi.find<UserGroup>(1, { "client.id": clientId }).then(
            ({ response, error }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setUserGroups(
                        response.items
                            .filter((e) => !e.isGenerated)
                            .map((user) => {
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
        getModerators();
        getSpeakers();
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
            setLoadingCat(false);
        });
    }, []);

    const renderLinksValue = () => {
        return !showExtraLinks ? "d-none" : "d-flex";
    };

    const { errors } = formState;

    if (loadingCat || loadingData) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:event")}
                linkUrl={`/event/${conferenceId}/agenda`}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("session.form:header.edit")
                        : t("session.form:header.add")
                }
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
                            title={t("session.form:label.photo").toString()}
                        >
                            <AppUploader
                                withCropper
                                accept="image/*"
                                imagePath={
                                    data.imageName
                                        ? `${sessionPosterPath}/${data.imageName}`
                                        : ""
                                }
                                fileInfo={
                                    FILETYPEINFO_SESSION_POSTER as FileTypeInfo
                                }
                                onFileSelect={onFileSelect}
                            />
                        </AppCard>
                    </Col>

                    <Col md={12} lg={6} xl={6}>
                        <AppCard title={t("session.form:label.sessionDetails")}>
                            <Row>
                                <Col
                                    md={12}
                                    lg={6}
                                    className="react-datepicker-container mb-2"
                                >
                                    <AppFormLabel
                                        required={false}
                                        label={t(
                                            "session.form:label.startDate"
                                        )}
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
                                                ? getDateTimeWithoutTimezone(
                                                      data.start
                                                  )
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
                                        label={t("session.form:label.endDate")}
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
                                                ? getDateTimeWithoutTimezone(
                                                      data.end
                                                  )
                                                : new Date()
                                        }
                                    />
                                </Col>
                                <AppFormSelect
                                    id={"category"}
                                    name={"sessionCategory"}
                                    label={t(
                                        "session.form:label.chooseCategory"
                                    )}
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
                                    placeholder={t(
                                        "session.form:label.chooseCategory"
                                    )}
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
                                        streamType={
                                            data.streamType &&
                                            data.streamType.toUpperCase()
                                        }
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
                                label={t("session.form:label.userGroups")}
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
                                label={t("session.form:label.sessionTags")}
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
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isVisible"}
                                    label={t("session.form:label.isVisible")}
                                    {...validation(
                                        "isVisible",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isVisible?.message}
                                    defaultChecked={data.isVisible}
                                    control={control}
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isCommentEnable"}
                                    label={t(
                                        "session.form:label.isCommentEnable"
                                    )}
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
                                    className={"mb-4 form-switch-label-wrap"}
                                />

                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isCommentModerated"}
                                    label={t(
                                        "session.form:label.isModeratedComment"
                                    )}
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
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isSharingEnable"}
                                    label={t("session.form:label.isSharing")}
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
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isLikeEnable"}
                                    label={t("session.form:label.isLikeEnable")}
                                    {...validation(
                                        "isLikeEnable",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isLikeEnable?.message}
                                    defaultChecked={data.isLikeEnable}
                                    control={control}
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isJoinRequired"}
                                    label={t(
                                        "session.form:label.isModeratedJoin"
                                    )}
                                    {...validation(
                                        "isJoinRequired",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isLikeEnable?.message}
                                    defaultChecked={data.isLikeEnable}
                                    control={control}
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isSessionPublic"}
                                    label={t(
                                        "session.form:label.isPublicSession"
                                    )}
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
                                    className={"mb-4 form-switch-label-wrap"}
                                />
                                <AppFormSwitch
                                    xs={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    name={"isReply"}
                                    label={t("session.form:label.isReplay")}
                                    {...validation(
                                        "isReply",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isReply?.message}
                                    defaultChecked={data.isReply}
                                    control={control}
                                    className={"mb-4 form-switch-label-wrap"}
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
                                        title={t(
                                            "session.form:label.speakers"
                                        ).toString()}
                                        icon="speakers"
                                        users={speakers}
                                        loadMore={getSpeakers}
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
                                        title={t(
                                            "session.form:label.moderators"
                                        ).toString()}
                                        icon="moderators"
                                        users={moderatores}
                                        loadMore={getModerators}
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
                                lg={12}
                                xl={12}
                                className="p-0 mb-4 form-switch-label-wrap"
                                name={"isExternalLinkEnable"}
                                label={t(
                                    "session.form:label.isExtraLinkEnable"
                                )}
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
                                    label={t(
                                        "session.form:label.extraLinkLabel"
                                    )}
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
                                    label={t("session.form:label.extraLinkUrl")}
                                    {...validation(
                                        "externalLinkUrl",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.externalLinkUrl?.message
                                    }
                                    defaultValue={data.externalLinkUrl}
                                    control={control}
                                />
                            </Row>

                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                className="p-0 mb-4 form-switch-label-wrap"
                                name={"isSessionAutoSwitch"}
                                label={t(
                                    "session.form:label.isAutoSwitchSession"
                                )}
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
                                lg={12}
                                xl={12}
                                className="p-0 mb-4 form-switch-label-wrap"
                                name={"isShowInVideoLibrary"}
                                label={t(
                                    "session.form:label.isShowInVideoLibrary"
                                )}
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
                                label={t("session.form:label.chooseCardSize")}
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
                                placeholder={t(
                                    "session.form:label.chooseCardSize"
                                )}
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
                                label={t("session.form:label.chooseCardType")}
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
                                placeholder={t(
                                    "session.form:label.chooseCardType"
                                )}
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
                                className="px-0"
                                name={"ord"}
                                type={"number"}
                                md={12}
                                lg={12}
                                xl={12}
                                required={false}
                                label={t("session.form:label.order")}
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
