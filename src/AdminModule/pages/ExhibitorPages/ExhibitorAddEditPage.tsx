import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find, first } from "lodash";
import {
    Exhibitor,
    ExhibitorCategory,
    ExhibitorTranslation,
    User,
    Session,
    Conference,
} from "../../models";
import {
    useAuthState,
    useBuildAssetPath,
    useDataAddEdit,
    useNavigator,
} from "../../../AppModule/hooks";
import {
    AppCard,
    AppLoader,
    AppFormLabelTranslatable,
    AppPageHeaderTranslatable,
    AppUploader,
    AppFormSwitch,
    AppFormInput,
    AppFormSelect,
    AppSessionUsers,
    AppFormActions,
    AppSessionPicker,
    AppEventPicker,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
    EXHIBITOR_LOGO_POSTER_TYPE,
    EXHIBITOR_POSTER_TYPE,
    EXHIBITOR_VIDEO_TYPE,
    ROLES,
} from "../../../config";
import { ExhibitorTranslatable } from "./ExhibitorTranslatable";
import {
    ExhibitorApi,
    ExhibitorCategoryApi,
    UserApi,
    SessionApi,
    ConferenceApi,
} from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import "./assets/scss/style.scss";
import {
    SimpleObject,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import { UploadAPI } from "../../../AppModule/apis";
import { AppSelectExhibitorStream } from "../../../AppModule/components/AppSelectStream/AppSelectExhibitorStream";

const { ROLE_EXHIBITOR, ROLE_USER } = ROLES;

export const ExhibitorAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const navigator = useNavigator(navigate);
    const {
        id,
        setData,
        data,
        isLoading,
        setIsLoading,
        isEditMode,
        activeLocale,
        defaultLocale,
        setActiveLocale,
        languages,
        hookForm,
        conId,
        conUrl,
    } = useDataAddEdit<Exhibitor>(new Exhibitor());
    const { clientId } = useAuthState();
    const logoBasePath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const coverBasePath = useBuildAssetPath(ExhibitorPosterFileInfo);
    const [translations, setTranslations] = useState<ExhibitorTranslation[]>(
        []
    );
    const [loadingLang, setLoadingLang] = useState<boolean>(true);
    const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
    const [categories, setCategories] = useState<SimpleObject<string>[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [pageUser, setPageUser] = useState<number>(0);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [totalMembers, setTotalMembers] = useState<number>(0);
    const [pageMember, setPageMember] = useState<number>(0);
    const [selectedSessions, setSelectedSessions] = useState<Session[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [totalSessions, setTotalSessions] = useState<number>(0);
    const [pageSession, setPageSession] = useState<number>(0);
    const [selectedEvents, setSelectedEvents] = useState<Conference[]>([]);
    const [events, setEvents] = useState<Conference[]>([]);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [pageEvent, setPageEvent] = useState<number>(0);

    const { t } = useTranslation();
    let logoImageFile: File | null = null;
    let coverImageFile: File | null = null;
    let videoFile: File | null = null;

    useEffect(() => {
        if (isEditMode && id !== null) {
            ExhibitorApi.findById<Exhibitor>(id, {
                "groups[]": "ExhibitorTranslationsGroup",
            })
                .then(({ response, isNotFound }) => {
                    if (isNotFound) {
                        errorToast(
                            t("admin.exhibitor.form:notfound.error.message")
                        );
                    } else if (response !== null) {
                        let d = response;
                        if (d?.category) {
                            const c = (d.category as unknown) as ExhibitorCategory;
                            d = {
                                ...response,
                                category: ExhibitorCategoryApi.toResourceUrl(
                                    c.id
                                ),
                            } as Exhibitor;
                        }
                        setData(d);
                        const items: ExhibitorTranslation[] = [];
                        if (response.translations) {
                            Object.entries(response.translations).forEach(
                                ([, value]) => {
                                    items.push({
                                        locale: value.locale,
                                        name: value.name,
                                        description: value.description,
                                        contactUsCaption:
                                            value.contactUsCaption,
                                    });
                                }
                            );
                        }
                        setTranslations(items);
                        setSelectedUsers(response.users as User[]);
                        setSelectedMembers(response.members as User[]);
                        setSelectedEvents(response.conferences as Conference[]);
                        setSelectedSessions(response.sessions as Session[]);
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
    }, [languages, translations]);

    useEffect(() => {
        setLoadingCategory(true);
        ExhibitorCategoryApi.find<ExhibitorCategory>(1, {
            "container.id": conId,
        }).then(({ response }) => {
            if (response !== null) {
                setCategories(
                    response.items.map((c: ExhibitorCategory) => {
                        return {
                            label: c.name,
                            value: ExhibitorCategoryApi.toResourceUrl(c.id),
                        };
                    })
                );
            }
            setLoadingCategory(false);
        });
    }, []);

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
            formData.users = selectedUsers.map((e) => {
                return UserApi.toResourceUrl(e.id);
            });
            formData.members = selectedMembers.map((e) => {
                return UserApi.toResourceUrl(e.id);
            });
            formData.conferences = selectedEvents.map((e) => {
                return ConferenceApi.toResourceUrl(e.id);
            });
            formData.sessions = selectedSessions.map((e) => {
                return SessionApi.toResourceUrl(e.id);
            });
            if (logoImageFile) {
                const res = await UploadAPI.upload(
                    logoImageFile,
                    EXHIBITOR_LOGO_POSTER_TYPE,
                    conUrl
                );
                if (res.response && res.response?.fileName) {
                    formData.logoImageName = res.response.fileName;
                }
            }
            if (coverImageFile) {
                const res = await UploadAPI.upload(
                    coverImageFile,
                    EXHIBITOR_POSTER_TYPE,
                    conUrl
                );
                if (res.response && res.response?.fileName) {
                    formData.coverImageName = res.response.fileName;
                }
            }
            if (videoFile) {
                const res = await UploadAPI.upload(
                    videoFile,
                    EXHIBITOR_VIDEO_TYPE,
                    conUrl
                );
                if (res.response && res.response?.fileName) {
                    formData.streamUrl = res.response.fileName;
                }
            }
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

    const getOwners = (search = "") => {
        const searchStatus = search !== "";
        if (searchStatus || totalUsers === 0 || totalUsers > users.length)
            UserApi.getLimited<User>(searchStatus ? 1 : pageUser + 1, {
                user_search: search,
                "roles.role": ROLE_EXHIBITOR,
                "client.id": clientId,
            }).then(({ response }) => {
                if (response !== null) {
                    if (searchStatus) {
                        setUsers(response.items);
                        setTotalUsers(response.totalItems);
                        setPageUser(0);
                    } else {
                        setUsers([...users, ...response.items]);
                        setTotalUsers(response.totalItems);
                        setPageUser(pageUser + 1);
                    }
                }
            });
    };

    const getMembers = (search = "") => {
        const searchStatus = search !== "";
        if (searchStatus || totalMembers === 0 || totalMembers > members.length)
            UserApi.getLimited<User>(searchStatus ? 1 : pageMember + 1, {
                user_search: search,
                "roles.role": ROLE_USER,
                "client.id": clientId,
            }).then(({ response }) => {
                if (response !== null) {
                    if (searchStatus) {
                        setMembers(response.items);
                        setTotalMembers(response.totalItems);
                        setPageMember(0);
                    } else {
                        setMembers([...members, ...response.items]);
                        setTotalMembers(response.totalItems);
                        setPageMember(pageMember + 1);
                    }
                }
            });
    };

    const getSessions = (search = "") => {
        const searchStatus = search !== "";
        if (
            searchStatus ||
            totalSessions === 0 ||
            totalSessions > sessions.length
        )
            SessionApi.find<Session>(searchStatus ? 1 : pageSession + 1, {
                "translations.title": search,
                "container.id": conId,
            }).then(({ response }) => {
                if (response !== null) {
                    if (searchStatus) {
                        setPageSession(0);
                        setSessions(response.items);
                        setTotalSessions(response.totalItems);
                    } else {
                        setSessions([...sessions, ...response.items]);
                        setTotalSessions(response.totalItems);
                        setPageSession(pageMember + 1);
                    }
                }
            });
    };

    const getEvents = (search = "") => {
        const searchStatus = search !== "";
        if (searchStatus || totalEvents === 0 || totalEvents > events.length)
            ConferenceApi.find<Conference>(searchStatus ? 1 : pageEvent + 1, {
                "translations.title": search,
                "container.id": conId,
            }).then(({ response }) => {
                if (response !== null) {
                    if (searchStatus) {
                        setEvents(response.items);
                        setTotalEvents(response.totalItems);
                        setPageEvent(0);
                    } else {
                        setEvents([...events, ...response.items]);
                        setTotalEvents(response.totalItems);
                        setPageEvent(pageEvent + 1);
                    }
                }
            });
    };

    useEffect(() => {
        getOwners();
        getMembers();
        getSessions();
        getEvents();
    }, []);

    const { formState, control, handleSubmit, setValue, watch } = hookForm;
    const { errors } = formState;
    const isExternal = watch("isExternal");

    if (isLoading || loadingLang || loadingCategory) {
        return <AppLoader />;
    }

    return (
        <div className={"exhibitor-add-edit-page"}>
            <AppPageHeaderTranslatable
                title={`admin.exhibitor.form:header.${
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
                            <ExhibitorTranslatable
                                languages={languages}
                                control={control}
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
                                        imagePath={
                                            data.logoImageName
                                                ? `${logoBasePath}/${data.logoImageName}`
                                                : ""
                                        }
                                        onFileSelect={(selectedFiles) => {
                                            logoImageFile =
                                                first(selectedFiles) ?? null;
                                        }}
                                        onDelete={() => {
                                            setValue("logoImageName", "");
                                        }}
                                        confirmation={{
                                            title: t(
                                                "admin.exhibitor.form:deleteLogoImage.confirm.title"
                                            ),
                                            bodyContent: t(
                                                "admin.exhibitor.form:deleteLogoImage.confirm.message"
                                            ),
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col className={"p-0"}>
                                <Form.Group>
                                    <AppFormLabelTranslatable
                                        label={
                                            "admin.exhibitor.form:label.cover"
                                        }
                                        required={true}
                                    />
                                    <AppUploader
                                        withCropper
                                        accept="image/*"
                                        fileInfo={ExhibitorPosterFileInfo}
                                        imagePath={
                                            data.coverImageName
                                                ? `${coverBasePath}/${data.coverImageName}`
                                                : ""
                                        }
                                        onFileSelect={(selectedFiles) => {
                                            coverImageFile =
                                                first(selectedFiles) ?? null;
                                        }}
                                        onDelete={() => {
                                            setValue("coverImageName", "");
                                        }}
                                        confirmation={{
                                            title: t(
                                                "admin.exhibitor.form:deleteCoverImage.confirm.title"
                                            ),
                                            bodyContent: t(
                                                "admin.exhibitor.form:deleteCoverImage.confirm.message"
                                            ),
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <AppFormSelect
                                id={"category"}
                                name={"category"}
                                label={t("admin.exhibitor.form:label.category")}
                                md={12}
                                lg={12}
                                xl={12}
                                {...validation(
                                    "category",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={errors.category?.message}
                                defaultValue={data.category}
                                placeholder={t(
                                    "admin.exhibitor.form:placeholder.chooseCategory"
                                )}
                                options={categories}
                                control={control}
                                transform={{
                                    output: (category: SimpleObject<string>) =>
                                        category?.value,
                                    input: (value: string) => {
                                        return find(categories, {
                                            value,
                                        });
                                    },
                                }}
                                className={"p-0"}
                            />
                        </AppCard>
                    </Col>
                    <Col md={6}>
                        <AppCard>
                            <Row>
                                <Col lg={6} className={"pl-0"}>
                                    <AppFormSwitch
                                        name={"isEnableOnlineAttendee"}
                                        label={t(
                                            "admin.exhibitor.form:label.isEnableOnlineAttendee"
                                        )}
                                        {...validation(
                                            "isEnableOnlineAttendee",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.isEnableOnlineAttendee
                                                ?.message
                                        }
                                        defaultChecked={
                                            data.isEnableOnlineAttendee
                                        }
                                        control={control}
                                        lg={12}
                                        xl={12}
                                    />
                                </Col>
                                <Col lg={6} className={"pl-0"}>
                                    <AppFormSwitch
                                        name={"isCommentEnable"}
                                        label={t(
                                            "admin.exhibitor.form:label.isCommentEnable"
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
                                        lg={12}
                                        xl={12}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} className={"pl-0"}>
                                    <AppFormSwitch
                                        name={"isExternal"}
                                        label={t(
                                            "admin.exhibitor.form:label.isExternal"
                                        )}
                                        {...validation(
                                            "isExternal",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.isExternal?.message
                                        }
                                        defaultChecked={data.isExternal}
                                        control={control}
                                        lg={12}
                                        xl={12}
                                    />
                                </Col>
                                {isExternal && (
                                    <AppFormInput
                                        name={"externalUrl"}
                                        label={t(
                                            "admin.exhibitor.form:label.externalUrl"
                                        )}
                                        {...validation(
                                            "externalUrl",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.externalUrl?.message
                                        }
                                        defaultValue={data.externalUrl}
                                        control={control}
                                        lg={6}
                                        xl={6}
                                        md={6}
                                    />
                                )}
                            </Row>
                            <Row>
                                <AppFormInput
                                    name={"website"}
                                    label={t(
                                        "admin.exhibitor.form:label.website"
                                    )}
                                    {...validation(
                                        "website",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.website?.message}
                                    defaultValue={data.website}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                                <AppFormInput
                                    name={"phone"}
                                    label={t(
                                        "admin.exhibitor.form:label.phone"
                                    )}
                                    {...validation(
                                        "phone",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.phone?.message}
                                    defaultValue={data.phone}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                            </Row>
                            <Row>
                                <AppFormInput
                                    name={"email"}
                                    label={t(
                                        "admin.exhibitor.form:label.email"
                                    )}
                                    {...validation(
                                        "email",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.email?.message}
                                    defaultValue={data.email}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                                <AppFormInput
                                    name={"address"}
                                    label={t(
                                        "admin.exhibitor.form:label.address"
                                    )}
                                    {...validation(
                                        "address",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.address?.message}
                                    defaultValue={data.address}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                            </Row>
                            <Row>
                                <AppFormInput
                                    name={"facebook"}
                                    label={t(
                                        "admin.exhibitor.form:label.facebook"
                                    )}
                                    {...validation(
                                        "facebook",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.facebook?.message}
                                    defaultValue={data.facebook}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                                <AppFormInput
                                    name={"linkedin"}
                                    label={t(
                                        "admin.exhibitor.form:label.linkedin"
                                    )}
                                    {...validation(
                                        "linkedin",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.linkedin?.message}
                                    defaultValue={data.linkedin}
                                    control={control}
                                    lg={6}
                                    xl={6}
                                    md={6}
                                    required={false}
                                />
                            </Row>
                            <Row>
                                <Col xl={12} lg={12}>
                                    <AppSessionUsers
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelectedUsers={setSelectedUsers}
                                        selectedUsers={selectedUsers}
                                        title={t(
                                            "admin.exhibitor.form:label.users"
                                        )}
                                        icon="speakers"
                                        users={users}
                                        loadMore={getOwners}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={12} lg={12}>
                                    <AppSessionUsers
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelectedUsers={setSelectedMembers}
                                        selectedUsers={selectedMembers}
                                        title={t(
                                            "admin.exhibitor.form:label.members"
                                        )}
                                        icon="speakers"
                                        users={members}
                                        loadMore={getMembers}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={12} lg={12}>
                                    <AppEventPicker
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelected={setSelectedEvents}
                                        selectedList={selectedEvents}
                                        title={t(
                                            "admin.exhibitor.form:label.events"
                                        )}
                                        icon="speakers"
                                        list={events}
                                        loadMore={getEvents}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={12} lg={12}>
                                    <AppSessionPicker
                                        xl={4}
                                        lg={4}
                                        md={12}
                                        sm={12}
                                        showAdd
                                        handleSelected={setSelectedSessions}
                                        selectedList={selectedSessions}
                                        title={t(
                                            "admin.exhibitor.form:label.sessions"
                                        )}
                                        icon="speakers"
                                        list={sessions}
                                        loadMore={getSessions}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <AppCard>
                            <AppSelectExhibitorStream
                                data={data}
                                setValue={setValue}
                                formState={formState}
                                control={control}
                                isEditMode={isEditMode}
                                errors={errors}
                                onFileSelect={(f) => {
                                    videoFile = f;
                                }}
                            />
                        </AppCard>
                    </Col>
                </Row>
                <AppFormActions
                    isEditMode={isEditMode}
                    navigation={navigator}
                    backLink={`/admin/exhibitors/new`}
                    isLoading={formState.isSubmitting}
                />
            </Form>
        </div>
    );
};
