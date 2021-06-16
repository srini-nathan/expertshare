import React, { FC, Fragment, useState, useEffect, useRef } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { find as _find, isString as _isString } from "lodash";
import { Canceler } from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppLoader,
    AppFormActions,
    AppCard,
    AppFormInput,
    AppFormInputPassword,
    AppFormSelect,
    AppFormSelectCreatable,
    AppTagSelect,
    AppFormSwitch,
    AppFormLabel,
    AppFormFieldGenerator,
    AppUploader,
} from "../../../AppModule/components";
import {
    User,
    PUser,
    UserGroup,
    UserTag,
    UserField,
    Language,
} from "../../models";
import {
    UserApi,
    UserTagApi,
    UserGroupApi,
    UserFieldApi,
    LanguageApi,
} from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    UnprocessableEntityErrorResponse,
    PrimitiveObject,
    SimpleObject,
    Upload,
    FileTypeInfo,
} from "../../../AppModule/models";
import { UploadAPI } from "../../../AppModule/apis";

import {
    useParamId,
    useNavigator,
    useAuthState,
    useRoles,
    useBuildAssetPath,
} from "../../../AppModule/hooks";
import { schema } from "./schema";
import { CONSTANTS } from "../../../config";

const { Upload: UPLOAD, User: USER } = CONSTANTS;
const { TIMEZONE, SOURCE, STATUS } = USER;
const {
    FILETYPE: { FILETYPE_USER_PROFILE },
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;
const options = TIMEZONE.map((value: string) => ({
    value,
    label: value,
}));

type UpdateProfileForm<T> = {
    [key: string]: T;
};

export const UserAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const { clientId: storageClientId, role, containerId } = useAuthState();
    const { clientId = storageClientId } = useParams();
    const { filterRoles, getRoles } = useRoles();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const [data, setData] = useState<PUser>(new User(containerResourceId));
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const cancelTokenSourceRef = useRef<Canceler>();
    const [userGroups, setUserGroups] = React.useState<SimpleObject<string>[]>(
        []
    );
    const [selectedUserTags, setSelectedUserTag] = useState<
        SimpleObject<string>[]
    >([]);
    const [selectedUserGroups, setSelectedUserGroups] = React.useState<
        SimpleObject<string>[]
    >([]);
    const [userTags, setUserTags] = useState<SimpleObject<string>[]>([]);
    const [userFields, setUserFields] = useState<UserField[]>([]);
    const [relationalManager, setRelationalManager] = useState<
        SimpleObject<string>[]
    >([]);
    const [languages, setLanguages] = useState<SimpleObject<string>[]>([]);
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );
    const [files, setFiles] = useState<File[]>([]);

    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState,
        setError,
        trigger,
        setValue,
    } = useForm<User>({
        resolver: yupResolver(schema(isEditMode)),
        mode: "all",
    });

    const getRolesOption = () => {
        const FilterRoute = filterRoles(role);

        return FilterRoute.map((e: any) => {
            return {
                value: e["@id"],
                label: e.name,
            };
        });
    };
    const getUserRole = () => {
        if (isEditMode) {
            let userRole: any = {};
            getRoles().forEach((e: any) => {
                if (data?.roles && e?.role && e?.role === data.roles[0])
                    userRole = {
                        value: e["@id"],
                        label: e.name,
                    };
            });
            return userRole;
        }
        return {};
    };
    const getDynamicFileds = (userField: any[]) => {
        const userFieldValues: any[] = [];

        if (userField)
            Object.keys(userField).forEach((key: any) => {
                let value: any = userField[key];

                if (value instanceof Date)
                    value = value.toISOString().slice(0, 10);
                else if (value instanceof Object)
                    value = JSON.stringify(
                        Object.keys(value).filter((item) => value[item])
                    );
                else if (value === undefined) value = "false";

                if (
                    isEditMode &&
                    data.userFieldValues &&
                    data.userFieldValues?.length > 0
                ) {
                    let found = false;
                    data.userFieldValues?.forEach((e: any) => {
                        if (e.userField["@id"] === key) {
                            userFieldValues.push({
                                "@id": `/api/user_field_values/${e.id}`,
                                value: `${value}`,
                            });
                            found = true;
                        }
                    });

                    if (!found) {
                        userFieldValues.push({
                            value: `${value}`,
                            userField: key,
                        });
                    }
                } else
                    userFieldValues.push({
                        value: `${value}`,
                        userField: key,
                    });
            });
        return userFieldValues;
    };
    const submitForm = async (formData: UpdateProfileForm<any>) => {
        const userGroupsSelectedItems = selectedUserGroups.map((e) => {
            return UserGroupApi.toResourceUrl(parseInt(e.id, 10));
        });
        formData.userTags = selectedUserTags.map((e) => {
            if (!e.id) return { name: e.label };
            return UserTagApi.toResourceUrl(parseInt(e.id, 10));
        });
        formData.userGroups = userGroupsSelectedItems;

        if (formData.relationManager === "") delete formData.relationManager;

        if (!isEditMode) {
            formData.source = SOURCE.SOURCE_CREATE;
            formData.status = STATUS.STATUS_ACTIVE;
        }

        if (formData.userField)
            formData.userFieldValues = getDynamicFileds(formData.userField);
        delete formData.userField;

        if (isEditMode)
            return UserApi.replace<User, UpdateProfileForm<any>>(
                id,
                formData
            ).then(({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<User>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast("User updated");
                    });
                }
            });
        return UserApi.create<User, UpdateProfileForm<any>>(formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<User>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast("User created");
                    });
                }
            }
        );
    };
    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };
    const onSubmit = async (formData: User) => {
        if (files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_USER_PROFILE);

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
    const fetchUserTags = async () => {
        return UserTagApi.find<UserTag>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    const tags: SimpleObject<string>[] = [];
                    response.items.forEach((e) => {
                        tags.push({
                            id: `${e.id}`,
                            value: e.name,
                            label: e.name,
                        });
                    });
                    setUserTags(tags);
                }
            }
        );
    };
    const fetchUserFields = async () => {
        return UserFieldApi.find<UserField>(1, { "client.id": clientId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setUserFields(response.items);
                }
            }
        );
    };
    useEffect(() => {
        fetchUserFields();
    }, [data]);
    useEffect(() => {
        fetchUserTags();
        UserGroupApi.find<UserGroup>(1, { "client.id": clientId }, (c) => {
            cancelTokenSourceRef.current = c;
        }).then(({ response, error }) => {
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
        });
        const cancelPendingCall = cancelTokenSourceRef.current;
        return () => {
            if (cancelPendingCall) {
                cancelPendingCall();
            }
        };
    }, []);

    useEffect(() => {
        UserApi.getLimited<User>(1, {
            "roles.role": "ROLE_RELATION_MANAGER",
            "client.id": clientId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                const rm: SimpleObject<string>[] = response.items.map((e) => {
                    return {
                        id: UserApi.toResourceUrl(e.id),
                        value: UserApi.toResourceUrl(e.id),
                        label: `${e.firstName} ${e.lastName}`,
                    };
                });
                setRelationalManager(rm);
            }
        });
    }, []);

    useEffect(() => {
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    const langs: SimpleObject<string>[] = [];
                    response.items.forEach((e) => {
                        langs.push({
                            id: `${e.id}`,
                            value: e.locale,
                            label: e.name,
                        });
                    });
                    setLanguages(langs);
                }
            }
        );
    }, []);

    const getRelationalManager = () => {
        const item = relationalManager.find(
            (e) => e.id === data.relationManager
        );

        if (item) return item;

        return "";
    };

    const getLocale = () => {
        const item = languages.find((e) => e.value === data.locale);

        if (item) return item;

        return "";
    };
    useEffect(() => {
        if (isEditMode) {
            UserApi.findById<User>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("User not exist");
                    } else if (response !== null) {
                        setData(response);
                        const selectedTags: SimpleObject<string>[] = [];
                        response?.userTags?.forEach((e: any) => {
                            selectedTags.push({
                                id: `${e.id}`,
                                value: `${e.name}`,
                                label: `${e.name}`,
                            });
                        });
                        setSelectedUserTag(selectedTags);
                        const selectedGroups: SimpleObject<string>[] = [];
                        response?.userGroups?.forEach((e: any) => {
                            selectedGroups.push({
                                id: `${e.id}`,
                                value: `${e.name}`,
                                label: `${e.name}`,
                            });
                        });
                        setSelectedUserGroups(selectedGroups);

                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    if (loading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    const renderUserFields = () => {
        return userFields.map((e) => {
            const defaultValue: any = (data?.userFieldValues as any[]).find(
                (item: any) => e.id === item.userField.id
            );
            return (
                <AppFormFieldGenerator
                    key={e.id}
                    defaultValue={defaultValue}
                    properties={e}
                    setValue={setValue}
                    control={control}
                    validation={{
                        ...validation(
                            UserFieldApi.toResourceUrl(e.id),
                            formState,
                            isEditMode
                        ),
                    }}
                />
            );
        });
    };

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:users")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.users.form:header.editTitle")
                        : t("admin.users.form:header.title")
                }
            />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md={12}>
                        <AppCard>
                            <Form.Row>
                                <Form.Group className="mb-3 px-1 w-100">
                                    <Form.Label>
                                        {t(
                                            "admin.users.form:label.profilePicture"
                                        )}
                                    </Form.Label>
                                    <AppUploader
                                        withCropper={true}
                                        accept="image/*"
                                        fileInfo={
                                            FILETYPEINFO_USER_PROFILE as FileTypeInfo
                                        }
                                        imagePath={
                                            data.imageName
                                                ? `${profilePicturePath}/${data.imageName}`
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
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"firstName"}
                                    label={t(
                                        "admin.users.form:label.firstName"
                                    )}
                                    defaultValue={data.firstName}
                                    required={false}
                                    {...validation(
                                        "firstName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.firstName?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"lastName"}
                                    defaultValue={data.lastName}
                                    label={t("admin.users.form:label.lastName")}
                                    required={false}
                                    {...validation(
                                        "lastName",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.lastName?.message}
                                    control={control}
                                />

                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    name={"company"}
                                    defaultValue={data.company}
                                    label={t(
                                        "admin.users.form:label.companyName"
                                    )}
                                    required={false}
                                    {...validation(
                                        "company",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.company?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={data.jobTitle}
                                    name={"jobTitle"}
                                    label={t("admin.users.form:label.jobTitle")}
                                    required={false}
                                    {...validation(
                                        "jobTitle",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.jobTitle?.message}
                                    control={control}
                                />
                                <AppFormInput
                                    lg={6}
                                    xl={6}
                                    defaultValue={data.email}
                                    name={"email"}
                                    label={t("admin.users.form:label.email")}
                                    required={true}
                                    {...validation(
                                        "email",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.email?.message}
                                    control={control}
                                />
                                <AppFormSelect
                                    id={"locale"}
                                    name={"locale"}
                                    label={t("admin.users.form:label.locale")}
                                    md={12}
                                    className="local-container"
                                    lg={6}
                                    xl={6}
                                    required={false}
                                    {...validation(
                                        "locale",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={getLocale()}
                                    placeholder={"Locale"}
                                    errorMessage={errors.locale?.message}
                                    options={languages}
                                    control={control}
                                    transform={{
                                        output: (locale: PrimitiveObject) =>
                                            locale?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                {!isEditMode && [
                                    <AppFormInputPassword
                                        lg={6}
                                        className="mb-0"
                                        xl={6}
                                        name={"plainPassword"}
                                        label={t(
                                            "admin.users.form:label.password"
                                        )}
                                        required={true}
                                        {...validation(
                                            "plainPassword",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.plainPassword?.message
                                        }
                                        control={control}
                                    />,
                                    <AppFormInputPassword
                                        lg={6}
                                        xl={6}
                                        className="mb-0"
                                        name={"confirmPassword"}
                                        label={t(
                                            "admin.users.form:label.confirmPassword"
                                        )}
                                        required={true}
                                        {...validation(
                                            "confirmPassword",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.confirmPassword?.message
                                        }
                                        control={control}
                                    />,
                                ]}

                                <AppFormSelect
                                    id={"role"}
                                    name={"role"}
                                    label={t("admin.users.form:label.userRole")}
                                    className="role-container"
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    required={true}
                                    {...validation(
                                        "role",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={getUserRole()}
                                    placeholder={"Role"}
                                    errorMessage={errors.role?.message}
                                    options={getRolesOption()}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) =>
                                            template?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                <AppFormSelect
                                    id={"relationManager"}
                                    name={"relationManager"}
                                    label={t(
                                        "admin.users.form:label.relationManager"
                                    )}
                                    md={12}
                                    className="role-container"
                                    lg={6}
                                    xl={6}
                                    required={false}
                                    {...validation(
                                        "relationManager",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={getRelationalManager()}
                                    placeholder={"Relation Manager"}
                                    errorMessage={
                                        errors.relationManager?.message
                                    }
                                    options={relationalManager}
                                    control={control}
                                    transform={{
                                        output: (
                                            relationManager: PrimitiveObject
                                        ) => relationManager?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />

                                <AppFormSelectCreatable
                                    name="userTags"
                                    label={t("admin.users.form:label.userTags")}
                                    md={12}
                                    sm={12}
                                    lg={12}
                                    xl={12}
                                    id="where-filter"
                                    onChangeHandler={setSelectedUserTag}
                                    value={selectedUserTags}
                                    options={userTags}
                                    control={control}
                                />
                                <Col className="mb-4" md={12}>
                                    <AppTagSelect
                                        options={userGroups}
                                        selectedItems={selectedUserGroups}
                                        label={t(
                                            "admin.users.form:label.userGroups"
                                        )}
                                        onChange={(item) => {
                                            let index = -1;
                                            selectedUserGroups.filter(
                                                (e, i) => {
                                                    if (e.id === item.id) {
                                                        index = i;
                                                    }
                                                    return e;
                                                }
                                            );
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
                                </Col>
                                <AppFormSelect
                                    id={"timezone"}
                                    name={"timezone"}
                                    label={t("admin.users.form:label.timeZone")}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    required={false}
                                    {...validation(
                                        "timezone",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultValue={
                                        data.timezone
                                            ? {
                                                  value: data?.timezone,
                                                  label: data?.timezone,
                                              }
                                            : ""
                                    }
                                    placeholder={"Timezone"}
                                    errorMessage={errors.timezone?.message}
                                    options={options}
                                    control={control}
                                    transform={{
                                        output: (template: PrimitiveObject) =>
                                            template?.value,
                                        input: (value: string) => {
                                            return _find([], {
                                                value,
                                            });
                                        },
                                    }}
                                />
                                <AppFormSwitch
                                    id={"isBlocked"}
                                    name={"isBlocked"}
                                    label={t(
                                        "admin.users.form:label.isBlocked"
                                    )}
                                    required={false}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                    {...validation(
                                        "isBlocked",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isBlocked}
                                    errorMessage={errors.isBlocked?.message}
                                    control={control}
                                />
                                <Col md={12}>
                                    <hr />
                                </Col>
                                <Col md={12} lg={6} xl={6}>
                                    <AppFormLabel
                                        label={`${t(
                                            "admin.users.form:label.source"
                                        )}: ${data?.source}`}
                                        required={false}
                                    />
                                </Col>
                                <Col md={12} lg={6} xl={6}>
                                    <AppFormLabel
                                        label={`${t(
                                            "admin.users.form:label.isOnBoarded"
                                        )}: ${
                                            data?.isOnboarded ? "Yes" : "No"
                                        }`}
                                        required={false}
                                    />
                                </Col>

                                {data?.lastLoginAt && (
                                    <Col className="mt-3" md={12} lg={6} xl={6}>
                                        <AppFormLabel
                                            label={`${t(
                                                "admin.users.form:label.lastLogin"
                                            )}: ${data?.lastLoginAt}`}
                                            required={false}
                                        />
                                    </Col>
                                )}
                                {data?.isOnboarded && (
                                    <Col className="mt-3" md={12} lg={6} xl={6}>
                                        <AppFormLabel
                                            label={`${t(
                                                "admin.users.form:label.onBoardedAt"
                                            )}: ${data?.onboardedAt}`}
                                            required={false}
                                        />
                                    </Col>
                                )}
                            </Form.Row>
                        </AppCard>
                    </Col>
                    {userFields.length > 0 && (
                        <Col md={12}>
                            <AppCard>
                                <Row>{renderUserFields()}</Row>
                            </AppCard>
                        </Col>
                    )}

                    <Col className={"mb-3"} md={12}>
                        <AppCard title="Privacy & Communication">
                            <Form.Row>
                                <AppFormSwitch
                                    id={"isDisplayAsGuest"}
                                    name={"isDisplayAsGuest"}
                                    label={t(
                                        "admin.users.form:label.isDisplayAsGuest"
                                    )}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={false}
                                    {...validation(
                                        "isDisplayAsGuest",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isDisplayAsGuest}
                                    errorMessage={
                                        errors.isDisplayAsGuest?.message
                                    }
                                    control={control}
                                />
                                <AppFormSwitch
                                    id={"isExposeEmail"}
                                    name={"isExposeEmail"}
                                    label={t(
                                        "admin.users.form:label.isExposeEmail"
                                    )}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={false}
                                    {...validation(
                                        "isExposeEmail",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isExposeEmail}
                                    errorMessage={errors.isExposeEmail?.message}
                                    control={control}
                                />
                                <AppFormSwitch
                                    id={"isAllowCommunication"}
                                    name={"isAllowCommunication"}
                                    label={t(
                                        "admin.users.form:label.isAllowCommunication"
                                    )}
                                    md={12}
                                    lg={4}
                                    xl={4}
                                    required={false}
                                    {...validation(
                                        "isAllowCommunication",
                                        formState,
                                        isEditMode
                                    )}
                                    defaultChecked={data?.isAllowCommunication}
                                    errorMessage={
                                        errors.isAllowCommunication?.message
                                    }
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>
                    </Col>
                </Row>
                <AppFormActions
                    isEditMode={isEditMode}
                    navigation={navigator}
                    isLoading={formState.isSubmitting}
                />
            </Form>
        </Fragment>
    );
};
